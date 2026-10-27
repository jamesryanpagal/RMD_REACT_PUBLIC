import { REQUEST_MODULE, type RequestResponse } from "@/api/query-fn.api";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import { Select } from "@/components/ui/select";
import { useGetRequests } from "@/hooks/queries/useRequest";
import { useNavigate } from "@/hooks/useNavigate";
import {
  requestClientColumns,
  requestPaymentColumns,
  requestFilterOptions,
  requestReservationColumns,
  requestContractColumns,
  requestAgentCommissionColumns,
  requestFileColumns,
} from "@/utils/data";
import { Funnel } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

type RequestComponentProps = {
  data?: RequestResponse[] | null;
  rowLength?: number;
  loading: boolean;
  onSelectRequest: (id: string, tabName: string) => void;
};

const RequestClient = ({
  onSelectRequest,
  ...props
}: RequestComponentProps) => {
  return (
    <DataTable columns={requestClientColumns(onSelectRequest)} {...props} />
  );
};

const RequestPayment = ({
  onSelectRequest,
  ...props
}: RequestComponentProps) => {
  return (
    <DataTable columns={requestPaymentColumns(onSelectRequest)} {...props} />
  );
};

const RequestReservation = (props: RequestComponentProps) => {
  return <DataTable columns={requestReservationColumns()} {...props} />;
};

const RequestContract = (props: RequestComponentProps) => {
  return <DataTable columns={requestContractColumns()} {...props} />;
};

const RequestAgentCommission = (props: RequestComponentProps) => {
  return <DataTable columns={requestAgentCommissionColumns()} {...props} />;
};

const RequestFile = (props: RequestComponentProps) => {
  return <DataTable columns={requestFileColumns()} {...props} />;
};

const renderRequestComponent: Record<
  REQUEST_MODULE,
  (props: RequestComponentProps) => React.ReactNode
> = {
  [REQUEST_MODULE.CLIENT]: props => <RequestClient {...props} />,
  [REQUEST_MODULE.PAYMENT]: props => <RequestPayment {...props} />,
  [REQUEST_MODULE.RESERVATION]: props => <RequestReservation {...props} />,
  [REQUEST_MODULE.CONTRACT]: props => <RequestContract {...props} />,
  [REQUEST_MODULE.AGENT_COMMISSION]: props => (
    <RequestAgentCommission {...props} />
  ),
  [REQUEST_MODULE.FILE]: props => <RequestFile {...props} />,
};

const Requests = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const moduleParams = searchParams.get("requestmodule") as
    | REQUEST_MODULE
    | null
    | undefined;

  const [requestModule, setRequestModule] = useState<REQUEST_MODULE>(
    moduleParams || REQUEST_MODULE.CLIENT,
  );

  const { data, isLoading, isRefetching } = useGetRequests({
    module: requestModule,
  });

  const nav = useNavigate();

  const onSelectRequest = useCallback(
    (id: string, tabName: string) => {
      nav({
        parent: ["requests"],
        path: ":id",
        params: { id },
        query: { tabName, module: requestModule },
      });
    },
    [requestModule],
  );

  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="end"
      >
        <Funnel className="size-6 text-secondary-color/70" />
        <Select
          options={requestFilterOptions}
          value={requestModule}
          onValueChange={e => {
            const formattedVal = e as REQUEST_MODULE;
            setSearchParams({ requestmodule: formattedVal });
            setRequestModule(formattedVal);
          }}
          triggerProps={{
            className: "w-52",
          }}
        />
      </Container>
      <Container bordered className="bg-card border-border/50">
        {renderRequestComponent[requestModule]({
          data: data?.response,
          loading: isLoading || isRefetching,
          onSelectRequest,
          rowLength: 50,
        })}
      </Container>
    </Container>
  );
};

export default Requests;
