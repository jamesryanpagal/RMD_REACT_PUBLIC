import { treeIcon, treeLastIcon } from "@/assets";
import Container from "@/components/container";
import { TextSmall } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlockSchema, PhaseSchema, ProjectSchema } from "@/utils/schema.z";
import { useMemo } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { GoDotFill } from "react-icons/go";
import { IoTrashBin } from "react-icons/io5";

export type PhaseFormProps = {
  blocks: BlockSchema[];
  project?: ProjectSchema | null;
  phase: PhaseSchema[] | PhaseSchema;
  errors: FieldErrors<PhaseSchema>;
  isAddingPhase?: boolean;
  setIsAddingPhase?: React.Dispatch<React.SetStateAction<boolean>>;
  onSave?: () => void;
  onDeleteBlock?: (props: number) => void;
  register: UseFormRegister<PhaseSchema>;
  setValue: UseFormSetValue<PhaseSchema>;
};

const PhaseComponent = ({ title, block }: PhaseSchema) => {
  if (!title || !block || !block.length) {
    return <></>;
  }

  return (
    <Container padding="none" flexDisplay gap="none">
      <Container
        padding={{ top: "sm", bottom: "sm" }}
        flexDisplay
        flexDirection="row"
        alignItems="center"
        gap="none"
        className="gap-x-1"
        cornerRadius="none"
      >
        <GoDotFill />
        <TextSmall className="font-bold">{title}</TextSmall>
      </Container>
      {block.map(({ title: blockTitle, lot }, j, arr) => {
        const isLast = j === arr.length - 1;
        return (
          <Container
            key={j}
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            gap="none"
            className="gap-x-1 h-12"
            cornerRadius="none"
          >
            <img
              src={isLast ? treeLastIcon : treeIcon}
              className="h-full w-1h-12 ml-2"
            />
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="ml-2"
            >
              <Container
                padding="none"
                cornerRadius="none"
                flexDisplay
                flexDirection="row"
                gap="none"
                alignItems="center"
              >
                <TextSmall secondary className="w-12">
                  Block
                </TextSmall>
                <TextSmall className="font-bold">{blockTitle}</TextSmall>
              </Container>
              <Container
                padding="none"
                cornerRadius="none"
                flexDisplay
                flexDirection="row"
                gap="none"
                alignItems="center"
              >
                <TextSmall secondary className="w-12">
                  Lot
                </TextSmall>
                <TextSmall className="font-bold">{lot}</TextSmall>
              </Container>
            </Container>
          </Container>
        );
      })}
    </Container>
  );
};

const PhaseForm = ({
  isAddingPhase,
  project,
  phase,
  blocks,
  errors,
  setIsAddingPhase,
  onSave,
  onDeleteBlock,
  register,
  setValue,
}: PhaseFormProps) => {
  const isPhaseArray = Array.isArray(phase);
  const renderTreePreview = useMemo(() => {
    const {
      projectName,
      houseNumber,
      street,
      barangay,
      subdivision,
      city,
      province,
      region,
      zip,
      description,
    } = project || {};

    return (
      <Container
        bordered
        className="bg-card mb-5 mt-2 border-border/50"
        flexDisplay
        gap="none"
      >
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <TextSmall secondary className="font-bold">
            {projectName}
          </TextSmall>
          <Container
            padding="none"
            cornerRadius="none"
            flexDisplay
            flexDirection="row"
          >
            {isAddingPhase && (
              <Button
                variant="destructive"
                size="xs"
                onClick={() => {
                  setIsAddingPhase?.(prev => !prev);
                }}
              >
                Cancel
              </Button>
            )}
            {isPhaseArray ? (
              <Button
                variant="success"
                size="xs"
                type="button"
                onClick={() => {
                  if (isAddingPhase) {
                    onSave?.();
                  } else {
                    setIsAddingPhase?.(true);
                  }
                }}
              >
                {isAddingPhase ? "Save" : "Add"}
              </Button>
            ) : (
              !isPhaseArray &&
              (!phase.title || !phase.block) && (
                <Button
                  variant="success"
                  size="xs"
                  type="button"
                  onClick={() => {
                    if (isAddingPhase) {
                      onSave?.();
                    } else {
                      setIsAddingPhase?.(true);
                    }
                  }}
                >
                  {isAddingPhase ? "Save" : "Add"}
                </Button>
              )
            )}
          </Container>
        </Container>
        {phase && isPhaseArray ? (
          phase?.map((props, i) => {
            return <PhaseComponent key={i} {...props} />;
          })
        ) : (
          <PhaseComponent {...phase} />
        )}
        <Container padding={{ top: "md" }} cornerRadius="none" flexDisplay>
          <TextSmall secondary>Address Details</TextSmall>
          <Container
            padding={{ left: "sm" }}
            className="border-l-8 border-border/50"
            cornerRadius="none"
          >
            <TextSmall className="font-bold">
              {`${houseNumber || ""} ${street}, ${
                subdivision ? subdivision + "," : ""
              } Brgy. ${barangay}, ${city} ${province ? province + "," : ""} ${
                zip ? zip + "," : ""
              } ${region}`}
            </TextSmall>
          </Container>
          <TextSmall secondary>Descriptions</TextSmall>
          <Container
            padding={{ left: "sm" }}
            className="border-l-8 border-border/50"
            cornerRadius="none"
          >
            <TextSmall
              {...(description
                ? { className: "font-bold" }
                : { secondary: true })}
            >
              {description || "No description provided."}
            </TextSmall>
          </Container>
        </Container>
      </Container>
    );
  }, [project, phase, isAddingPhase, isPhaseArray]);

  return (
    <>
      {renderTreePreview}
      {isAddingPhase && (
        <>
          <Container bordered className="bg-card border-border/50">
            <TextSmall secondary>Phase</TextSmall>
          </Container>
          <Container
            padding={{ left: "md" }}
            className="border-l-4 border-border/50"
            cornerRadius="none"
          >
            <Input
              label="Title"
              placeholder={`Phase ${
                isPhaseArray ? (phase.length || 0) + 1 : 1
              }`}
              {...register("title")}
              err={errors.title?.message}
              required
            />
          </Container>
          <Container
            bordered
            className="bg-card border-border/50"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextSmall secondary>Block</TextSmall>
            <Button
              size="xs"
              variant="success"
              type="button"
              onClick={() => {
                setValue("block", [...blocks, { title: "", lot: 1 }]);
              }}
            >
              Add Block
            </Button>
          </Container>
          {blocks?.map((_, i, arr) => {
            return (
              <Container
                padding={{ left: "md" }}
                cornerRadius="none"
                flexDisplay
                key={i}
                className="border-l-4 border-border/50"
              >
                {arr.length > 1 && (
                  <Container
                    padding="none"
                    cornerRadius="none"
                    flexDisplay
                    flexDirection="row"
                    justifyContent="end"
                  >
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      onClick={() => onDeleteBlock?.(i)}
                    >
                      <IoTrashBin className="text-destructive" />
                    </Button>
                  </Container>
                )}
                <Input
                  label="Title"
                  placeholder={`Block ${i + 1}`}
                  {...register(`block.${i}.title`)}
                  err={errors.block?.[i]?.title?.message}
                  required
                />
                <Input
                  label="Lot"
                  {...register(`block.${i}.lot`, { valueAsNumber: true })}
                  err={errors.block?.[i]?.lot?.message}
                  required
                />
              </Container>
            );
          })}
        </>
      )}
    </>
  );
};

export default PhaseForm;
