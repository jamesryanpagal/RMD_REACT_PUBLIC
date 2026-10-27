import { RESERVATION_STATUS, type QueryIdProps } from "@/api/query-fn.api";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DateInput from "@/components/date-input";
import Dropdown from "@/components/dropdown";
import PaymentDetails from "@/components/payment-details";
import { Text, TextSmall, Title } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { ProjectLoading } from "@/components/ui/skeleton";
import { useAdjustReservationValidity } from "@/hooks/queries/usePayment";
import {
  useDeleteReservation,
  useGetReservation,
} from "@/hooks/queries/useReservation";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { RESERVATION_STATUS_THEME } from "@/utils/constants";
import { reservationDropdownItems } from "@/utils/data";
import { onToPascalCase } from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import {
  adjustReservationValiditySchema,
  type AdjustReservationValiditySchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

type AdjustReservationValidityFormProps = {
  id?: string;
  setToggleAdjustReservationValidityModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

const AdjustReservationValidityForm = ({
  id,
  setToggleAdjustReservationValidityModal,
}: AdjustReservationValidityFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<AdjustReservationValiditySchema>({
    defaultValues: {
      id: id || "",
      validity: "",
    },
    resolver: zodResolver(adjustReservationValiditySchema),
  });

  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: adjustReservationValidity } =
    useAdjustReservationValidity({
      onSuccess: () => {
        onInvalidate(["reservations"]);
        onInvalidate(["reservation", { id }]);
        onShowToast({
          title: "Validity Date Adjusted",
          description: "Validity Date has been adjusted successfully.",
        });
        setToggleAdjustReservationValidityModal(false);
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

  const onFormSubmit = async (props: AdjustReservationValiditySchema) => {
    await adjustReservationValidity(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleAdjustReservationValidityModal(false);
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
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Container padding="none" flexDisplay>
          <Controller
            control={control}
            name="validity"
            render={({ field }) => {
              return (
                <DateInput
                  label="Validity Date"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  err={errors.validity?.message}
                />
              );
            }}
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
                  setToggleAdjustReservationValidityModal(false);
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

const Reservation = () => {
  const { id } = useParams<QueryIdProps>();
  const { data: reservation, isLoading } = useGetReservation({ id: id! });

  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  const [
    toggleAdjustReservationValidityModal,
    setToggleAdjustReservationValidityModal,
  ] = useState(false);

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();
  const nav = useNavigate();

  const { mutateAsync: deleteReservation, isPending } = useDeleteReservation({
    onSuccess: data => {
      onShowToast({
        title: "Reservation Deleted.",
        description: data.response || "Reservation deleted successfully.",
        showClose: false,
      });
      nav({ path: "reservations" });
      onInvalidate(["reservations"]);
    },
    onError: err => {
      onShowToast({
        title: "Delete Failed.",
        description: err.message || "Something went wrong. Please try again.",
        showClose: false,
        type: "error",
      });
    },
    onMutate: () => {
      setToggleDeleteModal(false);
    },
  });

  const { client, lot, status, payment, contractId, validity } =
    reservation?.response || {};
  const { firstName, middleName, lastName } = client || {};
  const { title: lotTitle, block } = lot || {};
  const { title: blockTitle, phase } = block || {};
  const { title: phaseTitle, project } = phase || {};
  const { projectName } = project || {};

  const { id: paymentId } = payment || {};

  const onDeleteReservation = useCallback(async () => {
    if (!id) return;
    await deleteReservation({ id });
  }, [id]);

  const renderDeleteModal = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDeleteModal}
        onCancel={() => setToggleDeleteModal(false)}
        description="Arey you sure you want to delete this reservation? This action cannot be undone."
        onConfirm={onDeleteReservation}
        cancelButtonProps={{
          disabled: isPending,
        }}
        confirmButtonProps={{
          disabled: isPending,
          loading: isPending,
          label: (
            <>
              Delete <strong>{firstName}'s</strong> Reservation
            </>
          ),
        }}
      />
    );
  }, [toggleDeleteModal, firstName, isPending, onDeleteReservation]);

  const renderAdjustReservationValidityModal = useMemo(() => {
    return (
      <Modal
        open={toggleAdjustReservationValidityModal}
        onOpenChange={setToggleAdjustReservationValidityModal}
        title="Adjust Validity Date"
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <AdjustReservationValidityForm
          id={id}
          setToggleAdjustReservationValidityModal={
            setToggleAdjustReservationValidityModal
          }
        />
      </Modal>
    );
  }, [toggleAdjustReservationValidityModal, id]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <>
      <Container padding="none" cornerRadius="none" flexDisplay>
        <Container
          padding="none"
          cornerRadius="none"
          flexDisplay
          className="mb-4"
        >
          <Container
            cornerRadius="none"
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container padding="none" flexDisplay flexDirection="row" gap="md">
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="end"
              >
                <Text secondary className="mb-1">
                  Lot:
                </Text>
                <Title level={2}>{lotTitle}</Title>
              </Container>
              <Container
                padding="none"
                flexDisplay
                flexDirection="row"
                alignItems="end"
              >
                <Text secondary className="mb-1">
                  Client:
                </Text>
                <Title level={2}>
                  {firstName} {middleName ? middleName + "," : ""} {lastName}
                </Title>
              </Container>
            </Container>
            <Dropdown
              modal={false}
              contentProps={{ align: "end" }}
              trigger={<EllipsisVertical />}
              items={reservationDropdownItems(
                () => {
                  setToggleAdjustReservationValidityModal(true);
                },
                () => {
                  setToggleDeleteModal(true);
                },
              ).filter(item =>
                status === RESERVATION_STATUS.CONTRACT_FORFEITED
                  ? item.id === "2"
                  : true,
              )}
            />
          </Container>
          <TextSmall className="font-bold">
            <span className="text-secondary-color text-xs">Project: </span>
            {projectName}
            <span className="text-secondary-color text-xs"> Phase: </span>
            {phaseTitle}
            <span className="text-secondary-color text-xs"> Block: </span>
            {blockTitle}
          </TextSmall>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <TextSmall className="font-bold">
              <span className="text-secondary-color text-xs">
                Valid until:{" "}
              </span>
              {mtz(validity, "defaultformat").format(
                DATE_FORMAT.shortDateAbbrev,
              )}
            </TextSmall>
            <Container
              padding="none"
              className="h-full"
              flexDisplay
              justifyContent="center"
            >
              <Badge variant={RESERVATION_STATUS_THEME[status || ""]}>
                {onToPascalCase(status || "", {
                  removeCharacters: ["_"],
                  replaceCharactersWith: " ",
                })}
              </Badge>
            </Container>
          </Container>
        </Container>
        <PaymentDetails
          id={paymentId || ""}
          {...(contractId
            ? {
                contractId,
                showPrint: true,
              }
            : {
                showPrint: false,
              })}
        />
      </Container>
      {renderDeleteModal}
      {renderAdjustReservationValidityModal}
    </>
  );
};

export default Reservation;
