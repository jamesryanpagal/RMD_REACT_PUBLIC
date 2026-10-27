import { USER_ROLE } from "@/utils/type";
import { apiRequest } from "./axios.api";
import { httpRequest } from "./base-request.api";
import config from "@/utils/config";
import type {
  AddBlockSchema,
  AdjustReservationValiditySchema,
  AgentPersonalDetailsSchema,
  AssignClientSchema,
  AssignProjectSchema,
  BlockSchema,
  BlockTitleSchema,
  CashPaymentSchema,
  ChangePasswordSchema,
  ClientPersonalDetailsSchema,
  ClientSchema,
  CreateAgentSchema,
  LoginSchema,
  LotSchema,
  PartialAndFullDownPaymentSchema,
  PayForAllRemainingDatesSchema,
  PayForDueDateSchema,
  PersonalDetailsSchema,
  PhaseSchema,
  PhaseTitleSchema,
  ProjectAddressDetailsSchema,
  ProjectNameAndDescriptionSchema,
  ProjectSchema,
  ReleaseAgentCommissionSchema,
  ReservationSchema,
  StartCommissionSchema,
  StraightMonthlyPaymentSchema,
  UpdatePaymentSchema,
  UpdateUserAccessAndFunctionsSchema,
  UserSchema,
} from "@/utils/schema.z";
import type { StepsFormProps } from "@/pages/onboarded/projects";
import type { Theme } from "@/components/context/theme-provider";

export const enum PAYMENT_TYPE {
  CASH = "CASH",
  INSTALLMENT = "INSTALLMENT",
}

export const enum MISCELLANEOUS {
  ZERO = "ZERO",
  TEN = "TEN",
}

export const enum COMMISSION {
  FIVE = "FIVE",
  SEVEN = "SEVEN",
  TEN = "TEN",
  TWELVE = "TWELVE",
  FIFTEEN = "FIFTEEN",
}

export const enum MODULE_ACCESS {
  PROJECTS = "PROJECTS",
  PHASE = "PHASE",
  BLOCK = "BLOCK",
  LOT = "LOT",
  RESERVATIONS = "RESERVATIONS",
  CLIENTS = "CLIENTS",
  AGENTS = "AGENTS",
  CONTRACTS = "CONTRACTS",
  AUDITTRAIL = "AUDITTRAIL",
  REQUESTS = "REQUESTS",
  USERS = "USERS",
}

export const enum MODULE_FUNCTION {
  CAN_CREATE_PROJECTS = "CAN_CREATE_PROJECTS",
  CAN_UPDATE_PROJECTS = "CAN_UPDATE_PROJECTS",
  CAN_DELETE_PROJECTS = "CAN_DELETE_PROJECTS",
}

export const enum MODE_OF_PAYMENT {
  CASH = "CASH",
  GCASH = "GCASH",
  ONLINE_BANKING = "ONLINE_BANKING",
  CHEQUE = "CHEQUE",
  NONE = "NONE",
}

