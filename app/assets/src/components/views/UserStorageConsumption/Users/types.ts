export interface UsersPageUser {
  id: number;
  email: string;
  name: string;
  sampleCount: number;
  inputFileCount: number;
  totalInputFilesSize: string;
  sampleS3FileCount: number;
  totalSampleS3StorageSize: string;
}

export interface UsersSummary {
  totalUsers: number;
  averageSamplesPerUser: number;
  averageInputFileSizePerUserBytes: number;
  averageSampleS3SizePerUserBytes: number;
}

export interface UserStorageConsumptionUsersProps {
  users: UsersPageUser[];
  page: number;
  totalPages: number;
  searchBy?: string;
  sortBy?: string;
  sortDir?: string;
  summary: UsersSummary;
}
