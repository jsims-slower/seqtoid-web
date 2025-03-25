This is a Ruby on Rails application with React as the frontend. It leverages the resque gem for background jobs, and interacts with AWS infrastructure (deployed via [insert GH repo here]) through AWS sdk gems, primarily for running resource-intensive backend genome processing pipelines. 

## Project Structure
This application follows the standard Ruby on Rails model-view-controller convention for its package structure.

**[/app/](../app/)** - contains the actual Rails application code, including all controllers, models, and views  
**[/app/assets/](../app/assets/)** - contains frontend assets, such as javascripts, css, and graphics  
**[/app/assets/src/](../app/assets/src/)** - contains the React components  
**[/app/controllers/](../app/controllers/)** - contains the controllers, which provide the backend logic for processing requests, managing models, and rendering views  
**[/app/models/](../app/models/)** - contains the models, which define the data structure for objects used by the application and stored in the database  
**[/app/views/](../app/views/)** - contains the views, which are the front-end pages rendered to users of the application. These are primarily rendered React components.  
**[/app/jobs/](../app/jobs/)** - contains the background jobs run by resque. These are run on separate workers in order to isolate them from the web application.  
**[/app/services/](../app/services/)** - contains services, which are ruby files for executing logic that is not tied to a specific controller action.  
**[/app/helpers/](../app/helpers/)** - contains helper methods, which are similar to services but for reusable front-end logic.  

**[/config/](../config/)** - contains the Rails configuration files for initialization and environment-specific settings  
**[/db/](../db/)** - contains the database schema, migrations (run to make in-place modifications to the database), and seeds (run to populate the database with initial data)  

**[/.github/workflows](./.github/workflows/)** - contains the GitHub Actions workflow files for CI/CD  
**[/bin/](../bin/)** - contains a mixture of local setup scripts, deploy time scripts, and adhoc scripts.  
_Recommend separating these out for improved clarity.  
e.g. bin/bundle, bin/rails, bin/rake, stay at root, bin/local-scripts for local setup, bin/deploy-scripts for deploy time, bin/adhoc-scripts for adhoc_

**[/test/](../test/)** - contains the suite of legacy minitest unit tests. Retained for coverage but not for any new tests.  
**[/spec/](../spec/)** - contains the suite of rspec tests for the application, which are unit/functional tests.  
**[/e2e/](../e2e/)** - contains the suite of end-to-end tests, which leverage Playwright to run tests against the running application (either locally or deployed to staging).  
**[/jest/](../jest/)** - contains the suite of jest tests for the application, which test the frontend React/Javascript code. _The only test in here is to test bulk download frontend functionality._


## Key Files

**[/app/views/layouts/application.html.erb](../app/views/layouts/application.html.erb)** - contains the main layout for the all pages rendered by the application. Includes HTML metadata and universal javascripts.  
**[/config/resque_schedule.yml](../config/resque_schedule.yml)** - contains the schedule for scheduled resque jobs. _NOTE: adhoc resque jobs are run in the ruby code through invocations to Resque.enqueue(JobName, args)_  
**[/config/routes.rb](../config/routes.rb)** - contains the routes for the application, which define which URLs are handled by which controllers actions.  
**[Gemfile](../Gemfile)** - contains the list of gems (external Ruby packages) used by the application.  
**[Makefile](../Makefile)** - the file used to build the application locally, primarily through first establishing necessary prerequisites (mainly scripts in /bin) executing `docker compose` to create Docker images
**[docker-compose.yml](../docker-compose.yml)** - the Docker file used to build the application container locally, executed through the Makefile

## Additional Components

### Shoryuken
[Shoryuken](https://github.com/ruby-shoryuken/shoryuken) is a message processing system for interacting with AWS SQS queues. It is only used by the [HandleSfnNotifications](../app/jobs/handle_sfn_notifications.rb) job for processing Step Functions notifications. In addition to being specified in the job class itself, the queue to be polled is also specified in the [config/shoryuken.yml](../config/shoryuken.yml) file.

### Resque
[Resque](https://github.com/resque/resque) is a system for processing background jobs. Any of the jobs in the [app/jobs](../app/jobs) directory which extend [InstrumentedJob](../app/jobs/instrumented_job.rb) will be run on a separate Resque worker. Additionally, any invocations of `Resque.enqueue` will also be run on a separate Resque worker.

### Sentry
[Sentry](https://sentry.io/) is a service for error tracking and reporting. The [config/initializers/sentry.rb](../config/initializers/sentry.rb) file contains the configuration for Sentry. Errors can be explicitly reported using the React `log_error` method in [logUtil.ts](../app/assets/src/components/utils/logUtil.ts).

### Segment Analytics & Appcues
[Segment Analytics](https://github.com/segmentio/analytics-ruby) is used in conjunction with [Appcues](https://www.appcues.com/) as a middleware tool for analytics. [app/assets/src/api/analytics.ts](../app/assets/src/api/analytics.ts) contains the code for establishing what data is tracked, and other React components can leverage the methods defined in `analytics.ts` to track specific user actions.

### Plausible Analytics
[Plausible Analytics](https://github.com/plausible/analytics) is used for wide-scale front-end user tracking/reporting, such as page-view counts, user journeys, dropouts, and more.

### OneTrust
[OneTrust](https://www.onetrust.com/) is used for tracking user consent to cookies and other third-party tracking (e.g. analytics tracking).