export const enum STATUS {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export const enum LOT_STATUS {
  OPEN = "OPEN",
  PENDING = "PENDING",
  ON_GOING = "ON_GOING",
  CLOSED = "CLOSED",
  SOLD = "SOLD",
  DELETED = "DELETED",
}

export type Settings = {
  id: string;
  userId: string;
  theme: Theme;
};

export type User = {
  id: string;
  username: string;
  accessToken?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  mobile: string;

  houseNumber?: string;
  street: string;
  barangay: string;
  subdivision?: string;
  city: string;
  province?: string;
  region: string;
  zip?: string;

  role: USER_ROLE;

  admin?: Admin;
  secretary?: Secretary;
  settings?: Settings;

  status: STATUS;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  dateCreated: string;
  dateUpdated: string;
  dateDeleted?: string;
};

export type Admin = {
  id: string;
  userId: string;
  isSuperAdmin: boolean;
  moduleAccess: MODULE_ACCESS[];
  moduleFunction: MODULE_FUNCTION[];

  user: User;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  dateCreated: string;
  dateUpdated: string;
  dateDeleted?: string;
};

export type Secretary = {
  id: string;
  userId: string;
  moduleAccess: MODULE_ACCESS[];
  moduleFunction: MODULE_FUNCTION[];

  user: User;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  dateCreated: string;
  dateUpdated: string;
  dateDeleted?: string;
};

export type LoginResponse = {
  accessToken: string;
  role: USER_ROLE;
  moduleAccess: MODULE_ACCESS[];
};

export type QuerySearchProps = {
  search?: string;
};

export type LotResponse = {
  id: string;
  blockId: string;
  title: string;
  sqm?: number | null;
  status: LOT_STATUS;
};

export type BlockResponse = Omit<BlockSchema, "lot"> & {
  id: string;
  phaseId: string;
  lot: LotResponse[];
};

export type PhaseResponse = Omit<PhaseSchema, "block"> & {
  id: string;
  projectId: string;
  block: BlockResponse[];
};

export type ProjectResponse = ProjectSchema & {
  id: string;
  phase: PhaseResponse[];
};

export type QueryIdProps = {
  id: string;
};

export type QueryIdAndModuleProps = QueryIdProps & {
  module: REQUEST_MODULE;
};

export type ProjectNameAndDescriptionProps = ProjectNameAndDescriptionSchema &
  QueryIdProps;

export type ProjectAddressDetailsProps = ProjectAddressDetailsSchema &
  QueryIdProps;

export type ClientResponse = ClientSchema & {
  id: string;
  reservation?: ReservationResponse[] | null;
  contract?: ContractResponse[] | null;
  status?: STATUS;
};

export const enum DOWN_PAYMENT_TYPE {
  FULL_DOWN_PAYMENT = "FULL_DOWN_PAYMENT",
  PARTIAL_DOWN_PAYMENT = "PARTIAL_DOWN_PAYMENT",
}

export const enum TRANSACTION_TYPE {
  HOLDING_FEE = "HOLDING_FEE",
  RESERVATION_FEE = "RESERVATION_FEE",
  PARTIAL_DOWN_PAYMENT = "PARTIAL_DOWN_PAYMENT",
  FULL_DOWN_PAYMENT = "FULL_DOWN_PAYMENT",
  MONTHLY_PAYMENT = "MONTHLY_PAYMENT",
  TCP_FULL_PAYMENT = "TCP_FULL_PAYMENT",
  DOWN_PAYMENT = "DOWN_PAYMENT",
  SURVEY_FEE = "SURVEY_FEE",
  AGENT_COMMISSION_RELEASE = "AGENT_COMMISSION_RELEASE",
  FULL_PAYMENT = "FULL_PAYMENT",
}

export type Lot = {
  id: string;
  blockId: string;
  title: string;
  sqm?: number | null;
  status: LOT_STATUS;
};

export type Block = {
  id: string;
  phaseId: string;
  title: string;
  status: STATUS;
};

export type Phase = {
  id: string;
  projectId: string;
  title: string;
  status: STATUS;
};

export type Project = {
  id: string;
  projectName: string;
  description?: string;
  houseNumber?: string | null;
  street: string;
  barangay: string;
  subdivision?: string | null;
  city: string;
  province?: string | null;
  region: string;
  zip?: string | null;
  status: STATUS;
};

export type File = {
  id: string;
  paymentId?: string | null;
  ext: string;
  name: string;
  description?: string | null;
  path: string;
};

export type Payment = {
  id: string;
  contractId?: string | null;
  reservationId?: string | null;
  agentCommissionId?: string | null;
  transactionType: TRANSACTION_TYPE;
  modeOfPayment: MODE_OF_PAYMENT;
  targetDueDate?: string | null;
  paymentDate: string;
  amount: number;
  referenceNumber?: string | null;
  penalized: boolean;
  penaltyAmount: number;
  waivedPenalty?: boolean | null;
  waivedReason?: string | null;
  receiptNo?: string | null;
  status: STATUS;
  contract?: ContractResponse;
  reservation?: ReservationResponse;
  files: File[];
};

export const enum RESERVATION_STATUS {
  ACTIVE = "ACTIVE",
  FORFEITED = "FORFEITED",
  CONTRACT_FORFEITED = "CONTRACT_FORFEITED",
  CONTRACT_DELETED = "CONTRACT_DELETED",
  DONE = "DONE",
  DELETED = "DELETED",
}

export type ReservationResponse = {
  id: string;
  lotId: string;
  clientId: string;
  contractId?: string | null;
  validity: string;
  status: RESERVATION_STATUS;
  lot: Lot & {
    block: Block & {
      phase: Phase & {
        project: Project;
      };
    };
  };
  client: ClientResponse;
  payment: Payment;
};

export type AddPhase = PhaseSchema & QueryIdProps;

export type UpdateThemeProps = {
  theme: Theme;
};

export type AgentResponse = QueryIdProps & CreateAgentSchema;

export type ClientLotReservationProps = {
  clientId: string;
  lotId: string;
};

export const enum DOWN_PAYMENT_STATUS {
  ON_GOING = "ON_GOING",
  FORFEITED = "FORFEITED",
  DONE = "DONE",
}

export const enum INSTALLMENT_TYPE {
  STRAIGHT_MONTHLY_PAYMENT = "STRAIGHT_MONTHLY_PAYMENT",
  REGULAR_MONTHLY_PAYMENT = "REGULAR_MONTHLY_PAYMENT",
}

export const enum CONTRACT_STATUS {
  ON_GOING = "ON_GOING",
  FORFEITED = "FORFEITED",
  DONE = "DONE",
  DELETED = "DELETED",
}

export type ContractResponse = {
  clientId: string;
  id: string;
  lotId: string;
  agentId: string;
  sqmPrice: number;
  downPaymentType?: TRANSACTION_TYPE | null;
  downPaymentStatus?: DOWN_PAYMENT_STATUS | null;
  totalDownPayment?: number | null;
  totalMonthlyDown?: number | null;
  totalMonthly?: number | null;
  downPayment?: number | null;
  terms?: number | null;
  miscellaneous: MISCELLANEOUS;
  miscellaneousTotal: number;
  agentCommission: COMMISSION;
  agentCommissionTotal: number;
  balance: number;
  totalLotPrice: number;
  tcp: number;
  paymentType: PAYMENT_TYPE;
  totalCashPayment?: number | null;
  recurringPaymentDay?: number | null;
  nextPaymentDate?: string | null;
  paymentStartedDate?: string | null;
  paymentLastDate?: string | null;
  penaltyAmount: number;
  penaltyCount: number;
  installmentType?: INSTALLMENT_TYPE | null;
  interest?: number | null;
  interestTotal?: number | null;
  excessPayment: number;
  status: CONTRACT_STATUS;
  lot: Lot & {
    block: Block & {
      phase: Phase & {
        project: Project;
      };
    };
  };
  client: ClientResponse;
  agent: AgentResponse;
  payment: Payment[];
};

export type ContractIdProps = {
  contractId: string;
};

export type PaymentBreakdownProps = {
  id: string;
  reservationId?: string | null;
  referenceNumber?: string | null;
  modeOfPayment: MODE_OF_PAYMENT;
  paymentDate: string;
  receiptNo: string;
  amount: number;
  paidAmount: number;
  transactionType: TRANSACTION_TYPE;
  dueDate: string;
  paid: boolean;
  remainingBalance: string;
  penalized?: boolean | null;
  penaltyAmount?: number | null;
  waivedPenalty?: boolean | null;
  penaltyCount?: number | null;
  files: File[];
  ignored?: boolean | null;
};

export type PaymentsBreakdownResponse = {
  paymentType: PAYMENT_TYPE;
  downPaymentType?: DOWN_PAYMENT_TYPE | null;
  installmentType?: INSTALLMENT_TYPE | null;
  interest?: number | null;
  interestTotal?: number | null;
  miscellaneousAsLastPayment: boolean;
  paymentLastDate: string;
  sqm: number;
  sqmPrice: number;
  totalLotPrice: number;
  downPaymentTerms?: number | null;
  terms: number;
  miscellaneous: MISCELLANEOUS;
  miscellaneousTotal: number;
  totalDownPayment?: number | null;
  tcp: number;
  excessPayment: number;
  rfValidityStartDate: string;
  rfValidityEndDate: string;
  client: ClientResponse;
  project: ProjectResponse;
  phase: PhaseResponse;
  block: BlockResponse;
  lot: LotResponse;
  agent: AgentResponse;
  agentCommission: COMMISSION;
  agentCommissionTotal: number;
  status: CONTRACT_STATUS;
  paymentBreakdown: PaymentBreakdownProps[];
};

export const enum AGENT_COMMISSION_STATUS {
  PENDING = "PENDING",
  DELETED = "DELETED",
  CONTRACT_FORFEITED = "CONTRACT_FORFEITED",
  ON_GOING = "ON_GOING",
  DONE = "DONE",
}

export type QueryAgentCommissionsProps = QuerySearchProps & QueryIdProps;

export type AgentCommissionResponse = {
  id: string;
  agentId: string;
  contractId: string;
  terms: number | null;
  recurringReleaseDate: string | null;
  monthlyReleaseAmount: number | null;
  balance: number;
  status: STATUS;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  firstName: string;
  lastName: string;
  releaseEndDate: string | null;
  releaseStartDate: string | null;
  nextReleaseDate: string | null;
  contract: ContractResponse;
};

export type AgentCommissionBreakdownResponse = {
  dueDate: string;
  transactionType: TRANSACTION_TYPE;
  amount: number;
  paidAmount: number;
  paid: boolean;
  remainingBalance: number;
  files: File[];
};

export const enum REQUEST_MODULE {
  CLIENT = "CLIENT",
  RESERVATION = "RESERVATION",
  CONTRACT = "CONTRACT",
  PAYMENT = "PAYMENT",
  AGENT_COMMISSION = "AGENT_COMMISSION",
  FILE = "FILE",
}

export type RequestModuleProps = {
  module: REQUEST_MODULE;
};

export const enum REQUEST_TYPE {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export const enum REQUEST_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
}

export const enum REQUEST_REJECT_DELETE {
  REJECT = "REJECT",
  DELETE = "DELETE",
}

export type RequestResponse = (
  | (ClientResponse & { target: ClientResponse })
  | (ReservationResponse & { target: ReservationResponse })
  | (ContractResponse & { target: ContractResponse })
  | (Payment & { target: Payment })
  | (AgentCommissionResponse & { target: AgentCommissionResponse })
  | (File & { target: File })
) & {
  requestType: REQUEST_TYPE;
  createdBy: User;
  dateCreated: string;
  approvedBy?: User;
  rejectedBy?: User;
  status?: REQUEST_STATUS;
};

export type RequestIdProps = {
  requestId: string;
};

export type ApproveRequestProps = RequestIdProps & {
  module: REQUEST_MODULE;
};

export type RejectOrDeleteRequestProps = RequestIdProps & {
  module: REQUEST_MODULE;
  requestType: REQUEST_REJECT_DELETE;
};

export const enum MODULES {
  PROJECT = "PROJECT",
  RESERVATION = "RESERVATION",
  CLIENT = "CLIENT",
  AGENT = "AGENT",
  USER = "USER",
  CONTRACT = "CONTRACT",
  PAYMENT = "PAYMENT",
  AGENT_COMMISSION = "AGENT_COMMISSION",
}

export const enum AUDIT_ACTION {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export type AuditModuleProps = {
  module: MODULES;
};

export type AuditDetailsProps = AuditModuleProps & QueryIdProps;

export type AuditResponse = {
  id: string;
  action: AUDIT_ACTION;
  dateCreated: string;
  dateUpdated?: string;
  dateDeleted?: string;
  createdBy?: User;
};

export type AuditDetailsResponse = AuditResponse &
  (
    | (ProjectResponse & { target: ProjectResponse })
    | (ReservationResponse & { target: ReservationResponse })
    | (ClientResponse & { target: ClientResponse })
    | (AgentResponse & { target: AgentResponse })
    | (User & { target: User })
    | (ContractResponse & { target: ContractResponse })
    | (AgentCommissionResponse & { target: AgentCommissionResponse })
  ) & {
    createdBy?: User;
  };

export const enum NOTIFICATION_TYPE {
  EMAIL = "EMAIL",
}

export const enum NOTIFICATION_TITLE {
  MONTHLY_PAYMENT_REMINDER = "MONTHLY_PAYMENT_REMINDER",
}

export const enum NOTIFICATION_STATUS {
  UNREAD = "UNREAD",
  READ = "READ",
  DELETED = "DELETED",
}

export type NotificationsResponse = {
  id: string;
  type: NOTIFICATION_TYPE;
  title: NOTIFICATION_TITLE;
  description?: string;
  targetId: string;
  status: NOTIFICATION_STATUS;
  dateCreated: string;
};

export type NotificationCountAndListResponse = {
  count: number;
  list: NotificationsResponse[];
  more: number;
};

export type ResendData = {
  bcc: string[] | null;
  cc: string[] | null;
  created_at: string;
  from: string;
  html: string | null;
  id: string;
  last_event:
    | "bounced"
    | "canceled"
    | "clicked"
    | "complained"
    | "delivered"
    | "delivery_delayed"
    | "failed"
    | "opened"
    | "queued"
    | "scheduled"
    | "sent";
  reply_to: string[] | null;
  subject: string;
  text: string | null;
  to: string[];
  scheduled_at: string | null;
  object: "email";
};

export type EmailLogsResponse = {
  id: string;
  status: STATUS;
  clientId?: string | null;
  emailId: string;
  dateCreated: string;
  client?: ClientResponse | null;
  resendData: ResendData;
};

export type NotificationsQuery = {
  take?: number;
};

export type NotificationResponse = EmailLogsResponse;

export const getUserDetailsFn = apiRequest<null, User>(() => {
  return httpRequest().get(config.userDetails);
});

export const onLoginFn = apiRequest<LoginSchema, LoginResponse>(props => {
  return httpRequest().post(config.login, props);
});

export const onLogoutFn = apiRequest<null, string>(() => {
  return httpRequest().patch(config.logout);
});

export const onCreateProjectFn = apiRequest<StepsFormProps["formData"], string>(
  props => {
    return httpRequest().post(config.createProject, props);
  },
);

export const onGetProjectsFn = apiRequest<QuerySearchProps, ProjectResponse[]>(
  props => {
    return httpRequest().get(config.getProjects, { params: props });
  },
);

export const onGetProjectFn = apiRequest<QueryIdProps, ProjectResponse>(
  props => {
    const { id } = props || {};
    return httpRequest().get(`${config.getProjects}/${id}`);
  },
);

export const onUpdateProjectNameAndDescriptionFn = apiRequest<
  ProjectNameAndDescriptionProps,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(
    `${config.updateProjectNameAndDescription}/${id}`,
    rest,
  );
});

