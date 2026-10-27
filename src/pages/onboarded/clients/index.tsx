import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import InputGroup from "@/components/input-group";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateClient, useGetClients } from "@/hooks/queries/useClients";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { clientColumns } from "@/utils/data";
import { clientSchema, type ClientSchema } from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";

export type ClientFormProps = {
  setToggleClientForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClientForm = ({ setToggleClientForm }: ClientFormProps) => {
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ClientSchema>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      tinNumber: "",
      houseNumber: "",
      street: "",
      barangay: "",
      subdivision: "",
      city: "",
      province: "",
      region: "",
      zip: "",
    },
    resolver: zodResolver(clientSchema),
  });

  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: createClient } = useCreateClient({
    onSuccess: () => {
      onInvalidate(["clients"]);
      onShowToast({
        title: "Client Created",
        description: "Client created successfully",
      });
      setToggleClientForm(false);
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

  const onFormSubmit = async (props: ClientSchema) => {
    await createClient(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleClientForm(false);
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
              title="Create Client Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <Input
            label="First Name"
            required
            err={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input label="Middle" {...register("middleName")} />
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
            label="Contact #"
            required
            err={errors.contactNumber?.message}
            {...register("contactNumber")}
          />
          <Input
            label="TIN #"
            required
            err={errors.tinNumber?.message}
            {...register("tinNumber")}
          />
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
          <Input label="ZIP Code" {...register("zip")} />
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
                  setToggleClientForm(false);
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

const Clients = () => {
  const [toggleClientForm, setToggleClientForm] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { val } = useDeferred(search);

  const { data: clients, isLoading } = useGetClients(
    val ? { search: val } : {},
  );

  const nav = useNavigate();

  const renderClientForm = useMemo(() => {
    return (
      <Modal
        open={toggleClientForm}
        onOpenChange={setToggleClientForm}
        title="Add Client"
        closeOnClickOutside={false}
        closeOnEsc={false}
        showCloseButton={false}
      >
        <ClientForm setToggleClientForm={setToggleClientForm} />
      </Modal>
    );
  }, [toggleClientForm]);

  const onSelectClient = useCallback((id: string, tabName: string) => {
    nav({
      parent: ["clients"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
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
              placeholder="Search client"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            onClick={() => {
              setToggleClientForm(true);
            }}
          >
            Add Client
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={clientColumns(onSelectClient)}
            data={clients?.response}
            rowLength={50}
            loading={isLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any clients."
                : "You haven't created any clients yet.",
              description: val
                ? "Please try again with different keywords or create a new client."
                : "Get started by creating your first client.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleClientForm(true)}
                >
                  Add Client
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderClientForm}
    </>
  );
};

export default Clients;
