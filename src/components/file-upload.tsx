import { UploadIcon, XIcon } from "lucide-react";

import { useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { FaImage } from "react-icons/fa";
import { Text, TextSmall } from "./typography";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useDeferred } from "@/hooks/useDeferred";
import { FieldLabel } from "./ui/field";

export const enum ACCEPT {
  SVG = "image/svg+xml",
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  GIF = "image/gif",
}

export type FileUploadProps = {
  accept?: ACCEPT[];
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  value?: File[] | File;
  onChange?: (props: File[] | File) => void;
  label?: string;
  err?: string;
  required?: boolean;
};

const renderAcceptText: Record<ACCEPT, string> = {
  [ACCEPT.SVG]: "SVG",
  [ACCEPT.PNG]: "PNG",
  [ACCEPT.JPEG]: "JPEG",
  [ACCEPT.JPG]: "JPG",
  [ACCEPT.GIF]: "GIF",
};

const FileUpload = ({
  accept = [ACCEPT.JPEG, ACCEPT.JPG, ACCEPT.PNG],
  maxSize = 5,
  multiple = true,
  maxFiles = 5,
  label,
  err,
  required,
  value,
  onChange,
}: FileUploadProps) => {
  const computedMaxSize = maxSize * 1024 * 1024;

  const { cbDebounce } = useDeferred("", 100);

  const initialFiles = useMemo((): FileMetadata[] => {
    if (!value) return [];
    const filesArray = Array.isArray(value) ? value : [value];
    return filesArray.map(file => {
      const id = `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const url = URL.createObjectURL(file);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        id,
      };
    });
  }, [value]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: accept?.join(","),
    maxSize: computedMaxSize,
    multiple,
    maxFiles,
    initialFiles,
    onFilesChange: addedFiles => {
      const formattedFiles = addedFiles.map(f => f.file) as File[];
      cbDebounce(() => {
        onChange?.(multiple ? formattedFiles : formattedFiles[0]);
      });
    },
  });

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className={cn(
          "relative flex min-h-52 flex-col items-center overflow-hidden rounded-md border border-dashed border-border p-4 transition-colors not-data-files:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50",
          err ? "border-destructive" : "",
        )}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <Button
                variant="secondary"
                type="button"
                size="sm"
                onClick={openFileDialog}
                disabled={files.length >= maxFiles}
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add more
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map(file => (
                <div
                  key={file.id}
                  className="relative aspect-square rounded-md bg-accent border border-border/20"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center gap-2">
            <FaImage className="size-10 opacity-60" />
            <div>
              <Text>Drop your images here</Text>
              <TextSmall secondary className="text-xs">
                {accept.map(a => renderAcceptText[a]).join(", ")} (max.{" "}
                {maxSize}
                MB)
              </TextSmall>
            </div>
            <Button type="button" variant="secondary" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select Images
            </Button>
          </div>
        )}
      </div>

      {(errors.length > 0 || err) && (
        <div className="text-destructive text-sm font-normal" role="alert">
          <span>
            {errors?.[0] || ""} {err || ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
