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

export interface UserStorageConsumptionUsersProps {
  users: UsersPageUser[];
  page: number;
  totalPages: number;
  searchBy?: string;
  sortBy?: string;
  sortDir?: string;
}
