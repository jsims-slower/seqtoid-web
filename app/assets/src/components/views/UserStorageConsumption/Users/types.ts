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

export interface UsersFilters {
  keyword?: string;
  minSamples?: number;
  minInputFiles?: number;
  minTotalInputFileSizeMb?: number;
  minSampleS3Files?: number;
  minTotalSampleS3StorageMb?: number;
}

export interface UserStorageConsumptionUsersProps {
  users: UsersPageUser[];
  page: number;
  totalPages: number;
  sortBy?: string;
  sortDir?: string;
  summary: UsersSummary;
  filters?: UsersFilters;
}
