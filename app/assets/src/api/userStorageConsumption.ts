import { get } from "./core";

export interface SampleS3FilesChunkRequest {
  userId: number;
  sampleId: number;
  page: number;
}

export interface SampleS3FilesChunkResponse {
  sampleS3Files: Array<{
    displayName: string | null;
    fileSize: string | null;
  }>;
  nextPage: number | null;
}

export const fetchSampleS3FilesChunk = async ({
  userId,
  sampleId,
  page,
}: SampleS3FilesChunkRequest): Promise<SampleS3FilesChunkResponse> => {
  return get(
    `/user_storage_consumption/users/${userId}/samples/${sampleId}/sample_s3_files/load_more`,
    {
      params: { page },
    },
  );
};
