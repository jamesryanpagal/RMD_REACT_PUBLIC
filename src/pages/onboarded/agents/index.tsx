import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import DateInput from "@/components/date-input";
import InputGroup from "@/components/input-group";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateAgent, useGetAgents } from "@/hooks/queries/useAgent";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { agentColumns } from "@/utils/data";
import { createAgentSchema, type CreateAgentSchema } from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";

type AgentFormProps = {
  setToggleAgentForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AgentForm = ({ setToggleAgentForm }: AgentFormProps) => {
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<CreateAgentSchema>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
    },
    resolver: zodResolver(createAgentSchema),
  });

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: createAgent } = useCreateAgent({
    onSuccess: () => {
      onInvalidate(["agents"]);
      onShowToast({
        title: "Agent Created",
        description: "Agent created successfully",
      });
      setToggleAgentForm(false);
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

  const onFormSubmit = async (props: CreateAgentSchema) => {
    await createAgent(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleAgentForm(false);
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
              title="Create Agent Failed"
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
          <Input label="Middle Name" {...register("middleName")} />
          <Input
            label="Last Name"
            required
            err={errors.lastName?.message}
            {...register("lastName")}
          />
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => {
              return (
                <DateInput
                  label="Birth Date"
                  required
                  err={errors.birthDate?.message}
                  value={field.value}
                  onChange={field.onChange}
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
                  setToggleAgentForm(false);
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

const Agents = () => {
  const [toggleAgentForm, setToggleAgentForm] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { val } = useDeferred(search);

  const { data, isLoading } = useGetAgents(val ? { search: val } : {});

  const nav = useNavigate();

  const onSelectAgent = useCallback((id: string, tabName: string) => {
    nav({
      parent: ["agents"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  }, []);

  const renderAgentForm = useMemo(() => {
    return (
      <Modal
        title="Add Agent"
        open={toggleAgentForm}
        onOpenChange={setToggleAgentForm}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <AgentForm setToggleAgentForm={setToggleAgentForm} />
      </Modal>
    );
  }, [toggleAgentForm]);

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
              placeholder="Search agent"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            onClick={() => {
              setToggleAgentForm(true);
            }}
          >
            Add Agent
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={agentColumns(onSelectAgent)}
            data={data?.response}
            rowLength={50}
            loading={isLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any agents."
                : "You haven't created any agents yet.",
              description: val
                ? "Please try again with different keywords or create a new agent."
                : "Get started by creating your first agent.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleAgentForm(true)}
                >
                  Add Agent
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderAgentForm}
    </>
  );
};

export default Agents;
