import { useGetPayment, useUpdatePayment } from "@/hooks/queries/usePayment";
import Container, { type ContainerProps } from "./container";
import { Text, TextSmall, Title } from "./typography";
import { ProjectLoading, TableLoading } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Check, ChevronLeftIcon } from "lucide-react";
import {
  onNumberToWords,
  onToLocalCurrency,
  onToPascalCase,
} from "@/utils/helper";
import ImagePreview from "./image-preview";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { Badge } from "./ui/badge";
import { IoIosPrint } from "react-icons/io";
import { useMemo, useRef, useState } from "react";
import { useGetContract } from "@/hooks/queries/useContract";
import { useParams } from "react-router-dom";
import {
  MODE_OF_PAYMENT,
  TRANSACTION_TYPE,
  type QueryIdProps,
} from "@/api/query-fn.api";
import { appIconLg } from "@/assets";
import { MODE_OF_PAYMENT_TEXT } from "@/utils/constants";
import { useReactToPrint } from "react-to-print";
import { MdEdit } from "react-icons/md";
import { Modal } from "./ui/dialog";
import { Controller, useForm } from "react-hook-form";
import type { UpdatePaymentSchema } from "@/utils/schema.z";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { modeOfPaymentOptions, transactionTypeOptions } from "@/utils/data";
import InputNumber from "./input-number";
import ConfirmationModal from "./confirmation-modal";
import { useToast } from "@/hooks/useToast";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import DateInput from "./date-input";

export type PaymentDetailsProps = {
  id: string;
  contractId?: string | null;
  header?: React.ReactNode;
  title?: string;
  description?: string;
  rightContent?: React.ReactNode;
  showPrint?: boolean;
  dueDate?: string | null;
  onBack?: () => void;
};

type PrintReceiptProps = ContainerProps &
  Pick<PaymentDetailsProps, "contractId" | "dueDate"> & {
    receiptNo?: string | null;
    total?: number | null;
    modeOfPayment?: MODE_OF_PAYMENT | null;
    referenceNumber?: string | null;
    transactionType?: TRANSACTION_TYPE | null;
  };

