import React, { useEffect, useMemo, useState } from "react";
import cs from "./number_tile.scss";
import { getDecimalPlaces } from "./utils";

const ANIMATION_DURATION_MS = 900;

interface NumberTileProps {
  title: string;
  value: number;
  unit?: string;
  link?: {
    href: string;
    label: string;
  };
  variant?: "default" | "warning";
}

export const NumberTile: React.FC<NumberTileProps> = ({
  title,
  value,
  unit,
  link,
  variant = "default",
}) => {
  const decimalPlaces = Number.isFinite(value) ? getDecimalPlaces(value) : 0;

  const shouldAnimate =
    Number.isFinite(value) &&
    typeof window?.requestAnimationFrame === "function";

  const [animatedValue, setAnimatedValue] = useState<number>(
    shouldAnimate ? 0 : value,
  );

  useEffect(() => {
    if (!shouldAnimate) {
      setAnimatedValue(value);
      return;
    }

    let animationFrameId = 0;
    const startValue = 0;
    const targetValue = value;
    const startTime =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();

    const formatNumber = (input: number) =>
      decimalPlaces > 0
        ? Number(input.toFixed(decimalPlaces))
        : Math.round(input);

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const nextValue = startValue + (targetValue - startValue) * progress;

      if (progress < 1) {
        setAnimatedValue(formatNumber(nextValue));
        animationFrameId = window.requestAnimationFrame(animate);
      } else {
        setAnimatedValue(targetValue);
      }
    };

    setAnimatedValue(startValue);
    animationFrameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [shouldAnimate, value, decimalPlaces]);

  const currentValue = shouldAnimate ? animatedValue : value;

  const numberDisplay = useMemo(() => {
    if (!Number.isFinite(currentValue)) return undefined;
    return (currentValue as number).toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  }, [currentValue, decimalPlaces]);

  const displayValue = numberDisplay
    ? unit
      ? `${numberDisplay} ${unit}`
      : numberDisplay
    : "—";

  const tileClassName = [
    cs.numberTile,
    variant === "warning" && cs.numberTileWarning,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={tileClassName}>
      <div className={cs.numberTileTitle}>
        <span>{title}</span>
        {link && (
          <a href={link.href} className={cs.numberTileLink}>
            {link.label}
          </a>
        )}
      </div>
      <div className={cs.numberTileValue}>{displayValue}</div>
    </div>
  );
};
