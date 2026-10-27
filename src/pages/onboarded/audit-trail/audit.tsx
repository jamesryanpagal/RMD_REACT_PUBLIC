import {
  AUDIT_ACTION,
  MODULES,
  type AgentCommissionResponse,
  type AgentResponse,
  type AuditDetailsResponse,
  type ClientResponse,
  type ContractResponse,
  type Payment,
  type ProjectResponse,
  type QueryIdProps,
  type ReservationResponse,
  type User,
} from "@/api/query-fn.api";
import Container from "@/components/container";
import ImagePreview from "@/components/image-preview";
import { Text, TextSmall, Title } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { ProjectLoading } from "@/components/ui/skeleton";
import { useGetAuditDetails } from "@/hooks/queries/useAudit";
import { cn } from "@/lib/utils";
import { AGENT_COMMISSION_STATUS_THEME, RESERVATION_STATUS_THEME } from "@/utils/constants";
import {
  onFormatFullName,
  onFormatNumber,
  onOmitProperties,
  onToLocalCurrency,
  onToPascalCase,
} from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

type AuditDetailsProps = Omit<AuditDetailsResponse, "target" | "createdBy">;

const ClientDetails = (props: AuditDetailsProps) => {
  const {
    firstName,
    middleName,
    lastName,
    tinNumber,
    houseNumber,
    street,
    subdivision,
    barangay,
    city,
    province,
    zip,
    region,
  } = props as unknown as ClientResponse;
  return (
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
        <TextSmall secondary>First Name</TextSmall>
        <Text>{firstName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Middle</TextSmall>
        <Text>{middleName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Last Name</TextSmall>
        <Text>{lastName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>TIN #</TextSmall>
        <Text>{tinNumber || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>House #</TextSmall>
        <Text>{houseNumber || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Street</TextSmall>
        <Text>{street}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Subdivision</TextSmall>
        <Text>{subdivision || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Barangay</TextSmall>
        <Text>{barangay}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>City</TextSmall>
        <Text>{city}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Province</TextSmall>
        <Text>{province || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Zip Code</TextSmall>
        <Text>{zip || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Region</TextSmall>
        <Text>{region}</Text>
      </Container>
    </Container>
  );
};

const ProjectDetails = (props: AuditDetailsProps) => {
  const {
    project,
  } = props as unknown as ProjectResponse & { project: ProjectResponse }

  const {
    projectName,
    description,
    houseNumber,
    street,
    subdivision,
    barangay,
    city,
    province,
    zip,
    region,
    phase
  } = project;

  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
        gap="none"
      >
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Project Name</TextSmall>
          <Text>{onToPascalCase(projectName) || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Project Description</TextSmall>
          <Text>{description || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1 col-span-2 md:col-span-3 lg:col-span-4"
        >
          <TextSmall secondary>Phase(s), Block(s) & Lot(s)</TextSmall>
          <Container padding="none" flexDisplay gap="none">
            {phase.map(({ id: phaseId, title: phaseTitle, block }) => {
              return (
                <Container padding="none" flexDisplay gap="none" key={phaseId}>
                  <Badge variant="secondary">{phaseTitle}</Badge>
                  <Container padding="none" flexDisplay gap="none">
                    {block.map(({ id: blockId, title: blockTitle, lot }, blockIndex, blockArr) => {
                      const isLastBlock = (blockIndex + 1) === blockArr.length;
                      return (
                        <Container cornerRadius="none" padding="none" flexDisplay flexDirection="row" gap="sm" key={blockId}>
                          <Container padding="none" cornerRadius="none" className="w-10 relative ml-5">
                            <Container padding="none" cornerRadius="none" className={cn("absolute top-0 left-0 w-0.5 bg-black/70", isLastBlock ? "h-1/2" : "h-full")} />
                            <Container padding="none" cornerRadius="none" className="absolute top-1/2 -translate-y-1/2 h-0.5 w-full bg-black/70" />
                          </Container>
                          <Container cornerRadius="none" padding="none" flexDisplay gap="none" className="flex-1 mb-2">
                            <Badge variant="secondary">{blockTitle}</Badge>
                            <Container padding="none" flexDisplay flexDirection="row" alignItems="center" gap="none" className="flex-wrap gap-y-1 ml-2 mt-1" >
                              <TextSmall secondary>Lot(s): {lot.map(({ title: lotTitle }) => lotTitle).join(", ")}</TextSmall>
                            </Container>
                          </Container>
                        </Container>
                      )
                    })}
                  </Container>
                </Container>
              )
            })}
          </Container>
        </Container>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3"
        gap="none"
      >
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Address Details</Title>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>House #</TextSmall>
          <Text>{houseNumber || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Street</TextSmall>
          <Text>{street || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Subdivision</TextSmall>
          <Text>{subdivision || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Barangay</TextSmall>
          <Text>{barangay || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>City</TextSmall>
          <Text>{city || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Province</TextSmall>
          <Text>{province || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Zip Code</TextSmall>
          <Text>{zip || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Region</TextSmall>
          <Text>{region || "N/A"}</Text>
        </Container>
      </Container>
    </>
  )
};

const ReservationDetails = (props: AuditDetailsProps) => {
  const {
    reservation,
  } = props as unknown as ReservationResponse & { reservation: ReservationResponse };

  const { validity, client, status, payment } = reservation;

  const { firstName, middleName, lastName } = client;

  const { amount, modeOfPayment, transactionType, referenceNumber, receiptNo, paymentDate, files, penalized, penaltyAmount, waivedPenalty, waivedReason } = payment;

  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
        gap="none"
      >
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Client</TextSmall>
          <Text>{onFormatFullName(firstName, lastName, middleName)}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Validity</TextSmall>
          <Text>{mtz(validity, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Status</TextSmall>
          <Badge variant={RESERVATION_STATUS_THEME[status]}>{onToPascalCase(status)}</Badge>
        </Container>
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Payment Details</Title>
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
    </>
  )
};

const AgentDetails = (props: AuditDetailsProps) => {
  const { firstName, middleName, lastName, birthDate } = props as unknown as AgentResponse;
  return (
    <Container
      padding="none"
      cornerRadius="none"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
      gap="none"
    >
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Firstname</TextSmall>
        <Text>{firstName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Middle</TextSmall>
        <Text>{middleName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Lastname</TextSmall>
        <Text>{lastName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Birth Date</TextSmall>
        <Text>{mtz(birthDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
      </Container>
    </Container>
  );
};

const UserDetails = (props: AuditDetailsProps) => {
  const { firstName, middleName, lastName, houseNumber, street, subdivision, barangay, city, province, zip, region } = props as unknown as User;
  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
        gap="none"
      >
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Firstname</TextSmall>
          <Text>{firstName || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Middle</TextSmall>
          <Text>{middleName || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Lastname</TextSmall>
          <Text>{lastName || "N/A"}</Text>
        </Container>
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Address Details</Title>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>House #</TextSmall>
          <Text>{houseNumber || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Street</TextSmall>
          <Text>{street || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Subdivision</TextSmall>
          <Text>{subdivision || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Barangay</TextSmall>
          <Text>{barangay || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>City</TextSmall>
          <Text>{city || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Province</TextSmall>
          <Text>{province || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Zip Code</TextSmall>
          <Text>{zip || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Region</TextSmall>
          <Text>{region || "N/A"}</Text>
        </Container>
      </Container>
    </>
  );
};

const ContractDetails = (props: AuditDetailsProps) => {
  const { contract } = props as unknown as ContractResponse & { contract: ContractResponse };

  const { client, lot, } = contract;

  const { firstName, middleName, lastName } = client;

  const { title: lotTitle, sqm, block } = lot;
  const { title: blockTitle, phase } = block;
  const { title: phaseTitle, project } = phase;
  const { projectName, description, houseNumber, street, barangay, subdivision, city, province, region, zip } = project;

  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
        gap="none"
      >
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Client Details</Title>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Firstname</TextSmall>
          <Text>{firstName || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Middle</TextSmall>
          <Text>{middleName || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Lastname</TextSmall>
          <Text>{lastName || "N/A"}</Text>
        </Container>
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Project Details</Title>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Project Name</TextSmall>
          <Text>{projectName || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Description</TextSmall>
          <Text>{description || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Phase</TextSmall>
          <Text>{phaseTitle || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Block</TextSmall>
          <Text>{blockTitle || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Lot</TextSmall>
          <Text>{lotTitle || "N/A"} - {onFormatNumber(sqm || 0)} sqm</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Province</TextSmall>
          <Text>{province || "N/A"}</Text>
        </Container>
        <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Address Details</Title>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>House #</TextSmall>
          <Text>{houseNumber || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Street</TextSmall>
          <Text>{street || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Subdivision</TextSmall>
          <Text>{subdivision || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Barangay</TextSmall>
          <Text>{barangay || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>City</TextSmall>
          <Text>{city || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Province</TextSmall>
          <Text>{province || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Zip Code</TextSmall>
          <Text>{zip || "N/A"}</Text>
        </Container>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          gap="none"
          className="gap-y-1"
        >
          <TextSmall secondary>Region</TextSmall>
          <Text>{region || "N/A"}</Text>
        </Container>
      </Container>
    </>
  );
};

const PaymentDetails = (props: AuditDetailsProps) => {
  const { payment } = props as unknown as Payment & { payment: Payment };
  const { amount, modeOfPayment, transactionType, referenceNumber, receiptNo, penalized, penaltyAmount, waivedPenalty, waivedReason, paymentDate, files } = payment;
  return (
    <Container
      padding="none"
      cornerRadius="none"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
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
  )
};

const AgentCommissionDetails = (props: AuditDetailsProps) => {
  const { agentCommission } = props as unknown as AgentCommissionResponse & { agentCommission: AgentCommissionResponse };

  const { terms, releaseStartDate, releaseEndDate, status, nextReleaseDate, recurringReleaseDate, monthlyReleaseAmount, balance, contract } = agentCommission;
  const { lot, } = contract;
  const { title: lotTitle, sqm, block } = lot;
  const { title: blockTitle, phase } = block;
  const { title: phaseTitle, project } = phase;
  const { projectName, description } = project;

  return (
    <Container
      padding="none"
      cornerRadius="none"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3"
      gap="none"
    >
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Terms</TextSmall>
        <Text>{onFormatNumber(terms || 0)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Release Start Date</TextSmall>
        <Text>{!releaseStartDate ? "N/A" : mtz(releaseStartDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Release End Date</TextSmall>
        <Text>{!releaseEndDate ? "N/A" : mtz(releaseEndDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Next Release Date</TextSmall>
        <Text>{!nextReleaseDate ? "N/A" : mtz(nextReleaseDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Recurring Release Date</TextSmall>
        <Text>{!recurringReleaseDate ? "N/A" : mtz(recurringReleaseDate, "defaultformat").format(DATE_FORMAT.shortDateAbbrev)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Monthly Release Amount</TextSmall>
        <Text>{onToLocalCurrency(monthlyReleaseAmount || 0)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Balance</TextSmall>
        <Text>{onToLocalCurrency(balance || 0)}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Status</TextSmall>
        <Badge variant={AGENT_COMMISSION_STATUS_THEME[status]}>{onToPascalCase(status)}</Badge>
      </Container>
      <Title level={5} className="col-span-2 md:col-span-3 lg:col-span-4 my-3">Project Details</Title>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Project Name</TextSmall>
        <Text>{projectName || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Description</TextSmall>
        <Text>{description || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Phase</TextSmall>
        <Text>{phaseTitle || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Block</TextSmall>
        <Text>{blockTitle || "N/A"}</Text>
      </Container>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        gap="none"
        className="gap-y-1"
      >
        <TextSmall secondary>Lot</TextSmall>
        <Text>{lotTitle || "N/A"} - {sqm} sqm</Text>
      </Container>
    </Container>
  );
};

const renderAuditDetails: Record<
  MODULES,
  (props: AuditDetailsProps) => React.ReactNode
> = {
  [MODULES.CLIENT]: props => <ClientDetails {...props} />,
  [MODULES.PROJECT]: props => <ProjectDetails {...props} />,
  [MODULES.RESERVATION]: props => <ReservationDetails {...props} />,
  [MODULES.AGENT]: props => <AgentDetails {...props} />,
  [MODULES.USER]: props => <UserDetails {...props} />,
  [MODULES.CONTRACT]: props => <ContractDetails {...props} />,
  [MODULES.PAYMENT]: props => <PaymentDetails {...props} />,
  [MODULES.AGENT_COMMISSION]: props => <AgentCommissionDetails {...props} />,
};

const Audit = () => {
  const { id } = useParams<QueryIdProps>();
  const [searchParams] = useSearchParams();

  const module = searchParams.get("auditModule") as MODULES;

  const { data: auditDetails, isLoading: isAuditDetailsLoading } =
    useGetAuditDetails({ id: id!, module: module! });

  const { action, createdBy, dateCreated, dateDeleted } =
    auditDetails?.response || {};

  const performedBy = !createdBy
    ? "System"
    : onFormatFullName(
      createdBy.firstName,
      createdBy.lastName,
      createdBy.middleName,
    );

  const datePerformed = mtz(
    action === AUDIT_ACTION.DELETE ? dateDeleted || dateCreated : dateCreated,
    "defaultformat",
  ).format(DATE_FORMAT.shortDateAbbrev);

  if (isAuditDetailsLoading) {
    return <ProjectLoading />;
  }

  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      <Container padding="none" flexDisplay gap="none">
        <Title
          level={2}
          className={cn(
            action === AUDIT_ACTION.CREATE
              ? "text-success"
              : action === AUDIT_ACTION.UPDATE
                ? "text-primary"
                : "text-destructive",
          )}
        >
          {onToPascalCase(action || "", {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Title>
        <Text className="font-bold mt-2">
          <span className="text-secondary-color text-sm font-normal">
            Performed by:{" "}
          </span>
          {performedBy}
        </Text>
        <Text className="font-bold">
          <span className="text-secondary-color text-sm font-normal">
            Module:{" "}
          </span>
          {onToPascalCase(module || "", {
            removeCharacters: ["_"],
            replaceCharactersWith: " ",
          })}
        </Text>
        <Text className="font-bold">
          <span className="text-secondary-color text-sm font-normal">
            Date performed:{" "}
          </span>
          {datePerformed}
        </Text>
      </Container>
      <Container
        bordered
        padding="md"
        flexDisplay
        className="border-border/50 bg-card"
      >
        {renderAuditDetails[module](
          onOmitProperties(auditDetails?.response!, ["target", "createdBy"]),
        )}
      </Container>
    </Container>
  );
};

export default Audit;
