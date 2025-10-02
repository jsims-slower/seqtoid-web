export interface ParsedValueWithUnit {
  value: number;
  unit?: string;
}

export const parseValueWithUnit = (
  input: string | number | null | undefined,
): ParsedValueWithUnit => {
  if (typeof input === "number" && Number.isFinite(input)) {
    return { value: input };
  }

  if (typeof input !== "string") {
    return { value: Number.NaN };
  }

  const segments = input.trim().split(" ").filter(Boolean);
  if (segments.length === 0) {
    return { value: Number.NaN };
  }

  const numericPortion = segments[0]?.replace(/,/g, "") ?? "";
  const parsedValue = Number(numericPortion);
  const unit = segments.length > 1 ? segments[segments.length - 1] : undefined;

  return {
    value: parsedValue,
    unit,
  };
};

export const getDecimalPlaces = (input: number): number => {
  if (!Number.isFinite(input)) {
    return 0;
  }

  const [, decimalPart] = input.toString().split(".");
  return decimalPart ? decimalPart.length : 0;
};
