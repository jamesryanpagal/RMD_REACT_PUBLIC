import {
  MODULE_FUNCTION,
  type BlockResponse,
  type LotResponse,
  type PhaseResponse,
  type ProjectResponse,
  type QueryIdProps,
} from "@/api/query-fn.api";
import Container from "@/components/container";
import { Text, TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { ProjectLoading } from "@/components/ui/skeleton";
import {
  useAddBlock,
  useAddLot,
  useAddPhase,
  useDeleteLot,
  useDeleteProject,
  useGetProject,
  useUpdateBlockTitle,
  useUpdateLot,
  useUpdatePhaseTitle,
  useUpdateProjectAddressDetails,
  useUpdateProjectNameAndDescription,
} from "@/hooks/queries/useProject";
import { useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Modal } from "@/components/ui/dialog";
import React, { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  addBlockSchema,
  blockTitleSchema,
  lotSchema,
  phaseSchema,
  phaseTitleSchema,
  projectAddressDetailsSchema,
  projectNameAndDescriptionSchema,
  type AddBlockSchema,
  type BlockTitleSchema,
  type LotSchema,
  type PhaseSchema,
  type PhaseTitleSchema,
  type ProjectAddressDetailsSchema,
  type ProjectNameAndDescriptionSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { TextAreaAutoSize } from "@/components/ui/textarea";
import Alert from "@/components/alert";
import { PiWarningCircle, PiWarningCircleFill } from "react-icons/pi";
import { useToast } from "@/hooks/useToast";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import ConfirmationModal from "@/components/confirmation-modal";
import { useNavigate } from "@/hooks/useNavigate";
import { GoDotFill } from "react-icons/go";
import DataTable from "@/components/data-table";
import { lotColumns } from "@/utils/data";
import { Separator } from "@/components/ui/separator";
import { TiPlus } from "react-icons/ti";
import InputNumber from "@/components/input-number";
import SinglePhaseForm from "./phase-form";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLE } from "@/utils/type";

type EditType =
  | "project-name-description"
  | "address-details"
  | "phase"
  | "block"
  | "lot"
  | "add-lot"
  | "add-block"
  | "add-phase";

type EditFormProps = {
  id?: string;
  editType: EditType;
  project?: ProjectResponse | null;
  lot?: LotResponse | null;
  phase?: PhaseResponse | null;
  block?: BlockResponse | null;
  setToggleEditFormModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddPhaseForm = ({
  id,
  project,
  setToggleEditFormModal,
}: EditFormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<PhaseSchema>({
    defaultValues: {
      title: "",
      block: [{ title: "", lot: 1 }],
    },
    resolver: zodResolver(phaseSchema),
  });

  const [phase, setPhase] = useState<PhaseSchema[]>([]);
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const blocks = watch("block");

  const [isAddingPhase, setIsAddingPhase] = useState(false);

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: addPhase, isPending } = useAddPhase({
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
  });

  const onFormSubmit = (props: PhaseSchema) => {
    const { title, block } = props || {};
    setValue("title", title);
    setValue("block", block);

    setPhase(prev => [...prev, { title, block }]);

    setIsAddingPhase(false);
    reset();
  };

  const onSaveProject = async () => {
    if (!id) return;
    await Promise.all(
      phase.map(async p => {
        await addPhase({ id, ...p });
      }),
    );

    onShowToast({
      title: "Success",
      description: "Phase added successfully.",
      showClose: false,
    });
    setToggleEditFormModal(false);
    onInvalidate(["project", { id }]);

    clearErrors("root");
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

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
        <SinglePhaseForm
          project={project}
          isAddingPhase={isAddingPhase}
          setIsAddingPhase={setIsAddingPhase}
          phase={phase}
          onSave={() => ref.current?.requestSubmit()}
          onDeleteBlock={() => {}}
          register={register}
          errors={errors}
          setValue={setValue}
          blocks={blocks}
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
            disabled={isPending}
            onClick={() => {
              if (isDirty) {
                setToggleDiscardChanges(true);
              } else {
                setToggleEditFormModal(false);
              }
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            type="button"
            variant="success"
            loading={isPending}
            disabled={!phase.length || isPending}
            onClick={onSaveProject}
          >
            Save
          </Button>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const AddBlockForm = ({ id, phase, setToggleEditFormModal }: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<AddBlockSchema>({
    defaultValues: {
      id: phase?.id || "",
      title: "",
      lot: 0,
    },
    resolver: zodResolver(addBlockSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: addBlock } = useAddBlock({
    onSuccess: data => {
      onShowToast({
        title: "Success",
        description: data.response || "Block added successfully.",
        showClose: false,
      });
      setToggleEditFormModal(false);
      onInvalidate(["project", { id }]);
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = async (props: AddBlockSchema) => {
    await addBlock(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" flexDisplay gap="md">
          <Input
            label="Title"
            {...register("title")}
            required
            err={errors.title?.message}
          />
          <Controller
            control={control}
            name="lot"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Lot"
                  required
                  err={errors.lot?.message}
                  value={field.value}
                  onChange={e => field.onChange(e || 0)}
                />
              );
            }}
          />
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button
              variant="secondary"
              className="flex-1"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              type="submit"
              disabled={isSubmitting || !isDirty}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const AddLotForm = ({ id, block, setToggleEditFormModal }: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<LotSchema>({
    defaultValues: {
      id: block?.id || "",
      title: "",
      sqm: 0,
    },
    resolver: zodResolver(lotSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: addLot } = useAddLot({
    onSuccess: data => {
      onShowToast({
        title: "Success",
        description: data.response || "Lot added successfully.",
        showClose: false,
      });
      setToggleEditFormModal(false);
      onInvalidate(["project", { id }]);
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = async (props: LotSchema) => {
    await addLot(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" flexDisplay gap="md">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="Title"
            {...register("title")}
            required
            err={errors.title?.message}
          />
          <Controller
            control={control}
            name="sqm"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Sqm"
                  required
                  err={errors.sqm?.message}
                  value={field.value}
                  onChange={e => field.onChange(e || 0)}
                />
              );
            }}
          />
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button
              variant="secondary"
              className="flex-1"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              type="submit"
              disabled={isSubmitting || !isDirty}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const LotForm = ({ id, lot, setToggleEditFormModal }: EditFormProps) => {
  const { id: lotId, title, sqm } = lot || {};
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<LotSchema>({
    defaultValues: {
      id: lotId,
      title,
      sqm: sqm || 0,
    },
    resolver: zodResolver(lotSchema),
  });

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: updateLot } = useUpdateLot({
    onSuccess: data => {
      onShowToast({
        title: "Success",
        description: data.response || "Lot updated successfully.",
        showClose: false,
      });
      setToggleEditFormModal(false);
      onInvalidate(["project", { id }]);
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = async (props: LotSchema) => {
    await updateLot(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" cornerRadius="none" flexDisplay gap="md">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input label="Title" {...register("title")} />
          <Controller
            control={control}
            name="sqm"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Sqm"
                  required
                  err={errors.sqm?.message}
                  value={field.value}
                  onChange={e => field.onChange(e || 0)}
                />
              );
            }}
          />
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button
              variant="secondary"
              className="flex-1"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              type="submit"
              disabled={isSubmitting || !isDirty}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const BlockForm = ({ id, block, setToggleEditFormModal }: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<BlockTitleSchema>({
    defaultValues: {
      id: block?.id || "",
      title: block?.title || "",
    },
    resolver: zodResolver(blockTitleSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updateBlockTitle } = useUpdateBlockTitle({
    onSuccess: data => {
      onShowToast({
        title: "Success",
        description: data.response || "Block updated successfully.",
        showClose: false,
      });
      setToggleEditFormModal(false);
      onInvalidate(["project", { id }]);
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = async (props: BlockTitleSchema) => {
    await updateBlockTitle(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container flexDisplay padding="none">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="Title"
            {...register("title")}
            required
            err={errors.title?.message}
          />
          <Container
            flexDisplay
            flexDirection="row"
            padding="none"
            alignItems="center"
          >
            <Button
              variant="secondary"
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
              type="button"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
              className="flex-1"
              type="submit"
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const PhaseForm = ({ id, phase, setToggleEditFormModal }: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<PhaseTitleSchema>({
    defaultValues: {
      projectId: id || "",
      id: phase?.id || "",
      title: phase?.title || "",
    },
    resolver: zodResolver(phaseTitleSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updatePhaseTitle } = useUpdatePhaseTitle({
    onSuccess: data => {
      onShowToast({
        title: "Success",
        description: data.response || "Phase updated successfully.",
        showClose: false,
      });
      setToggleEditFormModal(false);
      onInvalidate(["project", { id }]);
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = async (props: PhaseTitleSchema) => {
    await updatePhaseTitle(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container flexDisplay padding="none">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="Title"
            {...register("title")}
            required
            err={errors.title?.message}
          />
          <Container
            flexDisplay
            flexDirection="row"
            padding="none"
            alignItems="center"
          >
            <Button
              variant="secondary"
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
              type="button"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
              className="flex-1"
              type="submit"
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const AddressDetailsForm = ({
  id,
  project,
  setToggleEditFormModal,
}: EditFormProps) => {
  const {
    houseNumber,
    street,
    barangay,
    subdivision,
    city,
    province,
    region,
    zip,
  } = project || {};
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ProjectAddressDetailsSchema>({
    defaultValues: {
      id,
      houseNumber,
      street,
      barangay,
      subdivision,
      city,
      province,
      region,
      zip,
    },
    resolver: zodResolver(projectAddressDetailsSchema),
  });

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: updateProjectAddressDetails } =
    useUpdateProjectAddressDetails({
      onSuccess: data => {
        onShowToast({
          title: "Success",
          description: data.response || "Project updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        onInvalidate(["project", { id }]);
      },
      onError: err => {
        setError("root", {
          message: err.message || "Something went wrong. Please try again.",
        });
      },
      onMutate: () => {
        clearErrors("root");
      },
    });

  const onFormSubmit = async (props: ProjectAddressDetailsSchema) => {
    await updateProjectAddressDetails(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" cornerRadius="none" flexDisplay gap="md">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input label="House #" {...register("houseNumber")} />
          <Input
            label="Street"
            required
            err={errors.street?.message}
            {...register("street")}
          />
          <Input
            label="Barangay"
            required
            err={errors.barangay?.message}
            {...register("barangay")}
          />
          <Input label="Subdivision" {...register("subdivision")} />
          <Input
            label="City"
            required
            err={errors.city?.message}
            {...register("city")}
          />
          <Input label="Province" {...register("province")} />
          <Input
            label="Region"
            required
            err={errors.region?.message}
            {...register("region")}
          />
          <Input label="Zip Code" {...register("zip")} />
          <Container
            flexDisplay
            flexDirection="row"
            padding="none"
            alignItems="center"
          >
            <Button
              variant="secondary"
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
              type="button"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
              className="flex-1"
              type="submit"
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const ProjectNameDescriptionForm = ({
  project,
  setToggleEditFormModal,
}: EditFormProps) => {
  const { id, projectName, description } = project || {};
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ProjectNameAndDescriptionSchema>({
    defaultValues: {
      id,
      projectName,
      description,
    },
    resolver: zodResolver(projectNameAndDescriptionSchema),
  });

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: updateProjectNameAndDescription } =
    useUpdateProjectNameAndDescription({
      onSuccess: data => {
        onShowToast({
          title: "Success",
          description: data.response || "Project updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        onInvalidate(["project", { id }]);
      },
      onError: err => {
        setError("root", {
          message: err.message || "Something went wrong. Please try again.",
        });
      },
      onMutate: () => {
        clearErrors("root");
      },
    });

  const onFormSubmit = async (props: ProjectNameAndDescriptionSchema) => {
    await updateProjectNameAndDescription(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
          reset();
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" flexDisplay gap="md" cornerRadius="none">
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="Project Name"
            required
            err={errors.projectName?.message}
            {...register("projectName")}
          />
          <TextAreaAutoSize
            label="Description"
            err={errors.description?.message}
            {...register("description")}
          />
          <Container
            flexDisplay
            flexDirection="row"
            padding="none"
            alignItems="center"
          >
            <Button
              variant="secondary"
              onClick={() => {
                if (isDirty) {
                  setToggleDiscardChanges(true);
                } else {
                  setToggleEditFormModal(false);
                }
              }}
              type="button"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
              className="flex-1"
              type="submit"
            >
              Save
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const renderEditForm: Record<
  EditType,
  (props: EditFormProps) => React.ReactNode
> = {
  "project-name-description": props => (
    <ProjectNameDescriptionForm {...props} />
  ),
  "address-details": props => <AddressDetailsForm {...props} />,
  phase: props => <PhaseForm {...props} />,
  block: props => <BlockForm {...props} />,
  lot: props => <LotForm {...props} />,
  "add-lot": props => <AddLotForm {...props} />,
  "add-block": props => <AddBlockForm {...props} />,
  "add-phase": props => <AddPhaseForm {...props} />,
};

const Project = () => {
  const { id } = useParams<QueryIdProps>();
  const { userDetails } = useAuth();
  const [toggleEditFormModal, setToggleEditFormModal] = useState(false);
  const [editType, setEditType] = useState<EditType>(
    "project-name-description",
  );
  const [toggleDeleteConfirmation, setToggleDeleteConfirmation] =
    useState(false);
  const [selectedLot, setSelectedLot] = useState<LotResponse | null>(null);
  const [toggleDeleteLotConfirmation, setToggleDeleteLotConfirmation] =
    useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseResponse | null>(
    null,
  );
  const [selectedBlock, setSelectedBlock] = useState<BlockResponse | null>(
    null,
  );

  const { role, admin, secretary } = userDetails || {};

  const canCreate =
    role === USER_ROLE.ADMIN
      ? admin?.moduleFunction.includes(MODULE_FUNCTION.CAN_CREATE_PROJECTS)
      : secretary?.moduleFunction.includes(MODULE_FUNCTION.CAN_CREATE_PROJECTS);
  const canUpdate =
    role === USER_ROLE.ADMIN
      ? admin?.moduleFunction.includes(MODULE_FUNCTION.CAN_UPDATE_PROJECTS)
      : secretary?.moduleFunction.includes(MODULE_FUNCTION.CAN_UPDATE_PROJECTS);
  const canDelete =
    role === USER_ROLE.ADMIN
      ? admin?.moduleFunction.includes(MODULE_FUNCTION.CAN_DELETE_PROJECTS)
      : secretary?.moduleFunction.includes(MODULE_FUNCTION.CAN_DELETE_PROJECTS);

  const { onShowToast } = useToast();
  const nav = useNavigate();
  const { onInvalidate } = useInvalidateQuery();

  const { data, isLoading } = useGetProject({ id: id! });

  const { mutateAsync: deleteProject, isPending } = useDeleteProject({
    onSuccess: data => {
      onShowToast({
        title: "Project Deleted.",
        description: data.response || "Project deleted successfully.",
        showClose: false,
      });
      nav({ path: "projects" });
      onInvalidate(["projects"]);
    },
    onError: err => {
      onShowToast({
        title: "Delete Failed.",
        description: err.message || "Something went wrong. Please try again.",
        showClose: false,
        type: "error",
      });
    },
    onMutate: () => {
      setToggleDeleteConfirmation(false);
    },
  });

  const { mutateAsync: deleteLot, isPending: isPendingDeleteLot } =
    useDeleteLot({
      onSuccess: data => {
        onShowToast({
          title: "Lot Deleted.",
          description: data.response || "Lot deleted successfully.",
          showClose: false,
        });
        onInvalidate(["project", { id }]);
      },
      onError: err => {
        onShowToast({
          title: "Delete Failed.",
          description: err.message || "Something went wrong. Please try again.",
          showClose: false,
          type: "error",
        });
      },
      onMutate: () => {
        setToggleDeleteLotConfirmation(false);
      },
    });

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
    phase,
  } = data?.response || {};

  const onToggleEditFormModal = (toggle: boolean, type?: EditType) => () => {
    if (type) {
      setEditType(type);
    }

    setToggleEditFormModal(toggle);
  };

  const onDeleteProject = async () => {
    if (!id) return;
    await deleteProject({ id });
  };

  const onConfirmDeleteLot = async () => {
    if (!selectedLot) return;
    await deleteLot({ id: selectedLot.id });
  };

  const onEditLot = (props: LotResponse) => {
    setEditType("lot");
    setSelectedLot(props);
    setToggleEditFormModal(true);
  };

  const onDeleteLot = (props: LotResponse) => {
    setSelectedLot(props);
    setToggleDeleteLotConfirmation(true);
  };

  const onReserve =
    (projectId: string, phase: string) => (props: LotResponse) => {
      const { blockId, id: lotId } = props || {};
      nav({
        path: "reservations",
        query: { project: projectId, phase, block: blockId, lot: lotId },
      });
    };

  const renderEditFormModal = useMemo(() => {
    return (
      <Modal
        title={`${editType.includes("add") ? "Add" : "Edit"} ${
          editType === "address-details"
            ? "Address Details"
            : editType === "phase"
            ? "Phase"
            : editType === "block"
            ? "Block"
            : editType === "lot"
            ? "Lot"
            : editType === "add-lot"
            ? "Lot"
            : editType === "add-phase"
            ? "Phase"
            : "Project Name and Description"
        }`}
        open={toggleEditFormModal}
        onOpenChange={setToggleEditFormModal}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        {renderEditForm[editType]({
          editType,
          setToggleEditFormModal,
          id,
          project: data?.response,
          lot: selectedLot,
          phase: selectedPhase,
          block: selectedBlock,
        })}
      </Modal>
    );
  }, [
    toggleEditFormModal,
    editType,
    id,
    data?.response,
    selectedLot,
    selectedPhase,
    selectedBlock,
  ]);

  const renderDeleteConfirmation = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDeleteConfirmation}
        onOpenChange={setToggleDeleteConfirmation}
        description="Are you sure you want to delete this project? This action cannot be undone."
        onCancel={() => setToggleDeleteConfirmation(false)}
        onConfirm={onDeleteProject}
        cancelButtonProps={{
          disabled: isPending,
        }}
        confirmButtonProps={{
          disabled: isPending,
          loading: isPending,
          label: (
            <>
              Delete <strong>{projectName}</strong>
            </>
          ),
        }}
      />
    );
  }, [toggleDeleteConfirmation, projectName, isPending]);

  const renderDeleteLotConfirmation = useMemo(() => {
    return (
      <ConfirmationModal
        description="Are you sure you want to delete this lot? this action cannot be undone."
        open={toggleDeleteLotConfirmation}
        onOpenChange={setToggleDeleteLotConfirmation}
        onCancel={() => setToggleDeleteLotConfirmation(false)}
        onConfirm={onConfirmDeleteLot}
        cancelButtonProps={{
          disabled: isPendingDeleteLot,
        }}
        confirmButtonProps={{
          disabled: isPendingDeleteLot,
          loading: isPendingDeleteLot,
          label: (
            <>
              Delete Lot <strong>{selectedLot?.title}</strong>
            </>
          ),
        }}
      />
    );
  }, [toggleDeleteLotConfirmation, selectedLot, isPendingDeleteLot]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        className="h-full"
        flexDisplay
        gap="md"
      >
        <Container padding="none" flexDisplay gap="none" className="gap-y-1">
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              <Title level={2}>{projectName}</Title>
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={!canUpdate}
                onClick={onToggleEditFormModal(
                  true,
                  "project-name-description",
                )}
              >
                <MdEdit className="text-dodger-blue size-5" />
              </Button>
            </Container>
            <Button
              variant="destructive"
              className="rounded-full"
              disabled={!canDelete}
              onClick={() => setToggleDeleteConfirmation(true)}
            >
              Delete
            </Button>
          </Container>
          <TextSmall secondary>{description}</TextSmall>
        </Container>
        <Container
          bordered
          padding="md"
          className="border-border/50 bg-card"
          flexDisplay
          gap="md"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Title level={5}>Address Details</Title>
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={!canUpdate}
              onClick={onToggleEditFormModal(true, "address-details")}
            >
              <MdEdit className="text-dodger-blue size-5" />
            </Button>
          </Container>
          <Container
            padding="none"
            cornerRadius="none"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3"
            gap="none"
          >
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>House #</TextSmall>
              <Text>{houseNumber || "N/A"}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Street</TextSmall>
              <Text>{street}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Subdivision</TextSmall>
              <Text>{subdivision || "N/A"}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Barangay</TextSmall>
              <Text>{barangay}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>City</TextSmall>
              <Text>{city}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Province</TextSmall>
              <Text>{province || "N/A"}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Zip Code</TextSmall>
              <Text>{zip || "N/A"}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Region</TextSmall>
              <Text>{region}</Text>
            </Container>
          </Container>
        </Container>
        <Container
          bordered
          padding="md"
          className="border-border/50 bg-card"
          flexDisplay
          gap="md"
        >
          <Container
            padding={{ right: "lg" }}
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Title level={5}>Phase, Block and Lot</Title>
            <Button
              variant="secondary-success"
              prefix={<TiPlus />}
              disabled={!canCreate}
              onClick={() => {
                onToggleEditFormModal(true, "add-phase")();
              }}
            >
              Add Phase
            </Button>
          </Container>
          <Container padding="none" cornerRadius="none" flexDisplay>
            {phase?.map(phaseProps => {
              const { id: phaseId, title: phaseTitle, block } = phaseProps;
              return (
                <React.Fragment key={phaseId}>
                  <Container
                    padding="none"
                    flexDisplay
                    flexDirection="row"
                    alignItems="center"
                  >
                    <GoDotFill />
                    <TextSmall
                      className="text-secondary-color/50 w-10"
                      secondary
                    >
                      Phase
                    </TextSmall>
                    <Text>{phaseTitle}</Text>
                    <Container
                      className="flex-1"
                      padding={{ right: "lg" }}
                      flexDisplay
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        disabled={!canUpdate}
                        onClick={() => {
                          setSelectedPhase(phaseProps);
                          onToggleEditFormModal(true, "phase")();
                        }}
                      >
                        <MdEdit className="text-dodger-blue size-4" />
                      </Button>
                      <Button
                        variant="secondary-success"
                        prefix={<TiPlus />}
                        disabled={!canCreate}
                        onClick={() => {
                          setSelectedPhase(phaseProps);
                          onToggleEditFormModal(true, "add-block")();
                        }}
                      >
                        Add Block
                      </Button>
                    </Container>
                  </Container>
                  {block.map((blockProps, i) => {
                    const { id: blockId, lot, title: blockTitle } = blockProps;
                    return (
                      <React.Fragment key={blockId}>
                        {i !== 0 && (
                          <Container padding={{ left: "lg", right: "lg" }}>
                            <Separator className="my-2" />
                          </Container>
                        )}
                        <Container
                          padding={{ left: "lg", right: "lg" }}
                          flexDisplay
                          flexDirection="row"
                          alignItems="center"
                        >
                          <TextSmall
                            className="text-secondary-color/50 w-10"
                            secondary
                          >
                            Block
                          </TextSmall>
                          <Text>{blockTitle}</Text>
                          <Container
                            className="flex-1"
                            padding="none"
                            flexDisplay
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Button
                              size="icon-xs"
                              variant="ghost"
                              disabled={!canUpdate}
                              onClick={() => {
                                setSelectedBlock(blockProps);
                                onToggleEditFormModal(true, "block")();
                              }}
                            >
                              <MdEdit className="text-dodger-blue size-4" />
                            </Button>
                            <Button
                              variant="secondary-success"
                              prefix={<TiPlus />}
                              disabled={!canCreate}
                              onClick={() => {
                                setSelectedBlock(blockProps);
                                onToggleEditFormModal(true, "add-lot")();
                              }}
                            >
                              Add Lot
                            </Button>
                          </Container>
                        </Container>
                        <Container padding={{ left: "lg", right: "lg" }}>
                          <DataTable
                            columns={lotColumns(
                              onEditLot,
                              onDeleteLot,
                              onReserve(id || "", phaseId),
                              canUpdate,
                              canDelete,
                            )}
                            data={lot}
                          />
                        </Container>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </Container>
        </Container>
      </Container>
      {renderEditFormModal}
      {renderDeleteConfirmation}
      {renderDeleteLotConfirmation}
    </>
  );
};

export default Project;