type EditPaymentFormProps = {
  id: string;
  amount?: number;
  modeOfPayment?: MODE_OF_PAYMENT | null;
  transactionType?: TRANSACTION_TYPE;
  referenceNumber?: string | null;
  receiptNo?: string | null;
  paymentDate?: string;
  contractId?: string | null;
  setToggleEditPayment: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditPaymentForm = ({
  id,
  amount,
  modeOfPayment,
  transactionType,
  referenceNumber,
  paymentDate,
  contractId,
  setToggleEditPayment,
}: EditPaymentFormProps) => {
  const { id: contractIdQuery } = useParams<QueryIdProps>();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<UpdatePaymentSchema>({
    defaultValues: {
      id: id || "",
      amount: amount || 0,
      modeOfPayment: modeOfPayment || null,
      referenceNumber: referenceNumber || "",
      paymentDate: paymentDate || "",
    },
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: updatePayment } = useUpdatePayment({
    onSuccess: data => {
      onShowToast({
        title: "Payment Updated.",
        description: data.response || "Payment updated successfully.",
        showClose: false,
      });
      onInvalidate(["payment", { id }]);
      onInvalidate([
        "payments-breakdown",
        { contractId: contractId || contractIdQuery! },
      ]);
    },
    onError: err => {
      onShowToast({
        title: "Update Failed.",
        description: err.message || "Something went wrong. Please try again.",
        showClose: false,
        type: "error",
      });
    },
    onMutate: () => {
      setToggleEditPayment(false);
    },
  });

  const onFormSubmit = async (props: UpdatePaymentSchema) => {
    await updatePayment(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditPayment(false);
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
          <Controller
            control={control}
            name="amount"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Amount"
                  formatOptions={{ currency: "PHP" }}
                  value={field.value}
                  onChange={e => {
                    const numVal = e || 0;
                    field.onChange(numVal);
                  }}
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
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  required
                  err={errors.modeOfPayment?.message}
                />
              );
            }}
          />
          <Select
            label="Transaction Type"
            defaultValue={transactionType ?? ""}
            options={transactionTypeOptions}
            disabled
          />
          <Input label="Reference Number" {...register("referenceNumber")} />
          <Controller
            control={control}
            name="paymentDate"
            render={({ field }) => {
              return (
                <DateInput
                  label="Payment Date"
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
                  setToggleEditPayment(false);
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

const PrintReceipt = ({
  receiptNo,
  total,
  modeOfPayment,
  referenceNumber,
  transactionType,
  contractId,
  dueDate,
  ...props
}: PrintReceiptProps) => {
  const { id } = useParams<QueryIdProps>();
  const { data: contract, isLoading } = useGetContract({
    id: contractId || id!,
  });

  const { lot, agent, client } = contract?.response || {};
  const { title: lotTitle, block } = lot || {};
  const { title: blockTitle, phase } = block || {};
  const { title: phaseTitle, project } = phase || {};
  const { projectName } = project || {};

  const { firstName, middleName, lastName } = agent || {};

  const {
    firstName: clientFirstName,
    middleName: clientMiddleName,
    lastName: clientLastName,
    street,
    barangay,
    city,
    province,
    region,
    zip,
  } = client || {};

  const clientFullName = `${clientFirstName} ${
    clientMiddleName ? clientMiddleName + "," : ""
  } ${clientLastName}`;

  const agentName = `${firstName} ${
    middleName ? middleName + "," : ""
  } ${lastName}`;

  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <Container
      cornerRadius="none"
      flexDisplay
      padding="none"
      alignItems="center"
      {...props}
    >
      <Container
        flexDisplay
        flexDirection="row"
        padding="none"
        alignItems="center"
        justifyContent="center"
        gap="lg"
        className="pr-32"
      >
        <img className="h-24 w-24 object-cover" src={appIconLg} />
        <Container padding="none" flexDisplay gap="none" alignItems="center">
          <Title>RMD LAND</Title>
          <TextSmall>
            123 Sample Street, Sample City
          </TextSmall>
          <TextSmall>09xx-xxx-xxxx • billing@example.com</TextSmall>
        </Container>
      </Container>
      <Title>INVOICE</Title>
      <Container
        flexDisplay
        className="grid grid-cols-2 w-full gap-x-8 mt-5"
        cornerRadius="none"
        padding="none"
        gap="none"
      >
        <Container padding="none" flexDisplay gap="md" cornerRadius="none">
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Project Name:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {projectName} ({phaseTitle})
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Blk. & Lot:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {blockTitle} Lot {lotTitle}
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Mode of Payment:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {MODE_OF_PAYMENT_TEXT[modeOfPayment || "NONE"]}
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Reference No.:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {referenceNumber || "--"}
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Team Head / Agent:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {onToPascalCase(agentName)}
            </div>
          </Container>
        </Container>
        <Container padding="none" flexDisplay gap="md" cornerRadius="none">
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Received from:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {onToPascalCase(clientFullName)}
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">Address:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {`${street}, ${barangay}, ${city}, ${province || ""} ${
                region || ""
              } ${zip || ""}`}
            </div>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="end"
            cornerRadius="none"
          >
            <TextSmall className="w-32">The sum of:</TextSmall>
            <div className="flex-1 border-b border-black border-px">
              {onNumberToWords(total || 0)} ({onToLocalCurrency(total || 0)})
            </div>
          </Container>
          <Container padding="none" flexDisplay gap="none" alignItems="end">
            <Container
              padding="none"
              flexDisplay
              flexDirection="row"
              alignItems="center"
              justifyContent="end"
              cornerRadius="none"
            >
              <TextSmall>As</TextSmall>
              <Check />
              <TextSmall>
                {transactionType === TRANSACTION_TYPE.RESERVATION_FEE
                  ? "Reservation Fee"
                  : "Monthly Amortization"}
              </TextSmall>
            </Container>
            {dueDate && (
              <Title level={5}>
                Payment for{" "}
                {mtz(dueDate, "shortDateAbbrev").format(
                  DATE_FORMAT.fullDateAbbrev,
                )}
              </Title>
            )}
          </Container>
        </Container>
      </Container>
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        className="mt-24 w-full"
      >
        <Container
          padding="none"
          flexDisplay
          alignItems="center"
          justifyContent="center"
          gap="none"
        >
          <div className="w-40 bg-black h-px" />
          <TextSmall>Authorized Signature</TextSmall>
        </Container>
        <Container padding="none" flexDisplay gap="none" alignItems="end">
          <TextSmall>{receiptNo || "--"}</TextSmall>
          <TextSmall>{mtz().format(DATE_FORMAT.shortDateAbbrev)}</TextSmall>
        </Container>
      </Container>
    </Container>
  );
};

const PaymentDetails = ({
  id,
  header,
  onBack,
  showPrint = true,
  title,
  description,
  rightContent,
  contractId,
  dueDate,
}: PaymentDetailsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const onPrint = useReactToPrint({
    contentRef: ref,
    print: async props => {
      const content = props.contentDocument?.body;
      if (content) {
        const contentStyle: Partial<CSSStyleDeclaration> = {
          position: "absolute",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          rotate: "90deg",
          zoom: "0.4",
        };

        Object.assign(content.style, contentStyle);
      }

      props.contentWindow?.print();
    },
  });
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [toggleEditPayment, setToggleEditPayment] = useState(false);
  const { data: payment, isLoading } = useGetPayment({ id: id! });

  const {
    amount,
    files,
    modeOfPayment,
    transactionType,
    referenceNumber,
    penalized,
    penaltyAmount,
    paymentDate,
    waivedPenalty,
    waivedReason,
    receiptNo,
    targetDueDate,
  } = payment?.response || {};

  const renderEditPeyment = useMemo(() => {
    return (
      <Modal
        title="Edit Payment Details"
        {...(targetDueDate && {
          description: `Payment details of ${mtz(
            targetDueDate,
            "defaultformat",
          ).format(DATE_FORMAT.shortDateAbbrev)}`,
        })}
        open={toggleEditPayment}
        onOpenChange={setToggleEditPayment}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <EditPaymentForm
          setToggleEditPayment={setToggleEditPayment}
          id={id}
          amount={amount}
          modeOfPayment={modeOfPayment}
          transactionType={transactionType}
          referenceNumber={referenceNumber}
          receiptNo={receiptNo}
          paymentDate={paymentDate}
          contractId={contractId}
        />
      </Modal>
    );
  }, [
    toggleEditPayment,
    targetDueDate,
    id,
    amount,
    modeOfPayment,
    transactionType,
    referenceNumber,
    receiptNo,
    paymentDate,
    contractId,
  ]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container
        padding="none"
        className="mb-4"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeftIcon />
            Back
          </Button>
        )}
        {showPrint && (
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            {showPrintReceipt && (
              <Button
                variant="secondary"
                onClick={() => setShowPrintReceipt(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="secondary-success"
              onClick={() => {
                if (showPrintReceipt) {
                  onPrint();
                } else {
                  setShowPrintReceipt(true);
                }
              }}
            >
              <IoIosPrint /> Print Receipt
            </Button>
          </Container>
        )}
      </Container>
      {showPrintReceipt ? (
        <div className="bg-white rounded-md p-5 border border-border border-dashed">
          <PrintReceipt
            ref={ref}
            receiptNo={receiptNo}
            total={amount}
            modeOfPayment={modeOfPayment}
            referenceNumber={referenceNumber}
            transactionType={transactionType}
            contractId={contractId}
            dueDate={dueDate}
          />
        </div>
      ) : (
        <Container
          bordered
          className="bg-card border-border/50"
          flexDisplay
          padding="md"
          gap="md"
        >
          {header || (
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
                <Container padding="none" flexDisplay gap="none">
                  <Title level={5}>{title || "Payment Details"}</Title>
                  {description && (
                    <TextSmall secondary>{description}</TextSmall>
                  )}
                </Container>
              </Container>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setToggleEditPayment(true)}
              >
                <MdEdit className="text-dodger-blue size-5" />
              </Button>
              {rightContent || <></>}
            </Container>
          )}
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
              <TextSmall secondary>Amount</TextSmall>
              <Text>{onToLocalCurrency(amount || 0)}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Mode of Payment</TextSmall>
              <Text>
                {onToPascalCase(modeOfPayment || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Transaction Type</TextSmall>
              <Text>
                {onToPascalCase(transactionType || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Reference #</TextSmall>
              <Text>{referenceNumber || "N/A"}</Text>
            </Container>
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Receipt No.</TextSmall>
              <Text>{receiptNo || "N/A"}</Text>
            </Container>
            {penalized && (
              <>
                <Container
                  padding="none"
                  cornerRadius="none"
                  flexDisplay
                  gap="none"
                  className="gap-y-1"
                >
                  <TextSmall secondary>Penalty</TextSmall>
                  <Container
                    padding="none"
                    flexDisplay
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Text className="text-destructive">
                      {`+ ${onToLocalCurrency(penaltyAmount || 0)}`}
                    </Text>
                    {waivedPenalty && (
                      <Badge variant="destructive">Waived</Badge>
                    )}
                  </Container>
                </Container>
                <Container
                  padding="none"
                  cornerRadius="none"
                  flexDisplay
                  gap="none"
                  className="gap-y-1"
                >
                  <TextSmall secondary>Waived Reason</TextSmall>
                  <Text>{waivedReason || "N/A"}</Text>
                </Container>
              </>
            )}
            <Container
              padding="none"
              cornerRadius="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall secondary>Payment Date</TextSmall>
              <Text>
                {mtz(paymentDate, "defaultformat").format(
                  DATE_FORMAT.shortDateAbbrev,
                )}
              </Text>
            </Container>
            {files && !!files.length && (
              <Container
                padding="none"
                cornerRadius="none"
                flexDisplay
                gap="none"
                className="gap-y-1 col-span-2 md:col-span-3 lg:col-span-4"
              >
                <TextSmall secondary>Proof of Payment</TextSmall>
                <ImagePreview file={files} />
              </Container>
            )}
          </Container>
        </Container>
      )}
      {renderEditPeyment}
    </>
  );
};

export default PaymentDetails;
