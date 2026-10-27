import {
  COMMISSION,
  DOWN_PAYMENT_TYPE,
  INSTALLMENT_TYPE,
  MISCELLANEOUS,
  MODE_OF_PAYMENT,
  MODULE_ACCESS,
  MODULE_FUNCTION,
  PAYMENT_TYPE,
  TRANSACTION_TYPE,
} from "@/api/query-fn.api";
import { z } from "zod";
import { USER_ROLE } from "./type";
import { Regexp } from "./constants";

const { smallChar, capitalChar, number, specialChar } = Regexp;

export type LoginSchema = z.infer<typeof loginSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type PhaseSchema = z.infer<typeof phaseSchema>;
export type BlockSchema = z.infer<typeof blockSchema>;
export type ProjectNameAndDescriptionSchema = z.infer<
  typeof projectNameAndDescriptionSchema
>;
export type ProjectAddressDetailsSchema = z.infer<
  typeof projectAddressDetailsSchema
>;
export type LotSchema = z.infer<typeof lotSchema>;
export type ReservationSchema = z.infer<typeof reservationSchema>;
export type ClientSchema = z.infer<typeof clientSchema>;
export type PhaseTitleSchema = z.infer<typeof phaseTitleSchema>;
export type BlockTitleSchema = z.infer<typeof blockTitleSchema>;
export type AddBlockSchema = z.infer<typeof addBlockSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type CreateAgentSchema = z.infer<typeof createAgentSchema>;
export type UpdateUserAccessAndFunctionsSchema = z.infer<
  typeof updateUserAccessAndFunctionsSchema
>;
export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;
export type CashPaymentSchema = z.infer<typeof cashPaymentSchema>;
export type PayForDueDateSchema = z.infer<typeof payForDueDateSchema>;
export type PayForAllRemainingDatesSchema = z.infer<
  typeof payForAllRemainingDatesSchema
>;
export type ReleaseAgentCommissionSchema = z.infer<
  typeof releaseAgentCommissionSchema
>;
export type PartialAndFullDownPaymentSchema = z.infer<
  typeof partialAndFullDownPaymentSchema
>;
export type StraightMonthlyPaymentSchema = z.infer<
  typeof straightMonthlyPaymentSchema
>;
export type AdjustReservationValiditySchema = z.infer<
  typeof adjustReservationValiditySchema
>;
export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;
export type ClientPersonalDetailsSchema = z.infer<
  typeof clientPersonalDetailsSchema
>;
export type AgentPersonalDetailsSchema = z.infer<
  typeof agentPersonalDetailsSchema
>;
export type StartCommissionSchema = z.infer<typeof startCommissionSchema>;
export type AssignClientSchema = z.infer<typeof assignClientSchema>;
export type AssignProjectSchema = z.infer<typeof assignProjectSchema>;

export const assignProjectSchema = z.object({
  id: z.string().min(1, "Id is required"),
  projectIds: z.array(z.string()),
});

export const assignClientSchema = z.object({
  id: z.string().min(1, "Id is required"),
  clientIds: z.array(z.string()),
});

export const startCommissionSchema = z.object({
  id: z.string().min(1, "Id is required"),
  terms: z.number().min(1, "Terms is required"),
  releaseStartDate: z.string().min(1, "Release date is required"),
});

export const agentPersonalDetailsSchema = z.object({
  id: z.string().min(1, "Id is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
});

export const clientPersonalDetailsSchema = z.object({
  id: z.string().min(1, "Id is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email({ error: "Invalid email address" }),
  contactNumber: z.string().min(1, "Contact number is required"),
  tinNumber: z.string().min(1, "Tin number is required"),
  houseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  subdivision: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  zip: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  id: z.string().min(1, "Id is required"),
  amount: z.number(),
  paymentDate: z.string().min(1, "Payment date is required"),
  modeOfPayment: z
    .enum([
      MODE_OF_PAYMENT.CASH,
      MODE_OF_PAYMENT.CHEQUE,
      MODE_OF_PAYMENT.GCASH,
      MODE_OF_PAYMENT.ONLINE_BANKING,
      MODE_OF_PAYMENT.NONE,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Mode of payment is required",
    }),
  referenceNumber: z.string().optional(),
});

export const adjustReservationValiditySchema = z.object({
  id: z.string().min(1, "Id is required"),
  validity: z.string().min(1, "Validity Date is required"),
});

export const straightMonthlyPaymentSchema = z.object({
  sqmPrice: z.number().min(1, "SQM price is required"),
  totalLotPrice: z.number().min(1, "Total lot price is required"),
  miscellaneous: z
    .enum([MISCELLANEOUS.ZERO, MISCELLANEOUS.TEN])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Miscellaneous is required",
    }),
  miscellaneousTotal: z.number(),
  agentCommission: z
    .enum([
      COMMISSION.FIVE,
      COMMISSION.SEVEN,
      COMMISSION.TEN,
      COMMISSION.TWELVE,
      COMMISSION.FIFTEEN,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Agent commission is required",
    }),
  agentCommissionTotal: z.number().min(1, "Agent commission total is required"),
  tcp: z.number().min(1, "TCP is required"),
  paymentType: z.enum([PAYMENT_TYPE.CASH, PAYMENT_TYPE.INSTALLMENT]),
  agentId: z.string().min(1, "Agent is required"),
  clientId: z.string().min(1, "Client is required"),
  lotId: z.string().min(1, "Lot is required"),
  terms: z.number().min(1, "Terms is required"),
  paymentStartDate: z.string().optional(),
  interest: z.number(),
  installmentType: z.enum([INSTALLMENT_TYPE.STRAIGHT_MONTHLY_PAYMENT]),
  miscellaneousAsLastPayment: z.boolean(),
});

