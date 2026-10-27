import type {
  AgentCommissionBreakdownResponse,
  AgentResponse,
  QueryIdProps,
} from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import DateInput from "@/components/date-input";
import FileUpload from "@/components/file-upload";
import InputGroup from "@/components/input-group";
import InputNumber from "@/components/input-number";
import { TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShortDetailsLoading, TableLoading } from "@/components/ui/skeleton";
import {
  useGetAgent,
  useGetAgentCommissionBreakdown,
  useGetAgentCommissions,
  useStartAgentCommission,
  useUpdateAgentPersonalDetails,
} from "@/hooks/queries/useAgent";
import { useReleaseAgentCommission } from "@/hooks/queries/usePayment";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import {
  agentCommissionBreakdownColumns,
  agentCommissionColumns,
  modeOfPaymentOptions,
  transactionTypeOptions,
} from "@/utils/data";
import { onToLocalCurrency, onToPascalCase } from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import {
  agentPersonalDetailsSchema,
  releaseAgentCommissionSchema,
  startCommissionSchema,
  type AgentPersonalDetailsSchema,
  type ReleaseAgentCommissionSchema,
  type StartCommissionSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cake, ChevronLeftIcon, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { useParams, useSearchParams } from "react-router-dom";

type AgentPersonalDetailsFormProps = {
  agentDetails?: AgentResponse | null;
  setToggleEditFormModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type AgentCommissionProps = {
  selectedAgentCommissionId?: string | null;
  onBack: () => void;
};

type StartCommissionFormProps = {
  id?: string | null;
  setToggleStartCommission: React.Dispatch<React.SetStateAction<boolean>>;
};

type PaymentFormProps = {
  agentCommissionId?: string | null;
  nextPayment?: AgentCommissionBreakdownResponse | null;
  setTogglePayForDueDate: React.Dispatch<React.SetStateAction<boolean>>;
};

const AgentPersonalDetailsForm = ({
  agentDetails,
  setToggleEditFormModal,
}: AgentPersonalDetailsFormProps) => {
  const { id, firstName, middleName, lastName, birthDate } = agentDetails || {};
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<AgentPersonalDetailsSchema>({
    defaultValues: {
      id: id || "",
      firstName: firstName || "",
      middleName: middleName || "",
      lastName: lastName || "",
      birthDate: birthDate || "",
    },
    resolver: zodResolver(agentPersonalDetailsSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updateAgentPersonalDetails } =
    useUpdateAgentPersonalDetails({
      onSuccess: data => {
        onInvalidate(["agent", { id: id! }]);
        onShowToast({
          title: "Agent's Personal Details Updated.",
          description:
            data.response || "Agent's Personal details updated successfully.",
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

  const onFormSubmit = async (props: AgentPersonalDetailsSchema) => {
    await updateAgentPersonalDetails(props);
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {errors.root?.message && (
          <Alert
            icon={<PiWarningCircleFill />}
            title="Update Failed"
            description={errors.root.message}
            variant="destructive"
          />
        )}
        <Container padding="none" flexDisplay cornerRadius="none">
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
            className="mt-3"
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

const StartCommissionForm = ({
  id,
  setToggleStartCommission,
}: StartCommissionFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<StartCommissionSchema>({
    defaultValues: {
      id: id || "",
      terms: 0,
      releaseStartDate: "",
    },
    resolver: zodResolver(startCommissionSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: startAgentCommission } = useStartAgentCommission({
    onSuccess: data => {
      onInvalidate(["agent-commission-breakdown", { id: id! }]);
      onInvalidate(["agent-commissions"]);
      onShowToast({
        title: "Agent Commission Started.",
        description: data.response || "Agent commission started successfully.",
        showClose: false,
      });
      setToggleStartCommission(false);
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

  const onFormSubmit = async (props: StartCommissionSchema) => {
    await startAgentCommission(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleStartCommission(false);
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {errors.root?.message && (
          <Alert
            icon={<PiWarningCircleFill />}
            title="Update Failed"
            description={errors.root.message}
            variant="destructive"
          />
        )}
        <Container padding="none" flexDisplay cornerRadius="none">
          <Controller
            control={control}
            name="terms"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Terms"
                  required
                  err={errors.terms?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="releaseStartDate"
            render={({ field }) => {
              return (
                <DateInput
                  label="Release Start Date"
                  required
                  err={errors.releaseStartDate?.message}
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
                  setToggleStartCommission(false);
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

const PaymentForm = ({
  agentCommissionId,
  nextPayment,
  setTogglePayForDueDate,
}: PaymentFormProps) => {
  const { amount, transactionType } = nextPayment || {};
  const {
    register,
    control,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ReleaseAgentCommissionSchema>({
    defaultValues: {
      agentCommissionId: agentCommissionId || "",
      pfp: [],
      modeOfPayment: null,
      paymentDate: "",
      amount: amount || 0,
      referenceNumber: "",
      transactionType: transactionType || null,
    },
    resolver: zodResolver(releaseAgentCommissionSchema),
  });

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { mutateAsync: releaseAgentCommission } = useReleaseAgentCommission({
    onSuccess: () => {
      onInvalidate(["agent-commission-breakdown", { id: agentCommissionId! }]);
      onInvalidate(["agent-commissions"]);
      onShowToast({
        title: "Release Created",
        description: "Release has been created successfully.",
      });
      setTogglePayForDueDate(false);
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

  const onFormSubmit = async (props: ReleaseAgentCommissionSchema) => {
    await releaseAgentCommission(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setTogglePayForDueDate(false);
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
        {errors.root?.message && (
          <Alert
            icon={<PiWarningCircleFill />}
            title="Payment Failed"
            description={errors.root.message}
            variant="destructive"
            className="mb-5"
          />
        )}
        <Container padding="none" flexDisplay cornerRadius="none">
          <Controller
            control={control}
            name="pfp"
            render={({ field }) => {
              return (
                <FileUpload
                  label="Proof of Payment"
                  value={field.value}
                  err={errors.pfp?.message}
                  onChange={e => field.onChange(e)}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="modeOfPayment"
            render={({ field }) => {
              return (
                <Select
                  label="Mode of Payment"
                  options={modeOfPaymentOptions}
                  required
                  err={errors.modeOfPayment?.message}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="paymentDate"
            render={({ field }) => {
              return (
                <DateInput
                  label="Payment Date"
                  required
                  err={errors.paymentDate?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="amount"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Amount"
                  formatOptions={{
                    style: "currency",
                    currency: "PHP",
                  }}
                  required
                  err={errors.amount?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="transactionType"
            render={({ field }) => {
              return (
                <Select
                  label="Transaction Type"
                  options={transactionTypeOptions}
                  disabled
                  required
                  err={errors.transactionType?.message}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                />
              );
            }}
          />
          <Input label="Reference Number" {...register("referenceNumber")} />
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="mt-3"
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
                  setTogglePayForDueDate(false);
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
              Pay
            </Button>
          </Container>
        </Container>
      </form>
      {renderDiscardChanges}
    </>
  );
};

const AgentCommission = ({
  selectedAgentCommissionId,
  onBack,
}: AgentCommissionProps) => {
  const [toggleStartCommission, setToggleStartCommission] = useState(false);
  const [toggleReleaseForm, setToggleReleaseForm] = useState(false);

  const {
    data: agentCommissionBreakdown,
    isLoading: isLoadingAgentCommissionBreakdown,
  } = useGetAgentCommissionBreakdown({ id: selectedAgentCommissionId! });

  const unpaidTransaction = useMemo(() => {
    return agentCommissionBreakdown?.response?.filter(({ paid }) => !paid)?.[0];
  }, [agentCommissionBreakdown?.response]);

  const paidTransaction = useMemo(() => {
    return agentCommissionBreakdown?.response
      ?.filter(({ paid }) => paid)
      .at(-1);
  }, [agentCommissionBreakdown?.response]);

  const remainingBalance = useMemo(() => {
    return !paidTransaction
      ? (unpaidTransaction?.amount || 0) +
          (unpaidTransaction?.remainingBalance || 0)
      : paidTransaction?.remainingBalance || 0;
  }, [paidTransaction, unpaidTransaction]);

  const totalPayment = useMemo(() => {
    return agentCommissionBreakdown?.response
      ?.filter(acb => acb.paid)
      ?.reduce((acc, c) => (acc += c.paidAmount), 0);
  }, [agentCommissionBreakdown?.response]);

  const renderStartCommission = useMemo(() => {
    return (
      <Modal
        title="Start Agent Commission"
        open={toggleStartCommission}
        onOpenChange={setToggleStartCommission}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <StartCommissionForm
          id={selectedAgentCommissionId}
          setToggleStartCommission={setToggleStartCommission}
        />
      </Modal>
    );
  }, [toggleStartCommission, selectedAgentCommissionId]);

  const renderReleaseForm = useMemo(() => {
    return (
      <Modal
        title={`Release for ${unpaidTransaction?.dueDate || ""}`}
        description={`Amount to pay ${onToLocalCurrency(
          unpaidTransaction?.amount || 0,
        )}`}
        open={toggleReleaseForm}
        onOpenChange={setToggleReleaseForm}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <PaymentForm
          agentCommissionId={selectedAgentCommissionId}
          setTogglePayForDueDate={setToggleReleaseForm}
          nextPayment={unpaidTransaction}
        />
      </Modal>
    );
  }, [toggleReleaseForm, unpaidTransaction, selectedAgentCommissionId]);

  if (isLoadingAgentCommissionBreakdown) {
    return <TableLoading />;
  }

  if (!agentCommissionBreakdown?.response) {
    return (
      <>
        <Container
          padding="md"
          flexDisplay
          cornerRadius="none"
          alignItems="center"
          justifyContent="center"
        >
          <Title level={5}>
            Agent commission must be started first before showing release
            breakdown.
          </Title>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Button variant="secondary" onClick={onBack}>
              <ChevronLeftIcon className="size-4" />
              Back
            </Button>
            <Button
              variant="success"
              onClick={() => setToggleStartCommission(true)}
            >
              Start Commission
            </Button>
          </Container>
        </Container>
        {renderStartCommission}
      </>
    );
  }

  return (
    <>
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        className="mt-4"
      >
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeftIcon className="size-4" />
          Back
        </Button>
        {unpaidTransaction && (
          <Button variant="success" onClick={() => setToggleReleaseForm(true)}>
            Release for {unpaidTransaction.dueDate}
          </Button>
        )}
      </Container>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Container
          bordered
          padding="md"
          className="border-border/50 bg-card"
          flexDisplay
          justifyContent="center"
          gap="none"
        >
          <TextSmall>Remaining Balance</TextSmall>
          <Title level={4}>{onToLocalCurrency(remainingBalance)}</Title>
        </Container>
        <Container
          bordered
          padding="md"
          className="border-border/50 bg-card"
          flexDisplay
          justifyContent="center"
          gap="none"
        >
          <TextSmall>Total Payment</TextSmall>
          <Title level={4}>
            {onToLocalCurrency(Math.round(totalPayment || 0))}
          </Title>
        </Container>
        {unpaidTransaction && (
          <Container
            bordered
            padding="md"
            className="border-border/50 bg-card"
            flexDisplay
            justifyContent="center"
            gap="none"
          >
            <TextSmall>Next Payment</TextSmall>
            <Title level={4}>{unpaidTransaction.dueDate}</Title>
          </Container>
        )}
      </div>
      <Container bordered className="bg-card border-border/50">
        <DataTable
          columns={agentCommissionBreakdownColumns}
          data={agentCommissionBreakdown?.response}
          rowLength={50}
        />
      </Container>
      {renderReleaseForm}
    </>
  );
};

const Agent = () => {
  const { id } = useParams<QueryIdProps>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleEditFormModal, setToggleEditFormModal] = useState(false);
  const [search, setSearch] = useState("");

  const nav = useNavigate();
  const { val } = useDeferred(search);

  const { data, isLoading } = useGetAgent({ id: id! });
  const { data: agentCommissions, isLoading: isLoadingAgentCommissions } =
    useGetAgentCommissions({ id: id!, ...(val ? { search: val } : {}) });

  const { firstName, middleName, lastName, birthDate } = data?.response || {};

  const agentFullName = `${firstName} ${
    middleName ? middleName + "," : ""
  } ${lastName}`;

  const selectedAgentCommissionId = searchParams.get("acId") || "";

  const onBack = useCallback(() => {
    const tabName = searchParams.get("tabName") || "";
    setSearchParams({ tabName });
  }, [searchParams]);

  const onSelectAgentCommission = useCallback(
    (id: string) => {
      const tabName = searchParams.get("tabName") || "";
      setSearchParams({ tabName, acId: id });
    },
    [searchParams],
  );

  const renderAgentPersonalDetailsForm = useMemo(() => {
    return (
      <Modal
        title="Edit Agent's Personal Details"
        open={toggleEditFormModal}
        onOpenChange={setToggleEditFormModal}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <AgentPersonalDetailsForm
          agentDetails={data?.response}
          setToggleEditFormModal={setToggleEditFormModal}
        />
      </Modal>
    );
  }, [toggleEditFormModal, data?.response]);

  const renderContent = useMemo(() => {
    return !selectedAgentCommissionId ? (
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
          justifyContent="space-between"
        >
          <Title level={5}>Commission</Title>
          <Container padding="none" className="w-64">
            <InputGroup
              placeholder="Search project"
              prefix={<Search />}
              className="w-10"
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
        </Container>
        <DataTable
          columns={agentCommissionColumns(onSelectAgentCommission)}
          data={agentCommissions?.response}
          rowLength={50}
          loading={isLoadingAgentCommissions}
          noDataProps={{
            title: "No commission data available.",
            description: "Start by assigning a contract to this agent.",
            action: (
              <Button
                variant="secondary-success"
                onClick={() => nav({ path: "contracts" })}
              >
                Assign to a Contract
              </Button>
            ),
          }}
        />
      </Container>
    ) : (
      <AgentCommission
        selectedAgentCommissionId={selectedAgentCommissionId}
        onBack={onBack}
      />
    );
  }, [
    selectedAgentCommissionId,
    agentCommissions?.response,
    isLoadingAgentCommissions,
    onSelectAgentCommission,
    onBack,
  ]);

  return (
    <>
      <Container padding="none" cornerRadius="none" flexDisplay>
        {isLoading ? (
          <ShortDetailsLoading />
        ) : (
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
                <Title level={2}>{onToPascalCase(agentFullName)}</Title>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setToggleEditFormModal(true)}
                >
                  <MdEdit className="text-dodger-blue size-5" />
                </Button>
              </Container>
            </Container>
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              <Cake />
              <TextSmall>
                {mtz(birthDate, "defaultformat").format(
                  DATE_FORMAT.shortDateAbbrev,
                )}
              </TextSmall>
            </Container>
          </Container>
        )}
        {renderContent}
      </Container>
      {renderAgentPersonalDetailsForm}
    </>
  );
};

export default Agent;
