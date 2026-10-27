// const ENV_PREFIX = "VITE_";
// ? DEV | PROD
const enum ENVIRONMENT {
  PROD = "PROD",
  DEV = "DEV",
}

const CURRENT_ENVIRONMENT: ENVIRONMENT = ENVIRONMENT.DEV;

// const enum ENV_KEY {}

type PlatformbaseConfig = {
  baseUrl: string;
  socketUrl: string;
};

type Config = {
  refreshToken: string;
  userDetails: string;
  login: string;
  logout: string;
  createProject: string;
  getProjects: string;
  updateProjectNameAndDescription: string;
  updateProjectAddressDetails: string;
  deleteProject: string;
  updateLot: string;
  deleteLot: string;
  getClients: string;
  createClient: string;
  createReservation: string;
  getReservations: string;
  updatePhaseTitle: string;
  updateBlockTitle: string;
  addLot: string;
  addBlock: string;
  addPhase: string;
  updateTheme: string;
  addUser: string;
  getUsers: string;
  changePassword: string;
  createAgent: string;
  getAgents: string;
  updateUserAccessAndFunction: string;
  userUpdateAddressDetails: string;
  userUpdatePersonalDetails: string;
  deleteUser: string;
  clientLotReservation: string;
  createContract: string;
  getContracts: string;
  getPaymentsBreakdown: string;
  createPayment: string;
  payments: string;
  adjustReservationValidity: string;
  deleteContract: string;
  deleteReservation: string;
  updatePayment: string;
  updateClientPersonalDetails: string;
  updateAgentPersonalDetails: string;
  getAgentCommissions: string;
  getAgentCommission: string;
  getAgentCommissionBreakdown: string;
  startAgentCommission: string;
  releaseAgentCommission: string;
  assignClient: string;
  assignProject: string;
  getUserClients: string;
  getUserProjects: string;
  forfeitContract: string;
  payAllRemainingDates: string;
  getRequests: string;
  approveRequest: string;
  rejectOrDeleteRequest: string;
  getAuditList: string;
  getAudit: string;
  notifications: string;
};

const enum ENVIRONMENT_VAL {
  PROD = "PROD",
  DEV = "DEV",
}

// ? use this when there are sensitive info like api-key.
// ? this will get the env value stored in github secrets.
// ? uncomment also ENV_PREFIX and ENV_KEY as those are dependents of this method.
// const loadEnv = (key: ENV_KEY): string => {
//   const formattedEndPoint = `${ENV_PREFIX}${key}`;
//   return import.meta.env[formattedEndPoint];
// };

const platformBaseConfig: Record<ENVIRONMENT_VAL, PlatformbaseConfig> = {
  [ENVIRONMENT_VAL.PROD]: {
    baseUrl: "https://api.example.com/api/",
    socketUrl: "https://api.example.com",
  },
  [ENVIRONMENT_VAL.DEV]: {
    baseUrl: "http://localhost:4000/api/",
    socketUrl: "http://localhost:4000",
  },
};

const envConfig: Record<keyof Config, string> = {
  refreshToken: "auth/jwt/refresh",
  userDetails: "users/details",
  login: "auth/login",
  logout: "auth/logout",
  createProject: "projects/create",
  getProjects: "projects",
  updateProjectNameAndDescription: "projects/update/name/and/description",
  updateProjectAddressDetails: "projects/update/address/details",
  deleteProject: "projects/delete",
  updateLot: "projects/update/lot",
  deleteLot: "projects/delete/lot",
  getClients: "clients",
  createClient: "clients/create",
  createReservation: "reservations/create",
  getReservations: "reservations",
  updatePhaseTitle: "projects/update/phase",
  updateBlockTitle: "projects/update/block",
  addLot: "projects/add/lot",
  addBlock: "projects/add/block",
  addPhase: "projects/add/phase",
  updateTheme: "settings/update/theme",
  addUser: "auth/create/account",
  getUsers: "users",
  changePassword: "users/change/password",
  createAgent: "agents/create",
  getAgents: "agents",
  updateUserAccessAndFunction: "users/update/access/functions",
  userUpdateAddressDetails: "users/update/address/details",
  userUpdatePersonalDetails: "users/update/personal/details",
  deleteUser: "users/delete",
  clientLotReservation: "reservations/client/lot",
  createContract: "contracts/create",
  getContracts: "contracts",
  getPaymentsBreakdown: "payments/breakdown",
  createPayment: "payments/create",
  payments: "payments",
  adjustReservationValidity: "payments/adjust/reservation/validity",
  deleteContract: "contracts/delete",
  deleteReservation: "reservations/delete",
  updatePayment: "payments/update",
  updateClientPersonalDetails: "clients/update",
  updateAgentPersonalDetails: "agents/update",
  getAgentCommissions: "agent-commissions/agents",
  getAgentCommission: "agent-commissions",
  getAgentCommissionBreakdown: "payments/agent/commissions/breakdown",
  startAgentCommission: "agent-commissions/start",
  releaseAgentCommission: "payments/release/agent/commission",
  assignClient: "users/assign/client",
  assignProject: "users/assign/project",
  getUserClients: "users/clients",
  getUserProjects: "users/projects",
  forfeitContract: "contracts/forfeit",
  payAllRemainingDates: "payments/create/all/remaining/dates",
  getRequests: "requests",
  approveRequest: "requests/approve",
  rejectOrDeleteRequest: "requests/reject/or/delete",
  getAuditList: "audit/list",
  getAudit: "audit",
  notifications: "notifications",
};

const config: Record<keyof (PlatformbaseConfig & Config), string> = {
  ...platformBaseConfig[CURRENT_ENVIRONMENT],
  ...envConfig,
};

export default config;
