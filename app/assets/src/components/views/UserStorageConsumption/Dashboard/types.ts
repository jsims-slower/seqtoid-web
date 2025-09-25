export interface DashboardUser {
  id: number;
  email: string;
  name: string;
  sampleCount: number;
  inputFileCount: number;
  totalInputFilesSize: string;
  sampleS3FileCount: number;
  totalSampleS3StorageSize: string;
}

export interface DashboardSnapshotDatum {
  snapshotDate: string;
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: number;
}

export interface UserStorageConsumptionDashboardProps {
  users: DashboardUser[];
  page: number;
  perPage: number;
  totalCount: number;
  searchBy?: string;
  sortBy?: string;
  sortDir?: string;
  totalUsers: number;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
  totalSampleS3Files: number;
  totalSampleS3StorageSize: string;
  flaggedFilesCount: number;
  snapshotData: DashboardSnapshotDatum[];
}