export const onUdpateProjectAddressDetailsFn = apiRequest<
  ProjectAddressDetailsProps,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(
    `${config.updateProjectAddressDetails}/${id}`,
    rest,
  );
});

export const onDeleteProjectFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().delete(`${config.deleteProject}/${id}`);
});

export const onUpdateLotFn = apiRequest<LotSchema, string>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(`${config.updateLot}/${id}`, rest);
});

export const onDeleteLotFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().delete(`${config.deleteLot}/${id}`);
});

export const onGetClientsFn = apiRequest<QuerySearchProps, ClientResponse[]>(
  props => {
    return httpRequest().get(config.getClients, { params: props });
  },
);

export const onCreateClientFn = apiRequest<ClientSchema, string>(props => {
  return httpRequest().post(config.createClient, props);
});

export const onCreateReservationFn = apiRequest<ReservationSchema, string>(
  props => {
    const { lotId, clientId, pfp, ...rest } = props || {};

    const formData = new FormData();
    pfp?.map(file => {
      formData.append("pfp", file);
    });

    Object.entries(rest).map(([key, val]) => {
      formData.append(key, val as string);
    });

    return httpRequest().post(
      `${config.createReservation}/${lotId}/${clientId}`,
      formData,
    );
  },
);

export const onGetReservationsFn = apiRequest<
  QuerySearchProps,
  ReservationResponse[]
