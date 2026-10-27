import { Regexp, type STORAGE_KEY } from "./constants";
import { toWords } from "number-to-words";
import deepDiff from "deep-diff";

export const onSaveLocalStorage = (key: STORAGE_KEY, val: string) => {
  localStorage.setItem(key, val);
};

export const onGetLocalStorage = (key: STORAGE_KEY) => {
  return localStorage.getItem(key);
};

export const onClearLocalStorage = () => {
  localStorage.clear();
};

export const onRemoveLocalStorage = (key: STORAGE_KEY) => {
  localStorage.removeItem(key);
};

export const onOpenUrl = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const onScrollToAnchor = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export type StringFormatterOptions = {
  removeCharacters?: string[];
  replaceCharactersWith?: string;
};

export type DeepDiffOptions<
  T extends Record<string, any>,
  K extends Record<string, any>,
> = {
  excludedKeys?: (keyof T | keyof K)[];
};

export type DeepDiffChangeResponse = {
  field: string;
  type: "added" | "deleted" | "modified";
  newValue?: string | number | undefined | null;
  oldValue?: string | number | undefined | null;
  path: string;
};

export const onToPascalCase = (
  str: string,
  options?: StringFormatterOptions,
) => {
  let val = str;

  if (options) {
    if (options.removeCharacters) {
      const regex = new RegExp(`[${options.removeCharacters.join("")}]`, "g");
      val = val.replace(regex, options.replaceCharactersWith || "");
    }
  }

  const pascalized = val
    .split(" ")
    .map(s => (!s ? "" : s?.[0]?.toUpperCase() + s?.substring(1).toLowerCase()))
    .join(" ");

  return pascalized;
};

export const onFormatMultiSelectValue = (value: string[]) => {
  return value.map(v => ({
    label: onToPascalCase(v, {
      removeCharacters: ["_"],
      replaceCharactersWith: " ",
    }),
    value: v,
  }));
};

export const onToLocalCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export const onFormatNumber = (amount: number): string => {
  return new Intl.NumberFormat("en-PH").format(amount);
};

export const onNumberToWords = (amount: number) => {
  if (!amount && amount !== 0) return "";

  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  const wholeWords = toWords(wholePart);
  const capitalizedWhole =
    wholeWords.charAt(0).toUpperCase() + wholeWords.slice(1);

  if (decimalPart === 0) {
    return `${capitalizedWhole} Pesos Only`;
  }

  const decimalWords = toWords(decimalPart);
  const capitalizedDecimal =
    decimalWords.charAt(0).toUpperCase() + decimalWords.slice(1);

  return `${capitalizedWhole} Pesos and ${capitalizedDecimal} Centavos Only`;
};

export const onParseStringCurrency = (amount: string): number => {
  return parseFloat(amount.replace(Regexp.localCurrency, "").trim());
};

export const onDeepDiff = <
  Root extends Record<string, any>,
  Target extends Record<string, any>,
>(
  root: Root,
  target: Target,
  options?: DeepDiffOptions<Root, Target>,
): DeepDiffChangeResponse[] => {
  const { excludedKeys } = options || {};

  const cleanRoot = Object.fromEntries(
    Object.entries(root).filter(([key]) => !excludedKeys?.includes(key)),
  );
  const cleanTarget = Object.fromEntries(
    Object.entries(target).filter(([key]) => !excludedKeys?.includes(key)),
  );

  const diff = deepDiff(cleanRoot, cleanTarget);

  if (!diff) return [];

  return diff.map((change): DeepDiffChangeResponse => {
    const path = change.path?.at(-1) || "";
    const isNew = change.kind === "N";
    const isDeleted = change.kind === "D";
    const isModified = change.kind === "E";

    const type =
      isNew || (isModified && !change.lhs)
        ? "added"
        : isDeleted || (isModified && !change.rhs)
        ? "deleted"
        : "modified";

    return {
      field: path,
      type,
      ...(isNew
        ? { newValue: change.rhs as any }
        : isDeleted
        ? { oldValue: change.lhs as any }
        : isModified
        ? { oldValue: change.lhs as any, newValue: change.rhs as any }
        : {}),
      path,
    };
  });
};

export const onFormatFullName = (
  firstName: string,
  lastName: string,
  middle?: string,
) => {
  const formattedName = `${firstName}${
    middle ? ` ${middle}, ` : " "
  }${lastName}`;
  return onToPascalCase(formattedName);
};

export const onOmitProperties = <
  T extends Record<string, any>,
  K extends keyof T,
>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k as K)),
  ) as Omit<T, K>;
};