export const partialAndFullDownPaymentSchema = z
  .object({
    sqmPrice: z.number().min(1, "SQM price is required"),
    totalLotPrice: z.number().min(1, "Total lot price is required"),
    miscellaneous: z
      .enum([MISCELLANEOUS.ZERO, MISCELLANEOUS.TEN])
      .nullable()
      .refine(val => val !== null && val !== undefined, {
        error: "Miscellaneous is required",
      }),
    miscellaneousTotal: z.number(),
    agentCommission: z
      .enum([
        COMMISSION.FIVE,
        COMMISSION.SEVEN,
        COMMISSION.TEN,
        COMMISSION.TWELVE,
        COMMISSION.FIFTEEN,
      ])
      .nullable()
      .refine(val => val !== null && val !== undefined, {
        error: "Agent commission is required",
      }),
    agentCommissionTotal: z
      .number()
      .min(1, "Agent commission total is required"),
    tcp: z.number().min(1, "TCP is required"),
    paymentType: z.enum([PAYMENT_TYPE.CASH, PAYMENT_TYPE.INSTALLMENT]),
    agentId: z.string().min(1, "Agent is required"),
    clientId: z.string().min(1, "Client is required"),
    lotId: z.string().min(1, "Lot is required"),
    downPayment: z.number().min(1, "Down payment is required"),
    downPaymentType: z
      .enum([
        DOWN_PAYMENT_TYPE.FULL_DOWN_PAYMENT,
        DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT,
      ])
      .nullable()
      .refine(val => val !== null && val !== undefined, {
        error: "Down payment type is required",
      }),
    downPaymentTerms: z.number().nullable().optional(),
    terms: z.number().min(1, "Terms is required"),
    paymentStartDate: z.string().optional(),
    miscellaneousAsLastPayment: z.boolean(),
  })
  .refine(
    data => {
      if (data.downPaymentType === DOWN_PAYMENT_TYPE.PARTIAL_DOWN_PAYMENT) {
        return (
          data.downPaymentTerms !== null &&
          data.downPaymentTerms !== undefined &&
          data.downPaymentTerms >= 1
        );
      }
      return true;
    },
    {
      message: "Down payment terms is required",
      path: ["downPaymentTerms"],
    },
  );

export const cashPaymentSchema = z.object({
  sqmPrice: z.number().min(1, "SQM price is required"),
  totalLotPrice: z.number().min(1, "Total lot price is required"),
  miscellaneous: z
    .enum([MISCELLANEOUS.ZERO, MISCELLANEOUS.TEN])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Miscellaneous is required",
    }),
  miscellaneousTotal: z.number(),
  agentCommission: z
    .enum([
      COMMISSION.FIVE,
      COMMISSION.SEVEN,
      COMMISSION.TEN,
      COMMISSION.TWELVE,
      COMMISSION.FIFTEEN,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Agent commission is required",
    }),
  agentCommissionTotal: z.number().min(1, "Agent commission total is required"),
  tcp: z.number().min(1, "TCP is required"),
  paymentType: z.enum([PAYMENT_TYPE.CASH, PAYMENT_TYPE.INSTALLMENT]),
  agentId: z.string().min(1, "Agent is required"),
  clientId: z.string().min(1, "Client is required"),
  lotId: z.string().min(1, "Lot is required"),
});