>(props => {
  return httpRequest().get(config.getReservations, { params: props });
});

export const onGetReservationFn = apiRequest<QueryIdProps, ReservationResponse>(
  props => {
    const { id } = props || {};
    return httpRequest().get(`${config.getReservations}/${id}`);
  },
);

export const onUpdatePhaseTitleFn = apiRequest<PhaseTitleSchema, string>(
  props => {
    const { projectId, id, title } = props || {};
    return httpRequest().patch(
      `${config.updatePhaseTitle}/${projectId}/${id}`,
      { title },
    );
  },
);

export const onUpdateBlockTitleFn = apiRequest<BlockTitleSchema, string>(
  props => {
    const { id, title } = props || {};
    return httpRequest().patch(`${config.updateBlockTitle}/${id}`, { title });
  },
);

export const onAddLotFn = apiRequest<LotSchema, string>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().post(`${config.addLot}/${id}`, rest);
});

export const onAddBlockFn = apiRequest<AddBlockSchema, string>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().post(`${config.addBlock}/${id}`, rest);
});

export const onAddPhaseFn = apiRequest<AddPhase, string>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().post(`${config.addPhase}/${id}`, rest);
});

export const onUpdateThemeFn = apiRequest<UpdateThemeProps, string>(props => {
  return httpRequest().patch(config.updateTheme, props);
});

