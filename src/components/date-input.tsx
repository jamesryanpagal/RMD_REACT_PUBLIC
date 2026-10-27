import React, { useEffect, useMemo, useRef, useState } from "react";
import { Regexp } from "@/utils/constants";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { useDeferred } from "@/hooks/useDeferred";
import type { ClassName } from "@/utils/type";
import { cn } from "@/lib/utils";

type DateProps = {
  mm?: string;
  dd?: string;
  yyyy?: string;
};

export type DateInputProps = {
  label?: string;
  description?: string;
  err?: string;
  required?: boolean;
  value?: string;
  showErr?: boolean;
  onChange?: (props: string) => void;
  format?: keyof typeof DATE_FORMAT;
  className?: ClassName;
};

const DateInput = ({
  label,
  description,
  err,
  required,
  value,
  showErr = true,
  onChange,
  format = "defaultformat",
  className,
}: DateInputProps) => {
  const inputRef = useRef<HTMLInputElement[]>([]);
  const [dateState, setDate] = useState<DateProps>({
    mm: "",
    dd: "",
    yyyy: "",
  });

  const { mm, dd, yyyy } = dateState;

  const { cbDebounce } = useDeferred("", 100);

  const onFormatDateType =
    (type: keyof DateProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      let dateTypeValue: string = val;
      switch (type) {
        case "mm":
          if (Number(val) > 12) {
            dateTypeValue = "12";
          }

          if (val.length === 1) {
            dateTypeValue = `0${val}`;
          }

          onInputChange(type)(dateTypeValue);

          break;
        case "dd":
          if (Number(val) > 31) {
            dateTypeValue = "31";
          }

          if (val.length === 1) {
            dateTypeValue = `0${val}`;
          }

          onInputChange(type)(dateTypeValue);

          break;
        default:
          return onInputChange(type)(dateTypeValue);
      }
    };

  const onInputChange =
    (type: keyof DateProps) =>
    (
      e: React.ChangeEvent<HTMLInputElement> | string,
      runSwitchFocus: boolean = true,
    ) => {
      const val = (typeof e === "string" ? e : e.target.value).replace(
        Regexp.numberOnly,
        "",
      );

      setDate(prev => {
        const updatedPrev = (prev = { ...prev, [type]: val });
        cbDebounce(() => {
          if (
            !prev.mm ||
            prev.mm.length < 2 ||
            !prev.dd ||
            prev.dd.length < 2 ||
            !prev.yyyy ||
            prev.yyyy.length < 4
          )
            return;
          const formattedDate = mtz(
            `${prev.mm}/${prev.dd}/${prev.yyyy}`,
            "monthDayYear",
          ).format(DATE_FORMAT[format]);
          onChange?.(formattedDate);
        });
        return (prev = updatedPrev);
      });

      if (runSwitchFocus) {
        onSwitchFocus(type, val.length);
      }
    };

  const onSwitchFocus = (type: keyof DateProps, valLength: number) => {
    switch (type) {
      case "mm":
        if (valLength === 2) {
          if (inputRef.current[1].value.length < 2) {
            inputRef.current[1].focus();
          }
        }
        break;
      case "dd":
        if (valLength === 2) {
          if (inputRef.current[2].value.length < 4) {
            inputRef.current[2].focus();
          }
        }
        break;
      default:
        if (valLength === 4) {
          inputRef.current[2].blur();
        }
        break;
    }
  };

  const onAssignRef = (index: number) => (el: HTMLInputElement) => {
    if (el) {
      inputRef.current[index] = el;
    }
  };

  const previewDate = useMemo(() => {
    if (!dateState.mm || !dateState.dd || !dateState.yyyy) return "";
    const formattedDate = mtz(
      `${dateState.mm}/${dateState.dd}/${dateState.yyyy}`,
      "monthDayYear",
    );

    if (!formattedDate.isValid()) return "Invalid date";

    return formattedDate.format(DATE_FORMAT.shortDateAbbrev);
  }, [dateState]);

  useEffect(() => {
    if (!value) return;
    const parsedValue = mtz(value, format);
    if (!parsedValue.isValid()) return;
    const month = parsedValue.get("month");
    const date = parsedValue.get("date");
    const year = parsedValue.get("year");

    const monthString = (month + 1).toString();
    const dateString = date.toString();
    const yearString = year.toString();

    const formattedMonth = `${
      monthString.length === 1 ? "0" : ""
    }${monthString}`;
    const formattedDate = `${dateString.length === 1 ? "0" : ""}${dateString}`;

    onInputChange("mm")(formattedMonth, false);
    onInputChange("dd")(formattedDate, false);
    onInputChange("yyyy")(yearString, false);
  }, [value, format]);

  const Wrapper = label ? Field : React.Fragment;

  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      <div className="flex items-end justify-between w-full">
        <div>
          {label && (
            <FieldLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
        </div>
        <span className="text-secondary-color text-xs">{previewDate}</span>
      </div>
      <div
        aria-invalid={!!err}
        className={cn(
          "border border-input flex items-center h-9 w-full rounded-md px-3 py-1 transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] aria-invalid:border-destructive",
          className,
        )}
      >
        <input
          ref={onAssignRef(0)}
          placeholder="MM"
          className="w-6.5 outline-none text-sm"
          maxLength={2}
          value={mm}
          onChange={onInputChange("mm")}
          onBlur={onFormatDateType("mm")}
        />
        <p className="ml-2 mr-3 text-secondary-color">/</p>
        <input
          ref={onAssignRef(1)}
          placeholder="DD"
          className="w-6 outline-none text-sm"
          maxLength={2}
          value={dd}
          onChange={onInputChange("dd")}
          onBlur={onFormatDateType("dd")}
        />
        <p className="ml-2 mr-3 text-secondary-color">/</p>
        <input
          ref={onAssignRef(2)}
          placeholder="YYYY"
          className="w-11 outline-none text-sm"
          maxLength={4}
          value={yyyy}
          onChange={onInputChange("yyyy")}
          onBlur={onFormatDateType("yyyy")}
        />
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && showErr && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export default DateInput;