export const releaseAgentCommissionSchema = z.object({
  agentCommissionId: z.string().min(1, "Contract id is required"),
  pfp: z.array(z.file()).optional(),
  modeOfPayment: z
    .enum([
      MODE_OF_PAYMENT.CASH,
      MODE_OF_PAYMENT.CHEQUE,
      MODE_OF_PAYMENT.GCASH,
      MODE_OF_PAYMENT.ONLINE_BANKING,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Mode of payment is required",
    }),
  paymentDate: z.string().min(1, "Payment date is required"),
  amount: z.number().min(1, "Amount is required"),
  transactionType: z
    .enum([
      TRANSACTION_TYPE.HOLDING_FEE,
      TRANSACTION_TYPE.RESERVATION_FEE,
      TRANSACTION_TYPE.PARTIAL_DOWN_PAYMENT,
      TRANSACTION_TYPE.FULL_DOWN_PAYMENT,
      TRANSACTION_TYPE.MONTHLY_PAYMENT,
      TRANSACTION_TYPE.TCP_FULL_PAYMENT,
      TRANSACTION_TYPE.DOWN_PAYMENT,
      TRANSACTION_TYPE.SURVEY_FEE,
      TRANSACTION_TYPE.AGENT_COMMISSION_RELEASE,
      TRANSACTION_TYPE.FULL_PAYMENT,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Transaction type is required",
    }),
  referenceNumber: z.string().optional(),
});

export const payForAllRemainingDatesSchema = z.object({
  contractId: z.string().min(1, "Contract id is required"),
  pfp: z.array(z.file()).optional(),
  modeOfPayment: z
    .enum([
      MODE_OF_PAYMENT.CASH,
      MODE_OF_PAYMENT.CHEQUE,
      MODE_OF_PAYMENT.GCASH,
      MODE_OF_PAYMENT.ONLINE_BANKING,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Mode of payment is required",
    }),
  paymentDate: z.string().min(1, "Payment date is required"),
  amount: z.number().min(1, "Amount is required"),
  transactionType: z
    .enum([
      TRANSACTION_TYPE.HOLDING_FEE,
      TRANSACTION_TYPE.RESERVATION_FEE,
      TRANSACTION_TYPE.PARTIAL_DOWN_PAYMENT,
      TRANSACTION_TYPE.FULL_DOWN_PAYMENT,
      TRANSACTION_TYPE.MONTHLY_PAYMENT,
      TRANSACTION_TYPE.TCP_FULL_PAYMENT,
      TRANSACTION_TYPE.DOWN_PAYMENT,
      TRANSACTION_TYPE.SURVEY_FEE,
      TRANSACTION_TYPE.AGENT_COMMISSION_RELEASE,
      TRANSACTION_TYPE.FULL_PAYMENT,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Transaction type is required",
    }),
  referenceNumber: z.string().optional(),
  penaltyAmount: z.number().nullable().optional(),
  waivePenalty: z.boolean().nullable().optional(),
  waivedReason: z.string().nullable().optional(),
  discount: z.number().nullable().optional(),
});

export const payForDueDateSchema = z.object({
  contractId: z.string().min(1, "Contract id is required"),
  pfp: z.array(z.file()).optional(),
  modeOfPayment: z
    .enum([
      MODE_OF_PAYMENT.CASH,
      MODE_OF_PAYMENT.CHEQUE,
      MODE_OF_PAYMENT.GCASH,
      MODE_OF_PAYMENT.ONLINE_BANKING,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Mode of payment is required",
    }),
  paymentDate: z.string().min(1, "Payment date is required"),
  amount: z.number().min(1, "Amount is required"),
  transactionType: z
    .enum([
      TRANSACTION_TYPE.HOLDING_FEE,
      TRANSACTION_TYPE.RESERVATION_FEE,
      TRANSACTION_TYPE.PARTIAL_DOWN_PAYMENT,
      TRANSACTION_TYPE.FULL_DOWN_PAYMENT,
      TRANSACTION_TYPE.MONTHLY_PAYMENT,
      TRANSACTION_TYPE.TCP_FULL_PAYMENT,
      TRANSACTION_TYPE.DOWN_PAYMENT,
      TRANSACTION_TYPE.SURVEY_FEE,
      TRANSACTION_TYPE.AGENT_COMMISSION_RELEASE,
      TRANSACTION_TYPE.FULL_PAYMENT,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Transaction type is required",
    }),
  referenceNumber: z.string().optional(),
  waivePenalty: z.boolean().nullable().optional(),
  waivedReason: z.string().nullable().optional(),
});

