#!/bin/bash
set -euo pipefail

declare image="$1"
declare env="$2"

# Ensure required environment variables are set.
if [[ -z "${image:-}" || -z "${env:-}" ]]; then
  echo "Error: Required environment variables 'image' and 'env' must be set."
  exit 1
fi

# Cleanup function to remove the czecs binary when the script exits.
cleanup() {
  rm -f /tmp/czecs
}
trap cleanup EXIT

# Determine OS.
if [[ "$(uname)" == "Darwin" ]]; then
  os="darwin"
else
  os="linux"
fi

if [[ "${env}" == "dev" ]]; then
  env_full="development"
else
  env_full="${env}"
fi

# Download and extract czecs.
curl -sS -L "https://github.com/chanzuckerberg/czecs/releases/download/v0.1.2/czecs_0.1.2_${os}_amd64.tar.gz" | tar xz -C /tmp czecs

# Obtain AWS account id.
aws_account_id=$(aws sts get-caller-identity --query="Account" | tr -d '"')

cluster="idseq-${env}-ecs"

echo "image: ${image}, env: ${env}, env_full: ${env_full} aws_account_id: ${aws_account_id}, cluster: ${cluster}"

# Pick balances file by env
balances_file="balances-${env}.json"
echo "Using balances file: $balances_file"

# Register the task. Exit if registration fails.
task_definition_arn=$(/tmp/czecs register -f $balances_file --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set account_id="${aws_account_id}" czecs.json)
#task_definition_arn="arn:aws:ecs:us-west-2:${aws_account_id}:task-definition/idseq-${env}-web:8"
if [[ $? -ne 0 ]]; then
  echo "== Could not register task =="
  exit 1
fi

echo "running migrations"

#echo "/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn=${task_definition_arn} --set cluster=${cluster} czecs-task-db-drop.json"
#/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn="${task_definition_arn}" --set cluster="${cluster}" czecs-task-db-drop.json

echo "/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn=${task_definition_arn} --set cluster=${cluster} czecs-task-db-create.json"
/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn="${task_definition_arn}" --set cluster="${cluster}" czecs-task-db-create.json

#echo "/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn=${task_definition_arn} --set cluster=${cluster} czecs-task-create-admin.json"
#/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn="${task_definition_arn}" --set cluster="${cluster}" czecs-task-create-admin.json

echo "/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn=${task_definition_arn} --set cluster=${cluster} czecs-task-migrate.json"
/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn="${task_definition_arn}" --set cluster="${cluster}" czecs-task-migrate.json

echo "/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn=${task_definition_arn} --set cluster=${cluster} czecs-task-db-seed.json"
/tmp/czecs task -f ${balances_file} --timeout 0 --set taskDefinitionArn="${task_definition_arn}" --set cluster="${cluster}" czecs-task-db-seed.json

echo "running updates"

echo "/tmp/czecs upgrade --timeout 900 --task-definition-arn ${task_definition_arn} ${cluster} idseq-${env}-web"
/tmp/czecs upgrade --timeout 900 --task-definition-arn "${task_definition_arn}" "${cluster}" "idseq-${env}-web"

# Upgrade Resque workers.
/tmp/czecs upgrade -f ${balances_file} --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set name=resque --set rake_command=resque:workers --set account_id="${aws_account_id}" "${cluster}" "idseq-${env}-resque" czecs-resque.json

# Upgrade Resque scheduler.
/tmp/czecs upgrade -f ${balances_file} --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set name=resque-scheduler --set rake_command=resque:scheduler --set account_id="${aws_account_id}" "${cluster}" "idseq-${env}-resque-scheduler" czecs-resque.json

# Upgrade Pipeline monitor.
/tmp/czecs upgrade -f ${balances_file} --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set name=resque-pipeline-monitor --set rake_command=pipeline_monitor --set account_id="${aws_account_id}" "${cluster}" "idseq-${env}-resque-pipeline-monitor" czecs-resque.json

# Upgrade Result monitor.
/tmp/czecs upgrade -f ${balances_file} --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set name=resque-result-monitor --set rake_command=result_monitor --set account_id="${aws_account_id}" "${cluster}" "idseq-${env}-resque-result-monitor" czecs-resque.json

# Upgrade Shoryuken.
/tmp/czecs upgrade -f ${balances_file} --set tag="${image}" --set env="${env}" --set env_full="${env_full}" --set name=shoryuken --set entry_command='-R -C config/shoryuken.yml' --set account_id="${aws_account_id}" "${cluster}" "idseq-${env}-shoryuken" czecs-shoryuken.json

echo "load release tag into param store"
# Extract the release SHA from the image string (expected format: sha-<7+ hex digits>).
if [[ "${image}" =~ ^sha-([0-9a-f]{7,})$ ]]; then
  release_sha="${BASH_REMATCH[1]}"
else
  echo "Error: image tag does not match expected pattern (sha-[0-9a-f]{7,})."
  exit 1
fi

# Put the parameter into AWS Systems Manager Parameter Store.
aws ssm put-parameter --name "/idseq-${env}-web/GIT_RELEASE_SHA" --value "${release_sha}" --type String --overwrite
