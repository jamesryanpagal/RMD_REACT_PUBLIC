import {
  DOWN_PAYMENT_TYPE,
  INSTALLMENT_TYPE,
  PAYMENT_TYPE,
  RESERVATION_STATUS,
  type AgentResponse,
  type BlockResponse,
  type ClientResponse,
  type LotResponse,
  type PhaseResponse,
  type ProjectResponse,
} from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import DateInput from "@/components/date-input";
import InputGroup from "@/components/input-group";
import InputNumber from "@/components/input-number";
import RadioButtonGroup from "@/components/radio-button-group";
import RadioCard from "@/components/radio-card";
import { Text, TextSmall, Title } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FormLoading } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useGetAgents } from "@/hooks/queries/useAgent";
import { useGetClients } from "@/hooks/queries/useClients";
import {
  useCreateContractCashPayment,
  useCreateContractPartialOrFullDownPayment,
  useCreateContractStraightMonthlyPayment,
  useGetClientLotReservation,
  useGetContracts,
} from "@/hooks/queries/useContract";
import { useGetProjects } from "@/hooks/queries/useProject";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import {
  COMMISSION_NUM_VALUE,
  MISCELLANEOUS_NUM_VALUE,
  RESERVATION_STATUS_THEME,
} from "@/utils/constants";
import {
  commissionOptions,
  contractColumns,
  contractPaymentOptions,
  downPaymentTypeOptions,
  installmentTypeItems,
  miscellaneousOptions,
} from "@/utils/data";
import { onToLocalCurrency, onToPascalCase } from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import {
  cashPaymentSchema,
  partialAndFullDownPaymentSchema,
  straightMonthlyPaymentSchema,
  type CashPaymentSchema,
  type PartialAndFullDownPaymentSchema,
  type StraightMonthlyPaymentSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent, Search } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";

type ContractPaymentFormProps = {
  lot?: LotResponse;
  agents?: AgentResponse[] | null;
  clientId: string;
  paymentType: PAYMENT_TYPE;
  reservationAmount: number;
  setPaymentType: React.Dispatch<React.SetStateAction<PAYMENT_TYPE>>;
  setToggleContractForm?: React.Dispatch<React.SetStateAction<boolean>>;
};

type ContractFormProps = Pick<
  ContractPaymentFormProps,
  "setToggleContractForm"
>;