export const onCreateUserFn = apiRequest<UserSchema, string>(props => {
  return httpRequest().post(config.addUser, props);
});

export const onGetUsersFn = apiRequest<QuerySearchProps, User[]>(props => {
  return httpRequest().get(config.getUsers, { params: props });
});

export const onGetUserFn = apiRequest<QueryIdProps, User>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.getUsers}/${id}`);
});

export const onChangePasswordFn = apiRequest<ChangePasswordSchema, string>(
  props => {
    const { currentPassword, newPassword } = props || {};
    return httpRequest().patch(config.changePassword, {
      currentPassword,
      newPassword,
    });
  },
);

export const onCreateAgentFn = apiRequest<CreateAgentSchema, string>(props => {
  return httpRequest().post(config.createAgent, props);
});

export const onGetAgentsFn = apiRequest<QuerySearchProps, AgentResponse[]>(
  props => {
    return httpRequest().get(`${config.getAgents}`, { params: props });
  },
);

export const onGetAgentFn = apiRequest<QueryIdProps, AgentResponse>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.getAgents}/${id}`);
});

export const onUpdateUserAccessAndFunctionsFn = apiRequest<
  UpdateUserAccessAndFunctionsSchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(
    `${config.updateUserAccessAndFunction}/${id}`,
    rest,
  );
});

