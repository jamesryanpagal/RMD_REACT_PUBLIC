import {
  CONTRACT_STATUS,
  DOWN_PAYMENT_TYPE,
  INSTALLMENT_TYPE,
  MISCELLANEOUS,
  PAYMENT_TYPE,
  TRANSACTION_TYPE,
  type COMMISSION,
  type PaymentBreakdownProps,
  type PaymentsBreakdownResponse,
  type QueryIdProps,
} from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import DateInput from "@/components/date-input";
import FileUpload from "@/components/file-upload";
import InputNumber from "@/components/input-number";
import Tabs, { type TabsItemsProps } from "@/components/tabs";
import { Text, TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectLoading } from "@/components/ui/skeleton";
import {
  useDeleteContract,
  useForfeitContract,
  useGetPaymentsBreakdown,
} from "@/hooks/queries/useContract";
import {
  useCreateFullPayment,
  useCreatePayment,
} from "@/hooks/queries/usePayment";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useToast } from "@/hooks/useToast";
import {
  COMMISSION_NUM_VALUE,
  CONTRACT_STATUS_BG_COLOR,
  CONTRACT_STATUS_ICON,
  MISCELLANEOUS_NUM_VALUE,
} from "@/utils/constants";
import {
  modeOfPaymentOptions,
  paymentBreakdownPrintColumns,
  paymentOptions,
  paymentsBreakdownColumns,
  transactionTypeOptions,
} from "@/utils/data";
import {
  onFormatNumber,
  onToLocalCurrency,
  onToPascalCase,
} from "@/utils/helper";
import {
  payForAllRemainingDatesSchema,
  payForDueDateSchema,
  type PayForAllRemainingDatesSchema,
  type PayForDueDateSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiWarningCircleFill } from "react-icons/pi";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import Tooltip from "@/components/tooltip";
import PaymentDetails from "@/components/payment-details";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { IoIosPrint } from "react-icons/io";
import { appIconLg } from "@/assets";
import { Separator } from "@/components/ui/separator";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "@/hooks/useNavigate";
import {
  BanknoteArrowUp,
  CalendarSync,
  ChevronsDown,
  Coins,
  CreditCard,
  MoveRight,
  PhilippinePeso,
  SquareArrowOutUpRight,
  Tag,
} from "lucide-react";
import DropdownButton from "@/components/dropdown-button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type PaymentFormProps = {
  contractId?: string;
  nextPayment?: PaymentBreakdownProps | null;
  additionalAmount?: number;
  setTogglePayForDueDate: React.Dispatch<React.SetStateAction<boolean>>;
};

