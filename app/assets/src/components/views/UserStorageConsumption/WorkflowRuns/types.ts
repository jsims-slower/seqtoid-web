export interface WorkflowRunRow {
  id: number;
  sampleId: number | null;
  sampleName: string | null;
  projectId: number | null;
  projectName: string | null;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  status: string | null;
  workflow: string | null;
  wdlVersion: string | null;
  deprecated: boolean | null;
  executedAt: string | null;
  runtimeSeconds: number;
  runtimeHours: string | null;
}

export interface WorkflowRunsSummary {
  totalRuns: number;
  averageRuntimeSeconds: number;
  slowestRuntimeSeconds: number;
  totalDeprecated: number;
}

export interface UserStorageConsumptionWorkflowRunsProps {
  workflowRuns: WorkflowRunRow[];
  summary: WorkflowRunsSummary;
  page: number;
  totalPages: number;
  sortBy?: string | null;
  sortDir?: string | null;
}