export const onUpdateUserAddressDetailsFn = apiRequest<
  ProjectAddressDetailsProps,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(`${config.userUpdateAddressDetails}/${id}`, rest);
});

export const onUpdateUserPersonalDetailsFn = apiRequest<
  PersonalDetailsSchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(`${config.userUpdatePersonalDetails}/${id}`, rest);
});

export const onDeleteUserFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().delete(`${config.deleteUser}/${id}`);
});

export const onGetClientLotReservationFn = apiRequest<
  ClientLotReservationProps,
  ReservationResponse
>(props => {
  const { clientId, lotId } = props || {};
  return httpRequest().get(
    `${config.clientLotReservation}/${clientId}/${lotId}`,
  );
});

export const onCreateContractCashPaymentFn = apiRequest<
  CashPaymentSchema,
  string
>(props => {
  const { clientId, lotId, agentId, ...rest } = props || {};
  return httpRequest().post(
    `${config.createContract}/${clientId}/${lotId}/${agentId}`,
    rest,
  );
});

export const onCreateContractPartialOrFullDownPaymentFn = apiRequest<
  PartialAndFullDownPaymentSchema,
  string
>(props => {
  const { clientId, lotId, agentId, ...rest } = props || {};
  return httpRequest().post(
    `${config.createContract}/${clientId}/${lotId}/${agentId}`,
    rest,
  );
});

