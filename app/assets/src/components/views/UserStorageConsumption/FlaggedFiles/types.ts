export interface FlaggedFile {
  id: number;
  name: string;
  fileType: string | null;
  sizeBytes: number | null;
  sizeHuman: string | null;
  createdAt: string | null;
  sourceType: string | null;
  sampleId: number | null;
  sampleName: string;
  sampleCreatedAt: string | null;
  projectId: number | null;
  projectName: string;
  userId: number | null;
  userEmail: string;
  userName: string;
}

export interface FlaggedFilesThresholds {
  minSizeMb: number;
  olderThanMonths: number;
  limit: number;
}

export interface FlaggedFilesSummary {
  flaggedCount: number;
  flaggedTotalSize: string;
  flaggedAverageFileSize: string;
  impactedUsers: number;
  impactedProjects: number;
}
