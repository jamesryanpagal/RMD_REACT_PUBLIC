import {
  AGENT_COMMISSION_STATUS,
  AUDIT_ACTION,
  COMMISSION,
  CONTRACT_STATUS,
  LOT_STATUS,
  MISCELLANEOUS,
  MODE_OF_PAYMENT,
  NOTIFICATION_TITLE,
  NOTIFICATION_TYPE,
  REQUEST_STATUS,
  REQUEST_TYPE,
  RESERVATION_STATUS,
} from "@/api/query-fn.api";
import type { BadgeVariants } from "@/components/ui/badge";
import { CircleAlert, CircleCheckBig, Loader, Mail, Trash } from "lucide-react";

export const enum STORAGE_KEY {
  THEME = "theme",
  ROLE = "role",
  MODULE_ACCESS = "module_access",
}

export const COLORS = {
  balticSea: "#232b2e",
  gunMetal: "#2E3440",
  funBlue: "#1959A8",
  dodgerBlue: "#3a86ff",
  blueKay: "#3d5371",
  riverBed: "#434C5F",
  mulledWine: "#4C566A",
  mediumTorquoise: "#3DC9EC",
  tropicalBlue: "#c7e0ff",
  white: "#ffffff",
  snowDrift: "#F7FAF7",
  dawnPink: "#ebebeb",
  mercury: "#e6e6e6",
  greyGoose: "#d1d1d1",
  paleSlate: "#bfbfbf",
  smokeyGrey: "#707070",
  steel: "#788290",
  liver: "#4d4d4d",
  dark: "#1B2431",
  cadmiumRed: "#E7000B",
  bitterSweet: "#FF6467",
  darkSpringGreen: "#2C6E49",
  atomicTangerine: "#f4a261",
  transparent: "transparent",
};

export const DEFAULTS = {
  deferredTime: 1000,
};

