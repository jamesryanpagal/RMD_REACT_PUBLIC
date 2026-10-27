import Container from "@/components/container";
import { Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TextAreaAutoSize } from "@/components/ui/textarea";
import {
  phaseSchema,
  projectSchema,
  type PhaseSchema,
  type ProjectSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TiPlus } from "react-icons/ti";
import { useCreateProject, useGetProjects } from "@/hooks/queries/useProject";
import Alert from "@/components/alert";
import { PiWarningCircle } from "react-icons/pi";
import { useToast } from "@/hooks/useToast";
import DataTable from "@/components/data-table";
import { projectColumns } from "@/utils/data";
import InputGroup from "@/components/input-group";
import { Search } from "lucide-react";
import { useNavigate } from "@/hooks/useNavigate";
import ConfirmationModal from "@/components/confirmation-modal";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { MdAdd } from "react-icons/md";
import PhaseForm from "./phase-form";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLE } from "@/utils/type";
import { MODULE_FUNCTION } from "@/api/query-fn.api";
import { useDeferred } from "@/hooks/useDeferred";

type ProjectFormProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setToggleProjectFormModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export type StepsFormProps = ProjectFormProps & {
  formData?: ProjectSchema & {
    phase: PhaseSchema[];
  };
  setFormData?: React.Dispatch<
    React.SetStateAction<StepsFormProps["formData"]>
  >;
};