export const onCreateContractStraightMonthlyPaymentFn = apiRequest<
  StraightMonthlyPaymentSchema,
  string
>(props => {
  const { clientId, lotId, agentId, ...rest } = props || {};
  return httpRequest().post(
    `${config.createContract}/${clientId}/${lotId}/${agentId}`,
    rest,
  );
});

export const onGetContractsFn = apiRequest<
  QuerySearchProps,
  ContractResponse[]
>(props => {
  return httpRequest().get(config.getContracts, { params: props });
});

export const onGetContractFn = apiRequest<QueryIdProps, ContractResponse>(
  props => {
    const { id } = props || {};
    return httpRequest().get(`${config.getContracts}/${id}`);
  },
);

export const onGetPaymentsBreakdownFn = apiRequest<
  ContractIdProps,
  PaymentsBreakdownResponse
>(props => {
  const { contractId } = props || {};
  return httpRequest().get(`${config.getPaymentsBreakdown}/${contractId}`);
});

export const onCreatePaymentFn = apiRequest<PayForDueDateSchema, string>(
  props => {
    const { contractId, pfp, ...rest } = props || {};
    const formData = new FormData();

    pfp?.map(file => {
      formData.append("pfp", file);
    });
    Object.entries(rest).map(([key, val]) => {
      formData.append(key, val as string);
    });

    return httpRequest().post(
      `${config.createPayment}/${contractId}`,
      formData,
    );
  },
);

export const onCreatePaymentAllRemainingDatesFn = apiRequest<
  PayForAllRemainingDatesSchema,
  string
>(props => {
  const { contractId, pfp, ...rest } = props || {};
  const formData = new FormData();

  pfp?.map(file => {
    formData.append("pfp", file);
  });
  Object.entries(rest).map(([key, val]) => {
    formData.append(key, val as string);
  });

  return httpRequest().post(
    `${config.payAllRemainingDates}/${contractId}`,
    formData,
  );
});

export const onGetPaymentFn = apiRequest<QueryIdProps, Payment>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.payments}/${id}`);
});

export const onAdjustReservationValidityFn = apiRequest<
  AdjustReservationValiditySchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(`${config.adjustReservationValidity}/${id}`, rest);
});

export const onDeleteContractFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().delete(`${config.deleteContract}/${id}`);
});

export const onDeleteReservationFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().delete(`${config.deleteReservation}/${id}`);
});

export const onUpdatePaymentFn = apiRequest<UpdatePaymentSchema, string>(
  props => {
    const { id, ...rest } = props || {};
    return httpRequest().patch(`${config.updatePayment}/${id}`, rest);
  },
);

export const onGetClientFn = apiRequest<QueryIdProps, ClientResponse>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.getClients}/${id}`);
});

export const onUpdateClientPersonalDetailsFn = apiRequest<
  ClientPersonalDetailsSchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(
    `${config.updateClientPersonalDetails}/${id}`,
    rest,
  );
});

export const onUpdateAgentPersonalDetailsFn = apiRequest<
  AgentPersonalDetailsSchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(
    `${config.updateAgentPersonalDetails}/${id}`,
    rest,
  );
});

export const onGetAgentCommissionsFn = apiRequest<
  QueryAgentCommissionsProps,
  AgentCommissionResponse[]
>(props => {
  const { id, search } = props || {};
  return httpRequest().get(`${config.getAgentCommissions}/${id}`, {
    params: { search },
  });
});

