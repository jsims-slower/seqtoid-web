export interface DashboardUser {
  id: number;
  email: string;
  name: string;
  sampleCount: number;
  inputFileCount: number;
  totalInputFilesSize: string;
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
  snapshotData: DashboardSnapshotDatum[];
}
