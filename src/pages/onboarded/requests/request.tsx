import {
  REQUEST_MODULE,
  REQUEST_REJECT_DELETE,
  REQUEST_STATUS,
  REQUEST_TYPE,
  type ClientResponse,
  type Payment,
  type QueryIdProps,
  type RequestResponse,
} from "@/api/query-fn.api";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import { Text, TextSmall, Title } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ProjectLoading } from "@/components/ui/skeleton";
import { useGetPayment } from "@/hooks/queries/usePayment";
import {
  useApproveRequest,
  useGetRequestDetails,
  useRejectOrDeleteRequest,
} from "@/hooks/queries/useRequest";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { REQUEST_STATUS_ICON, REQUEST_STATUS_VARIANT } from "@/utils/constants";
import {
  onDeepDiff,
  onFormatNumber,
  onToPascalCase,
  type DeepDiffChangeResponse,
} from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { Check, MoveRight, Plus, Trash, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type RequestModuleProps = RequestResponse;

type RequestHeaderProps = {
  requestType?: REQUEST_TYPE | null;
  requesterName: string;
  dateCreated: string;
  approveButtonProps?: Omit<ButtonProps, "children">;
  rejectButtonProps?: Omit<ButtonProps, "children">;
  deleteButtonProps?: Omit<ButtonProps, "children">;
  requestStatus?: REQUEST_STATUS | null;
};

type ActionType = "approve" | "reject" | "delete";

type RenderDiffProps<T extends object, K extends keyof T> = {
  objKey: K;
  objRef: T;
  diff: DeepDiffChangeResponse[];
};

const RenderDiff = <T extends object, K extends keyof T>({
  objKey,
  objRef,
  diff,
}: RenderDiffProps<T, K>) => {
  const hasDiff = diff.find(({ path }) => path === objKey);

  const value = objRef[objKey] as string | number | undefined | null;

  if (!hasDiff) {
    return (
      <Text>
        {typeof value === "number"
          ? onFormatNumber(value)
          : value
            ? onToPascalCase(value, {
              removeCharacters: ["_"],
              replaceCharactersWith: " ",
            })
            : "N/A"}
      </Text>
    );
  }

  const { type } = hasDiff;

  const isAdded = type === "added";
  const isDeleted = type === "deleted";

  return (
    <Container
      padding="none"
      flexDisplay
      flexDirection="row"
      alignItems="center"
    >
      {isAdded ? (
        <>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            gap="none"
            cornerRadius="none"
            className="bg-turtle-green/25 py-1 px-2 rounded-sm gap-x-1"
          >
            <Plus className="size-3.5 text-turtle-green" />
            <Text>{hasDiff.newValue || "N/A"}</Text>
          </Container>
        </>
      ) : isDeleted ? (
        <>
          <Text className="bg-destructive/25 rounded-sm line-through py-1 px-2">
            {hasDiff.oldValue || "N/A"}
          </Text>
        </>
      ) : (
        <>
          <Text>
            {!value
              ? "N/A"
              : typeof value === "number"
                ? value
                : onToPascalCase(value)}
          </Text>
          <MoveRight className="size-3.5 text-success" />
          <Text className="bg-turtle-green/25 rounded-sm py-1 px-2">
            {hasDiff.newValue || "N/A"}
          </Text>
        </>
      )}
    </Container>
  );
};

const RequestHeader = ({
  requestType,
  requesterName,
  dateCreated,
  approveButtonProps,
  rejectButtonProps,
  deleteButtonProps,
  requestStatus,
}: RequestHeaderProps) => {
  return (
    <>
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
      >
        <Title
          className={cn(
            requestType === REQUEST_TYPE.ADD
              ? "text-success"
              : requestType === REQUEST_TYPE.UPDATE
                ? "text-primary"
                : "text-destructive",
          )}
        >
          {onToPascalCase(requestType || "", {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}{" "}
          Request
        </Title>
        {requestStatus !== REQUEST_STATUS.PENDING && (
          <Badge variant={REQUEST_STATUS_VARIANT[requestStatus || ""]}>
            {REQUEST_STATUS_ICON[requestStatus || ""]}
            {onToPascalCase(requestStatus || "")}
          </Badge>
        )}
      </Container>
      <Container
        cornerRadius="none"
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sm={{
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Container
          padding="none"
          flexDisplay
          gap="none"
          className="w-full md:w-auto"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="w-full"
            sm={{
              justifyContent: "space-between",
            }}
          >
            <TextSmall secondary>Requester:</TextSmall>
            <Text className="font-bold">{onToPascalCase(requesterName)}</Text>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="w-full"
            sm={{
              justifyContent: "space-between",
            }}
          >
            <TextSmall secondary>Date Requested:</TextSmall>
            <Text className="font-bold">
              {mtz(dateCreated || "", "defaultformat").format(
                DATE_FORMAT.shortDateAbbrev,
              )}
            </Text>
          </Container>
        </Container>
        {requestStatus === REQUEST_STATUS.PENDING && (
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            className="w-full md:w-auto"
          >
            <Button
              variant="outline-destructive"
              prefix={<Trash />}
              className="flex-1"
              {...deleteButtonProps}
            >
              Delete
            </Button>
            <Button
              variant="destructive"
              prefix={<X />}
              className="flex-1"
              {...rejectButtonProps}
            >
              Reject
            </Button>
            <Button
              variant="success"
              prefix={<Check />}
              className="flex-1"
              {...approveButtonProps}
            >
              Approve
            </Button>
          </Container>
        )}
      </Container>
    </>
  );
};

const ClientRequest = (props: RequestModuleProps) => {
  const { target, ...rest } = props;

  const clientRequest = rest as ClientResponse;
  const targetData = target as ClientResponse;

  const diff = useMemo(() => {
    const diffResponse = onDeepDiff(targetData, clientRequest, {
      excludedKeys: ["id", "status"],
    });
    return diffResponse;
  }, [targetData, clientRequest]);

  return (
    <Container
      bordered
      padding="md"
      gap="none"
      className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-card border-border/50 gap-x-3 gap-y-4"
    >
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>First Name</TextSmall>
        <RenderDiff objRef={targetData} objKey="firstName" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Middle</TextSmall>
        <RenderDiff objRef={targetData} objKey="middleName" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Last Name</TextSmall>
        <RenderDiff objRef={targetData} objKey="lastName" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Email</TextSmall>
        <RenderDiff objRef={targetData} objKey="email" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Contact #</TextSmall>
        <RenderDiff objRef={targetData} objKey="contactNumber" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>TIN #</TextSmall>
        <RenderDiff objRef={targetData} objKey="tinNumber" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>House #</TextSmall>
        <RenderDiff objRef={targetData} objKey="houseNumber" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Street</TextSmall>
        <RenderDiff objRef={targetData} objKey="street" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Subdivision</TextSmall>
        <RenderDiff objRef={targetData} objKey="subdivision" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Barangay</TextSmall>
        <RenderDiff objRef={targetData} objKey="barangay" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>City</TextSmall>
        <RenderDiff objRef={targetData} objKey="city" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Province</TextSmall>
        <RenderDiff objRef={targetData} objKey="province" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Zip</TextSmall>
        <RenderDiff objRef={targetData} objKey="zip" diff={diff} />
      </Container>
      <Container padding="none" flexDisplay gap="none">
        <TextSmall secondary>Region</TextSmall>
        <RenderDiff objRef={targetData} objKey="region" diff={diff} />
      </Container>
    </Container>
  );
};

const ReservationRequest = () => {
  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      Reservation
    </Container>
  );
};

const ContractRequest = () => {
  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      Contract
    </Container>
  );
};

const PaymentRequest = (props: RequestModuleProps) => {
  const { target, ...rest } = props;

  const paymentRequest = rest as unknown as Payment;
  const targetData = target as unknown as Payment;

  const { data: paymentDetails, isLoading: isLoadingPaymentDetails } =
    useGetPayment({ id: targetData.id });

  const { contract, reservation } = paymentDetails?.response || {};

  const { firstName, middleName, lastName } =
    contract?.client || reservation?.client || {};

  const lotTitle = contract?.lot.title || reservation?.lot.title || "";
  const blockTitle =
    contract?.lot.block.title || reservation?.lot.block.title || "";
  const phaseTitle =
    contract?.lot.block.phase.title || reservation?.lot.block.phase.title || "";
  const projectTitle =
    contract?.lot.block.phase.project.projectName ||
    reservation?.lot.block.phase.project.projectName ||
    "";

  const clientFullName = `${firstName} ${middleName ? middleName + "," : ""
    } ${lastName}`;

  const diff = useMemo(() => {
    const diffResponse = onDeepDiff(targetData, paymentRequest, {
      excludedKeys: ["id", "status"],
    });
    return diffResponse;
  }, [targetData, paymentRequest]);

  return (
    <Container padding="none" flexDisplay className="mt-2">
      {isLoadingPaymentDetails ? (
        <ProjectLoading />
      ) : (
        <Container
          bordered
          padding="md"
          gap="none"
          className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-card border-border/50 gap-x-3 gap-y-4"
        >
          <Title level={5} className="col-span-1 md:col-span-2 lg:col-span-3">
            Other Details
          </Title>
          <Container padding="none" flexDisplay gap="none">
            <TextSmall secondary>Payer</TextSmall>
            <Text>{onToPascalCase(clientFullName)}</Text>
          </Container>
          <Container padding="none" flexDisplay gap="none">
            <TextSmall secondary>Project</TextSmall>
            <Text>{onToPascalCase(projectTitle)}</Text>
          </Container>
          <Container padding="none" flexDisplay gap="none">
            <TextSmall secondary>Block</TextSmall>
            <Text>{onToPascalCase(blockTitle)}</Text>
          </Container>
          <Container padding="none" flexDisplay gap="none">
            <TextSmall secondary>Phase</TextSmall>
            <Text>{onToPascalCase(phaseTitle)}</Text>
          </Container>
          <Container padding="none" flexDisplay gap="none">
            <TextSmall secondary>Lot</TextSmall>
            <Text>{onToPascalCase(lotTitle)}</Text>
          </Container>
        </Container>
      )}
      <Container
        bordered
        padding="md"
        gap="none"
        className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-card border-border/50 gap-x-3 gap-y-4"
      >
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Receipt Number</TextSmall>
          <RenderDiff objRef={targetData} objKey="receiptNo" diff={diff} />
        </Container>
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Transaction Type</TextSmall>
          <RenderDiff
            objRef={targetData}
            objKey="transactionType"
            diff={diff}
          />
        </Container>
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Mode of Payment</TextSmall>
          <RenderDiff objRef={targetData} objKey="modeOfPayment" diff={diff} />
        </Container>
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Payment Date</TextSmall>
          <RenderDiff objRef={targetData} objKey="paymentDate" diff={diff} />
        </Container>
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Amount</TextSmall>
          <RenderDiff objRef={targetData} objKey="amount" diff={diff} />
        </Container>
        <Container padding="none" flexDisplay gap="none">
          <TextSmall secondary>Reference Number</TextSmall>
          <RenderDiff
            objRef={targetData}
            objKey="referenceNumber"
            diff={diff}
          />
        </Container>
      </Container>
    </Container>
  );
};

const AgentCommissionRequest = () => {
  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      Agent Commission
    </Container>
  );
};

const FileRequest = () => {
  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      File
    </Container>
  );
};

const renderRequestModule: Record<
  REQUEST_MODULE,
  (props: RequestResponse) => React.ReactNode
> = {
  [REQUEST_MODULE.CLIENT]: props => <ClientRequest {...props} />,
  [REQUEST_MODULE.RESERVATION]: () => <ReservationRequest />,
  [REQUEST_MODULE.CONTRACT]: () => <ContractRequest />,
  [REQUEST_MODULE.PAYMENT]: props => <PaymentRequest {...props} />,
  [REQUEST_MODULE.AGENT_COMMISSION]: () => <AgentCommissionRequest />,
  [REQUEST_MODULE.FILE]: () => <FileRequest />,
};

const Request = () => {
  const { id } = useParams<QueryIdProps>();
  const [searchParams] = useSearchParams();
  const [toggleRequestConfirmation, setToggleRequestConfirmation] =
    useState(false);
  const [actionType, setActionType] = useState<ActionType>("approve");

  const moduleParams = searchParams.get("module") as REQUEST_MODULE;

  const { data, isLoading } = useGetRequestDetails({
    id: id!,
    module: moduleParams!,
  });

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();
  const nav = useNavigate();

  const { mutateAsync: approveRequest, isPending: approving } =
    useApproveRequest({
      onSuccess: () => {
        setToggleRequestConfirmation(false);
        nav({ path: "requests" });
        onInvalidate(["requests"]);
        onShowToast({
          title: "Success",
          description: "Request updated successfully",
        });
      },
      onError: () => {
        onShowToast({
          title: "Request update failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });

  const { mutateAsync: rejectOrDeleteRequest, isPending: rejectingOrDeleting } =
    useRejectOrDeleteRequest({
      onSuccess: () => {
        setToggleRequestConfirmation(false);
        nav({ path: "requests" });
        onInvalidate(["requests"]);
        onShowToast({
          title: "Success",
          description: "Request updated successfully",
        });
      },
      onError: () => {
        onShowToast({
          title: "Request update failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });

  const { requestType, createdBy, dateCreated, status } = data?.response || {};

  const {
    firstName: requesterFirstName,
    middleName: requesterMiddleName,
    lastName: requesterLastName,
  } = createdBy || {};

  const requesterName = `${requesterFirstName} ${requesterMiddleName ? requesterMiddleName + "," : ""
    } ${requesterLastName}`;

  const onApproveRequest = useCallback(
    (showConfirmation?: boolean) => async () => {
      if (!id || !moduleParams) return;
      if (showConfirmation) {
        setActionType("approve");
        setToggleRequestConfirmation(true);
        return;
      }
      await approveRequest({ requestId: id, module: moduleParams });
    },
    [id, moduleParams],
  );

  const onRejectOrDeleteRequest = useCallback(
    (requestType: REQUEST_REJECT_DELETE, showConfirmation?: boolean) =>
      async () => {
        if (!id || !moduleParams) return;
        if (showConfirmation) {
          setActionType(
            requestType === REQUEST_REJECT_DELETE.DELETE ? "delete" : "reject",
          );
          setToggleRequestConfirmation(true);
          return;
        }
        await rejectOrDeleteRequest({
          requestId: id,
          module: moduleParams,
          requestType,
        });
      },
    [id, moduleParams],
  );

  const renderRequestConfirmation = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleRequestConfirmation}
        onOpenChange={setToggleRequestConfirmation}
        description={`Are you sure you want to ${actionType} this request?`}
        onCancel={() => setToggleRequestConfirmation(false)}
        onConfirm={() => {
          if (actionType === "approve") {
            onApproveRequest(false)();
          } else if (actionType === "reject") {
            onRejectOrDeleteRequest(REQUEST_REJECT_DELETE.REJECT, false)();
          } else if (actionType === "delete") {
            onRejectOrDeleteRequest(REQUEST_REJECT_DELETE.DELETE, false)();
          }
        }}
        cancelButtonProps={{
          disabled: approving || rejectingOrDeleting,
        }}
        confirmButtonProps={{
          disabled: approving || rejectingOrDeleting,
          loading: approving || rejectingOrDeleting,
          label: onToPascalCase(actionType),
          variant: actionType === "approve" ? "success" : "destructive",
        }}
      />
    );
  }, [toggleRequestConfirmation, actionType, approving, rejectingOrDeleting]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container padding="none" flexDisplay cornerRadius="none">
        <RequestHeader
          requestType={requestType}
          requesterName={requesterName}
          dateCreated={dateCreated || ""}
          requestStatus={status}
          approveButtonProps={{
            onClick: onApproveRequest(true),
          }}
          rejectButtonProps={{
            onClick: onRejectOrDeleteRequest(
              REQUEST_REJECT_DELETE.REJECT,
              true,
            ),
          }}
          deleteButtonProps={{
            onClick: onRejectOrDeleteRequest(
              REQUEST_REJECT_DELETE.DELETE,
              true,
            ),
          }}
        />
        {renderRequestModule[moduleParams](data?.response as RequestResponse)}
      </Container>
      {renderRequestConfirmation}
    </>
  );
};

export default Request;
