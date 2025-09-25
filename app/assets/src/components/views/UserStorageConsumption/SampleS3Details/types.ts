export interface SampleS3DetailsUser {
  id: number;
  email: string;
  name: string;
  totalSamples: number;
  totalSampleS3Files: number;
  totalSampleS3Size: string;
}

export interface SampleS3FileRow {
  sampleId: number;
  sampleName: string;
  projectName: string;
  sampleCreatedAt: string;
  displayName: string | null;
  fileSize: string | null;
}

export interface UserStorageConsumptionSampleS3DetailsProps {
  user: SampleS3DetailsUser;
  sampleS3FileRows: SampleS3FileRow[];
  page: number;
  perPage: number;
  totalCount: number;
}
