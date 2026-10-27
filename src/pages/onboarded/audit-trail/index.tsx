import { MODULES } from "@/api/query-fn.api";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import { Select } from "@/components/ui/select";
import { useGetAuditList } from "@/hooks/queries/useAudit";
import { useNavigate } from "@/hooks/useNavigate";
import { auditColumns, moduleOptions } from "@/utils/data";
import { Funnel } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

const AuditTrail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleParams =
    (searchParams.get("auditModule") as MODULES) || MODULES.PROJECT;

  const [auditModule, setAuditModule] = useState<MODULES>(moduleParams);

  const nav = useNavigate();

  const {
    data: audit,
    isLoading: isAuditLoading,
    isRefetching: isAuditRefetching,
  } = useGetAuditList({
    module: auditModule,
  });

  const isLoading = isAuditLoading || isAuditRefetching;

  const onSelectAudit = useCallback(
    (id: string, tabName: string) => {
      nav({
        parent: ["audittrail"],
        path: ":id",
        params: { id },
        query: { tabName, auditModule: auditModule },
      });
    },
    [auditModule],
  );

  return (
    <Container padding="none" cornerRadius="none" flexDisplay>
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="end"
      >
        <Funnel className="size-6 text-secondary-color/70" />
        <Select
          options={moduleOptions}
          value={auditModule}
          onValueChange={e => {
            const formattedVal = e as MODULES;
            setSearchParams({ auditModule: formattedVal });
            setAuditModule(formattedVal);
          }}
          triggerProps={{
            className: "w-52",
          }}
        />
      </Container>
      <Container bordered className="bg-card border-border/50">
        <DataTable
          columns={auditColumns(onSelectAudit)}
          data={isLoading ? [] : audit?.response || []}
          loading={isLoading}
          rowLength={50}
        />
      </Container>
    </Container>
  );
};

export default AuditTrail;