const Step2 = ({
  formData,
  setFormData,
  setStep,
  setToggleProjectFormModal,
}: StepsFormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PhaseSchema>({
    defaultValues: {
      title: "",
      block: [{ title: "", lot: 1 }],
    },
    resolver: zodResolver(phaseSchema),
  });

  const { phase, ...restFormData } = formData || {};

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: createProject, isPending } = useCreateProject({
    onSuccess: () => {
      onShowToast({
        title: "Project Created",
        description: "Project has been created successfully!",
        showClose: false,
      });
      setToggleProjectFormModal(false);
      setStep(1);
      reset();
      onInvalidate(["projects"]);
    },
    onError: () => {
      setError("root", {
        message:
          "Something went wrong while creating the project. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const blocks = watch("block");

  const onDeleteBlock = (index: number) => {
    setValue(
      "block",
      getValues("block").filter((_, i) => i !== index),
    );
  };

  const onFormSubmit = (props: PhaseSchema) => {
    setFormData?.(prev => {
      if (!prev) return prev;

      if (prev?.phase) {
        prev.phase = [...prev.phase, props];
      }

      return (prev = { ...prev });
    });

    setIsAddingPhase(false);
    reset();
  };

  const onSaveProject = async () => {
    await createProject(formData);
  };

  return (
    <>
      {errors.root?.message && (
        <Alert
          variant="destructive"
          icon={<PiWarningCircle />}
          title="Create Project Failed"
          description={errors.root.message}
        />
      )}
      <form
        ref={ref}
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-y-5"
      >
        <PhaseForm
          isAddingPhase={isAddingPhase}
          setIsAddingPhase={setIsAddingPhase}
          project={restFormData as ProjectSchema}
          phase={phase || []}
          onSave={() => ref.current?.requestSubmit()}
          onDeleteBlock={onDeleteBlock}
          register={register}
          errors={errors}
          setValue={setValue}
          blocks={blocks}
        />
        {!!formData?.phase.length && !isAddingPhase && (
          <Container
            padding="none"
            cornerRadius="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button
              className="flex-1"
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => setStep(prev => (prev -= 1))}
            >
              Previous
            </Button>
            <Button
              className="flex-1"
              type="button"
              variant="success"
              loading={isPending}
              disabled={isPending}
              onClick={onSaveProject}
            >
              Save
            </Button>
          </Container>
        )}
      </form>
    </>
  );
};

const Step1 = ({
  formData,
  setFormData,
  setStep,
  setToggleProjectFormModal,
}: StepsFormProps) => {
  const [toggleConfirmation, setToggleConfirmation] = useState(false);

  const {
    projectName,
    description,
    houseNumber,
    street,
    barangay,
    subdivision,
    city,
    province,
    region,
    zip,
  } = formData || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectSchema>({
    defaultValues: {
      projectName: projectName || "",
      description: description || "",
      houseNumber: houseNumber || "",
      street: street || "",
      barangay: barangay || "",
      subdivision: subdivision || "",
      city: city || "",
      province: province || "",
      region: region || "",
      zip: zip || "",
    },
    resolver: zodResolver(projectSchema),
  });

  const onFormSubmit = async (props: ProjectSchema) => {
    setFormData?.(prev => {
      if (!prev) return { ...props, phase: [] };
      return { ...prev, ...props };
    });
    setStep(prev => (prev += 1));
  };

  const renderConfirmationModal = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleConfirmation}
        onOpenChange={setToggleConfirmation}
        onCancel={() => setToggleConfirmation(false)}
        onConfirm={() => {
          setToggleProjectFormModal(false);
          reset({});
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleConfirmation]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-y-5"
      >
        <Input
          label="Project Name"
          {...register("projectName")}
          err={errors.projectName?.message}
          required
        />
        <Text secondary>Address</Text>
        <Container padding="none" cornerRadius="none" flexDisplay gap="md">
          <TextAreaAutoSize
            label="Description"
            {...register("description")}
            className="max-h-36"
            err={errors.description?.message}
          />
          <Input
            label="House Number"
            {...register("houseNumber")}
            err={errors.houseNumber?.message}
          />
          <Input
            label="Street"
            {...register("street")}
            err={errors.street?.message}
            required
          />
          <Input
            label="Barangay"
            {...register("barangay")}
            err={errors.barangay?.message}
            required
          />
          <Input
            label="Subdivision"
            {...register("subdivision")}
            err={errors.subdivision?.message}
          />
          <Input
            label="City"
            {...register("city")}
            err={errors.city?.message}
            required
          />
          <Input
            label="Province"
            {...register("province")}
            err={errors.province?.message}
          />
          <Input
            label="Region"
            {...register("region")}
            err={errors.region?.message}
            required
          />
          <Input
            label="Zip Code"
            {...register("zip")}
            err={errors.zip?.message}
          />
          <Container
            padding="none"
            cornerRadius="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button
              className="flex-1"
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                if (isDirty) {
                  setToggleConfirmation(true);
                } else {
                  setToggleProjectFormModal(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              type="submit"
              variant="success"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
            >
              Next
            </Button>
          </Container>
        </Container>
      </form>
      {renderConfirmationModal}
    </>
  );
};

const renderCurrentStep: Record<
  string,
  (props: StepsFormProps) => React.ReactNode
> = {
  "1": props => <Step1 {...props} />,
  "2": props => <Step2 {...props} />,
};

const ProjectForm = (props: ProjectFormProps) => {
  const [formData, setFormData] =
    useState<StepsFormProps["formData"]>(undefined);
  return renderCurrentStep[props.step]({ ...props, formData, setFormData });
};

const Projects = () => {
  const { userDetails } = useAuth();
  const [toggleProjectFormModal, setToggleProjectFormModal] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [step, setStep] = useState(1);

  const { val } = useDeferred(search);

  const { data, isLoading } = useGetProjects(val ? { search: val } : {});

  const nav = useNavigate();

  const onSelectProject = (id: string, tabName: string) => {
    nav({
      parent: ["projects"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  };

  const { role, admin, secretary } = userDetails || {};

  const canCreate =
    role === USER_ROLE.ADMIN
      ? admin?.moduleFunction.includes(MODULE_FUNCTION.CAN_CREATE_PROJECTS)
      : secretary?.moduleFunction.includes(MODULE_FUNCTION.CAN_CREATE_PROJECTS);

  const renderProjectFormModal = useMemo(() => {
    return (
      <Modal
        title={`Add ${step === 1 ? "Project" : "Phase, Block and Lot"}`}
        description={`Step ${step} of ${Object.keys(renderCurrentStep).length}`}
        open={toggleProjectFormModal}
        onOpenChange={setToggleProjectFormModal}
        closeOnClickOutside={false}
        showCloseButton={false}
        closeOnEsc={false}
      >
        <ProjectForm
          step={step}
          setStep={setStep}
          setToggleProjectFormModal={setToggleProjectFormModal}
        />
      </Modal>
    );
  }, [toggleProjectFormModal, step, renderCurrentStep]);

  return (
    <>
      <Container cornerRadius="none" padding="none" flexDisplay>
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          justifyContent="space-between"
          alignItems="end"
        >
          <Container padding="none" cornerRadius="none" className="w-[400px]">
            <InputGroup
              placeholder="Search project"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            disabled={!canCreate}
            onClick={() => {
              setToggleProjectFormModal(true);
            }}
          >
            Add Project
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={projectColumns(onSelectProject)}
            data={data?.response}
            rowLength={50}
            loading={isLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any projects."
                : "You haven't created any projects yet.",
              description: val
                ? "Please try again with different keywords or create a new project."
                : "Get started by creating your first project.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleProjectFormModal(true)}
                >
                  Add Project
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderProjectFormModal}
    </>
  );
};

export default Projects;
