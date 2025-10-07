export interface PipelineRunRow {
  id: number;
  sampleId: number | null;
  sampleName: string | null;
  projectId: number | null;
  projectName: string | null;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  jobStatus: string | null;
  technology: string | null;
  wdlVersion: string | null;
  deprecated: boolean | null;
  executedAt: string | null;
  runtimeSeconds: number;
  runtimeHours: string | null;
}

export interface PipelineRunsSummary {
  totalRuns: number;
  averageRuntimeSeconds: number;
  slowestRuntimeSeconds: number;
  totalDeprecated: number;
}

export interface UserStorageConsumptionPipelineRunsProps {
  pipelineRuns: PipelineRunRow[];
  summary: PipelineRunsSummary;
  page: number;
  totalPages: number;
  sortBy?: string | null;
  sortDir?: string | null;
}
