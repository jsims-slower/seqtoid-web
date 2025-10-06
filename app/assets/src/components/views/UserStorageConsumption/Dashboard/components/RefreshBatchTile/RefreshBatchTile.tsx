import { Icon, Tooltip } from "@czi-sds/components";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  enqueueRefreshBatch,
  fetchRefreshBatch,
  RefreshBatch,
  RefreshBatchStatus,
} from "~/api/userStorageConsumption";
import PrimaryButton from "~/components/ui/controls/buttons/PrimaryButton";
import styles from "./refresh_batch_tile.scss";

const REFRESH_BATCH_POLL_INTERVAL_MS = 5000;
const DATE_TIME_DISPLAY_FORMAT = "MM/DD/YYYY HH:mm:ss";
const INFO_TOOLTIP_MESSAGE =
  "Disabled while a batch is pending or in progress.";

const STATUS_LABELS: Record<RefreshBatchStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  failed: "Failed",
};

const statusClassMap: Record<RefreshBatchStatus, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  failed: styles.statusFailed,
};

const isProcessing = (batch: RefreshBatch | null): boolean => {
  if (!batch) return false;
  return batch.status === "pending" || batch.status === "in_progress";
};

const progressFromBatch = (batch: RefreshBatch | null): number => {
  if (!batch) return 0;

  const { totalJobs, status, processedJobs, errorCount } = batch;

  if (totalJobs <= 0) {
    return status === "completed" ? 100 : 0;
  }

  const ratio = (processedJobs + errorCount) / totalJobs;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
};

const RefreshBatchTile: React.FC = () => {
  const [batch, setBatch] = useState<RefreshBatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggeredSync, setHasTriggeredSync] = useState(false);
  const [showReloadPrompt, setShowReloadPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBatch = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setIsLoading(true);

      try {
        const response = await fetchRefreshBatch();
        const refreshedBatch = response.batch;
        setBatch(refreshedBatch);
        const batchComplete = refreshedBatch?.status === "completed";
        setShowReloadPrompt(hasTriggeredSync && batchComplete);
        setError(null);
      } catch (err) {
        setError(err.error || "Unable to load refresh status.");
      } finally {
        setIsLoading(false);
      }
    },
    [hasTriggeredSync],
  );

  useEffect(() => {
    loadBatch(true);
  }, [loadBatch]);

  useEffect(() => {
    if (!batch || !isProcessing(batch)) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadBatch();
    }, REFRESH_BATCH_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [batch, loadBatch]);

  const handleEnqueue = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setHasTriggeredSync(true);

    try {
      const response = await enqueueRefreshBatch();
      setBatch(response.batch);
    } catch (err) {
      setError(err.error || "Unable to load refresh status.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const totalJobs = batch?.totalJobs ?? 0;
  const processedJobs = batch?.processedJobs ?? 0;
  const errorCount = batch?.errorCount ?? 0;
  const isBatchProcessing = isProcessing(batch);
  const progressPercentage = progressFromBatch(batch);

  const statusLabel = batch ? STATUS_LABELS[batch.status] : "Pending";
  const statusClassName = batch
    ? statusClassMap[batch.status]
    : styles.statusPending;

  const buttonDisabled = isLoading || isSubmitting || isBatchProcessing;
  const buttonText = batch && !isBatchProcessing ? "Sync Again" : "Sync Now";
  const showReloadButton = showReloadPrompt && !isBatchProcessing;

  const processedLabel = `${processedJobs.toLocaleString()} / ${totalJobs.toLocaleString()}`;
  const errorLabel = errorCount.toLocaleString();
  const startedLabel = batch?.startedAt
    ? moment(batch.startedAt).format(DATE_TIME_DISPLAY_FORMAT)
    : "--";
  const finishedLabel = batch?.completedAt
    ? moment(batch.completedAt).format(DATE_TIME_DISPLAY_FORMAT)
    : "--";

  return (
    <div className={styles.refreshTile}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Storage Sync Refresh</span>
          <Tooltip arrow placement="top" title={INFO_TOOLTIP_MESSAGE}>
            <span className={styles.infoIcon}>
              <Icon sdsIcon="infoCircle" sdsSize="s" sdsType="interactive" />
            </span>
          </Tooltip>
        </div>
        <span className={`${styles.statusBadge} ${statusClassName}`}>
          {statusLabel}
        </span>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressValue}>{progressPercentage}%</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div>
            {showReloadButton ? (
              <>
                <PrimaryButton
                  text="Reload"
                  onClick={() => window.location.reload()}
                  disabled={isSubmitting}
                  type="button"
                  sdsStyle="minimal"
                  className={styles.reloadButton}
                />
                <div className={styles.reloadNotice}>
                  Reload to see the latest storage usage after this sync
                  completes.
                </div>
              </>
            ) : (
              <PrimaryButton
                text={buttonText}
                onClick={handleEnqueue}
                disabled={buttonDisabled}
                loading={isSubmitting}
                className={styles.actionButton}
              />
            )}
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Processed</span>
            <span className={styles.metricValue}>{processedLabel}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Errors</span>
            <span className={styles.metricValue}>{errorLabel}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Started</span>
            <span className={styles.metricValue}>{startedLabel}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Finished</span>
            <span className={styles.metricValue}>{finishedLabel}</span>
          </div>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      {isLoading && !batch ? (
        <div className={styles.loading}>Loading…</div>
      ) : null}
    </div>
  );
};

export default RefreshBatchTile;
