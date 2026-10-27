import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import InputGroup from "@/components/input-group";
import MultiSelect from "@/components/multiselect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateUser, useGetUsers } from "@/hooks/queries/useUser";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import {
  moduleAccessOptions,
  moduleFunctionOptions,
  userColumns,
  userRoleOptions,
} from "@/utils/data";
import { onFormatMultiSelectValue } from "@/utils/helper";
import { userSchema, type UserSchema } from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";

type UserFormProps = {
  setToggleUserForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserForm = ({ setToggleUserForm }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<UserSchema>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      houseNumber: "",
      street: "",
      barangay: "",
      subdivision: "",
      city: "",
      province: "",
      region: "",
      zip: "",
      role: null,
      moduleAccess: [],
      moduleFunction: [],
    },
    resolver: zodResolver(userSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: createUser } = useCreateUser({
    onSuccess: data => {
      onInvalidate(["users"]);
      onShowToast({
        title: "User Created.",
        description: data.response || "User created successfully.",
        showClose: false,
      });
      setToggleUserForm(false);
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

  const onFormSubmit = async (props: UserSchema) => {
    await createUser(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleUserForm(false);
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
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Create User Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="First Name"
            {...register("firstName")}
            required
            err={errors.firstName?.message}
          />
          <Input label="Middle Name" {...register("middleName")} />
          <Input
            label="Last Name"
            {...register("lastName")}
            required
            err={errors.lastName?.message}
          />
          <Input
            label="Email"
            {...register("email")}
            required
            err={errors.email?.message}
          />
          <Input label="Phone" {...register("phone")} />
          <Input
            label="Mobile"
            {...register("mobile")}
            required
            err={errors.mobile?.message}
          />
          <Input label="House Number" {...register("houseNumber")} />
          <Input
            label="Street"
            {...register("street")}
            required
            err={errors.street?.message}
          />
          <Input
            label="Barangay"
            {...register("barangay")}
            required
            err={errors.barangay?.message}
          />
          <Input label="Subdivision" {...register("subdivision")} />
          <Input
            label="City"
            {...register("city")}
            required
            err={errors.city?.message}
          />
          <Input label="Province" {...register("province")} />
          <Input
            label="Region"
            {...register("region")}
            required
            err={errors.region?.message}
          />
          <Input label="ZIP Code" {...register("zip")} />
          <Controller
            control={control}
            name="role"
            render={({ field }) => {
              return (
                <Select
                  label="Role"
                  options={userRoleOptions}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  required
                  err={errors.role?.message}
                />
              );
            }}
          />
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
                  description="Select the modules that the user will have access to."
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
                  label="Module Functions"
                  options={moduleFunctionOptions}
                  value={onFormatMultiSelectValue(field.value || [])}
                  onChange={e => field.onChange(e.map(v => v.value))}
                  description="Select the module functions that the user will have access to."
                  err={errors.moduleFunction?.message}
                />
              );
            }}
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
                  setToggleUserForm(false);
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

const Users = () => {
  const [toggleUserForm, setToggleUserForm] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { val } = useDeferred(search);

  const { data, isLoading } = useGetUsers(val ? { search: val } : {});

  const nav = useNavigate();

  const renderUserForm = useMemo(() => {
    return (
      <Modal
        open={toggleUserForm}
        onOpenChange={setToggleUserForm}
        title="Add User"
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <UserForm setToggleUserForm={setToggleUserForm} />
      </Modal>
    );
  }, [toggleUserForm]);

  const onSelectUser = useCallback((id: string, tabName: string) => {
    nav({ parent: ["users"], path: ":id", params: { id }, query: { tabName } });
  }, []);

  return (
    <>
      <Container padding="none" cornerRadius="none" flexDisplay>
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          justifyContent="space-between"
          alignItems="end"
        >
          <Container padding="none" cornerRadius="none" className="w-[400px]">
            <InputGroup
              placeholder="Search user"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            onClick={() => {
              setToggleUserForm(true);
            }}
          >
            Add User
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={userColumns(onSelectUser)}
            data={data?.response}
            rowLength={50}
            loading={isLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any users."
                : "You haven't created any users yet.",
              description: val
                ? "Please try again with different keywords or create a new user."
                : "Get started by creating your first user.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleUserForm(true)}
                >
                  Add User
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderUserForm}
    </>
  );
};

export default Users;