export const Regexp = {
  urlParams: /(\/\w+)|(\/)|(:\w+)/g,
  spaces: /(\s)/g,
  smallChar: /\w*[a-z]\w*/,
  capitalChar: /\w*[A-Z]\w*/,
  number: /\d/,
  specialChar: /[!@#$%^&*()\-_"=+{}; :,<.>]/,
  usMobileNumberRegex:
    /^(\+?1)?[-. ]?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/,
  alphanumericOnlyRegexWithHashOrDash: /^[a-zA-Z0-9\s#-]+$/,
  numberOnly: /\D/g,
  tabName: /tabName=([^&]*)/,
  localCurrency: /[₱,]/g,
  cleanTabLabel: /\?.*$/,
};

export const LOT_STATUS_THEME: Record<
  Exclude<LOT_STATUS, "DELETED">,
  BadgeVariants
> = {
  [LOT_STATUS.OPEN]: "secondary",
  [LOT_STATUS.PENDING]: "pending",
  [LOT_STATUS.CLOSED]: "destructive",
  [LOT_STATUS.SOLD]: "sold",
  [LOT_STATUS.ON_GOING]: "default",
};

export const RESERVATION_STATUS_THEME: Record<
  Exclude<RESERVATION_STATUS, "DELETED">,
  BadgeVariants
> = {
  [RESERVATION_STATUS.ACTIVE]: "default",
  [RESERVATION_STATUS.CONTRACT_FORFEITED]: "destructive",
  [RESERVATION_STATUS.DONE]: "sold",
  [RESERVATION_STATUS.FORFEITED]: "destructive",
  [RESERVATION_STATUS.CONTRACT_DELETED]: "destructive",
};

export const CONTRACT_STATUS_THEME: Record<
  Exclude<CONTRACT_STATUS, "DELETED">,
  BadgeVariants
> = {
  [CONTRACT_STATUS.ON_GOING]: "pending",
  [CONTRACT_STATUS.FORFEITED]: "destructive",
  [CONTRACT_STATUS.DONE]: "sold",
};

export const CONTRACT_STATUS_BG_COLOR: Record<
  Exclude<CONTRACT_STATUS, "DELETED">,
  string
> = {
  [CONTRACT_STATUS.ON_GOING]: "bg-mac-and-cheese",
  [CONTRACT_STATUS.FORFEITED]: "bg-destructive",
  [CONTRACT_STATUS.DONE]: "bg-success",
};

export const CONTRACT_STATUS_ICON: Record<
  Exclude<CONTRACT_STATUS, "DELETED">,
  React.ReactNode
> = {
  [CONTRACT_STATUS.ON_GOING]: <Loader className="text-white/95 size-10" />,
  [CONTRACT_STATUS.FORFEITED]: (
    <CircleAlert className="text-white/95 size-10" />
  ),
  [CONTRACT_STATUS.DONE]: <CircleCheckBig className="text-white/95 size-10" />,
};

export const MISCELLANEOUS_NUM_VALUE: Record<MISCELLANEOUS, number> = {
  [MISCELLANEOUS.ZERO]: 0,
  [MISCELLANEOUS.TEN]: 10,
};

export const COMMISSION_NUM_VALUE: Record<COMMISSION, number> = {
  [COMMISSION.FIVE]: 5,
  [COMMISSION.SEVEN]: 7,
  [COMMISSION.TEN]: 10,
  [COMMISSION.TWELVE]: 12,
  [COMMISSION.FIFTEEN]: 15,
};

export const MODE_OF_PAYMENT_TEXT: Record<MODE_OF_PAYMENT, string> = {
  [MODE_OF_PAYMENT.CASH]: "Cash / Cash Deposit",
  [MODE_OF_PAYMENT.CHEQUE]: "Cheque",
  [MODE_OF_PAYMENT.GCASH]: "GCash",
  [MODE_OF_PAYMENT.ONLINE_BANKING]: "Online Banking",
  [MODE_OF_PAYMENT.NONE]: "None",
};

export const AGENT_COMMISSION_STATUS_THEME: Record<
  Exclude<AGENT_COMMISSION_STATUS, "DELETED">,
  BadgeVariants
> = {
  [AGENT_COMMISSION_STATUS.PENDING]: "pending",
  [AGENT_COMMISSION_STATUS.CONTRACT_FORFEITED]: "destructive",
  [AGENT_COMMISSION_STATUS.ON_GOING]: "default",
  [AGENT_COMMISSION_STATUS.DONE]: "sold",
};

export const REQUEST_TYPE_VARIANT: Record<REQUEST_TYPE, BadgeVariants> = {
  [REQUEST_TYPE.ADD]: "sold",
  [REQUEST_TYPE.UPDATE]: "default",
  [REQUEST_TYPE.DELETE]: "destructive",
};

export const REQUEST_STATUS_VARIANT: Partial<
  Record<REQUEST_STATUS, BadgeVariants>
> = {
  [REQUEST_STATUS.PENDING]: "pending",
  [REQUEST_STATUS.APPROVED]: "sold",
  [REQUEST_STATUS.REJECTED]: "destructive",
  [REQUEST_STATUS.DELETED]: "destructive",
};

export const REQUEST_STATUS_ICON: Partial<
  Record<REQUEST_STATUS, React.ReactNode>
> = {
  [REQUEST_STATUS.PENDING]: <Loader className="text-white/95 size-10" />,
  [REQUEST_STATUS.APPROVED]: (
    <CircleCheckBig className="text-white/95 size-10" />
  ),
  [REQUEST_STATUS.REJECTED]: <CircleAlert className="text-white/95 size-10" />,
  [REQUEST_STATUS.DELETED]: <Trash className="text-white/95 size-10" />,
};

export const AUDIT_ACTION_VARIANT: Record<AUDIT_ACTION, BadgeVariants> = {
  [AUDIT_ACTION.CREATE]: "sold",
  [AUDIT_ACTION.UPDATE]: "default",
  [AUDIT_ACTION.DELETE]: "destructive",
};

export const NOTIFICATION_TITLE_TEXT: Record<NOTIFICATION_TITLE, string> = {
  [NOTIFICATION_TITLE.MONTHLY_PAYMENT_REMINDER]: "Monthly Payment Reminder",
};

export const NOTIFICATION_TYPE_ICON: Record<
  NOTIFICATION_TYPE,
  React.ReactNode
> = {
  [NOTIFICATION_TYPE.EMAIL]: <Mail className="size-8 mr-1.5" />,
};
