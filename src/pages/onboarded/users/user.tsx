import type {
  MODULE_ACCESS,
  MODULE_FUNCTION,
  QueryIdProps,
} from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import InputGroup from "@/components/input-group";
import MultiSelect from "@/components/multiselect";
import { Text, TextSmall, Title } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProjectLoading } from "@/components/ui/skeleton";
import { useGetClients } from "@/hooks/queries/useClients";
import { useGetProjects } from "@/hooks/queries/useProject";
import {
  useAssignClient,
  useAssignProject,
  useDeleteUser,
  useGetUser,
  useGetUserClients,
  useGetUserProjects,
  useUpdateUserAccessAndFunctions,
  useUpdateUserAddressDetails,
  useUpdateUserPersonalDetails,
} from "@/hooks/queries/useUser";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import {
  clientColumns,
  moduleAccessOptions,
  moduleFunctionOptions,
  projectColumns,
} from "@/utils/data";
import { onFormatMultiSelectValue, onToPascalCase } from "@/utils/helper";
import {
  assignClientSchema,
  assignProjectSchema,
  personalDetailsSchema,
  projectAddressDetailsSchema,
  updateUserAccessAndFunctionsSchema,
  type AssignClientSchema,
  type AssignProjectSchema,
  type PersonalDetailsSchema,
  type ProjectAddressDetailsSchema,
  type UpdateUserAccessAndFunctionsSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { useParams } from "react-router-dom";

type EditFormType =
  | "module-access-and-function"
  | "address-details"
  | "personal-details";

type EditFormProps = {
  id?: string;
  moduleAccess?: MODULE_ACCESS[];
  moduleFunction?: MODULE_FUNCTION[];
  houseNumber?: string;
  street?: string;
  barangay?: string;
  subdivision?: string;
  city?: string;
  province?: string;
  region?: string;
  zip?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  setToggleEditFormModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PersonalDetailsForm = ({
  id,
  firstName,
  middleName,
  lastName,
  email,
  mobile,
  phone,
  setToggleEditFormModal,
}: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<PersonalDetailsSchema>({
    defaultValues: {
      id: id || "",
      firstName: firstName || "",
      middleName: middleName || "",
      lastName: lastName || "",
      email: email || "",
      mobile: mobile || "",
      phone: phone || "",
    },
    resolver: zodResolver(personalDetailsSchema),
  });
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updateUserPersonalDetails } =
    useUpdateUserPersonalDetails({
      onSuccess: data => {
        onInvalidate(["user", { id: id! }]);
        onShowToast({
          title: "Personal Details Updated.",
          description:
            data.response || "Personal details updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        reset();
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

  const onFormSubmit = async (props: PersonalDetailsSchema) => {
    await updateUserPersonalDetails(props);
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
        <Container padding="none" cornerRadius="none" flexDisplay>
          <Input
            label="First Name"
            required
            err={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input label="Middle Name" {...register("middleName")} />
          <Input
            label="Last Name"
            required
            err={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            label="Email"
            required
            err={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Mobile"
            required
            err={errors.mobile?.message}
            {...register("mobile")}
          />
          <Input label="Phone" {...register("phone")} />
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

const ModuleAccessAndFunctionForm = ({
  id,
  moduleAccess,
  moduleFunction,
  setToggleEditFormModal,
}: EditFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<UpdateUserAccessAndFunctionsSchema>({
    defaultValues: {
      id: id || "",
      moduleAccess: moduleAccess || [],
      moduleFunction: moduleFunction || [],
    },
    resolver: zodResolver(updateUserAccessAndFunctionsSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updateAccessAndFunctions } =
    useUpdateUserAccessAndFunctions({
      onSuccess: data => {
        onInvalidate(["user", { id: id! }]);
        onShowToast({
          title: "Module Access and Function Updated.",
          description:
            data.response || "Module access and function updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        reset();
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

  const onFormSubmit = async (props: UpdateUserAccessAndFunctionsSchema) => {
    await updateAccessAndFunctions(props);
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
        <Container padding="none" flexDisplay>
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Update User Access and Function Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Controller
            control={control}
            name="moduleAccess"
            render={({ field }) => {
              return (
                <MultiSelect
                  label="Module Access"
                  options={moduleAccessOptions}
                  value={onFormatMultiSelectValue(field.value || [])}
                  onChange={e => field.onChange(e.map(v => v.value))}
                  required
                  err={errors.moduleAccess?.message}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="moduleFunction"
            render={({ field }) => {
              return (
                <MultiSelect
                  label="Module Function"
                  options={moduleFunctionOptions}
                  value={onFormatMultiSelectValue(field.value || [])}
                  onChange={e => field.onChange(e.map(v => v.value))}
                  err={errors.moduleFunction?.message}
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

const AddressForm = ({
  id,
  houseNumber,
  street,
  barangay,
  subdivision,
  city,
  province,
  region,
  zip,
  setToggleEditFormModal,
}: EditFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ProjectAddressDetailsSchema>({
    defaultValues: {
      id: id || "",
      houseNumber: houseNumber || "",
      street: street || "",
      barangay: barangay || "",
      subdivision: subdivision || "",
      city: city || "",
      province: province || "",
      region: region || "",
      zip: zip || "",
    },
    resolver: zodResolver(projectAddressDetailsSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: updateUserAddressDetails } = useUpdateUserAddressDetails(
    {
      onSuccess: data => {
        onShowToast({
          title: "Success",
          description: data.response || "Address details updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        onInvalidate(["user", { id }]);
      },
      onError: err => {
        setError("root", {
          message: err.message || "Something went wrong. Please try again.",
        });
      },
      onMutate: () => {
        clearErrors("root");
      },
    },
  );

  const onFormSubmit = async (props: ProjectAddressDetailsSchema) => {
    await updateUserAddressDetails(props);
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
        <Container padding="none" flexDisplay>
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

const renderEditForm: Record<
  EditFormType,
  (props: EditFormProps) => React.ReactNode
> = {
  "module-access-and-function": props => (
    <ModuleAccessAndFunctionForm {...props} />
  ),
  "address-details": props => <AddressForm {...props} />,
  "personal-details": props => <PersonalDetailsForm {...props} />,
};

const User = () => {
  const { id } = useParams<QueryIdProps>();
  const { data, isLoading } = useGetUser({ id: id! });
  const {
    data: userClients,
    isLoading: isUserClientsLoading,
    isRefetching: isUserClientsRefetching,
  } = useGetUserClients({ id: id! });
  const {
    data: userProjects,
    isLoading: isUserProjectsLoading,
    isRefetching: isUserProjectRefetching,
  } = useGetUserProjects({ id: id! });

  const [clientSearch, setClientSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const { val: clientSearchVal } = useDeferred(clientSearch);
  const { val: projectSearchVal } = useDeferred(projectSearch);

  const { data: clients, isLoading: isClientsLoading } = useGetClients(
    clientSearchVal ? { search: clientSearchVal } : {},
  );
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects(
    projectSearchVal ? { search: projectSearchVal } : {},
  );

  const [toggleEditFormModal, setToggleEditFormModal] = useState(false);
  const [editFormType, setEditFormType] = useState<EditFormType>(
    "module-access-and-function",
  );
  const [toggleDeleteConfirmation, setToggleDeleteConfirmation] =
    useState(false);

  const [toggleAssignClient, setToggleAssignClient] = useState(false);
  const [toggleAssignProject, setToggleAssignProject] = useState(false);

  const {
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AssignClientSchema>({
    defaultValues: {
      id: id || "",
      clientIds: userClients?.response?.map(({ id }) => id) || [],
    },
    resolver: zodResolver(assignClientSchema),
  });

  const {
    setValue: setProjectValue,
    handleSubmit: handleSubmitProject,
    setError: setProjectError,
    clearErrors: clearProjectErrors,
    formState: { errors: projectErrors, isSubmitting: projectIsSubmitting },
  } = useForm<AssignProjectSchema>({
    defaultValues: {
      id: id || "",
      projectIds: userProjects?.response?.map(({ id }) => id) || [],
    },
    resolver: zodResolver(assignProjectSchema),
  });

  const {
    username,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    mobile,
    houseNumber,
    street,
    subdivision,
    barangay,
    city,
    province,
    zip,
    region,
    admin,
    secretary,
    role,
  } = data?.response || {};

  const moduleAccess = admin?.moduleAccess.length
    ? admin?.moduleAccess
    : secretary?.moduleAccess;

  const moduleFunction = admin?.moduleFunction.length
    ? admin?.moduleFunction
    : secretary?.moduleFunction;

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();
  const nav = useNavigate();

  const { mutateAsync: deleteUser, isPending } = useDeleteUser({
    onSuccess: () => {
      onInvalidate(["users"]);
      nav({ path: "users" });
    },
    onError: () => {
      onShowToast({
        title: "Delete Failed",
        description:
          "Something went wrong while deleting the user. Please try again.",
        type: "error",
      });
    },
    onMutate: () => {
      setToggleDeleteConfirmation(false);
    },
  });

  const { mutateAsync: assignClient } = useAssignClient({
    onSuccess: () => {
      onInvalidate(["user", { id: id! }]);
      onInvalidate(["user-clients", { id: id! }]);
      onShowToast({
        title: "Success",
        description: "Client assigned successfully",
      });
      setToggleAssignClient(false);
    },
    onError: () => {
      setError("root", {
        message:
          "Something went wrong while assigning the client to the user. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const { mutateAsync: assignProject } = useAssignProject({
    onSuccess: () => {
      onInvalidate(["user", { id: id! }]);
      onInvalidate(["user-projects", { id: id! }]);
      onShowToast({
        title: "Success",
        description: "Project assigned successfully",
      });
      setToggleAssignProject(false);
    },
    onError: () => {
      setProjectError("root", {
        message:
          "Something went wrong while assigning the project to the user. Please try again.",
      });
    },
    onMutate: () => {
      clearProjectErrors("root");
    },
  });

  const onConfirmDeleteUser = async () => {
    if (!id) return;
    await deleteUser({ id });
  };

  const onToggleEditFormModal = (toggle: boolean, type: EditFormType) => {
    setToggleEditFormModal(toggle);
    setEditFormType(type);
  };

  const onFormSubmit =
    (type: "clients" | "projects") =>
    async (props: AssignClientSchema | AssignProjectSchema) => {
      await (type === "clients" ? assignClient : assignProject)(props as any);
    };

  const onSelectAssigned = useCallback(
    (parentPath: "clients" | "projects") => (id: string, tabName: string) => {
      nav({
        parent: [parentPath],
        path: ":id",
        params: { id },
        query: { tabName },
      });
    },
    [],
  );

  const renderFormModal = useMemo(() => {
    return (
      <Modal
        open={toggleEditFormModal}
        onOpenChange={setToggleEditFormModal}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
        title={`Edit ${
          editFormType === "module-access-and-function"
            ? "Module Access and Function"
            : "Address Details"
        }`}
      >
        {renderEditForm[editFormType]({
          id,
          moduleAccess,
          moduleFunction,
          houseNumber,
          street,
          barangay,
          subdivision,
          city,
          province,
          region,
          zip,
          firstName,
          middleName,
          lastName,
          email,
          mobile,
          phone,
          setToggleEditFormModal,
        })}
      </Modal>
    );
  }, [
    toggleEditFormModal,
    editFormType,
    id,
    moduleAccess,
    moduleFunction,
    houseNumber,
    street,
    barangay,
    subdivision,
    city,
    province,
    region,
    zip,
    firstName,
    middleName,
    lastName,
    email,
    mobile,
    phone,
  ]);

  const renderDeleteConfirmationModal = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDeleteConfirmation}
        onOpenChange={setToggleDeleteConfirmation}
        onCancel={() => setToggleDeleteConfirmation(false)}
        description="Are you sure you want to delete this user? this action cannot be undone."
        onConfirm={onConfirmDeleteUser}
        cancelButtonProps={{
          disabled: isPending,
        }}
        confirmButtonProps={{
          loading: isPending,
          disabled: isPending,
          label: (
            <>
              Delete{" "}
              <strong>
                {firstName || ""} {lastName || ""}
              </strong>
            </>
          ),
        }}
      />
    );
  }, [toggleDeleteConfirmation, firstName, lastName, isPending]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container padding="none" cornerRadius="none" flexDisplay>
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
              <Title level={2}>
                {firstName} {!middleName ? "" : middleName + ","} {lastName}
              </Title>
              <Badge>{onToPascalCase(role || "")}</Badge>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => onToggleEditFormModal(true, "personal-details")}
              >
                <MdEdit className="text-dodger-blue size-5" />
              </Button>
            </Container>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => {
                setToggleDeleteConfirmation(true);
              }}
            >
              Delete
            </Button>
          </Container>
          <Container
            padding="none"
            cornerRadius="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="flex-wrap"
          >
            <TextSmall secondary>{username}</TextSmall>
            <Container bordered padding="none" className="h-5" />
            <TextSmall secondary>{email}</TextSmall>
            <Container bordered padding="none" className="h-5" />
            <TextSmall secondary>{mobile}</TextSmall>
            {phone && (
              <>
                <Container bordered padding="none" className="h-5" />
                <TextSmall secondary>{phone}</TextSmall>
              </>
            )}
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
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Title level={5}>Address Details</Title>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onToggleEditFormModal(true, "address-details")}
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
          className="border-border/50 bg-card grid-cols-1 grid md:grid-cols-2"
          gap="md"
        >
          <Container padding="none" flexDisplay gap="md">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              <Title level={5}>Module Access</Title>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  onToggleEditFormModal(true, "module-access-and-function")
                }
              >
                <MdEdit className="text-dodger-blue size-5" />
              </Button>
            </Container>
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              className="flex-wrap gap-2"
            >
              {!moduleAccess?.length ? (
                <TextSmall secondary>No module access assigned.</TextSmall>
              ) : (
                moduleAccess?.map((module, i) => {
                  return (
                    <Container
                      key={i}
                      bordered
                      cornerRadius="full"
                      padding="none"
                      className="py-1 px-2"
                    >
                      <TextSmall>
                        {onToPascalCase(module, {
                          removeCharacters: ["_"],
                          replaceCharactersWith: " ",
                        })}
                      </TextSmall>
                    </Container>
                  );
                })
              )}
            </Container>
          </Container>
          <Container padding="none" flexDisplay gap="md">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              <Title level={5}>Module Function</Title>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  onToggleEditFormModal(true, "module-access-and-function")
                }
              >
                <MdEdit className="text-dodger-blue size-5" />
              </Button>
            </Container>
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              className="flex-wrap gap-2"
            >
              {!moduleFunction?.length ? (
                <TextSmall secondary>No module function(s) assigned.</TextSmall>
              ) : (
                moduleFunction?.map((module, i) => {
                  return (
                    <Container
                      key={i}
                      bordered
                      cornerRadius="full"
                      padding="none"
                      className="py-1 px-2"
                    >
                      <TextSmall>
                        {onToPascalCase(module, {
                          removeCharacters: ["_"],
                          replaceCharactersWith: " ",
                        })}
                      </TextSmall>
                    </Container>
                  );
                })
              )}
            </Container>
          </Container>
        </Container>
        <Container
          bordered
          padding="md"
          flexDisplay
          className="border-border/50 bg-card"
          gap="md"
        >
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
              <Title level={5}>Clients Assigned</Title>
              {toggleAssignClient ? (
                <>
                  <Button
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => {
                      setToggleAssignClient(false);
                      clearErrors("root");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onClick={handleSubmit(onFormSubmit("clients"))}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setToggleAssignClient(prev => !prev)}
                >
                  <MdEdit className="text-dodger-blue size-5" />
                </Button>
              )}
            </Container>
            <Container padding="none" cornerRadius="none" className="w-[400px]">
              <InputGroup
                placeholder="Search client"
                prefix={<Search />}
                onChange={e => setClientSearch(e.target.value)}
              />
            </Container>
          </Container>
          {(errors.root?.message || errors.clientIds?.message) && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Assign Client Failed"
              description={errors.root?.message || errors.clientIds?.message}
              variant="destructive"
            />
          )}
          <DataTable
            columns={clientColumns(onSelectAssigned("clients"))}
            data={
              toggleAssignClient ? clients?.response : userClients?.response
            }
            loading={
              isUserClientsLoading ||
              isClientsLoading ||
              isUserClientsRefetching
            }
            enableRowSelection={toggleAssignClient}
            selectedRows={toggleAssignClient ? userClients?.response : []}
            onSelectRow={row => {
              const formattedRow = row.map(({ id }) => id);
              setValue("clientIds", formattedRow);
            }}
            showPagination={false}
            noDataProps={{
              title: "No specific clients assigned.",
              description:
                "Having no specific clients assigned to a user means that the user has access to all clients. If you want to limit the user's access to specific clients, you can assign them here.",
              action: (
                <Button
                  variant="success"
                  onClick={() => setToggleAssignClient(true)}
                >
                  Assign Clients
                </Button>
              ),
            }}
          />
        </Container>
        <Container
          bordered
          padding="md"
          flexDisplay
          className="border-border/50 bg-card"
          gap="md"
        >
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
              <Title level={5}>Projects Assigned</Title>
              {toggleAssignProject ? (
                <>
                  <Button
                    variant="secondary"
                    disabled={projectIsSubmitting}
                    onClick={() => {
                      setToggleAssignProject(false);
                      clearProjectErrors("root");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    disabled={projectIsSubmitting}
                    loading={projectIsSubmitting}
                    onClick={handleSubmitProject(onFormSubmit("projects"))}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setToggleAssignProject(prev => !prev)}
                >
                  <MdEdit className="text-dodger-blue size-5" />
                </Button>
              )}
            </Container>
            <Container padding="none" cornerRadius="none" className="w-[400px]">
              <InputGroup
                placeholder="Search project"
                prefix={<Search />}
                onChange={e => setProjectSearch(e.target.value)}
              />
            </Container>
          </Container>
          {(projectErrors.root?.message ||
            projectErrors.projectIds?.message) && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Assign Client Failed"
              description={
                projectErrors.root?.message || projectErrors.projectIds?.message
              }
              variant="destructive"
            />
          )}
          <DataTable
            columns={projectColumns(onSelectAssigned("projects"))}
            data={
              toggleAssignProject ? projects?.response : userProjects?.response
            }
            loading={
              isUserProjectsLoading ||
              isProjectsLoading ||
              isUserProjectRefetching
            }
            enableRowSelection={toggleAssignProject}
            selectedRows={toggleAssignProject ? userProjects?.response : []}
            onSelectRow={row => {
              const formattedRow = row.map(({ id }) => id);
              setProjectValue("projectIds", formattedRow);
            }}
            showPagination={false}
            noDataProps={{
              title: "No specific projects assigned.",
              description:
                "Having no specific projects assigned to a user means that the user has access to all projects. If you want to limit the user's access to specific projects, you can assign them here.",
              action: (
                <Button
                  variant="success"
                  onClick={() => setToggleAssignProject(true)}
                >
                  Assign Projects
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderFormModal}
      {renderDeleteConfirmationModal}
    </>
  );
};

export default User;