type FullPaymentFormProps = {
  contractId?: string;
  unpaidTransactionList?: PaymentBreakdownProps[] | null;
  setTogglePayForAllRemainingDates: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

type PaymentTableProps = Pick<TabContentProps, "paymentBreakdownData"> & {
  onSelectPayment: (id: string, tabName: string) => void;
};

type PaymentBreakdownPrintHeaderProps = Pick<
  PaymentTableProps,
  "paymentBreakdownData"
>;

type TabContentProps = {
  paymentBreakdownData?: PaymentsBreakdownResponse | null;
};

type RemovalType = "delete" | "forfeit";

const PaymentBreakdownPrintHeader = ({
  paymentBreakdownData,
}: PaymentBreakdownPrintHeaderProps) => {
  const {
    client,
    totalLotPrice,
    totalDownPayment,
    miscellaneous,
    rfValidityStartDate,
    rfValidityEndDate,
    miscellaneousTotal,
    sqm,
    sqmPrice,
    project,
    phase,
    block,
    lot,
    downPaymentTerms,
    terms,
    tcp,
    paymentType,
    installmentType,
    paymentBreakdown: breakdownList,
  } = paymentBreakdownData || {};

  const { firstName, middleName, lastName } = client || {};

  const { projectName } = project || {};
  const { title: phaseTitle } = phase || {};
  const { title: blockTitle } = block || {};
  const { title: lotTitle } = lot || {};

  const isCashPayment = paymentType === PAYMENT_TYPE.CASH;
  const isStraightMonthlyPayment =
    installmentType === INSTALLMENT_TYPE.STRAIGHT_MONTHLY_PAYMENT;

  const reservation = paymentBreakdownData?.paymentBreakdown?.[0];

  const clientName = onToPascalCase(
    `${firstName} ${middleName ? `${middleName},` : ""} ${lastName}`,
  );

  const paidTransaction = useMemo(() => {
    return breakdownList?.filter(bl => bl.paid).at(-1);
  }, [breakdownList]);

  return (
    <Container flexDisplay cornerRadius="none">
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <img src={appIconLg} className="h-24 w-24 object-contain" />
        <Container
          padding="none"
          flexDisplay
          gap="none"
          justifyContent="center"
        >
          <Title>Payment Breakdown</Title>
          <TextSmall className="text-center text-lg">{clientName}</TextSmall>
        </Container>
      </Container>
      <Container padding="none" className="grid grid-cols-3 gap-y-2" gap="none">
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Project:</TextSmall>
          <Text>{projectName}</Text>
        </Container>
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Phase:</TextSmall>
          <Text>{phaseTitle}</Text>
        </Container>
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Block & Lot:</TextSmall>
          <Text>{`${blockTitle} / ${lotTitle}`}</Text>
        </Container>
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Area:</TextSmall>
          <Text>{onFormatNumber(sqm || 0)}</Text>
        </Container>
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Price Per SQM:</TextSmall>
          <Text>{onToLocalCurrency(sqmPrice || 0)}</Text>
        </Container>
        <Container padding="none" flexDisplay gap="none" cornerRadius="none">
          <TextSmall className="font-bold">Total land Cost:</TextSmall>
          <Text>{onToLocalCurrency(totalLotPrice || 0)}</Text>
        </Container>
        <Separator className="col-span-full my-2" />
        <Container
          padding="none"
          flexDisplay
          gap="none"
          className="col-span-3 gap-y-2 grid grid-cols-3"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="col-span-2"
          >
            <TextSmall className="font-bold">Reservation Fee:</TextSmall>
            <Text>{onToLocalCurrency(reservation?.amount || 0)}</Text>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <TextSmall className="font-bold">Misc:</TextSmall>
            <Text>
              {MISCELLANEOUS_NUM_VALUE[miscellaneous || MISCELLANEOUS.ZERO]}%
            </Text>
            <Text>({onToLocalCurrency(miscellaneousTotal || 0)})</Text>
          </Container>
          {!isCashPayment && !isStraightMonthlyPayment && (
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              <TextSmall className="font-bold">Downpayment:</TextSmall>
              <Text>{onToLocalCurrency(totalDownPayment || 0)}</Text>
            </Container>
          )}
        </Container>
        <Separator className="col-span-full my-2" />
        <Container
          padding="none"
          flexDisplay
          gap="none"
          cornerRadius="none"
          className="col-span-3 grid grid-cols-3 gap-y-2"
        >
          <Container
            padding="none"
            flexDisplay
            gap="none"
            className="gap-y-2 col-span-2"
          >
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-2"
            >
              <TextSmall className="font-bold">RF Validity:</TextSmall>
              <Text>
                {mtz(rfValidityStartDate, "defaultformat").format(
                  DATE_FORMAT.shortDateAbbrev,
                )}{" "}
                -{" "}
                {mtz(rfValidityEndDate, "defaultformat").format(
                  DATE_FORMAT.shortDateAbbrev,
                )}
              </Text>
            </Container>
            {!isCashPayment && !isStraightMonthlyPayment && (
              <>
                <Container
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="center"
                  className="col-span-full md:col-span-2"
                >
                  <TextSmall className="font-bold">DP Terms:</TextSmall>
                  <Text>{downPaymentTerms} Month(s)</Text>
                </Container>
                <Container
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="center"
                  className="col-span-full md:col-span-2"
                >
                  <TextSmall className="font-bold">RB Terms:</TextSmall>
                  <Text>{terms} Month(s)</Text>
                </Container>
              </>
            )}
          </Container>
          <Container padding="none" flexDisplay gap="none" className="gap-y-2">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-full md:col-span-2"
            >
              <TextSmall className="font-bold">Total Contract Price:</TextSmall>
              <Text>{onToLocalCurrency(tcp || 0)}</Text>
            </Container>
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              className="col-span-full md:col-span-2"
            >
              <TextSmall className="font-bold">Remaining Balance:</TextSmall>
              <Text>{paidTransaction?.remainingBalance}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const PaymentTable = ({
  paymentBreakdownData,
  onSelectPayment,
}: PaymentTableProps) => {
  const { id } = useParams<QueryIdProps>();
  const printComponentRef = useRef<HTMLDivElement>(null);
  const [showPrintPaymentBreakdown, setShowPrintPaymentBreakdown] =
    useState(false);

  const [togglePayForDueDate, setTogglePayForDueDate] = useState(false);
  const [togglePayForAllRemainingDates, setTogglePayForAllRemainingDates] =
    useState(false);
  const [usePaymentProgress, setUsePaymentProgress] = useState(false);

  const {
    excessPayment,
    paymentBreakdown: breakdownList,
    status,
    miscellaneousAsLastPayment,
    paymentLastDate,
    miscellaneousTotal,
  } = paymentBreakdownData || {};

  const onPrintPaymentBreakdown = useReactToPrint({
    contentRef: printComponentRef,
  });

  const unpaidTransaction = useMemo(() => {
    return breakdownList?.filter(bl => !bl.paid)?.[0];
  }, [breakdownList]);

  const unpaidTransactionList = useMemo(() => {
    return breakdownList?.filter(bl => !bl.paid);
  }, [breakdownList]);

  const paidTransaction = useMemo(() => {
    return breakdownList?.filter(bl => bl.paid).at(-1);
  }, [breakdownList]);

  const totalPayment = useMemo(() => {
    return breakdownList
      ?.filter(bl => bl.paid)
      .reduce((acc, c) => (acc += c.paidAmount), 0);
  }, [breakdownList]);

  const renderPayForDueDate = useMemo(() => {
    let computedAmountToPay = unpaidTransaction?.amount || 0;

    const lastPaymentAdditional =
      miscellaneousAsLastPayment &&
      unpaidTransaction?.dueDate ===
        mtz(paymentLastDate, "defaultformat").format(
          DATE_FORMAT.shortDateAbbrev,
        );

    if (lastPaymentAdditional) {
      computedAmountToPay += miscellaneousTotal || 0;
    }

    return (
      <Modal
        open={togglePayForDueDate}
        description={`Amount to pay: ${onToLocalCurrency(computedAmountToPay)}`}
        onOpenChange={setTogglePayForDueDate}
        title={`Pay for ${unpaidTransaction?.dueDate || ""}`}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
        className="lg:max-w-3xl"
      >
        <PaymentForm
          contractId={id}
          setTogglePayForDueDate={setTogglePayForDueDate}
          nextPayment={unpaidTransaction}
          {...(lastPaymentAdditional && {
            additionalAmount: miscellaneousTotal || 0,
          })}
        />
      </Modal>
    );
  }, [
    togglePayForDueDate,
    unpaidTransaction,
    id,
    miscellaneousAsLastPayment,
    paymentLastDate,
    miscellaneousTotal,
  ]);

  const renderPayForAllRemainingDates = useMemo(() => {
    return (
      <Modal
        title="Full Payment"
        description={`Amount to pay: ${onToLocalCurrency(
          unpaidTransactionList?.reduce((acc, c) => (acc += c.amount), 0) || 0,
        )}`}
        open={togglePayForAllRemainingDates}
        onOpenChange={setTogglePayForAllRemainingDates}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
        className="lg:max-w-3xl"
      >
        <FullPaymentForm
          contractId={id}
          setTogglePayForAllRemainingDates={setTogglePayForAllRemainingDates}
          unpaidTransactionList={unpaidTransactionList}
        />
      </Modal>
    );
  }, [togglePayForAllRemainingDates, unpaidTransactionList, id]);

  return (
    <>
      <Container padding="none" cornerRadius="none" flexDisplay>
        {!showPrintPaymentBreakdown && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Container
              bordered
              padding="md"
              className="border-border/50 bg-turtle-green"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Container padding="none" flexDisplay gap="none">
                <TextSmall className="text-white/95">
                  Remaining Balance
                </TextSmall>
                <Title level={4} className="text-white/95">
                  {paidTransaction?.remainingBalance || "0"}
                </Title>
              </Container>
              <CreditCard className="text-white/95 size-10" />
            </Container>
            <Container
              bordered
              padding="md"
              className="border-border/50 bg-primary"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Container padding="none" flexDisplay gap="none">
                <TextSmall className="text-white/95">Total Payment</TextSmall>
                <Title level={4} className="text-white/95">
                  {onToLocalCurrency(Math.round(totalPayment || 0))}
                </Title>
              </Container>
              <BanknoteArrowUp className="text-white/95 size-10" />
            </Container>
            <Container
              bordered
              padding="md"
              className="border-border/50 bg-sunrise-orange"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Container padding="none" flexDisplay gap="none">
                <Container
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="center"
                >
                  <TextSmall className="text-white/95">
                    Excess Payment
                  </TextSmall>
                  <Tooltip trigger={<FiInfo className="text-white/95" />}>
                    <TextSmall>
                      Excess payment is deducted to the last payment.
                    </TextSmall>
                  </Tooltip>
                </Container>
                <Title level={4} className="text-white/95">
                  {onToLocalCurrency(excessPayment || 0)}
                </Title>
              </Container>
              <Coins className="text-white/95 size-10" />
            </Container>
            {unpaidTransaction && (
              <Container
                bordered
                padding="md"
                className="border-border/50 bg-mac-and-cheese"
                flexDisplay
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Container padding="none" flexDisplay gap="none">
                  <TextSmall className="text-white/95">Next Payment</TextSmall>
                  <Title level={4} className="text-white/95">
                    {unpaidTransaction.dueDate}
                  </Title>
                </Container>
                <CalendarSync className="text-white/95 size-10" />
              </Container>
            )}
          </div>
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
            {status === CONTRACT_STATUS.FORFEITED && (
              <>
                <PiWarningCircleFill className="text-destructive" />
                <TextSmall className="text-destructive">
                  This contract has been forfeited.
                </TextSmall>
              </>
            )}
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className={cn(
              !!showPrintPaymentBreakdown && "flex-1 justify-between",
            )}
          >
            {!!showPrintPaymentBreakdown && (
              <Checkbox
                id="1"
                label="Switch to payment progress"
                description="Uses paid amount as basis of remaining balance"
                checked={usePaymentProgress}
                onCheckedChange={e => setUsePaymentProgress(e as boolean)}
              />
            )}
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              {!!showPrintPaymentBreakdown && (
                <Button
                  variant="secondary"
                  onClick={() => setShowPrintPaymentBreakdown(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant={
                  showPrintPaymentBreakdown ? "success" : "secondary-success"
                }
                prefix={<IoIosPrint />}
                onClick={() => {
                  if (showPrintPaymentBreakdown) {
                    onPrintPaymentBreakdown();
                  } else {
                    setShowPrintPaymentBreakdown(true);
                  }
                }}
              >
                Print Payment Breakdown
              </Button>
            </Container>
            {!!unpaidTransaction &&
              !showPrintPaymentBreakdown &&
              status !== CONTRACT_STATUS.DONE && (
                <DropdownButton
                  variant="success"
                  disabled={status === CONTRACT_STATUS.FORFEITED}
                  onClick={() => {
                    setTogglePayForDueDate(true);
                  }}
                  options={paymentOptions(
                    unpaidTransaction.dueDate,
                    ({ id }) => {
                      if (id === "2") {
                        setTogglePayForAllRemainingDates(true);
                      }
                    },
                  )}
                />
              )}
          </Container>
        </Container>
        <Container
          ref={printComponentRef}
          padding="none"
          flexDisplay
          cornerRadius="none"
        >
          {showPrintPaymentBreakdown && (
            <PaymentBreakdownPrintHeader
              paymentBreakdownData={paymentBreakdownData}
            />
          )}
          <Container bordered className="bg-card border-border/50">
            <DataTable
              showPagination={false}
              columns={
                showPrintPaymentBreakdown
                  ? paymentBreakdownPrintColumns(
                      !!miscellaneousAsLastPayment,
                      mtz(paymentLastDate, "defaultformat").format(
                        DATE_FORMAT.shortDateAbbrev,
                      ),
                      miscellaneousTotal || 0,
                      usePaymentProgress,
                    )
                  : paymentsBreakdownColumns(
                      onSelectPayment,
                      !!miscellaneousAsLastPayment,
                      mtz(paymentLastDate, "defaultformat").format(
                        DATE_FORMAT.shortDateAbbrev,
                      ),
                      miscellaneousTotal || 0,
                    )
              }
              rowProps={({ dueDate, ignored }) => {
                if (showPrintPaymentBreakdown) {
                  return null;
                }

                if (ignored) {
                  return {
                    className: "opacity-50",
                  };
                }

                if (
                  status === CONTRACT_STATUS.DONE ||
                  status === CONTRACT_STATUS.FORFEITED
                )
                  return null;

                if (dueDate === unpaidTransaction?.dueDate) {
                  return {
                    className:
                      "!border-t-2 !border-l-2 !border-r-2 !border-b-2 border-success bg-success/5 dark:border-turtle-green dark:bg-turtle-green/5",
                  };
                }
              }}
              data={breakdownList}
              rowLength={50}
            />
          </Container>
        </Container>
      </Container>
      {renderPayForDueDate}
      {renderPayForAllRemainingDates}
    </>
  );
};

const FullPaymentForm = ({
  contractId,
  unpaidTransactionList,
  setTogglePayForAllRemainingDates,
}: FullPaymentFormProps) => {
  const amount = useMemo(() => {
    return unpaidTransactionList?.reduce((acc, c) => (acc += c.amount), 0) || 0;
  }, [unpaidTransactionList]);

  const penaltyAmount = useMemo(() => {
    return unpaidTransactionList?.reduce((acc, c) => {
      if (c.penalized) {
        acc += c.penaltyAmount || 0;
      }
      return acc;
    }, 0);
  }, [unpaidTransactionList]);

  const {
    register,
    control,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<PayForAllRemainingDatesSchema>({
    defaultValues: {
      contractId: contractId || "",
      pfp: [],
      modeOfPayment: null,
      paymentDate: "",
      amount: (amount || 0) + (penaltyAmount || 0),
      referenceNumber: "",
      transactionType: TRANSACTION_TYPE.FULL_PAYMENT,
      waivePenalty: false,
      waivedReason: null,
      penaltyAmount: penaltyAmount || 0,
      discount: 0,
    },
    resolver: zodResolver(payForAllRemainingDatesSchema),
  });

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const watchedWaivePenalty = watch("waivePenalty");

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const penalized = useMemo(() => {
    return !!unpaidTransactionList?.some(utl => utl.penalized);
  }, [unpaidTransactionList]);

  const { mutateAsync: createFullPayment } = useCreateFullPayment({
    onSuccess: () => {
      onInvalidate(["payments-breakdown", { contractId }]);
      onInvalidate(["contract", { id: contractId }]);
      onShowToast({
        title: "Payment Created",
        description: "Payment has been created successfully.",
      });
      setTogglePayForAllRemainingDates(false);
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

  const onFormSubmit = async (props: PayForAllRemainingDatesSchema) => {
    await createFullPayment(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setTogglePayForAllRemainingDates(false);
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
          {penalized && penaltyAmount && (
            <>
              <Controller
                control={control}
                name="waivePenalty"
                render={({ field }) => {
                  return (
                    <Container
                      bordered
                      flexDisplay
                      className="bg-destructive/10 border-destructive"
                      gap="none"
                    >
                      <Container
                        padding="none"
                        flexDisplay
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <TextSmall>Waive Penalty?</TextSmall>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={e => {
                            setValue(
                              "amount",
                              e
                                ? getValues("amount") - penaltyAmount
                                : getValues("amount") + penaltyAmount,
                            );
                            setValue("waivedReason", null);
                            field.onChange(e);
                          }}
                        />
                      </Container>
                      <TextSmall
                        secondary
                        className={`${
                          watchedWaivePenalty ? "line-through" : ""
                        }`}
                      >
                        {`An additional amount of ${onToLocalCurrency(
                          penaltyAmount,
                        )} is added to the total amount due to penalty.`}
                      </TextSmall>
                    </Container>
                  );
                }}
              />
              {watchedWaivePenalty && (
                <Textarea
                  label="Put a reason for waiving the penalty"
                  placeholder="Type your reason here..."
                  className="max-h-36"
                  {...register("waivedReason")}
                />
              )}
            </>
          )}
          <Controller
            control={control}
            name="discount"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Discount"
                  formatOptions={{
                    style: "currency",
                    currency: "PHP",
                  }}
                  value={field.value || 0}
                  onChange={e => {
                    const numValue = Number(e) || 0;
                    const totalAmount = e
                      ? getValues("amount") - numValue
                      : amount + (penaltyAmount || 0);
                    setValue("amount", totalAmount);
                    field.onChange(numValue);
                  }}
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
                  setTogglePayForAllRemainingDates(false);
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

const PaymentForm = ({
  contractId,
  nextPayment,
  additionalAmount = 0,
  setTogglePayForDueDate,
}: PaymentFormProps) => {
  const { amount, transactionType, penalized, penaltyAmount } =
    nextPayment || {};
  const {
    register,
    control,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<PayForDueDateSchema>({
    defaultValues: {
      contractId: contractId || "",
      pfp: [],
      modeOfPayment: null,
      paymentDate: "",
      amount: (amount || 0) + (penaltyAmount || 0) + additionalAmount,
      referenceNumber: "",
      transactionType: transactionType || null,
      waivePenalty: false,
      waivedReason: null,
    },
    resolver: zodResolver(payForDueDateSchema),
  });

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const watchedWaivePenalty = watch("waivePenalty");

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const { mutateAsync: createPayment } = useCreatePayment({
    onSuccess: () => {
      onInvalidate(["payments-breakdown", { contractId }]);
      onInvalidate(["contract", { id: contractId }]);
      onShowToast({
        title: "Payment Created",
        description: "Payment has been created successfully.",
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

  const onFormSubmit = async (props: PayForDueDateSchema) => {
    await createPayment(props);
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
          {penalized && penaltyAmount && (
            <>
              <Controller
                control={control}
                name="waivePenalty"
                render={({ field }) => {
                  return (
                    <Container
                      bordered
                      flexDisplay
                      className="bg-destructive/10 border-destructive"
                      gap="none"
                    >
                      <Container
                        padding="none"
                        flexDisplay
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <TextSmall>Waive Penalty?</TextSmall>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={e => {
                            setValue(
                              "amount",
                              e
                                ? getValues("amount") - penaltyAmount
                                : getValues("amount") + penaltyAmount,
                            );
                            setValue("waivedReason", null);
                            field.onChange(e);
                          }}
                        />
                      </Container>
                      <TextSmall
                        secondary
                        className={`${
                          watchedWaivePenalty ? "line-through" : ""
                        }`}
                      >
                        {`An additional amount of ${onToLocalCurrency(
                          penaltyAmount,
                        )} is added to the total amount due to penalty.`}
                      </TextSmall>
                    </Container>
                  );
                }}
              />
              {watchedWaivePenalty && (
                <Textarea
                  label="Put a reason for waiving the penalty"
                  placeholder="Type your reason here..."
                  className="max-h-36"
                  {...register("waivedReason")}
                />
              )}
            </>
          )}
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

const Overview = ({ paymentBreakdownData }: TabContentProps) => {
  const {
    client,
    project,
    phase,
    block,
    lot,
    sqmPrice,
    totalLotPrice,
    paymentType,
    downPaymentType,
    downPaymentTerms,
    installmentType,
    interest,
    interestTotal,
    terms,
    status,
    tcp,
    miscellaneous,
    miscellaneousTotal,
    agent,
    agentCommission,
    agentCommissionTotal,
    paymentBreakdown: breakdownList,
  } = paymentBreakdownData || {};

  const { id } = useParams<QueryIdProps>();

  const reservationDetails = breakdownList?.[0];

  const { firstName, middleName, lastName } = client || {};
  const { title: lotTitle, sqm } = lot || {};
  const { title: blockTitle } = block || {};
  const { title: phaseTitle } = phase || {};
  const { projectName } = project || {};

  const {
    firstName: agentFirstName,
    middleName: agentMiddleName,
    lastName: agentLastName,
    id: agentId,
  } = agent || {};

  const agentName = `${agentFirstName} ${
    agentMiddleName ? agentMiddleName + "," : ""
  } ${agentLastName}`;

  const clientName = `${firstName} ${
    middleName ? middleName + "," : ""
  } ${lastName}`;

  const [toggleDeleteForfeitConfirmation, setToggleDeleteForfeitConfirmation] =
    useState(false);
  const [removalType, setRemovalType] = useState<RemovalType>("delete");

  const [deleteTextConfirmation, setDeleteTextConfirmation] = useState<
    string | null
  >(null);

  const nav = useNavigate();
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: deleteContract, isPending: isDeleting } =
    useDeleteContract({
      onSuccess: () => {
        onInvalidate(["contracts"]);
        onShowToast({
          title: "Contract Deleted",
          description: "Contract has been deleted successfully.",
        });
        setToggleDeleteForfeitConfirmation(false);
        nav({ path: "contracts" });
      },
      onError: () => {
        onShowToast({
          title: "Delete Failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });

  const { mutateAsync: forfeitContract, isPending: isForfeiting } =
    useForfeitContract({
      onSuccess: () => {
        onInvalidate(["payments-breakdown", { contractId: id! }]);
        onShowToast({
          title: "Contract Forfeited",
          description: "Contract has been forfeited successfully.",
        });
        setToggleDeleteForfeitConfirmation(false);
      },
      onError: () => {
        onShowToast({
          title: "Forfeit Failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });

  const onDeleteContract = useCallback(async () => {
    if (!id) return;
    await deleteContract({ id });
  }, [id]);

  const onForfeitContract = useCallback(async () => {
    if (!id) return;
    await forfeitContract({ id });
  }, [id]);

  const renderDeleteForfeitConfirmation = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDeleteForfeitConfirmation}
        description={
          <Container
            bordered
            className="border-destructive bg-destructive/10 mt-4"
            flexDisplay
          >
            <Text className="font-bold">
              Are you sure you want to {removalType} this contract?
            </Text>
            <TextSmall>
              {onToPascalCase(
                removalType === "delete" ? "Deleting" : "Forfeiting",
              )}{" "}
              this contract will also {removalType} all associated payments,
              reservations and agent commissions. This action cannot be undone.
            </TextSmall>
            <TextSmall className="mt-2.5">
              Type <strong>{onToPascalCase(removalType)}</strong> to confirm
            </TextSmall>
            <Input
              placeholder={onToPascalCase(removalType)}
              onChange={e => setDeleteTextConfirmation(e.target.value)}
              className="border-black/80"
            />
          </Container>
        }
        onOpenChange={setToggleDeleteForfeitConfirmation}
        onCancel={() => setToggleDeleteForfeitConfirmation(false)}
        onConfirm={
          removalType === "delete" ? onDeleteContract : onForfeitContract
        }
        confirmButtonProps={{
          label: onToPascalCase(removalType),
          loading: isDeleting || isForfeiting,
          disabled:
            isDeleting ||
            isForfeiting ||
            deleteTextConfirmation !== onToPascalCase(removalType),
        }}
        cancelButtonProps={{
          label: "Cancel",
          disabled: isDeleting || isForfeiting,
        }}
      />
    );
  }, [
    toggleDeleteForfeitConfirmation,
    isDeleting,
    isForfeiting,
    deleteTextConfirmation,
    removalType,
    onDeleteContract,
    onForfeitContract,
  ]);

  return (
    <>
      <Container padding="none" flexDisplay cornerRadius="none" gap="md">
        <Container padding="none" flexDisplay gap="none" className="gap-y-1">
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay gap="none">
              <Title level={2}>
                {onToPascalCase(clientName)} - {projectName}
              </Title>
            </Container>
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
            >
              {status !== CONTRACT_STATUS.FORFEITED &&
                status !== CONTRACT_STATUS.DONE && (
                  <Button
                    variant="outline-destructive"
                    className="rounded-full"
                    onClick={() => {
                      setRemovalType("forfeit");
                      setToggleDeleteForfeitConfirmation(true);
                    }}
                  >
                    Forfeit
                  </Button>
                )}
              <Button
                variant="destructive"
                className="rounded-full"
                onClick={() => {
                  setRemovalType("delete");
                  setToggleDeleteForfeitConfirmation(true);
                }}
              >
                Delete
              </Button>
            </Container>
          </Container>
        </Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Container
            bordered
            padding="md"
            className="border-border/50 bg-turtle-green"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay gap="none">
              <TextSmall className="text-white/95">
                Total Contract Price
              </TextSmall>
              <Title level={4} className="text-white/95">
                {onToLocalCurrency(tcp || 0)}
              </Title>
            </Container>
            <PhilippinePeso className="text-white/95 size-10" />
          </Container>
          <Container
            bordered
            padding="md"
            className="border-border/50 bg-primary"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay gap="none">
              <TextSmall className="text-white/95">Payment Type</TextSmall>
              <Title level={4} className="text-white/95">
                {onToPascalCase(paymentType || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Title>
            </Container>
            <ChevronsDown className="text-white/95 size-10" />
          </Container>
          <Container
            bordered
            padding="md"
            className="border-border/50 bg-sunrise-orange"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay gap="none">
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="center"
                cornerRadius="none"
                gap="none"
                className="gap-x-1"
              >
                <TextSmall className="text-white/95">Reservation</TextSmall>
                <Link
                  to={{
                    pathname: `/reservations/${
                      reservationDetails?.reservationId || ""
                    }`,
                    search: `?tabName=${clientName
                      .replace(",", "")
                      .split(" ")
                      .join("+")}`,
                  }}
                  className="text-xs text-dodger-blue flex items-center space-x-1 underline decoration-white/95"
                >
                  <TextSmall className="text-xs text-white/95">View</TextSmall>
                  <SquareArrowOutUpRight className="size-3 text-white/95" />
                </Link>
              </Container>
              <Title level={4} className="text-white/95">
                {onToLocalCurrency(reservationDetails?.amount || 0)}
              </Title>
            </Container>
            <Tag className="text-white/95 size-10" />
          </Container>
          <Container
            bordered
            padding="md"
            className={cn(
              "border-border/50",
              CONTRACT_STATUS_BG_COLOR[status as CONTRACT_STATUS],
            )}
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay gap="none">
              <TextSmall className="text-white/95">Status</TextSmall>
              <Title level={4} className="text-white/95">
                {onToPascalCase(status || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Title>
            </Container>
            {CONTRACT_STATUS_ICON[status as CONTRACT_STATUS]}
          </Container>
        </div>
        <Container
          bordered
          padding="md"
          className="border-border/50 bg-card"
          flexDisplay
          gap="md"
        >
          <Title level={5}>Lot Details</Title>
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
              <TextSmall secondary>Phase</TextSmall>
              <Text>{phaseTitle}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Block</TextSmall>
              <Text>{blockTitle}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Lot</TextSmall>
              <Text>{lotTitle}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Sqm</TextSmall>
              <Text>{sqm}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Sqm Price</TextSmall>
              <Text>{onToLocalCurrency(sqmPrice || 0)}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Total Lot Price</TextSmall>
              <Text>{onToLocalCurrency(totalLotPrice || 0)}</Text>
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
          <Title level={5}>Miscellaneous Details</Title>
          <Container
            padding="none"
            cornerRadius="none"
            className="grid grid-cols-2"
            gap="none"
          >
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Miscellaneous</TextSmall>
              <Text>
                {MISCELLANEOUS_NUM_VALUE[miscellaneous as MISCELLANEOUS]}%
              </Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Total</TextSmall>
              <Text>{onToLocalCurrency(miscellaneousTotal || 0)}</Text>
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
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Title level={5}>Agent Commission Details</Title>
            <Link
              to={{
                pathname: `/agents/${agentId}`,
                search: `?tabName=${agentName
                  .replace(",", "")
                  .split(" ")
                  .join("+")}`,
              }}
              className="text-xs text-dodger-blue flex items-center space-x-1"
            >
              <TextSmall>View</TextSmall>
              <SquareArrowOutUpRight className="size-4" />
            </Link>
          </Container>
          <Container
            padding="none"
            cornerRadius="none"
            className="grid grid-cols-2 md:grid-cols-3 gap-y-3"
            gap="none"
          >
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Commission</TextSmall>
              <Text>
                {COMMISSION_NUM_VALUE[agentCommission as COMMISSION]}%
              </Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Total</TextSmall>
              <Text>{onToLocalCurrency(agentCommissionTotal || 0)}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Agent</TextSmall>
              <Text>{onToPascalCase(agentName)}</Text>
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
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Title level={5}>Payment Details</Title>
          </Container>
          <Container
            padding="none"
            cornerRadius="none"
            className="grid grid-cols-2 md:grid-cols-3 gap-y-3"
            gap="none"
          >
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Payment Type</TextSmall>
              <Text>
                {onToPascalCase(paymentType || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Text>
            </Container>
            {paymentType === PAYMENT_TYPE.INSTALLMENT && (
              <>
                <Container
                  padding="none"
                  cornerRadius="none"
                  flexDisplay
                  gap="none"
                  className="gap-y-1"
                >
                  <TextSmall secondary>Installment Type</TextSmall>
                  <Text>
                    {onToPascalCase(
                      installmentType || "Regular Monthly Payment",
                      {
                        removeCharacters: ["_"],
                        replaceCharactersWith: " ",
                      },
                    )}
                  </Text>
                </Container>
                {!installmentType ? (
                  <>
                    <Container
                      padding="none"
                      cornerRadius="none"
                      flexDisplay
                      gap="none"
                      className="gap-y-1"
                    >
                      <TextSmall secondary>Down Payment Type</TextSmall>
                      <Text>
                        {onToPascalCase(downPaymentType || "", {
                          removeCharacters: ["_"],
                          replaceCharactersWith: " ",
                        })}
                      </Text>
                    </Container>
                    {downPaymentType ===
                      DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT && (
                      <Container
                        padding="none"
                        cornerRadius="none"
                        flexDisplay
                        gap="none"
                        className="gap-y-1"
                      >
                        <TextSmall secondary>Down Payment Terms</TextSmall>
                        <Text>
                          {onFormatNumber(downPaymentTerms || 0)} Month(s)
                        </Text>
                      </Container>
                    )}
                  </>
                ) : (
                  <Container
                    padding="none"
                    cornerRadius="none"
                    flexDisplay
                    gap="none"
                    className="gap-y-1"
                  >
                    <TextSmall secondary>Interest</TextSmall>
                    <Container
                      padding="none"
                      flexDisplay
                      flexDirection="row"
                      alignItems="center"
                    >
                      <Text>{onFormatNumber(interest || 0)}%</Text>
                      <MoveRight />
                      <Text>{onToLocalCurrency(interestTotal || 0)}</Text>
                    </Container>
                  </Container>
                )}
                <Container
                  padding="none"
                  cornerRadius="none"
                  flexDisplay
                  gap="none"
                  className="gap-y-1"
                >
                  <TextSmall secondary>Terms</TextSmall>
                  <Text>{onFormatNumber(terms || 0)} Month(s)</Text>
                </Container>
              </>
            )}
          </Container>
        </Container>
      </Container>
      {renderDeleteForfeitConfirmation}
    </>
  );
};

const PaymentsBreakdown = ({ paymentBreakdownData }: TabContentProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPaymentId = searchParams.get("paymentId");
  const selectedPaymentTab = searchParams.get("paymentTab");

  const onSelectPayment = useCallback((id: string, tabName: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("paymentId", id);
      newParams.set("paymentTab", tabName);

      return newParams;
    });
  }, []);

  const onPaymentDetailsBack = useCallback(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("paymentId");
      newParams.delete("paymentTab");
      return newParams;
    });
  }, []);

  const renderPaymentContent = useMemo(() => {
    return !selectedPaymentId ? (
      <PaymentTable
        paymentBreakdownData={paymentBreakdownData}
        onSelectPayment={onSelectPayment}
      />
    ) : (
      <PaymentDetails
        id={selectedPaymentId}
        description={`Payment for ${selectedPaymentTab?.replace(/[+]/g, " ")}`}
        dueDate={selectedPaymentTab}
        onBack={onPaymentDetailsBack}
      />
    );
  }, [
    selectedPaymentId,
    selectedPaymentTab,
    paymentBreakdownData,
    onSelectPayment,
  ]);

  return renderPaymentContent;
};

const Contract = () => {
  const { id } = useParams<QueryIdProps>();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchSelectedTab = searchParams.get("selectedTab") || "overview";
  const tabName = searchParams.get("tabName");

  const { data, isLoading } = useGetPaymentsBreakdown({ contractId: id! });

  const onSelectTab = useCallback(
    (e: string) => {
      setSearchParams(() => {
        const newParams = new URLSearchParams();
        newParams.set("tabName", tabName || "");
        newParams.set("selectedTab", e);
        return newParams;
      });
    },
    [tabName],
  );

  const tabItems = useMemo((): TabsItemsProps[] => {
    return [
      {
        label: "Overview",
        value: "overview",
        content: <Overview paymentBreakdownData={data?.response} />,
      },
      {
        label: "Payments",
        value: "payments",
        content: <PaymentsBreakdown paymentBreakdownData={data?.response} />,
      },
    ];
  }, [data?.response]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <Tabs
      items={tabItems}
      currentTab={searchSelectedTab}
      onValueChange={onSelectTab}
    />
  );
};

export default Contract;
