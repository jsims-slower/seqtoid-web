import React, { useCallback, useEffect } from "react";
import CompositeCell from "~/components/common/UserStorageConsumption/CompositeCell";
import { fetchSampleS3FilesChunk } from "~/api/userStorageConsumption";
import {
  SampleS3File,
  SampleS3Row,
} from "~/components/views/UserStorageConsumption/SampleS3Details/types";
import styles from "./sample_s3_files_table.scss";

interface SampleS3FilesTableProps {
  rows: SampleS3Row[];
  userId: number;
}

interface SampleRowState {
  files: SampleS3File[];
  nextPage: number | null;
  loading: boolean;
}

const buildInitialState = (rows: SampleS3Row[]) =>
  rows.reduce((accumulator, row) => {
    accumulator[row.sampleId] = {
      files: row.sampleS3Files ?? [],
      nextPage: row.nextPage ?? null,
      loading: false,
    };
    return accumulator;
  }, {});

const defaultState: SampleRowState = {
  files: [],
  nextPage: null,
  loading: false,
};

const SampleS3FilesTable: React.FC<SampleS3FilesTableProps> = ({
  rows,
  userId,
}) => {
  const [sampleStates, setSampleStates] = React.useState(() =>
    buildInitialState(rows),
  );

  useEffect(() => {
    setSampleStates(buildInitialState(rows));
  }, [rows]);

  const handleShowMore = useCallback(
    async (sampleId: number) => {
      const currentState = sampleStates[sampleId] ?? defaultState;

      if (currentState.loading || currentState.nextPage === null) {
        return;
      }

      setSampleStates(previous => ({
        ...previous,
        [sampleId]: {
          ...(previous[sampleId] ?? defaultState),
          loading: true,
        },
      }));

      try {
        const response = await fetchSampleS3FilesChunk({
          userId,
          sampleId,
          page: currentState.nextPage,
        });

        setSampleStates(previous => {
          const prior = previous[sampleId] ?? defaultState;
          return {
            ...previous,
            [sampleId]: {
              files: [...prior.files, ...response.sampleS3Files],
              nextPage: response.nextPage,
              loading: false,
            },
          };
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load more sample S3 files", error);
        setSampleStates(previous => {
          const prior = previous[sampleId] ?? defaultState;
          return {
            ...previous,
            [sampleId]: {
              ...prior,
              loading: false,
            },
          };
        });
      }
    },
    [sampleStates, userId],
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.thSampleId}>Sample ID</th>
          <th className={styles.thSampleName}>Sample Name</th>
          <th className={styles.thCreatedAt}>Created At</th>
          <th className={styles.thTotalFiles}>Total Files</th>
          <th className={styles.thTotalSize}>Total Size</th>
          <th className={styles.thDisplayName}>Display Name</th>
          <th className={styles.thFileSize}>File Size</th>
        </tr>
      </thead>
      {rows.map(sample => {
        const state = sampleStates[sample.sampleId] ?? defaultState;
        const hasFiles = state.files.length > 0;
        const displayFiles: Array<SampleS3File | null> = hasFiles
          ? state.files
          : [null];
        const hasNextPage = state.nextPage !== null;
        const rowSpan = displayFiles.length + (hasNextPage ? 1 : 0);
        const sampleName = sample.sampleName || "N/A";
        const projectName = sample.projectName || "N/A";

        return (
          <tbody key={sample.sampleId}>
            {displayFiles.map((file, index) => {
              const displayName = file?.displayName ?? "N/A";

              return (
                <tr key={`${sample.sampleId}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdSampleId}>
                      {sample.sampleId}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdSampleName}>
                      <CompositeCell
                        primary={sampleName}
                        secondaryParts={[`Project: ${projectName}`]}
                        minWidth="12rem"
                        maxWidth="25rem"
                      />
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdCreatedAt}>
                      {sample.sampleCreatedAt}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdTotalFiles}>
                      {sample.totalSampleS3Files}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={rowSpan} className={styles.tdTotalSize}>
                      {sample.totalSampleS3FilesSize}
                    </td>
                  )}
                  <td className={styles.tdDisplayName}>
                    <span className={styles.displayName} title={displayName}>
                      {displayName}
                    </span>
                  </td>
                  <td className={styles.tdFileSize}>
                    {file?.fileSize ?? "N/A"}
                  </td>
                </tr>
              );
            })}
            {hasNextPage && (
              <tr key={`${sample.sampleId}-show-more`}>
                <td colSpan={2} className={styles.tdShowMore}>
                  <button
                    type="button"
                    className={styles.showMoreButton}
                    onClick={() => handleShowMore(sample.sampleId)}
                    disabled={state.loading}
                  >
                    {state.loading ? "Loading…" : "Show more"}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        );
      })}
    </table>
  );
};

export default SampleS3FilesTable;
