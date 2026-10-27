import type { ClientResponse, QueryIdProps } from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import { Text, TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProjectLoading } from "@/components/ui/skeleton";
import {
  useGetClient,
  useUpdateClientPersonalDetails,
} from "@/hooks/queries/useClients";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { contractColumns, reservationColumn } from "@/utils/data";
import { onToPascalCase } from "@/utils/helper";
import {
  clientPersonalDetailsSchema,
  type ClientPersonalDetailsSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { useParams } from "react-router-dom";

type PersonalDetailsFormProps = {
  clientDetails?: ClientResponse | null;
  setToggleEditFormModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PersonalDetailsForm = ({
  clientDetails,
  setToggleEditFormModal,
}: PersonalDetailsFormProps) => {
  const {
    id,
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
    tinNumber,
    houseNumber,
    street,
    barangay,
    subdivision,
    city,
    province,
    region,
    zip,
  } = clientDetails || {};
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ClientPersonalDetailsSchema>({
    defaultValues: {
      id: id || "",
      firstName: firstName || "",
      middleName: middleName || "",
      lastName: lastName || "",
      email: email || "",
      contactNumber: contactNumber || "",
      tinNumber: tinNumber || "",
      houseNumber: houseNumber || "",
      street: street || "",
      barangay: barangay || "",
      subdivision: subdivision || "",
      city: city || "",
      province: province || "",
      region: region || "",
      zip: zip || "",
    },
    resolver: zodResolver(clientPersonalDetailsSchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: updateClientPersonalDetails } =
    useUpdateClientPersonalDetails({
      onSuccess: data => {
        onInvalidate(["client", { id: id! }]);
        onShowToast({
          title: "Client's Personal Details Updated.",
          description:
            data.response || "Client's Personal details updated successfully.",
          showClose: false,
        });
        setToggleEditFormModal(false);
        reset();
      },
      onError: err => {
        setError("root", {
          message: err.message || "Something went wrong. Please try again.",
        });
      },
      onMutate: () => {
        clearErrors("root");
      },
    });

  const onFormSubmit = async (props: ClientPersonalDetailsSchema) => {
    await updateClientPersonalDetails(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleEditFormModal(false);
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {errors.root?.message && (
          <Alert
            icon={<PiWarningCircleFill />}
            title="Update Failed"
            description={errors.root.message}
            variant="destructive"
          />
        )}
        <Container padding="none" flexDisplay cornerRadius="none">
          <Input
            label="First Name"
            {...register("firstName")}
            required
            err={errors.firstName?.message}
          />
          <Input
            label="Middle Name"
            {...register("middleName")}
            err={errors.middleName?.message}
          />
          <Input
            label="Last Name"
            {...register("lastName")}
            required
            err={errors.lastName?.message}
          />
          <Input
            label="Email"
            {...register("email")}
            required
            err={errors.email?.message}
          />
          <Input
            label="Contact Number"
            {...register("contactNumber")}
            required
            err={errors.contactNumber?.message}
          />
          <Input
            label="TIN #"
            {...register("tinNumber")}
            required
            err={errors.tinNumber?.message}
          />
          <Input
            label="House #"
            {...register("houseNumber")}
            err={errors.houseNumber?.message}
          />
          <Input
            label="Street"
            {...register("street")}
            required
            err={errors.street?.message}
          />
          <Input
            label="Barangay"
            {...register("barangay")}
            required
            err={errors.barangay?.message}
          />
          <Input
            label="Subdivision"
            {...register("subdivision")}
            err={errors.subdivision?.message}
          />
          <Input
            label="City"
            {...register("city")}
            required
            err={errors.city?.message}
          />
          <Input
            label="Province"
            {...register("province")}
            err={errors.province?.message}
          />
          <Input
            label="Region"
            {...register("region")}
            required
            err={errors.region?.message}
          />
          <Input
            label="ZIP Code"
            {...register("zip")}
            err={errors.zip?.message}
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
                  setToggleEditFormModal(false);
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

const Client = () => {
  const { id } = useParams<QueryIdProps>();
  const [toggleEditFormModal, setToggleEditFormModal] = useState(false);

  const nav = useNavigate();

  const { data, isLoading } = useGetClient({ id: id! });

  const {
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
    tinNumber,
    street,
    barangay,
    subdivision,
    city,
    province,
    region,
    zip,
    houseNumber,
    reservation,
    contract,
  } = data?.response || {};

  const clientFullName = `${firstName} ${
    middleName ? middleName + "," : ""
  } ${lastName}`;

  const renderEditFormModal = useMemo(() => {
    return (
      <Modal
        title="Edit Client's Personal Details"
        open={toggleEditFormModal}
        onOpenChange={setToggleEditFormModal}
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <PersonalDetailsForm
          clientDetails={data?.response}
          setToggleEditFormModal={setToggleEditFormModal}
        />
      </Modal>
    );
  }, [toggleEditFormModal, data?.response]);

  const onSelectReservation = (id: string, tabName: string) => {
    nav({
      parent: ["reservations"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  };

  const onSelectContract = useCallback((id: string, tabName: string) => {
    nav({
      parent: ["contracts"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  }, []);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container padding="none" flexDisplay cornerRadius="none">
        <Container flexDisplay gap="none" padding="none">
          <Title>{onToPascalCase(clientFullName)}</Title>
          <TextSmall secondary>
            {email} | {contactNumber}
          </TextSmall>
        </Container>
        <Container
          bordered
          className="bg-card border-border/50"
          flexDisplay
          padding="md"
          gap="md"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Title level={5}>Personal Details</Title>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setToggleEditFormModal(true)}
            >
              <MdEdit className="text-dodger-blue size-5" />
            </Button>
          </Container>
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
        </Container>
        <Container
          padding="md"
          flexDisplay
          bordered
          className="bg-card border-border/50"
          gap="md"
        >
          <Container
            flexDisplay
            flexDirection="row"
            alignItems="center"
            padding="none"
          >
            <Title level={5}>Reservations</Title>
          </Container>
          <DataTable
            data={reservation}
            columns={reservationColumn(onSelectReservation).filter(
              ({ id }) => id !== "client-name",
            )}
            noDataProps={{
              title: "No Reservation(s) Found",
              description:
                "Create its first reservation by clicking the button below.",
              action: (
                <Button
                  variant="secondary-success"
                  onClick={() => nav({ path: "reservations" })}
                >
                  Add Reservation
                </Button>
              ),
            }}
          />
        </Container>
        <Container
          padding="md"
          flexDisplay
          bordered
          className="bg-card border-border/50"
          gap="md"
        >
          <Container
            flexDisplay
            flexDirection="row"
            alignItems="center"
            padding="none"
          >
            <Title level={5}>Contracts</Title>
          </Container>
          <DataTable
            data={contract}
            columns={contractColumns(onSelectContract).filter(
              ({ id }) => id !== "client",
            )}
            noDataProps={{
              title: "No Contract(s) Found",
              description:
                "Create its first contract by clicking the button below.",
              action: (
                <Button
                  variant="secondary-success"
                  onClick={() => nav({ path: "contracts" })}
                >
                  Add Contract
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderEditFormModal}
    </>
  );
};

export default Client;
