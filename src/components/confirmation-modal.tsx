import { Modal, type DialogProps } from "./ui/dialog";
import Container from "./container";
import { Button, type ButtonProps } from "./ui/button";
import type React from "react";

type ModalButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
  label?: React.ReactNode;
};

export type ConfirmationModalProps = DialogProps & {
  confirmButtonProps?: ModalButtonProps;
  cancelButtonProps?: ModalButtonProps;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const ConfirmationModal = ({
  title = "Confirmation",
  description = "Are you sure you want to close and discard changes?",
  confirmButtonProps = { variant: "destructive", label: "Confirm" },
  cancelButtonProps = { variant: "secondary", label: "Cancel" },
  onConfirm,
  onCancel,
  ...props
}: ConfirmationModalProps) => {
  const { label: confirmLabel, ...confirmRest } = confirmButtonProps;
  const { label: cancelLabel, ...cancelRest } = cancelButtonProps;
  return (
    <Modal
      title={title}
      description={description}
      closeOnClickOutside={false}
      showCloseButton={false}
      closeOnEsc={false}
      footer={
        <Container
          flexDisplay
          flexDirection="row"
          alignItems="center"
          justifyContent="end"
          padding="none"
        >
          <Button
            {...{ variant: "secondary", ...cancelRest }}
            onClick={onCancel}
          >
            {cancelLabel || "Cancel"}
          </Button>
          <Button
            {...{ variant: "destructive", ...confirmRest }}
            onClick={onConfirm}
          >
            {confirmLabel || "Confirm"}
          </Button>
        </Container>
      }
      {...props}
    />
  );
};

export default ConfirmationModal;
