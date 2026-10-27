import type {
  SideBarGroupProps,
  SideBarItemsProps,
} from "@/components/app-sidebar";
import { FaAngleDoubleDown } from "react-icons/fa";
import { IoEllipsisHorizontalSharp, IoMoon } from "react-icons/io5";
import { IoIosCash, IoMdSettings } from "react-icons/io";
import type { DropdownItemProps } from "@/components/dropdown";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AGENT_COMMISSION_STATUS,
  AUDIT_ACTION,
  COMMISSION,
  CONTRACT_STATUS,
  DOWN_PAYMENT_TYPE,
  INSTALLMENT_TYPE,
  LOT_STATUS,
  MISCELLANEOUS,
  MODE_OF_PAYMENT,
  MODULE_ACCESS,
  MODULE_FUNCTION,
  MODULES,
  PAYMENT_TYPE,
  REQUEST_MODULE,
  REQUEST_STATUS,
  REQUEST_TYPE,
  TRANSACTION_TYPE,
  type AgentCommissionBreakdownResponse,
  type AgentCommissionResponse,
  type AgentResponse,
  type AuditResponse,
  type ClientResponse,
  type ContractResponse,
  type File,
  type LotResponse,
  type PaymentBreakdownProps,
  type ProjectResponse,
  type RequestResponse,
  type ReservationResponse,
  type User,
} from "@/api/query-fn.api";
import { TextSmall } from "@/components/typography";
import {
  Blocks,
  BriefcaseBusiness,
  ChevronRight,
  Footprints,
  GitPullRequestCreateArrow,
  Handshake,
  LogOut,
  Moon,
  Settings,
  Settings2,
  ShieldUser,
  Sun,
  Tag,
  UsersRound,
} from "lucide-react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/dropdown";
import { MdSunny } from "react-icons/md";
import type { RadioButtonGroupItemsProps } from "@/components/radio-button-group";
import {
  onFormatFullName,
  onFormatNumber,
  onParseStringCurrency,
  onToLocalCurrency,
  onToPascalCase,
} from "./helper";
import type { SelectOptions } from "@/components/ui/select";
import { DATE_FORMAT, mtz } from "./mtz";
import {
  AGENT_COMMISSION_STATUS_THEME,
  AUDIT_ACTION_VARIANT,
  CONTRACT_STATUS_THEME,
  LOT_STATUS_THEME,
  REQUEST_STATUS_ICON,
  REQUEST_STATUS_VARIANT,
  REQUEST_TYPE_VARIANT,
  RESERVATION_STATUS_THEME,
} from "./constants";
import { USER_ROLE } from "./type";
import type { Option } from "@/components/ui/multiselect";
import type { RadioCardOptions } from "@/components/radio-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Tooltip from "@/components/tooltip";
import { Separator } from "@/components/ui/separator";
import type {
  DropdownButtonItemProps,
  DropdownButtonOptionsProps,
} from "@/components/dropdown-button";

const projectManagementMenuItems: SideBarItemsProps[] = [
  {
    title: "Projects",
    icon: <Blocks size={30} />,
    url: "projects",
  },
  {
    title: "Reservations",
    icon: <Tag size={30} />,
    url: "reservations",
  },
];

const userManagementMenuItems: SideBarItemsProps[] = [
  {
    title: "Clients",
    icon: <UsersRound size={30} />,
    url: "clients",
  },
  {
    title: "Agents",
    icon: <BriefcaseBusiness size={30} />,
    url: "agents",
  },
  {
    title: "Users",
    icon: <ShieldUser size={30} />,
    url: "users",
  },
];

const otherMenuItems: SideBarItemsProps[] = [
  {
    title: "Contracts",
    icon: <Handshake size={30} />,
    url: "contracts",
  },
  {
    title: "Audit Trail",
    icon: <Footprints size={30} />,
    url: "audittrail",
  },
  {
    title: "Requests",
    icon: <GitPullRequestCreateArrow size={30} />,
    url: "requests",
  },
];

const onFilterMenuItems = (
  moduleAccess: MODULE_ACCESS[],
  items: SideBarItemsProps[],
) => {
  return items.filter(item =>
    moduleAccess.includes(item.url.toUpperCase() as MODULE_ACCESS),
  );
};

export const sidebarData = (
  moduleAccess: MODULE_ACCESS[],
): (SideBarItemsProps | SideBarGroupProps)[] => {
  const projectManagementItems = onFilterMenuItems(
    moduleAccess,
    projectManagementMenuItems,
  );
  const userManagementItems = onFilterMenuItems(
    moduleAccess,
    userManagementMenuItems,
  );
  const otherItems = onFilterMenuItems(moduleAccess, otherMenuItems);

  return [
    ...(projectManagementItems.length
      ? [
          {
            group: {
              label: "Project Management",
              items: projectManagementItems,
            },
          },
        ]
      : []),
    ...(userManagementItems.length
      ? [
          {
            group: {
              label: "User Management",
              items: userManagementItems,
            },
          },
        ]
      : []),
    ...otherItems,
  ];
};

export const themeItems: RadioButtonGroupItemsProps[] = [
  {
    id: "1",
    icon: <MdSunny />,
    label: "Light",
    value: "light",
  },
  {
    id: "2",
    icon: <IoMoon />,
    label: "Dark",
    value: "dark",
  },
  {
    id: "3",
    icon: <IoMdSettings />,
    label: "System",
    value: "system",
  },
];

export const installmentTypeItems: RadioButtonGroupItemsProps[] = [
  {
    id: "1",
    label: "Regular Monthly Payment",
    value: INSTALLMENT_TYPE.REGULAR_MONTHLY_PAYMENT,
  },
  {
    id: "2",
    label: "Straight Monthly Payment",
    value: INSTALLMENT_TYPE.STRAIGHT_MONTHLY_PAYMENT,
  },
];

