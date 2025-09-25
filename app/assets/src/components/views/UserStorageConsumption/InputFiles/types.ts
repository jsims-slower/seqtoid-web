export interface InputFilesSummary {
  id: number;
  email: string;
  name: string;
  totalSamples: number;
  totalInputFiles: number;
  totalInputFilesSize: string;
}

export interface SampleFileRow {
  sampleId: number;
  sampleName: string;
  projectName: string;
  sampleCreatedAt: string;
  fileId: number;
  fileName: string | null;
  fileType: string | null;
  fileSize: string | null;
  sourceType: string | null;
}

export interface UserStorageConsumptionInputFilesProps {
  summary: InputFilesSummary;
  sampleFileRows: SampleFileRow[];
  page: number;
  perPage: number;
  totalCount: number;
}