export const personalDetailsSchema = z.object({
  id: z.string().min(1, "Id is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email(),
  mobile: z.string().min(1, "Mobile number is required"),
  phone: z.string().optional(),
});

export const updateUserAccessAndFunctionsSchema = z.object({
  id: z.string().min(1, "Id is required"),
  moduleAccess: z
    .array(
      z.enum([
        MODULE_ACCESS.PROJECTS,
        MODULE_ACCESS.PHASE,
        MODULE_ACCESS.BLOCK,
        MODULE_ACCESS.LOT,
        MODULE_ACCESS.RESERVATIONS,
        MODULE_ACCESS.CLIENTS,
        MODULE_ACCESS.AGENTS,
        MODULE_ACCESS.CONTRACTS,
        MODULE_ACCESS.AUDITTRAIL,
        MODULE_ACCESS.REQUESTS,
        MODULE_ACCESS.USERS,
      ]),
    )
    .refine(val => val.length !== 0, {
      error: "At least one module access is required",
    }),
  moduleFunction: z.array(
    z.enum([
      MODULE_FUNCTION.CAN_CREATE_PROJECTS,
      MODULE_FUNCTION.CAN_UPDATE_PROJECTS,
      MODULE_FUNCTION.CAN_DELETE_PROJECTS,
    ]),
  ),
});

export const createAgentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Atleast 6 characters long")
      .regex(smallChar, "Atleast 1 small character")
      .regex(capitalChar, "Atleast 1 capital character")
      .regex(number, "Atleast 1 numeric character")
      .regex(specialChar, "Atleast 1 special character"),
    confirmNewPassword: z.string(),
  })
  .refine(val => val.newPassword === val.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email(),
  phone: z.string().optional(),
  mobile: z.string().min(1, "Mobile number is required"),
  houseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  subdivision: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  zip: z.string().optional(),
  role: z
    .enum([USER_ROLE.ADMIN, USER_ROLE.SECRETARY])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Role is required",
    }),
  moduleAccess: z
    .array(
      z.enum([
        MODULE_ACCESS.PROJECTS,
        MODULE_ACCESS.PHASE,
        MODULE_ACCESS.BLOCK,
        MODULE_ACCESS.LOT,
        MODULE_ACCESS.RESERVATIONS,
        MODULE_ACCESS.CLIENTS,
        MODULE_ACCESS.AGENTS,
        MODULE_ACCESS.CONTRACTS,
        MODULE_ACCESS.AUDITTRAIL,
        MODULE_ACCESS.REQUESTS,
        MODULE_ACCESS.USERS,
      ]),
    )
    .refine(val => val.length !== 0, {
      error: "At least one module access is required",
    }),
  moduleFunction: z.array(
    z.enum([
      MODULE_FUNCTION.CAN_CREATE_PROJECTS,
      MODULE_FUNCTION.CAN_UPDATE_PROJECTS,
      MODULE_FUNCTION.CAN_DELETE_PROJECTS,
    ]),
  ),
});

export const addBlockSchema = z.object({
  id: z.string().min(1, "Id is required"),
  title: z.string().min(1, "Title is required"),
  lot: z.number().refine(val => val >= 1 && val !== null, {
    error: "Invalid lot",
  }),
});

export const phaseTitleSchema = z.object({
  projectId: z.string().min(1, "Project id is required"),
  id: z.string().min(1, "Id is required"),
  title: z.string().min(1, "Title is required"),
});

export const blockTitleSchema = z.object({
  id: z.string().min(1, "Id is required"),
  title: z.string().min(1, "Title is required"),
});

export const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email(),
  contactNumber: z.string().min(1, "Contact number is required"),
  tinNumber: z.string().min(1, "Tin number is required"),
  houseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  subdivision: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  zip: z.string().optional(),
});

export const reservationSchema = z.object({
  lotId: z.string().min(1, "Lot is required"),
  clientId: z.string().min(1, "Client is required"),
  pfp: z.array(z.file()).optional(),
  modeOfPayment: z
    .enum([
      MODE_OF_PAYMENT.CASH,
      MODE_OF_PAYMENT.CHEQUE,
      MODE_OF_PAYMENT.GCASH,
      MODE_OF_PAYMENT.ONLINE_BANKING,
    ])
    .nullable()
    .refine(val => val !== null && val !== undefined, {
      error: "Mode of payment is required",
    }),
  paymentDate: z.string().min(1, "Payment date is required"),
  amount: z
    .number()
    .nullable()
    .refine(val => val !== null, { error: "Amount is required" }),
  referenceNumber: z.string().optional(),
});

export const lotSchema = z.object({
  id: z.string().min(1, "Lot ID is required"),
  title: z.string().min(1, "Title is required"),
  sqm: z.number().refine(val => val >= 1 && val !== null, {
    error: "Invalid sqm",
  }),
});

export const loginSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
});

export const blockSchema = z.object({
  title: z.string().min(1, "Block title is required"),
  lot: z.number().min(1, "Lot is required"),
});

export const phaseSchema = z.object({
  title: z.string().min(1, "Phase title is required"),
  block: blockSchema.array().min(1, "At least one block is required"),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  houseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  subdivision: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  zip: z.string().optional(),
});

export const projectNameAndDescriptionSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export const projectAddressDetailsSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  houseNumber: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  subdivision: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  zip: z.string().optional(),
});