const CashPaymentForm = ({
  paymentType,
  lot,
  agents,
  clientId,
  setToggleContractForm,
}: ContractPaymentFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    getValues,
    setValue,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<CashPaymentSchema>({
    defaultValues: {
      sqmPrice: 0,
      totalLotPrice: 0,
      miscellaneous: null,
      miscellaneousTotal: 0,
      agentCommission: null,
      agentCommissionTotal: 0,
      tcp: 0,
      paymentType,
      agentId: "",
      lotId: lot?.id || "",
      clientId: clientId || "",
    },
    resolver: zodResolver(cashPaymentSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const watchedTotalLotPrice = watch("totalLotPrice");
  const watchedTcp = watch("tcp");

  const { cbDebounce } = useDeferred("", 1000);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: createContractCashPayment } =
    useCreateContractCashPayment({
      onSuccess: () => {
        onInvalidate(["contracts"]);
        onShowToast({
          title: "Contract Created",
          description: "Contract has been created successfully.",
        });
        setToggleContractForm?.(false);
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

  const onCalculateTcp = (
    field: "lot" | "miscellaneous",
    totalValue: number,
  ) => {
    if (field === "lot") {
      const miscellaneousTotal = getValues("miscellaneousTotal");
      setValue("tcp", totalValue + miscellaneousTotal);
    } else {
      const totalLotPrice = getValues("totalLotPrice");
      setValue("tcp", totalLotPrice + totalValue);
    }
  };

  const onFormSubmit = async (props: CashPaymentSchema) => {
    await createContractCashPayment(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleContractForm?.(false);
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
            title="Create Contract Failed"
            description={errors.root.message}
            variant="destructive"
            className="mb-5"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
          <div className="border border-success p-2.5 rounded-md bg-success/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Lot
              </Title>
              <Badge variant="outline-sold" className="font-bold">
                {lot?.sqm || ""} Sqm
              </Badge>
            </Container>
            <Controller
              control={control}
              name="sqmPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Sqm Price"
                    required
                    err={errors.sqmPrice?.message}
                    value={field.value}
                    onChange={e => {
                      const numValue = e || 0;
                      field.onChange(numValue);
                      const totalLotPrice = numValue * (lot?.sqm || 0);
                      setValue("miscellaneous", null);
                      setValue("miscellaneousTotal", 0);
                      setValue("agentCommission", null);
                      setValue("agentCommissionTotal", 0);
                      setValue("totalLotPrice", totalLotPrice);
                      onCalculateTcp("lot", totalLotPrice);
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="totalLotPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Total Lot Price"
                    required
                    err={errors.totalLotPrice?.message}
                    value={field.value}
                    onChange={field.onChange}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="border border-primary p-2.5 rounded-md bg-primary/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Miscellaneous
              </Title>
            </Container>
            <Controller
              control={control}
              name="miscellaneous"
              render={({ field }) => {
                return (
                  <Select
                    label="Miscellaneous"
                    placeholder="Select Miscellaneous"
                    required
                    err={errors.miscellaneous?.message}
                    options={miscellaneousOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = MISCELLANEOUS_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const miscellaneousTotal =
                          numValue * (getValues("totalLotPrice") / 100);
                        onCalculateTcp("miscellaneous", miscellaneousTotal);
                        setValue("miscellaneousTotal", miscellaneousTotal);
                        setValue("agentCommission", null);
                        setValue("agentCommissionTotal", 0);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="miscellaneousTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Miscellaneous Total"
                    required
                    err={errors.miscellaneousTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <div className="border border-mac-and-cheese p-2.5 rounded-md bg-mac-and-cheese/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Agent Commission
              </Title>
            </Container>
            <Controller
              control={control}
              name="agentCommission"
              render={({ field }) => {
                return (
                  <Select
                    label="Agent Commission"
                    placeholder="Select Agent Commission"
                    required
                    err={errors.agentCommission?.message}
                    options={commissionOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = COMMISSION_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const agentCommissionTotal =
                          (numValue / 100) * getValues("tcp");
                        setValue("agentCommissionTotal", agentCommissionTotal);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="agentCommissionTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Agent Commission Total"
                    required
                    err={errors.agentCommissionTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            <div className="col-span-1">
              <Controller
                control={control}
                name="agentId"
                render={({ field }) => {
                  return (
                    <Select
                      triggerProps={{ className: "bg-background" }}
                      label="Agent"
                      placeholder="Select Agent"
                      options={agents?.map(
                        ({ id, firstName, middleName, lastName }) => ({
                          id,
                          label: `${firstName} ${middleName || ""} ${lastName}`,
                          value: id,
                        }),
                      )}
                      required
                      err={errors.agentId?.message}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  );
                }}
              />
            </div>
          </div>
          <Container
            padding="none"
            flexDisplay
            className="gap-y-2 col-span-1 md:col-span-2"
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
                <Title
                  level={4}
                  className="dark:text-turtle-green text-success"
                >
                  Total Contract Price (TCP)
                </Title>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1 dark:text-turtle-green text-success font-bold">
                  {onToLocalCurrency(watchedTcp)}
                </Text>
              </Container>
            </Container>
          </Container>
        </div>
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
                setToggleContractForm?.(false);
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
      </form>
      {renderDiscardChanges}
    </>
  );
};

const PartialAndFullDownPaymentForm = ({
  paymentType,
  lot,
  agents,
  clientId,
  reservationAmount,
  setToggleContractForm,
}: ContractPaymentFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    getValues,
    setValue,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<PartialAndFullDownPaymentSchema>({
    defaultValues: {
      sqmPrice: 0,
      totalLotPrice: 0,
      miscellaneous: null,
      miscellaneousTotal: 0,
      agentCommission: null,
      agentCommissionTotal: 0,
      tcp: 0,
      paymentType,
      agentId: "",
      lotId: lot?.id || "",
      clientId: clientId || "",
      downPayment: 0,
      downPaymentTerms: null,
      downPaymentType: null,
      terms: 0,
      paymentStartDate: "",
      miscellaneousAsLastPayment: false,
    },
    resolver: zodResolver(partialAndFullDownPaymentSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const watchedTotalLotPrice = watch("totalLotPrice");
  const watchedTcp = watch("tcp");
  const watchedDownPaymentType = watch("downPaymentType");
  const watchedDownPayment = watch("downPayment");
  const watchedDownPaymentTerms = watch("downPaymentTerms");
  const watchedTerms = watch("terms");
  const watchedMiscellaneousAsLastPayment = watch("miscellaneousAsLastPayment");

  const totalDownPayment = useMemo(() => {
    return (
      (watchedMiscellaneousAsLastPayment ? watchedTotalLotPrice : watchedTcp) *
      (watchedDownPayment / 100)
    );
  }, [
    watchedDownPayment,
    watchedTcp,
    watchedMiscellaneousAsLastPayment,
    watchedTotalLotPrice,
  ]);

  const computedTotalDownPayment = useMemo(() => {
    const computedTotal =
      (watchedMiscellaneousAsLastPayment
        ? watchedTotalLotPrice * (watchedDownPayment / 100)
        : totalDownPayment) - reservationAmount;
    if (computedTotal < 0) return 0;

    return computedTotal;
  }, [
    totalDownPayment,
    watchedMiscellaneousAsLastPayment,
    watchedTotalLotPrice,
    watchedDownPayment,
    reservationAmount,
  ]);

  const totalMonthlyDown = useMemo(() => {
    return watchedDownPaymentTerms
      ? computedTotalDownPayment / watchedDownPaymentTerms
      : 0;
  }, [computedTotalDownPayment, watchedDownPaymentTerms]);

  const totalMonthly = useMemo(() => {
    if (!watchedTerms) return 0;

    return (
      ((watchedMiscellaneousAsLastPayment ? watchedTotalLotPrice : watchedTcp) -
        totalDownPayment) /
      watchedTerms
    );
  }, [
    watchedTerms,
    watchedTcp,
    totalDownPayment,
    watchedMiscellaneousAsLastPayment,
    watchedTotalLotPrice,
  ]);

  const { cbDebounce } = useDeferred("", 1000);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const onCalculateTcp = (
    field: "lot" | "miscellaneous",
    totalValue: number,
  ) => {
    if (field === "lot") {
      const miscellaneousTotal = getValues("miscellaneousTotal");
      setValue("tcp", totalValue + miscellaneousTotal);
    } else {
      const totalLotPrice = getValues("totalLotPrice");
      setValue("tcp", totalLotPrice + totalValue);
    }
  };

  const { mutateAsync: createContractPartialOrFullDownPayment } =
    useCreateContractPartialOrFullDownPayment({
      onSuccess: () => {
        onInvalidate(["contracts"]);
        onShowToast({
          title: "Contract Created",
          description: "Contract has been created successfully.",
        });
        setToggleContractForm?.(false);
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

  const onFormSubmit = async (props: PartialAndFullDownPaymentSchema) => {
    await createContractPartialOrFullDownPayment(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleContractForm?.(false);
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
            title="Create Contract Failed"
            description={errors.root.message}
            variant="destructive"
            className="mb-5"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
          <div className="border border-success p-2.5 rounded-md bg-success/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Lot
              </Title>
              <Badge variant="outline-sold" className="font-bold">
                {lot?.sqm || ""} Sqm
              </Badge>
            </Container>
            <Controller
              control={control}
              name="sqmPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Sqm Price"
                    required
                    err={errors.sqmPrice?.message}
                    value={field.value}
                    onChange={e => {
                      const numValue = e || 0;
                      field.onChange(numValue);
                      const totalLotPrice = numValue * (lot?.sqm || 0);
                      setValue("miscellaneous", null);
                      setValue("miscellaneousTotal", 0);
                      setValue("agentCommission", null);
                      setValue("agentCommissionTotal", 0);
                      setValue("totalLotPrice", totalLotPrice);
                      setValue("downPayment", 0);
                      setValue("downPaymentTerms", 0);
                      setValue("downPaymentType", null);
                      setValue("terms", 0);
                      onCalculateTcp("lot", totalLotPrice);
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="totalLotPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Total Lot Price"
                    required
                    err={errors.totalLotPrice?.message}
                    value={field.value}
                    onChange={field.onChange}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="border border-primary p-2.5 rounded-md bg-primary/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              className="col-span-1 md:col-span-2"
              sm={{
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Title level={4} className="text-secondary-color">
                Miscellaneous
              </Title>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <TextSmall>
                  Put miscellaneous fees in the last payment
                </TextSmall>
                <Controller
                  control={control}
                  name="miscellaneousAsLastPayment"
                  render={({ field }) => {
                    return (
                      <Switch
                        checked={field.value}
                        onCheckedChange={e => {
                          field.onChange(e);
                        }}
                      />
                    );
                  }}
                />
              </Container>
            </Container>
            <Controller
              control={control}
              name="miscellaneous"
              render={({ field }) => {
                return (
                  <Select
                    label="Miscellaneous"
                    required
                    err={errors.miscellaneous?.message}
                    options={miscellaneousOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = MISCELLANEOUS_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const miscellaneousTotal =
                          numValue * (getValues("totalLotPrice") / 100);
                        onCalculateTcp("miscellaneous", miscellaneousTotal);
                        setValue("miscellaneousTotal", miscellaneousTotal);
                        setValue("agentCommission", null);
                        setValue("agentCommissionTotal", 0);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="miscellaneousTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Miscellaneous Total"
                    required
                    err={errors.miscellaneousTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <div className="border border-rose-bud p-2.5 rounded-md bg-rose-bud/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Down Payment Details
              </Title>
            </Container>
            <Controller
              control={control}
              name="downPaymentType"
              render={({ field }) => {
                return (
                  <Select
                    label="Down Payment Type"
                    placeholder="Select Down Payment Type"
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    required
                    err={errors.downPaymentType?.message}
                    options={downPaymentTypeOptions}
                    value={field.value ?? ""}
                    onValueChange={e => {
                      field.onChange(e);
                      if (e === DOWN_PAYMENT_TYPE.FULL_DOWN_PAYMENT) {
                        setValue("downPaymentTerms", null);
                      }
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="downPayment"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Down Payment"
                    isDisabled={!watchedTotalLotPrice}
                    required
                    err={errors.downPayment?.message}
                    value={field.value}
                    onChange={field.onChange}
                    preFix={<Percent />}
                  />
                );
              }}
            />
            {watchedDownPaymentType ===
              DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT && (
              <Controller
                control={control}
                name="downPaymentTerms"
                render={({ field }) => {
                  return (
                    <InputNumber
                      label="Down Payment Terms ( Months )"
                      isDisabled={!watchedTotalLotPrice}
                      required
                      err={errors.downPaymentTerms?.message}
                      value={field.value || 0}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            )}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Terms ( Months )"
                    isDisabled={!watchedTotalLotPrice}
                    required
                    err={errors.terms?.message}
                    value={field.value || 0}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <div className="border border-mac-and-cheese p-2.5 rounded-md bg-mac-and-cheese/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Agent Commission
              </Title>
            </Container>
            <Controller
              control={control}
              name="agentCommission"
              render={({ field }) => {
                return (
                  <Select
                    label="Agent Commission"
                    placeholder="Select Agent Commission"
                    required
                    err={errors.agentCommission?.message}
                    options={commissionOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = COMMISSION_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const agentCommissionTotal =
                          (numValue / 100) * getValues("tcp");
                        setValue("agentCommissionTotal", agentCommissionTotal);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="agentCommissionTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Agent Commission Total"
                    required
                    err={errors.agentCommissionTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            <div className="col-span-1">
              <Controller
                control={control}
                name="agentId"
                render={({ field }) => {
                  return (
                    <Select
                      triggerProps={{ className: "bg-background" }}
                      label="Agent"
                      placeholder="Select Agent"
                      options={agents?.map(
                        ({ id, firstName, middleName, lastName }) => ({
                          id,
                          label: `${firstName} ${middleName || ""} ${lastName}`,
                          value: id,
                        }),
                      )}
                      required
                      err={errors.agentId?.message}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="border border-secondary-color p-2.5 rounded-md bg-secondary-color/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Title level={4} className="text-secondary-color">
              Payment Start Date
            </Title>
            <Controller
              control={control}
              name="paymentStartDate"
              render={({ field }) => {
                return (
                  <DateInput
                    className="bg-background"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <Container
            padding="none"
            flexDisplay
            className="gap-y-2 col-span-1 md:col-span-2"
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
                <Text className="text-secondary-color">Down Payment Total</Text>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end" secondary>
                  {onToLocalCurrency(computedTotalDownPayment)}
                </Text>
                {reservationAmount && (
                  <Text className="md:text-end text-secondary-color/70">
                    - {onToLocalCurrency(reservationAmount)}
                  </Text>
                )}
              </Container>
            </Container>
            <Separator />
            {watchedDownPaymentType ===
              DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT && (
              <>
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
                    <Text className="text-secondary-color">
                      Monthly Down Total
                    </Text>
                  </Container>
                  <Container
                    padding="none"
                    flexDisplay
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Text className="md:text-end flex-1" secondary>
                      {onToLocalCurrency(totalMonthlyDown)}
                    </Text>
                  </Container>
                </Container>
                <Separator />
              </>
            )}
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
                <Text className="text-secondary-color">Monthly Total</Text>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1" secondary>
                  {onToLocalCurrency(totalMonthly)}
                </Text>
              </Container>
            </Container>
            <Separator />
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
                <Title
                  level={4}
                  className="dark:text-turtle-green text-success"
                >
                  Total Contract Price (TCP)
                </Title>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1 dark:text-turtle-green text-success font-bold">
                  {onToLocalCurrency(watchedTcp)}
                </Text>
              </Container>
            </Container>
          </Container>
        </div>
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
                setToggleContractForm?.(false);
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
      </form>
      {renderDiscardChanges}
    </>
  );
};

const StraightMonthlyPaymentForm = ({
  paymentType,
  lot,
  agents,
  clientId,
  reservationAmount,
  setToggleContractForm,
}: ContractPaymentFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    getValues,
    setValue,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<StraightMonthlyPaymentSchema>({
    defaultValues: {
      sqmPrice: 0,
      totalLotPrice: 0,
      miscellaneous: null,
      miscellaneousTotal: 0,
      agentCommission: null,
      agentCommissionTotal: 0,
      tcp: 0,
      paymentType,
      agentId: "",
      lotId: lot?.id || "",
      clientId: clientId || "",
      terms: 0,
      paymentStartDate: "",
      interest: 0,
      installmentType: INSTALLMENT_TYPE.STRAIGHT_MONTHLY_PAYMENT,
      miscellaneousAsLastPayment: false,
    },
    resolver: zodResolver(straightMonthlyPaymentSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const watchedTotalLotPrice = watch("totalLotPrice");
  const watchedTcp = watch("tcp");
  const watchedTerms = watch("terms");
  const watchedInterest = watch("interest");
  const watchedMiscellaneousTotal = watch("miscellaneousTotal");
  const watchedMiscellaneousAsLastPayment = watch("miscellaneousAsLastPayment");

  const totalInterest = useMemo(() => {
    return (
      (watchedTotalLotPrice + watchedMiscellaneousTotal) *
      (watchedInterest / 100)
    );
  }, [watchedMiscellaneousTotal, watchedTotalLotPrice, watchedInterest]);

  const totalMonthly = useMemo(() => {
    if (!watchedTerms) return 0;
    return (
      ((watchedMiscellaneousAsLastPayment
        ? watchedTotalLotPrice + totalInterest
        : watchedTcp) -
        reservationAmount) /
      watchedTerms
    );
  }, [
    watchedTerms,
    watchedTcp,
    watchedMiscellaneousAsLastPayment,
    watchedTotalLotPrice,
    totalInterest,
    reservationAmount,
  ]);

  const { cbDebounce } = useDeferred("", 1000);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const onCalculateTcp = (
    field: "lot" | "miscellaneous" | "interest",
    totalValue: number,
  ) => {
    if (field === "lot") {
      const miscellaneousTotal = getValues("miscellaneousTotal");
      setValue("tcp", totalValue + miscellaneousTotal);
    } else if (field === "miscellaneous") {
      const totalLotPrice = getValues("totalLotPrice");
      const interest = getValues("interest") / 100;
      const miscellaneousTotalAfterLotPrice = totalLotPrice + totalValue;
      const interestTotal = miscellaneousTotalAfterLotPrice * interest;
      setValue("tcp", miscellaneousTotalAfterLotPrice + interestTotal);
    } else {
      const tcpTotal =
        getValues("totalLotPrice") + getValues("miscellaneousTotal");
      const interestTotal = tcpTotal * (getValues("interest") / 100);
      setValue("tcp", tcpTotal + interestTotal);
    }
  };

  const { mutateAsync: createContractStraightMonthlyPayment } =
    useCreateContractStraightMonthlyPayment({
      onSuccess: () => {
        onInvalidate(["contracts"]);
        onShowToast({
          title: "Contract Created",
          description: "Contract has been created successfully.",
        });
        setToggleContractForm?.(false);
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

  const onFormSubmit = async (props: StraightMonthlyPaymentSchema) => {
    await createContractStraightMonthlyPayment(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleContractForm?.(false);
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
            title="Create Contract Failed"
            description={errors.root.message}
            variant="destructive"
            className="mb-5"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
          <div className="border border-success p-2.5 rounded-md bg-success/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Lot
              </Title>
              <Badge variant="outline-sold" className="font-bold">
                {lot?.sqm || ""} Sqm
              </Badge>
            </Container>
            <Controller
              control={control}
              name="sqmPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Sqm Price"
                    required
                    err={errors.sqmPrice?.message}
                    value={field.value}
                    onChange={e => {
                      const numValue = e || 0;
                      field.onChange(numValue);
                      const totalLotPrice = numValue * (lot?.sqm || 0);
                      setValue("miscellaneous", null);
                      setValue("miscellaneousTotal", 0);
                      setValue("agentCommission", null);
                      setValue("agentCommissionTotal", 0);
                      setValue("totalLotPrice", totalLotPrice);
                      setValue("interest", 0);
                      setValue("terms", 0);
                      onCalculateTcp("lot", totalLotPrice);
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="totalLotPrice"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Total Lot Price"
                    required
                    err={errors.totalLotPrice?.message}
                    value={field.value}
                    onChange={field.onChange}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="interest"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Interest"
                    required
                    err={errors.interest?.message}
                    disabled={!watchedTotalLotPrice}
                    value={field.value}
                    onChange={e => {
                      const numValue = e || 0;
                      field.onChange(numValue);
                      onCalculateTcp("interest", numValue);
                      setValue("agentCommission", null);
                      setValue("agentCommissionTotal", 0);
                    }}
                    preFix={<Percent />}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="terms"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Terms ( Months )"
                    required
                    err={errors.terms?.message}
                    value={field.value}
                    disabled={!watchedTotalLotPrice}
                    onChange={e => {
                      const numValue = e || 0;
                      field.onChange(numValue);
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="border border-primary p-2.5 rounded-md bg-primary/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              className="col-span-1 md:col-span-2"
              sm={{
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Title level={4} className="text-secondary-color">
                Miscellaneous
              </Title>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <TextSmall>
                  Put miscellaneous fees in the last payment
                </TextSmall>
                <Controller
                  control={control}
                  name="miscellaneousAsLastPayment"
                  render={({ field }) => {
                    return (
                      <Switch
                        checked={field.value}
                        onCheckedChange={e => {
                          field.onChange(e);
                        }}
                      />
                    );
                  }}
                />
              </Container>
            </Container>
            <Controller
              control={control}
              name="miscellaneous"
              render={({ field }) => {
                return (
                  <Select
                    label="Miscellaneous"
                    required
                    err={errors.miscellaneous?.message}
                    options={miscellaneousOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = MISCELLANEOUS_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const miscellaneousTotal =
                          getValues("totalLotPrice") * (numValue / 100);
                        onCalculateTcp("miscellaneous", miscellaneousTotal);
                        setValue("miscellaneousTotal", miscellaneousTotal);
                        setValue("agentCommission", null);
                        setValue("agentCommissionTotal", 0);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="miscellaneousTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Miscellaneous Total"
                    required
                    err={errors.miscellaneousTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <div className="border border-mac-and-cheese p-2.5 rounded-md bg-mac-and-cheese/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-1 md:col-span-2"
            >
              <Title level={4} className="text-secondary-color">
                Agent Commission
              </Title>
            </Container>
            <Controller
              control={control}
              name="agentCommission"
              render={({ field }) => {
                return (
                  <Select
                    label="Agent Commission"
                    placeholder="Select Agent Commission"
                    required
                    err={errors.agentCommission?.message}
                    options={commissionOptions}
                    value={field.value ?? ""}
                    disabled={!watchedTotalLotPrice}
                    triggerProps={{
                      className: "bg-background",
                    }}
                    onValueChange={e => {
                      const numValue = COMMISSION_NUM_VALUE[e];
                      field.onChange(e);
                      cbDebounce(() => {
                        const agentCommissionTotal =
                          (numValue / 100) * getValues("tcp");
                        setValue("agentCommissionTotal", agentCommissionTotal);
                      });
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="agentCommissionTotal"
              render={({ field }) => {
                return (
                  <InputNumber
                    label="Agent Commission Total"
                    required
                    err={errors.agentCommissionTotal?.message}
                    value={field.value}
                    inputProps={{
                      readOnly: true,
                    }}
                    onChange={field.onChange}
                  />
                );
              }}
            />
            <div className="col-span-1">
              <Controller
                control={control}
                name="agentId"
                render={({ field }) => {
                  return (
                    <Select
                      triggerProps={{ className: "bg-background" }}
                      label="Agent"
                      placeholder="Select Agent"
                      options={agents?.map(
                        ({ id, firstName, middleName, lastName }) => ({
                          id,
                          label: `${firstName} ${middleName || ""} ${lastName}`,
                          value: id,
                        }),
                      )}
                      required
                      err={errors.agentId?.message}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="border border-secondary-color p-2.5 rounded-md bg-secondary-color/10 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <Title level={4} className="text-secondary-color">
              Payment Start Date
            </Title>
            <Controller
              control={control}
              name="paymentStartDate"
              render={({ field }) => {
                return (
                  <DateInput
                    className="bg-background"
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
          <Container
            padding="none"
            flexDisplay
            className="gap-y-2 col-span-1 md:col-span-2"
            gap="none"
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
                <Text className="text-secondary-color">Reservation</Text>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1 text-secondary-color/70">
                  - {onToLocalCurrency(reservationAmount)}
                </Text>
              </Container>
            </Container>
            <Separator />
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
                <Text className="text-secondary-color">Interest Total</Text>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1" secondary>
                  {onToLocalCurrency(totalInterest)}
                </Text>
              </Container>
            </Container>
            <Separator />
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
                <Text className="text-secondary-color">Monthly Total</Text>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1" secondary>
                  {onToLocalCurrency(totalMonthly)}
                </Text>
              </Container>
            </Container>
            <Separator />
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
                <Title
                  level={4}
                  className="dark:text-turtle-green text-success"
                >
                  Total Contract Price (TCP)
                </Title>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
              >
                <Text className="md:text-end flex-1 dark:text-turtle-green text-success font-bold">
                  {onToLocalCurrency(watchedTcp)}
                </Text>
              </Container>
            </Container>
          </Container>
        </div>
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
                setToggleContractForm?.(false);
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
      </form>
      {renderDiscardChanges}
    </>
  );
};

const renderInstallmentType: Record<
  INSTALLMENT_TYPE,
  (props: ContractPaymentFormProps) => React.ReactNode
> = {
  [INSTALLMENT_TYPE.REGULAR_MONTHLY_PAYMENT]: props => (
    <PartialAndFullDownPaymentForm {...props} />
  ),
  [INSTALLMENT_TYPE.STRAIGHT_MONTHLY_PAYMENT]: props => (
    <StraightMonthlyPaymentForm {...props} />
  ),
};

const InstallmentForm = (props: ContractPaymentFormProps) => {
  const [installmentType, setInstallmentType] = useState<INSTALLMENT_TYPE>(
    INSTALLMENT_TYPE.REGULAR_MONTHLY_PAYMENT,
  );
  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        alignItems="end"
      >
        <RadioButtonGroup
          items={installmentTypeItems}
          value={installmentType}
          onValueChange={e => setInstallmentType(e as INSTALLMENT_TYPE)}
        />
      </Container>
      {renderInstallmentType[installmentType](props)}
    </>
  );
};

const renderContractForm: Record<
  PAYMENT_TYPE,
  (props: ContractPaymentFormProps) => React.ReactNode
> = {
  [PAYMENT_TYPE.CASH]: props => <CashPaymentForm {...props} />,
  [PAYMENT_TYPE.INSTALLMENT]: props => <InstallmentForm {...props} />,
};

const ContractForm = ({ setToggleContractForm }: ContractFormProps) => {
  const [project, setProject] = useState<ProjectResponse | undefined>(
    undefined,
  );
  const [client, setClient] = useState<ClientResponse | undefined>(undefined);
  const [phase, setPhase] = useState<PhaseResponse | undefined>(undefined);
  const [block, setBlock] = useState<BlockResponse | undefined>(undefined);
  const [lot, setLot] = useState<LotResponse | undefined>(undefined);
  const [paymentType, setPaymentType] = useState<PAYMENT_TYPE>(
    PAYMENT_TYPE.CASH,
  );

  const { data: projects, isLoading: isProjectLoading } = useGetProjects();
  const { data: clients, isLoading: isClientLoading } = useGetClients();
  const { data: agents, isLoading: isAgentLoading } = useGetAgents();

  const { val: clientId } = useDeferred(client?.id);
  const { val: lotId } = useDeferred(lot?.id);

  const { data: reservation, isLoading: isReservationLoading } =
    useGetClientLotReservation({ clientId: clientId!, lotId: lotId! });

  const onSelectProjectDetails =
    (type: "project" | "phase" | "block" | "lot" | "client") =>
    (id: string) => {
      switch (type) {
        case "project":
          setProject(projects?.response?.find(project => project.id === id));
          setPhase(undefined);
          setBlock(undefined);
          setLot(undefined);
          break;
        case "phase":
          setPhase(project?.phase.find(phase => phase.id === id));
          setBlock(undefined);
          setLot(undefined);
          break;
        case "block":
          setBlock(phase?.block.find(block => block.id === id));
          setLot(undefined);
          break;
        case "lot":
          setLot(block?.lot.find(lot => lot.id === id));
          break;
        case "client":
          setClient(clients?.response?.find(client => client.id === id));
          break;
        default:
          break;
      }
    };

  const renderClientReservation = useMemo(() => {
    const reservationResponse = reservation?.response;

    const { payment, validity, status } = reservationResponse || {};

    return (
      <>
        {!clientId || !lotId ? (
          <></>
        ) : isReservationLoading ? (
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Text secondary>Checking reservation</Text>
            <Spinner />
          </Container>
        ) : !reservationResponse ? (
          <Alert
            title="No reservation found on this client and lot."
            variant="destructive"
            icon={<PiWarningCircleFill />}
          />
        ) : (
          <>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <TextSmall>Reservation Details</TextSmall>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="end"
                gap="md"
              >
                <Container
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="end"
                  gap="none"
                  className="gap-1.5"
                >
                  <TextSmall secondary>Amount:</TextSmall>
                  <Text>{onToLocalCurrency(payment?.amount || 0)}</Text>
                </Container>
                <Container
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="end"
                  gap="none"
                  className="gap-1.5"
                >
                  {status !== RESERVATION_STATUS.FORFEITED &&
                  status !== RESERVATION_STATUS.CONTRACT_FORFEITED ? (
                    <>
                      <TextSmall secondary>Valid Unitl:</TextSmall>
                      <Text>
                        {mtz(validity, "defaultformat").format(
                          DATE_FORMAT.shortDateAbbrev,
                        )}
                      </Text>
                    </>
                  ) : (
                    <Badge variant={RESERVATION_STATUS_THEME[status]}>
                      {onToPascalCase(status, {
                        removeCharacters: ["_"],
                        replaceCharactersWith: " ",
                      })}
                    </Badge>
                  )}
                </Container>
              </Container>
            </Container>
            <RadioCard
              options={contractPaymentOptions}
              className="flex"
              value={paymentType}
              onValueChange={value => setPaymentType(value as PAYMENT_TYPE)}
            />
            {status !== RESERVATION_STATUS.ACTIVE ? (
              <Alert
                title="Client must have an active reservation to create a contract."
                variant="destructive"
                icon={<PiWarningCircleFill />}
              />
            ) : (
              renderContractForm[paymentType]({
                paymentType,
                lot,
                agents: agents?.response,
                clientId,
                reservationAmount: payment?.amount || 0,
                setPaymentType,
                setToggleContractForm,
              })
            )}
          </>
        )}
      </>
    );
  }, [
    reservation,
    isReservationLoading,
    clientId,
    lotId,
    paymentType,
    lot,
    agents,
  ]);

  if (isProjectLoading || isClientLoading || isAgentLoading) {
    return <FormLoading />;
  }

  return (
    <Container padding="none" flexDisplay gap="none" className="gap-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4">
        <Container
          className="col-span-1 md:col-span-3 lg:col-span-4"
          padding="none"
        >
          <Select
            label="Client"
            placeholder="Select Client"
            options={clients?.response?.map(
              ({ id, firstName, middleName, lastName }) => ({
                id,
                label: `${firstName} ${middleName || ""} ${lastName}`,
                value: id,
              }),
            )}
            value={client?.id}
            onValueChange={onSelectProjectDetails("client")}
          />
        </Container>
        <Select
          label="Project"
          placeholder="Select Project"
          options={projects?.response?.map(({ id, projectName }) => ({
            id,
            label: projectName,
            value: id,
          }))}
          value={project?.id}
          onValueChange={onSelectProjectDetails("project")}
        />
        <Select
          label="Phase"
          placeholder="Select Phase"
          options={project?.phase.map(({ id, title }) => ({
            id,
            label: title,
            value: id,
          }))}
          value={phase?.id}
          onValueChange={onSelectProjectDetails("phase")}
          disabled={!project}
        />
        <Select
          label="Block"
          placeholder="Select Block"
          options={phase?.block.map(({ id, title }) => ({
            id,
            label: title,
            value: id,
          }))}
          value={block?.id}
          onValueChange={onSelectProjectDetails("block")}
          disabled={!phase}
        />
        <Select
          label="Lot"
          placeholder="Select Lot"
          options={block?.lot.map(({ id, title }) => ({
            id,
            label: title,
            value: id,
          }))}
          value={lot?.id}
          onValueChange={onSelectProjectDetails("lot")}
          disabled={!block}
        />
      </div>
      {renderClientReservation}
    </Container>
  );
};

const Contracts = () => {
  const [toggleContractForm, setToggleContractForm] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { val } = useDeferred(search);

  const { data: contracts, isLoading: isContractsLoading } = useGetContracts(
    val ? { search: val } : {},
  );

  const nav = useNavigate();

  const onSelectContract = useCallback((id: string, tabName: string) => {
    nav({
      parent: ["contracts"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  }, []);

  const renderContractFormModal = useMemo(() => {
    return (
      <Modal
        open={toggleContractForm}
        onOpenChange={setToggleContractForm}
        title="Create Contract"
        className="lg:max-w-[60%]"
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <ContractForm setToggleContractForm={setToggleContractForm} />
      </Modal>
    );
  }, [toggleContractForm]);

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
              placeholder="Search contract"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            onClick={() => {
              setToggleContractForm(true);
            }}
          >
            Create Contract
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={contractColumns(onSelectContract)}
            data={contracts?.response}
            rowLength={50}
            loading={isContractsLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any contracts."
                : "You haven't created any contracts yet.",
              description: val
                ? "Please try again with different keywords or create a new contract."
                : "Get started by creating your first contract.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleContractForm(true)}
                >
                  Add Contract
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderContractFormModal}
    </>
  );
};

export default Contracts;