export const profileDropdownItems: DropdownItemProps[] = [
  {
    id: "settings",
    label: "Settings",
    icon: <Settings />,
  },
  {
    id: "logout",
    label: "Logout",
    itemProps: { variant: "destructive" },
    icon: <LogOut />,
  },
];

export const lotColumns = (
  onEdit: (props: LotResponse) => void,
  onDelete: (props: LotResponse) => void,
  onReserve: (props: LotResponse) => void,
  canUpdate?: boolean,
  canDelete?: boolean,
): ColumnDef<LotResponse>[] => [
  {
    header: "Lot",
    accessorKey: "title",
    size: 200,
    cell: ({ row }) => {
      return <TextSmall>{row.getValue("title")}</TextSmall>;
    },
  },
  {
    header: "Sqm",
    accessorKey: "sqm",
    size: 200,
    cell: ({ row }) => {
      const val = row.getValue<number | null>("sqm");
      return (
        <TextSmall className={`${!val ? "text-secondary-color/35" : ""}`}>
          {onFormatNumber(val || 0) || "N/A"}
        </TextSmall>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ row }) => {
      const { sqm } = row.original;
      const status = row.getValue<string>("status");

      if (!sqm) {
        return (
          <TextSmall secondary className="text-secondary-color/50">
            Unavailable
          </TextSmall>
        );
      }

      return (
        <Badge variant={LOT_STATUS_THEME[status]} className="w-full max-w-28">
          {onToPascalCase(status, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Badge>
      );
    },
  },
  {
    id: "action",
    size: 50,
    cell: ({ row }) => {
      const { sqm, status } = row.original;
      const editable = !sqm || status === LOT_STATUS.OPEN;
      const reservable = !!sqm && status === LOT_STATUS.OPEN;

      return (
        <Container flexDisplay alignItems="center" justifyContent="center">
          <Dropdown
            modal={false}
            contentProps={{
              align: "end",
            }}
            trigger={<IoEllipsisHorizontalSharp className="size-5" />}
            items={[
              {
                id: "edit",
                label: "Edit",
                itemProps: { disabled: !canUpdate || !editable },
                onClick: () => onEdit(row.original),
              },
              {
                id: "reserveation",
                label: "Reserve",
                itemProps: {
                  disabled: !reservable,
                },
                onClick: () => onReserve(row.original),
              },
              {
                id: "delete",
                label: "Delete",
                itemProps: {
                  variant: "destructive",
                  disabled: !canDelete || !editable,
                },
                onClick: () => onDelete(row.original),
              },
            ]}
          />
        </Container>
      );
    },
  },
];

export const projectColumns = (
  onSelectProject: (id: string, tabName: string) => void,
): ColumnDef<ProjectResponse>[] => [
  {
    header: "Project",
    accessorKey: "projectName",
    size: 200,
    cell: ({ row }) => {
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectProject(
              row.original.id,
              onToPascalCase(row.original.projectName),
            )
          }
        >
          {row.getValue("projectName")}
        </TextSmall>
      );
    },
  },
  {
    id: "fullAddress",
    header: "Address Details",
    accessorFn: row => {
      const {
        houseNumber,
        street,
        subdivision,
        barangay,
        city,
        province,
        zip,
        region,
      } = row;

      return `${houseNumber || ""} ${street}, ${
        subdivision ? subdivision + "," : ""
      } Brgy. ${barangay}, ${city} ${province ? province + "," : ""} ${
        zip ? zip + "," : ""
      } ${region}`;
    },
    cell: ({ row }) => {
      const fullAddress = row.getValue<string>("fullAddress");
      return <TextSmall>{fullAddress}</TextSmall>;
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              onSelectProject(
                row.original.id,
                onToPascalCase(row.original.projectName),
              )
            }
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const clientColumns = (
  onSelectClient: (props: string, tabName: string) => void,
): ColumnDef<ClientResponse>[] => [
  {
    id: "fullName",
    header: "Name",
    accessorFn: row => {
      const { firstName, middleName, lastName } = row;
      return `${firstName} ${middleName ? middleName + "," : ""} ${lastName}`;
    },
    cell: ({ row }) => {
      const fullName = row.getValue<string>("fullName");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectClient(
              row.original.id,
              onToPascalCase(fullName.replace(",", "")),
            )
          }
        >
          {onToPascalCase(fullName)}
        </TextSmall>
      );
    },
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => {
      return <TextSmall>{row.original.email}</TextSmall>;
    },
  },
  {
    id: "fullAddress",
    header: "Address",
    accessorFn: row => {
      const {
        houseNumber,
        street,
        subdivision,
        barangay,
        city,
        province,
        zip,
        region,
      } = row;

      return `${houseNumber || ""} ${street}, ${
        subdivision ? subdivision + "," : ""
      } Brgy. ${barangay}, ${city} ${province ? province + "," : ""} ${
        zip ? zip + "," : ""
      } ${region}`;
    },
    cell: ({ row }) => {
      const fullAddress = row.getValue<string>("fullAddress");
      return <TextSmall className="text-wrap">{fullAddress}</TextSmall>;
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      const { id, firstName, middleName, lastName } = row.original;
      const fullName = `${firstName} ${
        !middleName ? "" : middleName
      } ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectClient(id, onToPascalCase(fullName))}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const modeOfPaymentOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Cash / Cash Deposit",
    value: MODE_OF_PAYMENT.CASH,
  },
  {
    id: "2",
    label: "Cheque",
    value: MODE_OF_PAYMENT.CHEQUE,
  },
  {
    id: "3",
    label: "GCash",
    value: MODE_OF_PAYMENT.GCASH,
  },
  {
    id: "4",
    label: "Online Banking",
    value: MODE_OF_PAYMENT.ONLINE_BANKING,
  },
];

export const reservationColumn = (
  onSelectReservation: (props: string, tabName: string) => void,
): ColumnDef<ReservationResponse>[] => [
  {
    id: "client-name",
    header: "Client",
    size: 300,
    accessorFn: row => {
      const { firstName, middleName, lastName } = row.client;
      return `${firstName} ${!middleName ? "" : middleName + ","} ${lastName}`;
    },
    cell: ({ row }) => {
      const clientFullName = row.getValue<string>("client-name");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectReservation(
              row.original.id,
              onToPascalCase(clientFullName.replace(",", "")),
            )
          }
        >
          {onToPascalCase(clientFullName)}
        </TextSmall>
      );
    },
  },
  {
    id: "project-details",
    header: "Project Details",
    cell: ({ row }) => {
      const { block } = row.original.lot;
      const { title: blockTitle, phase } = block;
      const { title: phaseTitle, project } = phase;
      const { projectName } = project;
      return (
        <TextSmall>
          <span className="text-secondary-color text-xs">Project: </span>
          {projectName}
          <span className="text-secondary-color text-xs"> Phase: </span>
          {phaseTitle}
          <span className="text-secondary-color text-xs"> Block: </span>
          {blockTitle}
        </TextSmall>
      );
    },
  },
  {
    id: "lot",
    header: "Lot",
    size: 150,
    cell: ({ row }) => {
      const { title: lotTitle, sqm } = row.original.lot;
      return (
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          alignItems="center"
        >
          <TextSmall>{lotTitle}</TextSmall>
          <Badge variant="outline-sold">{onFormatNumber(sqm || 0)} Sqm</Badge>
        </Container>
      );
    },
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: row => {
      const { amount } = row.payment;
      return amount;
    },
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");
      return <TextSmall>{onToLocalCurrency(amount)}</TextSmall>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={RESERVATION_STATUS_THEME[status]} className="w-full">
          {onToPascalCase(status, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Badge>
      );
    },
  },
  {
    header: "Validity",
    accessorKey: "validity",
    size: 100,
    cell: ({ row }) => {
      const validity = row.getValue<string>("validity");

      const formattedValidity = mtz(validity, "defaultformat").format(
        DATE_FORMAT.shortDateAbbrev,
      );

      return <TextSmall>{formattedValidity}</TextSmall>;
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      const { id, client } = row.original;
      const { firstName, middleName, lastName } = client || {};
      const clientFullName = `${firstName} ${
        !middleName ? "" : middleName
      } ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              onSelectReservation(id, onToPascalCase(clientFullName))
            }
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const userColumns = (
  onSelectUser: (props: string, tabName: string) => void,
): ColumnDef<User>[] => [
  {
    id: "name",
    header: "Name",
    size: 200,
    accessorFn: row => {
      const { firstName, middleName, lastName } = row;
      return `${firstName} ${!middleName ? "" : middleName + ","} ${lastName}`;
    },
    cell: ({ row }) => {
      const name = row.getValue<string>("name");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectUser(row.original.id, onToPascalCase(name.replace(",", "")))
          }
        >
          {onToPascalCase(name)}
        </TextSmall>
      );
    },
  },
  {
    header: "Username",
    accessorKey: "username",
    cell: ({ row }) => {
      const username = row.getValue<string>("username");
      return <TextSmall>{username}</TextSmall>;
    },
  },
  {
    header: "Email",
    size: 200,
    accessorKey: "email",
    cell: ({ row }) => {
      const email = row.getValue<string>("email");
      return <TextSmall>{email}</TextSmall>;
    },
  },
  {
    id: "fulladdress",
    header: "Address",
    size: 300,
    accessorFn: row => {
      const {
        houseNumber,
        street,
        subdivision,
        barangay,
        city,
        province,
        zip,
        region,
      } = row;
      return `${houseNumber || ""} ${street}, ${
        subdivision ? subdivision + "," : ""
      } Brgy. ${barangay}, ${city} ${province ? province + "," : ""} ${
        zip ? zip + "," : ""
      } ${region}`;
    },
    cell: ({ row }) => {
      const fullAddress = row.getValue<string>("fulladdress");
      return <TextSmall className="text-wrap">{fullAddress}</TextSmall>;
    },
  },
  {
    header: "Module Access",
    accessorKey: "moduleAccess",
    cell: ({ row }) => {
      const { admin, secretary } = row.original;
      const moduleAccess = [
        ...(admin?.moduleAccess || []),
        ...(secretary?.moduleAccess || []),
      ];
      return (
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          flexDirection="row"
          className="flex-wrap gap-2"
        >
          {moduleAccess.map((module, i) => {
            return (
              <Badge variant="outline" key={i}>
                {onToPascalCase(module, {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Badge>
            );
          })}
        </Container>
      );
    },
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue<string>("role");
      return <TextSmall>{onToPascalCase(role)}</TextSmall>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id, firstName, middleName, lastName } = row.original;
      const fullName = `${firstName} ${
        !middleName ? "" : middleName
      } ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectUser(id, onToPascalCase(fullName))}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const userRoleOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Admin",
    value: USER_ROLE.ADMIN,
  },
  {
    id: "2",
    label: "Secretary",
    value: USER_ROLE.SECRETARY,
  },
];

export const moduleFunctionOptions: Option[] = [
  {
    label: "Can Create Projects",
    value: MODULE_FUNCTION.CAN_CREATE_PROJECTS,
  },
  {
    label: "Can Update Projects",
    value: MODULE_FUNCTION.CAN_UPDATE_PROJECTS,
  },
  {
    label: "Can Delete Projects",
    value: MODULE_FUNCTION.CAN_DELETE_PROJECTS,
  },
];

export const moduleAccessOptions: Option[] = [
  {
    label: "Projects",
    value: MODULE_ACCESS.PROJECTS,
  },
  {
    label: "Reservations",
    value: MODULE_ACCESS.RESERVATIONS,
  },
  {
    label: "Clients",
    value: MODULE_ACCESS.CLIENTS,
  },
  {
    label: "Agents",
    value: MODULE_ACCESS.AGENTS,
  },
  {
    label: "Contracts",
    value: MODULE_ACCESS.CONTRACTS,
  },
  {
    label: "Audit Trail",
    value: MODULE_ACCESS.AUDITTRAIL,
  },
  {
    label: "Requests",
    value: MODULE_ACCESS.REQUESTS,
  },
  {
    label: "Users",
    value: MODULE_ACCESS.USERS,
  },
];

export const agentColumns = (
  onSelectAgent: (props: string, tabName: string) => void,
): ColumnDef<AgentResponse>[] => [
  {
    id: "fullName",
    header: "Name",
    size: 20,
    accessorFn: row => {
      const { firstName, middleName, lastName } = row;
      return `${firstName} ${!middleName ? "" : middleName + ","} ${lastName}`;
    },
    cell: ({ row }) => {
      const fullName = row.getValue<string>("fullName");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectAgent(
              row.original.id,
              onToPascalCase(fullName.replace(",", "")),
            )
          }
        >
          {onToPascalCase(fullName)}
        </TextSmall>
      );
    },
  },
  {
    header: "Birth Date",
    accessorKey: "birthDate",
    size: 20,
    cell: ({ row }) => {
      const birthDate = row.getValue<string>("birthDate");
      return (
        <TextSmall>
          {mtz(birthDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}
        </TextSmall>
      );
    },
  },
  {
    id: "action",
    size: 100,
    cell: ({ row }) => {
      const { id, firstName, middleName, lastName } = row.original;
      const fullName = `${firstName} ${
        !middleName ? "" : middleName
      } ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectAgent(id, onToPascalCase(fullName))}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const themeOptions: RadioCardOptions[] = [
  {
    id: "1",
    label: "Light",
    value: "light",
    icon: <Sun />,
  },
  {
    id: "2",
    label: "Dark",
    value: "dark",
    icon: <Moon />,
  },
  {
    id: "3",
    label: "System",
    value: "system",
    icon: <Settings2 />,
  },
];

export const contractPaymentOptions: RadioCardOptions[] = [
  {
    id: "1",
    label: "Cash Payment",
    value: PAYMENT_TYPE.CASH,
    icon: <IoIosCash className="size-9" />,
    props: {
      className: "flex-1",
    },
  },
  {
    id: "2",
    label: "Installment",
    value: PAYMENT_TYPE.INSTALLMENT,
    icon: <FaAngleDoubleDown className="size-9" />,
    props: {
      className: "flex-1",
    },
  },
];

export const miscellaneousOptions: SelectOptions[] = [
  {
    id: "1",
    label: "0%",
    value: MISCELLANEOUS.ZERO,
  },
  {
    id: "2",
    label: "10%",
    value: MISCELLANEOUS.TEN,
  },
];

export const commissionOptions: SelectOptions[] = [
  {
    id: "1",
    label: "5%",
    value: COMMISSION.FIVE,
  },
  {
    id: "2",
    label: "7%",
    value: COMMISSION.SEVEN,
  },
  {
    id: "3",
    label: "10%",
    value: COMMISSION.TEN,
  },
  {
    id: "4",
    label: "12%",
    value: COMMISSION.TWELVE,
  },
  {
    id: "5",
    label: "15%",
    value: COMMISSION.FIFTEEN,
  },
];

export const contractColumns = (
  onSelectContract: (props: string, tabName: string) => void,
): ColumnDef<ContractResponse>[] => [
  {
    id: "client",
    header: "Client",
    size: 250,
    accessorFn: row => {
      const { firstName, middleName, lastName } = row.client;
      return `${firstName} ${!middleName ? "" : middleName + ","} ${lastName}`;
    },
    cell: ({ row }) => {
      const client = row.getValue<string>("client");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectContract(
              row.original.id,
              onToPascalCase(client.replace(",", "")),
            )
          }
        >
          {onToPascalCase(client)}
        </TextSmall>
      );
    },
  },
  {
    id: "project-details",
    header: "Project Details",
    cell: ({ row }) => {
      const { block } = row.original.lot;
      const { title: blockTitle, phase } = block;
      const { title: phaseTitle, project } = phase;
      const { projectName } = project;
      return (
        <TextSmall>
          <span className="text-secondary-color text-xs">Project: </span>
          {projectName}
          <span className="text-secondary-color text-xs"> Phase: </span>
          {phaseTitle}
          <span className="text-secondary-color text-xs"> Block: </span>
          {blockTitle}
        </TextSmall>
      );
    },
  },
  {
    header: "Lot",
    size: 150,
    cell: ({ row }) => {
      const { title: lotTitle, sqm } = row.original.lot;
      return (
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          alignItems="center"
        >
          <TextSmall>{lotTitle}</TextSmall>
          <Badge variant="outline-sold">{onFormatNumber(sqm || 0)} Sqm</Badge>
        </Container>
      );
    },
  },
  {
    header: "Next Payment Date",
    accessorKey: "nextPaymentDate",
    size: 150,
    cell: ({ row }) => {
      const { nextPaymentDate, status } = row.original;

      if (!nextPaymentDate || status !== CONTRACT_STATUS.ON_GOING) {
        return <TextSmall>--</TextSmall>;
      }

      return (
        <TextSmall>
          {mtz(nextPaymentDate, "defaultformat").format(
            DATE_FORMAT.shortDateAbbrev,
          )}
        </TextSmall>
      );
    },
  },
  {
    header: "Payment Type",
    accessorKey: "paymentType",
    size: 150,
    cell: ({ row }) => {
      const { paymentType, downPaymentType, installmentType } = row.original;
      return (
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          alignItems="center"
        >
          <TextSmall>
            {onToPascalCase(paymentType, {
              removeCharacters: ["_"],
              replaceCharactersWith: " ",
            })}
          </TextSmall>
          {downPaymentType && (
            <>
              <TextSmall>/</TextSmall>
              <Badge variant="secondary">
                {onToPascalCase(downPaymentType, {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                }).replace(/\b(Payment|Down)\b/gi, "")}
              </Badge>
            </>
          )}
          {installmentType && (
            <>
              <TextSmall>/</TextSmall>
              <Badge variant="secondary">
                {onToPascalCase(installmentType, {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                }).replace("Payment", "")}
              </Badge>
            </>
          )}
        </Container>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 150,
    cell: ({ row }) => {
      const status = row.getValue<CONTRACT_STATUS>("status");
      return (
        <Badge
          variant={CONTRACT_STATUS_THEME[status]}
          className="w-full max-w-28"
        >
          {onToPascalCase(status, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Badge>
      );
    },
  },
  {
    id: "action",
    size: 10,
    cell: ({ row }) => {
      const { id, client } = row.original;
      const { firstName, middleName, lastName } = client;
      const fullName = `${firstName} ${middleName || ""} ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectContract(id, onToPascalCase(fullName))}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const paymentBreakdownPrintColumns = (
  miscellaneousAsLastPayment: boolean,
  paymentLastDate: string,
  miscellaneousTotal: number,
  usePaymentProgress: boolean,
): ColumnDef<PaymentBreakdownProps>[] => [
  {
    id: "index",
    header: "No.",
    cell: ({ row }) => {
      return <TextSmall>{row.index + 1}</TextSmall>;
    },
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const dueDate = row.getValue<string>("dueDate");
      return <TextSmall>{dueDate}</TextSmall>;
    },
  },
  {
    header: usePaymentProgress ? "Paid Amount" : "Amount",
    accessorKey: "amount",
    size: 150,
    cell: ({ row }) => {
      const { dueDate, amount, paidAmount } = row.original;
      let computedAmount = usePaymentProgress ? paidAmount : amount;

      const lastPaymentAdditional =
        miscellaneousAsLastPayment && dueDate === paymentLastDate;

      if (lastPaymentAdditional && !usePaymentProgress) {
        computedAmount += miscellaneousTotal;
      }

      return (
        <TextSmall>
          {onToLocalCurrency(computedAmount)}
          {lastPaymentAdditional && (
            <span className="text-secondary-color/70">
              {" + Miscellaneous"}
            </span>
          )}
        </TextSmall>
      );
    },
  },
  {
    header: "Remaining Balance",
    accessorKey: "remainingBalance",
    cell: ({ row, table }) => {
      const { index } = row;
      const options = table.options.data;

      const previousPayment = !index ? null : options[index - 1];

      const { remainingBalance, paidAmount } = row.original;
      let computedRemainingBalance: string | number = remainingBalance;

      if (usePaymentProgress && !!previousPayment) {
        computedRemainingBalance =
          onParseStringCurrency(previousPayment.remainingBalance) - paidAmount;
      }

      if (typeof computedRemainingBalance === "number") {
        computedRemainingBalance = onToLocalCurrency(computedRemainingBalance);
      }

      return <TextSmall>{computedRemainingBalance}</TextSmall>;
    },
  },
  {
    header: "Type",
    accessorKey: "transactionType",
    size: 200,
    cell: ({ row }) => {
      const transactionType = row.getValue<TRANSACTION_TYPE>("transactionType");
      return (
        <TextSmall>
          {onToPascalCase(transactionType, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </TextSmall>
      );
    },
  },
];

export const paymentsBreakdownColumns = (
  onSelectPayment: (props: string, tabName: string) => void,
  miscellaneousAsLastPayment: boolean,
  paymentLastDate: string,
  miscellaneousTotal: number,
): ColumnDef<PaymentBreakdownProps>[] => [
  {
    id: "index",
    header: "No.",
    cell: ({ row }) => {
      return <TextSmall>{row.index + 1}</TextSmall>;
    },
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
    size: 150,
    cell: ({ row }) => {
      const { id } = row.original;
      const dueDate = row.getValue<string>("dueDate");
      return (
        <TextSmall
          className={
            !id
              ? ""
              : "hover:underline hover:underline-offset-4 hover:cursor-pointer"
          }
          onClick={() => {
            if (!id) return;
            onSelectPayment(id, onToPascalCase(dueDate.replace(",", "")));
          }}
        >
          {dueDate}
        </TextSmall>
      );
    },
  },
  {
    header: "Payment Date",
    accessorKey: "paymentDate",
    size: 150,
    cell: ({ row }) => {
      const paymentDate = row.getValue<string | undefined>("paymentDate");
      return (
        <TextSmall>
          {!paymentDate
            ? "--"
            : mtz(paymentDate, "defaultformat").format(
                DATE_FORMAT.shortDateAbbrev,
              )}
        </TextSmall>
      );
    },
  },
  {
    header: "Mode of Payment",
    accessorKey: "modeOfPayment",
    size: 150,
    cell: ({ row }) => {
      const modeOfPayment = row.getValue<MODE_OF_PAYMENT | undefined>(
        "modeOfPayment",
      );
      return (
        <TextSmall>
          {!modeOfPayment
            ? "--"
            : onToPascalCase(modeOfPayment, {
                removeCharacters: ["_"],
                replaceCharactersWith: " ",
              })}
        </TextSmall>
      );
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "transactionType",
    size: 150,
    cell: ({ row }) => {
      const transactionType = row.getValue<TRANSACTION_TYPE>("transactionType");
      return (
        <TextSmall>
          {onToPascalCase(transactionType, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </TextSmall>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    size: 150,
    cell: ({ row }) => {
      const { dueDate, amount } = row.original;
      let computedAmount = amount;

      const lastPaymentAdditional =
        miscellaneousAsLastPayment && dueDate === paymentLastDate;

      if (lastPaymentAdditional) {
        computedAmount += miscellaneousTotal;
      }
      return (
        <TextSmall>
          {onToLocalCurrency(computedAmount)}
          {lastPaymentAdditional && (
            <span className="text-secondary-color/70">
              {" + Miscellaneous"}
            </span>
          )}
        </TextSmall>
      );
    },
  },
  {
    header: "Penalty",
    accessorKey: "penalized",
    size: 150,
    cell: ({ row }) => {
      const { penalized, penaltyAmount, waivedPenalty, penaltyCount, ignored } =
        row.original;

      const hasPenalty = penalized && penaltyAmount;

      if (!hasPenalty || !!ignored) {
        return <TextSmall>--</TextSmall>;
      }

      return (
        <Tooltip
          trigger={
            <TextSmall
              className={cn(
                "text-destructive hover:cursor-pointer",
                waivedPenalty ? "line-through" : "",
              )}
            >
              {`+ ${onToLocalCurrency(penaltyAmount)}`}
            </TextSmall>
          }
        >
          <Container className="w-96" flexDisplay>
            <TextSmall>
              Late payment will receive a penalty fee of 0.005% of the total
              amount of their monthly fee multiplied by the number of month(s)
              passed since the due date.
            </TextSmall>
            <Separator />
            <Container
              padding="none"
              flexDisplay
              gap="none"
              className="gap-y-1"
            >
              <TextSmall>
                Penalty Amount: {onToLocalCurrency(penaltyAmount)}
                {waivedPenalty && (
                  <Badge variant="destructive" className="ml-2">
                    Waived
                  </Badge>
                )}
              </TextSmall>
              <TextSmall>
                Months(s) Passed: {onFormatNumber(penaltyCount || 0)}
              </TextSmall>
            </Container>
          </Container>
        </Tooltip>
      );
    },
  },
  {
    header: "Paid Amount",
    accessorKey: "paidAmount",
    size: 150,
    cell: ({ row }) => {
      const paidAmount = row.getValue<number>("paidAmount");
      return <TextSmall>{onToLocalCurrency(paidAmount)}</TextSmall>;
    },
  },
  {
    header: "Remaining Balance",
    accessorKey: "remainingBalance",
    size: 150,
    cell: ({ row }) => {
      const remainingBalance = row.getValue<string>("remainingBalance");
      return <TextSmall>{remainingBalance}</TextSmall>;
    },
  },
  {
    id: "paid",
    header: "Status",
    accessorKey: "paid",
    size: 100,
    cell: ({ row }) => {
      const paid = row.getValue<boolean>("paid");
      return (
        <Badge variant={paid ? "sold" : "pending"} className="w-full">
          {paid ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      const { id, dueDate } = row.original;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            className={!id ? "opacity-20" : ""}
            onClick={() => {
              if (!id) return;
              onSelectPayment(id, onToPascalCase(dueDate.replace(",", "")));
            }}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const transactionTypeOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Holding Fee",
    value: TRANSACTION_TYPE.HOLDING_FEE,
  },
  {
    id: "2",
    label: "Reservation Fee",
    value: TRANSACTION_TYPE.RESERVATION_FEE,
  },
  {
    id: "3",
    label: "Partial Down Payment",
    value: TRANSACTION_TYPE.PARTIAL_DOWN_PAYMENT,
  },
  {
    id: "4",
    label: "Full Down Payment",
    value: TRANSACTION_TYPE.FULL_DOWN_PAYMENT,
  },
  {
    id: "5",
    label: "Monthly Payment",
    value: TRANSACTION_TYPE.MONTHLY_PAYMENT,
  },
  {
    id: "6",
    label: "TCP Full Payment",
    value: TRANSACTION_TYPE.TCP_FULL_PAYMENT,
  },
  {
    id: "7",
    label: "Down Payment",
    value: TRANSACTION_TYPE.DOWN_PAYMENT,
  },
  {
    id: "8",
    label: "Survey Fee",
    value: TRANSACTION_TYPE.SURVEY_FEE,
  },
  {
    id: "9",
    label: "Agent Commission Release",
    value: TRANSACTION_TYPE.AGENT_COMMISSION_RELEASE,
  },
  {
    id: "10",
    label: "Full Payment",
    value: TRANSACTION_TYPE.FULL_PAYMENT,
  },
];

export const downPaymentTypeOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Partial Down Payment",
    value: DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT,
  },
  {
    id: "2",
    label: "Full Down Payment",
    value: DOWN_PAYMENT_TYPE.FULL_DOWN_PAYMENT,
  },
];

export const agentCommissionColumns = (
  onSelectAgentCommission: (id: string) => void,
): ColumnDef<AgentCommissionResponse>[] => [
  {
    header: "Project",
    cell: ({ row }) => {
      const { lot } = row.original.contract || {};
      const { title: lotTitle, block } = lot || {};
      const { title: blockTitle, phase } = block || {};
      const { title: phaseTitle, project } = phase || {};
      const { projectName } = project || {};
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() => onSelectAgentCommission(row.original.id)}
        >
          <span className="text-secondary-color text-xs">Project: </span>
          {projectName}
          <span className="text-secondary-color text-xs"> Phase: </span>
          {phaseTitle}
          <span className="text-secondary-color text-xs"> Block: </span>
          {blockTitle}
          <span className="text-secondary-color text-xs"> Lot: </span>
          {lotTitle}
        </TextSmall>
      );
    },
  },
  {
    header: "Client",
    cell: ({ row }) => {
      const { client } = row.original.contract;
      const { firstName, middleName, lastName } = client;
      return (
        <TextSmall>
          {onFormatFullName(firstName, lastName, middleName)}
        </TextSmall>
      );
    },
  },
  {
    header: "Terms",
    accessorKey: "terms",
    cell: ({ row }) => {
      const terms = row.getValue<number>("terms");
      return <TextSmall>{onFormatNumber(terms || 0)}</TextSmall>;
    },
  },
  {
    header: "Release Start Date",
    accessorKey: "releaseStartDate",
    cell: ({ row }) => {
      const releaseStartDate = row.getValue<string | null>("releaseStartDate");
      return <TextSmall>{releaseStartDate || "--"}</TextSmall>;
    },
  },
  {
    header: "Release End Date",
    accessorKey: "releaseEndDate",
    cell: ({ row }) => {
      const releaseEndDate = row.getValue<string | null>("releaseEndDate");
      return <TextSmall>{releaseEndDate || "--"}</TextSmall>;
    },
  },
  {
    header: "Next Release Date",
    accessorKey: "nextReleaseDate",
    cell: ({ row }) => {
      const nextReleaseDate = row.getValue<string | null>("nextReleaseDate");
      return <TextSmall>{nextReleaseDate || "--"}</TextSmall>;
    },
  },
  {
    header: "Remaining Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const balance = row.getValue<number>("balance");
      return <TextSmall>{onToLocalCurrency(balance || 0)}</TextSmall>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue<AGENT_COMMISSION_STATUS>("status");
      return (
        <Badge
          variant={AGENT_COMMISSION_STATUS_THEME[status]}
          className="w-full"
        >
          {onToPascalCase(status, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Badge>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectAgentCommission(id)}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const agentCommissionBreakdownColumns: ColumnDef<AgentCommissionBreakdownResponse>[] =
  [
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ row }) => {
        const dueDate = row.getValue<string>("dueDate");
        return <TextSmall>{dueDate}</TextSmall>;
      },
    },
    {
      header: "Transaction Type",
      accessorKey: "transactionType",
      cell: ({ row }) => {
        const transactionType =
          row.getValue<TRANSACTION_TYPE>("transactionType");
        return (
          <TextSmall>
            {onToPascalCase(transactionType, {
              removeCharacters: ["_"],
              replaceCharactersWith: " ",
            })}
          </TextSmall>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        const amount = row.getValue<number>("amount");
        return <TextSmall>{onToLocalCurrency(amount)}</TextSmall>;
      },
    },
    {
      header: "Paid Amount",
      accessorKey: "paidAmount",
      cell: ({ row }) => {
        const paidAmount = row.getValue<number>("paidAmount");
        return <TextSmall>{onToLocalCurrency(paidAmount)}</TextSmall>;
      },
    },
    {
      header: "Remaining Balance",
      accessorKey: "remainingBalance",
      cell: ({ row }) => {
        const remainingBalance = row.getValue<number>("remainingBalance");
        return <TextSmall>{onToLocalCurrency(remainingBalance)}</TextSmall>;
      },
    },
    {
      id: "paid",
      header: "Status",
      accessorKey: "paid",
      cell: ({ row }) => {
        const paid = row.getValue<boolean>("paid");
        return (
          <Badge variant={paid ? "sold" : "pending"} className="w-full">
            {paid ? "Paid" : "Unpaid"}
          </Badge>
        );
      },
    },
  ];

export const paymentOptions = (
  date: string,
  onClickItem: (props: DropdownButtonItemProps) => void,
): DropdownButtonOptionsProps[] => [
  {
    id: "1",
    label: `Pay for ${date}`,
  },
  {
    id: "2",
    label: "Full Payment",
    description: "Pay in full, marking this contract as done",
    onClick: onClickItem,
  },
];

export const requestFilterOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Client",
    value: REQUEST_MODULE.CLIENT,
  },
  {
    id: "2",
    label: "Payment",
    value: REQUEST_MODULE.PAYMENT,
  },
];

export const requestClientColumns = (
  onSelectRequest: (id: string, tabName: string) => void,
): ColumnDef<RequestResponse>[] => [
  {
    id: "client-name",
    header: "Client",
    accessorFn: row => {
      const { firstName, middleName, lastName } = row.target as ClientResponse;
      return `${firstName} ${!middleName ? "" : middleName + ","} ${lastName}`;
    },
    cell: ({ row }) => {
      const clientName = row.getValue<string>("client-name");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() =>
            onSelectRequest(row.id, onToPascalCase(clientName.replace(",", "")))
          }
        >
          {onToPascalCase(clientName)}
        </TextSmall>
      );
    },
  },
  {
    header: "Date Requested",
    accessorKey: "dateCreated",
    size: 200,
    cell: ({ row }) => {
      const dateCreated = row.getValue<REQUEST_TYPE>("dateCreated");
      return (
        <TextSmall>
          {mtz(dateCreated, "defaultformat").format(
            DATE_FORMAT.shortDateAbbrev,
          )}
        </TextSmall>
      );
    },
  },
  {
    header: "Request Type",
    accessorKey: "requestType",
    size: 100,
    cell: ({ row }) => {
      const requestType = row.getValue<REQUEST_TYPE>("requestType");
      return (
        <Badge variant={REQUEST_TYPE_VARIANT[requestType]}>
          {onToPascalCase(requestType, {
            removeCharacters: ["_"],
            replaceCharactersWith: "",
          })}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 10,
    cell: ({ row }) => {
      const status = row.getValue<REQUEST_STATUS>("status");
      return (
        <Badge variant={REQUEST_STATUS_VARIANT[status || ""]}>
          {REQUEST_STATUS_ICON[status || ""]}
          {onToPascalCase(status || "")}
        </Badge>
      );
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      const { firstName, middleName, lastName } = row.original
        .target as ClientResponse;
      const fullName = `${firstName} ${
        middleName ? middleName + "," : ""
      } ${lastName}`;
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              onSelectRequest(row.id, onToPascalCase(fullName.replace(",", "")))
            }
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const requestPaymentColumns = (
  onSelectRequest: (id: string, tabName: string) => void,
): ColumnDef<RequestResponse>[] => [
  {
    header: "Receipt No.",
    accessorKey: "receiptNo",
    cell: ({ row }) => {
      const receiptNo = row.getValue<string>("receiptNo");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() => onSelectRequest(row.id, receiptNo)}
        >
          {receiptNo}
        </TextSmall>
      );
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "transactionType",
    size: 200,
    cell: ({ row }) => {
      const transactionType = row.getValue<TRANSACTION_TYPE>("transactionType");
      return (
        <TextSmall>
          {onToPascalCase(transactionType, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </TextSmall>
      );
    },
  },
  {
    header: "Date Requested",
    accessorKey: "dateCreated",
    size: 200,
    cell: ({ row }) => {
      const dateCreated = row.getValue<REQUEST_TYPE>("dateCreated");
      return (
        <TextSmall>
          {mtz(dateCreated, "defaultformat").format(
            DATE_FORMAT.shortDateAbbrev,
          )}
        </TextSmall>
      );
    },
  },
  {
    header: "Request Type",
    accessorKey: "requestType",
    size: 10,
    cell: ({ row }) => {
      const requestType = row.getValue<REQUEST_TYPE>("requestType");
      return (
        <Badge variant={REQUEST_TYPE_VARIANT[requestType]}>
          {onToPascalCase(requestType, {
            removeCharacters: ["_"],
            replaceCharactersWith: "",
          })}
        </Badge>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 10,
    cell: ({ row }) => {
      const status = row.getValue<REQUEST_STATUS>("status");
      return (
        <Badge variant={REQUEST_STATUS_VARIANT[status || ""]}>
          {REQUEST_STATUS_ICON[status || ""]}
          {onToPascalCase(status || "")}
        </Badge>
      );
    },
  },
  {
    id: "action",
    size: 5,
    cell: ({ row }) => {
      const receiptNo = row.getValue<string>("receiptNo");
      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectRequest(row.id, receiptNo)}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];

export const requestReservationColumns = (): ColumnDef<RequestResponse>[] => [
  {
    header: "Reservation",
    accessorKey: "reservation",
    cell: ({ row }) => {
      const { id } = row.original.target || ({} as ReservationResponse);
      return <TextSmall>{id}</TextSmall>;
    },
  },
];

export const requestContractColumns = (): ColumnDef<RequestResponse>[] => [
  {
    header: "Contract",
    accessorKey: "contract",
    cell: ({ row }) => {
      const { id } = row.original.target || ({} as ContractResponse);
      return <TextSmall>{id}</TextSmall>;
    },
  },
];

export const requestAgentCommissionColumns =
  (): ColumnDef<RequestResponse>[] => [
    {
      header: "Agent Commission",
      accessorKey: "agentCommission",
      cell: ({ row }) => {
        const { id } = row.original.target || ({} as AgentCommissionResponse);
        return <TextSmall>{id}</TextSmall>;
      },
    },
  ];

export const requestFileColumns = (): ColumnDef<RequestResponse>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name } = row.original.target as File;
      return <TextSmall>{name}</TextSmall>;
    },
  },
];

export const reservationDropdownItems = (
  onAdjustReservationValidity: () => void,
  onDeleteReservation: () => void,
): DropdownItemProps[] => [
  {
    id: "1",
    label: "Adjust reservation validity",
    onClick: onAdjustReservationValidity,
  },
  {
    id: "2",
    label: "Delete reservation",
    onClick: onDeleteReservation,
    itemProps: {
      variant: "destructive",
    },
  },
];

export const moduleOptions: SelectOptions[] = [
  {
    id: "1",
    label: "Project",
    value: MODULES.PROJECT,
  },
  {
    id: "2",
    label: "Reservation",
    value: MODULES.RESERVATION,
  },
  {
    id: "3",
    label: "Client",
    value: MODULES.CLIENT,
  },
  {
    id: "4",
    label: "Agent",
    value: MODULES.AGENT,
  },
  {
    id: "5",
    label: "User",
    value: MODULES.USER,
  },
  {
    id: "6",
    label: "Contract",
    value: MODULES.CONTRACT,
  },
  {
    id: "7",
    label: "Payment",
    value: MODULES.PAYMENT,
  },
  {
    id: "8",
    label: "Agent Commission",
    value: MODULES.AGENT_COMMISSION,
  },
];

export const auditColumns = (
  onSelectAudit: (id: string, tabName: string) => void,
): ColumnDef<AuditResponse>[] => [
  {
    id: "full-name",
    header: "Performed by",
    accessorFn: row => {
      const { createdBy } = row || {};
      if (!createdBy) {
        return "System";
      }

      const { firstName, middleName, lastName } = createdBy;

      return onFormatFullName(firstName, lastName, middleName);
    },
    cell: ({ row }) => {
      const fullName = row.getValue<string>("full-name");
      return (
        <TextSmall
          className="hover:underline hover:underline-offset-4 hover:cursor-pointer"
          onClick={() => onSelectAudit(row.original.id, fullName)}
        >
          {fullName}
        </TextSmall>
      );
    },
  },
  {
    header: "Action Performed",
    accessorKey: "action",
    size: 200,
    cell: ({ row }) => {
      const { action } = row.original || {};
      return (
        <Badge variant={AUDIT_ACTION_VARIANT[action]}>
          {onToPascalCase(action, {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Badge>
      );
    },
  },
  {
    id: "date-performed",
    header: "Date Performed",
    size: 200,
    accessorFn: row => {
      const { action, dateCreated, dateDeleted } = row;

      let datePerformed = dateCreated;

      if (action === AUDIT_ACTION.DELETE) {
        datePerformed = dateDeleted || dateCreated;
      }

      return mtz(datePerformed, "defaultformat").format(
        DATE_FORMAT.shortDateAbbrev,
      );
    },
  },
  {
    id: "row-action",
    size: 5,
    cell: ({ row }) => {
      const { id, createdBy } = row.original || {};

      const { firstName, middleName, lastName } = createdBy || {};

      const fullName = !createdBy
        ? "System"
        : onFormatFullName(firstName || "", lastName || "", middleName || "");

      return (
        <Container padding="none" flexDisplay alignItems="end">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onSelectAudit(id, fullName)}
          >
            <ChevronRight />
          </Button>
        </Container>
      );
    },
  },
];
