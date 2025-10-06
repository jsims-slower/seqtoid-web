export interface DashboardSnapshotDatum {
  snapshotDate: string;
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: number;
}

export interface UserStorageConsumptionDashboardProps {
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
  totalSampleS3Files: number;
  totalSampleS3StorageSize: string;
  flaggedFilesCount: number;
  flaggedFilesDescription: string;
  averagePipelineRuntime: string;
  averageWorkflowRuntime: string;
  snapshotData: DashboardSnapshotDatum[];
}