export const onGetAgentCommissionFn = apiRequest<
  QueryIdProps,
  AgentCommissionResponse
>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.getAgentCommission}/${id}`);
});

export const onGetAgentCommissionBreakdownFn = apiRequest<
  QueryIdProps,
  AgentCommissionBreakdownResponse[]
>(props => {
  const { id } = props || {};
  return httpRequest().get(`${config.getAgentCommissionBreakdown}/${id}`);
});

export const onStartAgentCommissionFn = apiRequest<
  StartCommissionSchema,
  string
>(props => {
  const { id, ...rest } = props || {};
  return httpRequest().patch(`${config.startAgentCommission}/${id}`, rest);
});

export const onReleaseAgentCommissionFn = apiRequest<
  ReleaseAgentCommissionSchema,
  string
>(props => {
  const { agentCommissionId, pfp, ...rest } = props || {};
  const formData = new FormData();

  pfp?.map(file => {
    formData.append("pfp", file);
  });
  Object.entries(rest).map(([key, val]) => {
    formData.append(key, val as string);
  });

  return httpRequest().post(
    `${config.releaseAgentCommission}/${agentCommissionId}`,
    formData,
  );
});

export const onAssignClientFn = apiRequest<AssignClientSchema, string>(
  props => {
    const { id, ...rest } = props || {};
    return httpRequest().patch(`${config.assignClient}/${id}`, rest);
  },
);

export const onAssignProjectFn = apiRequest<AssignProjectSchema, string>(
  props => {
    const { id, ...rest } = props || {};
    return httpRequest().patch(`${config.assignProject}/${id}`, rest);
  },
);

export const onGetUserClientsFn = apiRequest<QueryIdProps, ClientResponse[]>(
  props => {
    return httpRequest().get(config.getUserClients, { params: props });
  },
);

export const onGetUserProjectsFn = apiRequest<QueryIdProps, ProjectResponse[]>(
  props => {
    return httpRequest().get(config.getUserProjects, { params: props });
  },
);

export const onForfeitContractFn = apiRequest<QueryIdProps, string>(props => {
  const { id } = props || {};
  return httpRequest().patch(`${config.forfeitContract}/${id}`);
});

export const onGetRequestsFn = apiRequest<
  RequestModuleProps,
  RequestResponse[]
>(props => {
  const { module } = props || {};
  return httpRequest().get(`${config.getRequests}/${module}`);
});

export const onGetRequestDetailsFn = apiRequest<
  QueryIdAndModuleProps,
  RequestResponse
>(props => {
  const { module, id } = props || {};
  return httpRequest().get(`${config.getRequests}/${module}/${id}`);
});

export const onApproveRequestFn = apiRequest<ApproveRequestProps, string>(
  props => {
    const { requestId, module } = props || {};
    return httpRequest().post(`${config.approveRequest}/${requestId}`, {
      module,
    });
  },
);

export const onRejectOrDeleteRequestFn = apiRequest<
  RejectOrDeleteRequestProps,
  string
>(props => {
  const { requestId, ...rest } = props || {};
  return httpRequest().post(
    `${config.rejectOrDeleteRequest}/${requestId}`,
    rest,
  );
});

export const onGetAuditListFn = apiRequest<AuditModuleProps, AuditResponse[]>(
  props => {
    const { module } = props || {};
    return httpRequest().get(`${config.getAuditList}/${module}`);
  },
);

export const onGetAuditDetailsFn = apiRequest<
  AuditDetailsProps,
  AuditDetailsResponse
>(props => {
  const { id, module } = props || {};
  return httpRequest().get(`${config.getAudit}/${id}/${module}`);
});

export const onGetNotificationsFn = apiRequest<
  NotificationsQuery,
  NotificationCountAndListResponse
>(props => {
  return httpRequest().get(config.notifications, { params: props });
});

export const onGetNotification = apiRequest<QueryIdProps, EmailLogsResponse>(
  props => {
    const { id } = props || {};
    return httpRequest().get(`${config.notifications}/${id}`);
  },
);
