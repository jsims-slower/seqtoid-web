export interface SampleS3DetailsUser {
  id: number;
  email: string;
  name: string;
  totalSamples: number;
  totalSampleS3Files: number;
  totalSampleS3Size: string;
}

export interface SampleS3File {
  displayName: string | null;
  fileSize: string | null;
}

export interface SampleS3Row {
  sampleId: number;
  sampleName: string;
  projectName: string;
  sampleCreatedAt: string;
  totalSampleS3Files: number;
  totalSampleS3FilesSize: string;
  sampleS3Files: SampleS3File[];
  nextPage: number | null;
}

export interface UserStorageConsumptionSampleS3DetailsProps {
  user: SampleS3DetailsUser;
  sampleS3FileRows: SampleS3Row[];
  page: number;
  perPage: number;
  totalCount: number;
}
