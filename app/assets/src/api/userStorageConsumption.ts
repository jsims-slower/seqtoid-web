import { get, postWithCSRF } from "./core";

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

export type RefreshBatchStatus = "pending" | "in_progress" | "completed" | "failed";

export interface RefreshBatch {
  id: number;
  status: RefreshBatchStatus;
  totalJobs: number;
  processedJobs: number;
  errorCount: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshBatchResponse {
  batch: RefreshBatch | null;
}

export const fetchRefreshBatch = async (): Promise<RefreshBatchResponse> => {
  return get("/user_storage_consumption/refresh_batch");
};

export const enqueueRefreshBatch = async (): Promise<RefreshBatchResponse> => {
  return postWithCSRF("/user_storage_consumption/refresh_batch");
};
