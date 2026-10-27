import { LOT_STATUS } from "@/api/query-fn.api";
import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import DataTable from "@/components/data-table";
import DateInput from "@/components/date-input";
import FileUpload from "@/components/file-upload";
import InputGroup from "@/components/input-group";
import InputNumber from "@/components/input-number";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, type SelectOptions } from "@/components/ui/select";
import { FormLoading } from "@/components/ui/skeleton";
import { useGetClients } from "@/hooks/queries/useClients";
import { useGetProjects } from "@/hooks/queries/useProject";
import {
  useCreateReservation,
  useGetReservations,
} from "@/hooks/queries/useReservation";
import { useDeferred } from "@/hooks/useDeferred";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useNavigate } from "@/hooks/useNavigate";
import { useToast } from "@/hooks/useToast";
import { modeOfPaymentOptions, reservationColumn } from "@/utils/data";
import { reservationSchema, type ReservationSchema } from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";
import { useSearchParams, type SetURLSearchParams } from "react-router-dom";

export type ReservationFormProps = {
  projectId?: string;
  phaseId?: string;
  blockId?: string;
  lotId?: string;
  clientId?: string;
  searchParams: URLSearchParams;
  setToggleReservationForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
};

const ReservationForm = ({
  projectId,
  phaseId,
  blockId,
  lotId,
  clientId,
  setToggleReservationForm,
  searchParams,
  setSearchParams,
}: ReservationFormProps) => {
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ReservationSchema>({
    defaultValues: {
      lotId: lotId || "",
      clientId: clientId || "",
      pfp: [],
      referenceNumber: "",
      modeOfPayment: null,
      paymentDate: "",
      amount: 0,
    },
    resolver: zodResolver(reservationSchema),
  });

  const { data: projects, isLoading: isProjectLoading } = useGetProjects();
  const { data: clients, isLoading: isClientLoading } = useGetClients();

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();
  const nav = useNavigate();

  const { mutateAsync: createReservation } = useCreateReservation({
    onSuccess: () => {
      onInvalidate(["reservations"]);
      onShowToast({
        title: "Reservation Created",
        description: "Reservation has been created successfully.",
      });
      setToggleReservationForm(false);
      nav({ path: "reservations" });
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

  const onChangeSearchParams = (
    type: "project" | "phase" | "block" | "lot",
    value: string,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    switch (type) {
      case "project":
        newParams.set("project", value);
        newParams.set("phase", "");
        newParams.set("block", "");
        newParams.set("lot", "");
        break;
      case "phase":
        newParams.set("phase", value);
        newParams.set("block", "");
        newParams.set("lot", "");
        break;
      case "block":
        newParams.set("block", value);
        newParams.set("lot", "");
        break;
      case "lot":
        newParams.set("lot", value);
        break;
      default:
        break;
    }

    setSearchParams(newParams);
  };

  const onFormSubmit = async (props: ReservationSchema) => {
    await createReservation(props);
  };

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleReservationForm(false);
          reset();
          nav({ path: "reservations", query: {} });
        }}
        confirmButtonProps={{
          label: "Close and Discard Changes",
        }}
      />
    );
  }, [toggleDiscardChanges]);

  const phaseOptions = useMemo((): SelectOptions[] | undefined => {
    return projects?.response
      ?.find(({ id }) => projectId === id)
      ?.phase.map(({ id, title }) => ({ id, label: title, value: id }));
  }, [projects, projectId]);

  const blockOptions = useMemo((): SelectOptions[] | undefined => {
    return projects?.response
      ?.find(({ id }) => projectId === id)
      ?.phase.find(({ id }) => phaseId === id)
      ?.block.map(({ id, title }) => ({ id, label: title, value: id }));
  }, [projects, projectId, phaseId]);

  const lotOptions = useMemo((): SelectOptions[] | undefined => {
    return projects?.response
      ?.find(({ id }) => projectId === id)
      ?.phase.find(({ id }) => phaseId === id)
      ?.block.find(({ id }) => blockId === id)
      ?.lot.map(({ id, title, sqm, status }) => ({
        id,
        label: title,
        value: id,
        description: !sqm ? "Sqm not yet set" : `Sqm: ${sqm}`,
        props: {
          disabled:
            !sqm ||
            (status !== LOT_STATUS.OPEN && status !== LOT_STATUS.CLOSED),
        },
        descriptionProps: { className: sqm ? "text-turtle-green" : "" },
      }));
  }, [projects, projectId, phaseId, blockId]);

  if (isClientLoading || isProjectLoading) {
    return <FormLoading />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {errors.root?.message && (
          <Alert
            icon={<PiWarningCircleFill />}
            title="Create Failed"
            description={errors.root.message}
            variant="destructive"
            className="mb-5"
          />
        )}
        <Container
          padding="none"
          flexDisplay
          className="grid grid-cols-2 gap-x-3 gap-y-4"
          gap="none"
        >
          <Select
            label="Project"
            defaultValue={projectId}
            required
            options={projects?.response?.map(({ id, projectName }) => ({
              id,
              label: projectName,
              value: id,
            }))}
            onValueChange={e => onChangeSearchParams("project", e)}
          />
          <Select
            label="Phase"
            defaultValue={phaseId}
            required
            disabled={!projectId}
            options={phaseOptions}
            onValueChange={e => onChangeSearchParams("phase", e)}
          />
          <Select
            label="Block"
            defaultValue={blockId}
            required
            disabled={!phaseId}
            options={blockOptions}
            onValueChange={e => onChangeSearchParams("block", e)}
          />
          <Controller
            control={control}
            name="lotId"
            render={({ field }) => {
              return (
                <Select
                  label="Lot"
                  value={field.value}
                  disabled={!blockId}
                  options={lotOptions}
                  required
                  err={errors.lotId?.message}
                  onValueChange={e => {
                    field.onChange(e);
                    onChangeSearchParams("lot", e);
                  }}
                />
              );
            }}
          />
          <Container
            padding="none"
            className="col-span-2 gap-y-4"
            flexDisplay
            gap="none"
          >
            <Controller
              control={control}
              name="clientId"
              render={({ field }) => {
                return (
                  <Select
                    label="Client"
                    value={field.value}
                    onValueChange={e => field.onChange(e)}
                    required
                    err={errors.clientId?.message}
                    options={clients?.response?.map(
                      ({ id, firstName, middleName, lastName }) => ({
                        id,
                        label: `${firstName} ${
                          middleName ? middleName + "," : ""
                        } ${lastName}`,
                        value: id,
                      }),
                    )}
                    emptyAction={
                      <Container padding="none">
                        <Button
                          prefix={<MdAdd />}
                          variant="success"
                          onClick={() => nav({ path: "clients" })}
                        >
                          Add Client
                        </Button>
                      </Container>
                    }
                  />
                );
              }}
            />
          </Container>
          <Container
            padding="none"
            className="col-span-2 gap-y-4"
            flexDisplay
            gap="none"
          >
            <Controller
              control={control}
              name="pfp"
              render={({ field }) => {
                return (
                  <FileUpload
                    label="Proof of Payment"
                    required
                    value={field.value}
                    err={errors.pfp?.message}
                    onChange={e => field.onChange(e)}
                  />
                );
              }}
            />
          </Container>
          <Controller
            control={control}
            name="modeOfPayment"
            render={({ field }) => {
              return (
                <Select
                  label="Mode of Payment"
                  options={modeOfPaymentOptions}
                  required
                  err={errors.modeOfPayment?.message}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="paymentDate"
            render={({ field }) => {
              return (
                <DateInput
                  label="Payment Date"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  err={errors.paymentDate?.message}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="amount"
            render={({ field }) => {
              return (
                <InputNumber
                  label="Amount"
                  formatOptions={{
                    style: "currency",
                    currency: "PHP",
                  }}
                  value={field.value || 0}
                  onChange={field.onChange}
                  required
                  err={errors.amount?.message}
                />
              );
            }}
          />
          <Input label="Reference #" {...register("referenceNumber")} />
        </Container>
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
              if (isDirty || !!(projectId || phaseId || blockId || lotId)) {
                setToggleDiscardChanges(true);
              } else {
                setToggleReservationForm(false);
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
      </form>
      {renderDiscardChanges}
    </>
  );
};

const Reservations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project") || undefined;
  const phaseId = searchParams.get("phase") || undefined;
  const blockId = searchParams.get("block") || undefined;
  const lotId = searchParams.get("lot") || undefined;
  const [search, setSearch] = useState<string>("");

  const { val } = useDeferred(search);

  const reservationFormInitialState = !!(
    projectId ||
    phaseId ||
    blockId ||
    lotId
  );

  const [toggleReservationForm, setToggleReservationForm] = useState(
    reservationFormInitialState,
  );

  const { data: reservations, isLoading } = useGetReservations(
    val ? { search: val } : {},
  );

  const nav = useNavigate();

  const onSelectReservation = (id: string, tabName: string) => {
    nav({
      parent: ["reservations"],
      path: ":id",
      params: { id },
      query: { tabName },
    });
  };

  const renderReservationForm = useMemo(() => {
    return (
      <Modal
        title="Create Reservation"
        closeOnClickOutside={false}
        closeOnEsc={false}
        showCloseButton={false}
        open={toggleReservationForm}
        onOpenChange={setToggleReservationForm}
        className="lg:max-w-[50%]"
      >
        <ReservationForm
          projectId={projectId}
          phaseId={phaseId}
          blockId={blockId}
          lotId={lotId}
          setToggleReservationForm={setToggleReservationForm}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </Modal>
    );
  }, [toggleReservationForm, projectId, phaseId, blockId, lotId, searchParams]);

  return (
    <>
      <Container cornerRadius="none" padding="none" flexDisplay>
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          justifyContent="space-between"
          alignItems="end"
        >
          <Container padding="none" cornerRadius="none" className="w-[400px]">
            <InputGroup
              placeholder="Search reservation"
              prefix={<Search />}
              onChange={e => setSearch(e.target.value)}
            />
          </Container>
          <Button
            variant="secondary-success"
            prefix={<TiPlus />}
            onClick={() => {
              setToggleReservationForm(true);
            }}
          >
            Create Reservation
          </Button>
        </Container>
        <Container bordered className="bg-card border-border/50">
          <DataTable
            columns={reservationColumn(onSelectReservation)}
            data={reservations?.response}
            rowLength={50}
            loading={isLoading}
            noDataProps={{
              title: val
                ? "We couldn't find any reservations."
                : "You haven't created any reservations yet.",
              description: val
                ? "Please try again with different keywords or create a new reservation."
                : "Get started by creating your first reservation.",
              action: (
                <Button
                  variant="success"
                  prefix={<MdAdd />}
                  onClick={() => setToggleReservationForm(true)}
                >
                  Add Reservation
                </Button>
              ),
            }}
          />
        </Container>
      </Container>
      {renderReservationForm}
    </>
  );
};

export default Reservations;
