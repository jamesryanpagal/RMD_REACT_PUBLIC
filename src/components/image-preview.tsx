import type { File } from "@/api/query-fn.api";
import type { ClassName, Sizes } from "@/utils/type";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import { Modal } from "./ui/dialog";
import { TextSmall } from "./typography";

export type PreviewImageSize = Exclude<Sizes, "xs" | "xl">;

export type ImagePreviewProps = {
  file: File[] | File;
  size?: Exclude<Sizes, "xs" | "xl">;
};

const imageSizes: Record<PreviewImageSize, ClassName> = {
  sm: "h-[120px] w-[120px]",
  md: "h-[180px] w-[180px]",
  lg: "h-[240px] w-[240px]",
};

const ImageComponent = ({
  size = "md",
  file,
  onClick,
}: { file: File; onClick: (props: File) => void } & Pick<
  ImagePreviewProps,
  "size"
>) => {
  const { path } = file;

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden cursor-pointer hover:opacity-70",
        imageSizes[size],
      )}
      onClick={() => onClick(file)}
    >
      <img src={path} className="h-full w-full object-cover" />
    </div>
  );
};

const ImagePreview = ({ file, ...rest }: ImagePreviewProps) => {
  const [togglePreview, setTogglePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onPreviewImage = useCallback((props: File) => {
    setSelectedFile(props);
    setTogglePreview(true);
  }, []);

  const renderPreviewModal = useMemo(() => {
    if (!selectedFile) return <></>;

    const { name, path } = selectedFile || {};

    return (
      <Modal
        title={name}
        open={togglePreview}
        onOpenChange={setTogglePreview}
        className="lg:max-w-[70%]"
      >
        <img src={path} className="h-[600px] w-full object-contain" />
      </Modal>
    );
  }, [togglePreview, selectedFile]);

  return (
    <>
      <div className="w-full flex flex-wrap gap-2">
        {Array.isArray(file) && file.length ? (
          file.map(fileProps => {
            return (
              <ImageComponent
                key={fileProps.id}
                file={fileProps}
                {...rest}
                onClick={onPreviewImage}
              />
            );
          })
        ) : (
          <TextSmall secondary>N/A</TextSmall>
        )}
      </div>
      {renderPreviewModal}
    </>
  );
};

export default ImagePreview;
