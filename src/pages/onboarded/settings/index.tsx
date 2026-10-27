import Alert from "@/components/alert";
import ConfirmationModal from "@/components/confirmation-modal";
import Container from "@/components/container";
import type { Theme } from "@/components/context/theme-provider";
import { InputPassword } from "@/components/input-group";
import RadioSegmented from "@/components/radio-button-group";
import { Text, TextSmall } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateTheme } from "@/hooks/queries/useProject";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { themeItems } from "@/utils/data";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/utils/schema.z";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { Regexp, STORAGE_KEY } from "@/utils/constants";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useChangePassword, useUserDetails } from "@/hooks/queries/useUser";
import { TbReload } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";
import { onSaveLocalStorage, onToPascalCase } from "@/utils/helper";
import { USER_ROLE } from "@/utils/type";

const { smallChar, capitalChar, number, specialChar } = Regexp;

type ChangePasswordFormProps = {
  setToggleChangePasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangePasswordForm = ({
  setToggleChangePasswordModal,
}: ChangePasswordFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { isDirty, errors, isSubmitting },
  } = useForm<ChangePasswordSchema>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });
  const [toggleDiscardChanges, setToggleDiscardChanges] = useState(false);

  const watchedNewPassword = watch("newPassword");

  const { onInvalidate } = useInvalidateQuery();
  const { onShowToast } = useToast();

  const { mutateAsync: changePassword } = useChangePassword({
    onSuccess: () => {
      onInvalidate(["clients"]);
      onShowToast({
        title: "Password Updated",
        description: "Password updated successfully",
      });
      setToggleChangePasswordModal(false);
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

  const onFormSubmit = async (props: ChangePasswordSchema) => {
    await changePassword(props);
  };

  const renderPasswordRules = useMemo((): {
    label: string;
    passed: boolean;
  }[] => {
    return [
      {
        label: "At least 6 characters",
        passed: watchedNewPassword.length >= 6,
      },
      {
        label: "At least 1 small character",
        passed: smallChar.test(watchedNewPassword),
      },
      {
        label: "At least 1 capital character",
        passed: capitalChar.test(watchedNewPassword),
      },
      {
        label: "At least 1 numeric character",
        passed: number.test(watchedNewPassword),
      },
      {
        label: "At least 1 special character",
        passed: specialChar.test(watchedNewPassword),
      },
    ];
  }, [watchedNewPassword, smallChar, capitalChar, number, specialChar]);

  const renderDiscardChanges = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleDiscardChanges}
        onOpenChange={setToggleDiscardChanges}
        onCancel={() => setToggleDiscardChanges(false)}
        onConfirm={() => {
          setToggleChangePasswordModal(false);
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
        <Container padding="none" cornerRadius="none" flexDisplay>
          {errors.root?.message && (
            <Alert
              icon={<PiWarningCircleFill />}
              title="Change Password Failed"
              description={errors.root.message}
              variant="destructive"
            />
          )}
          <InputPassword
            label="Current Password"
            required
            err={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <InputPassword
            label="New Password"
            required
            err={errors.newPassword?.message}
            showErr={false}
            description="Password must contain the following:"
            {...register("newPassword")}
          />
          <Container padding="none" flexDisplay gap="none" className="gap-y-1">
            {renderPasswordRules.map(({ label, passed }, i) => {
              return (
                <Container
                  key={i}
                  padding="none"
                  flexDisplay
                  flexDirection="row"
                  alignItems="center"
                  gap="none"
                  className="gap-x-1"
                >
                  {passed ? (
                    <IoCheckmarkCircle className="text-success dark:text-turtle-green" />
                  ) : (
                    <IoIosCloseCircle className="text-destructive" />
                  )}
                  <TextSmall
                    className={
                      !passed
                        ? "text-secondary-color/80"
                        : "text-success dark:text-turtle-green"
                    }
                  >
                    {label}
                  </TextSmall>
                </Container>
              );
            })}
          </Container>
          <InputPassword
            label="Confirm New Password"
            required
            err={errors.confirmNewPassword?.message}
            {...register("confirmNewPassword")}
          />
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
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
                  setToggleChangePasswordModal(false);
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

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { onShowToast } = useToast();
  const { onInvalidate } = useInvalidateQuery();
  const { userDetails, moduleAccess, setModuleAccess } = useAuth();
  const { refetch: refetchUserDetails, isRefetching: isRefetchingUserDetails } =
    useUserDetails();

  const [toggleChangePasswordModal, setToggleChangePasswordModal] =
    useState(false);

  const [isPending, startTransition] = useTransition();
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    theme,
    (_, next: Theme) => next,
  );

  const { role, admin, secretary } = userDetails || {};

  const moduleFunctions =
    role === USER_ROLE.ADMIN
      ? admin?.moduleFunction
      : secretary?.moduleFunction;

  const { mutateAsync: updateTheme, isPending: isMutating } = useUpdateTheme({
    onSuccess: () => {
      onInvalidate(["user-details"]);
    },
    onError: () => {
      onShowToast({
        title: "Update Failed",
        description:
          "Something went wrong while updating theme. Please try again.",
        type: "error",
      });
      setOptimisticTheme(theme);
      setTheme(theme);
    },
  });

  const onUpdateTheme = async (e: Theme) => {
    startTransition(async () => {
      setOptimisticTheme(e);
      setTheme(e);
      await updateTheme({ theme: e });
    });
  };

  const onRefetchUserDetails = async () => {
    const userResponse = await refetchUserDetails();
    const { response } = userResponse.data || {};
    const { role, admin, secretary } = response || {};
    if (role === USER_ROLE.ADMIN) {
      onSaveLocalStorage(
        STORAGE_KEY.MODULE_ACCESS,
        JSON.stringify(admin?.moduleAccess || []),
      );
      setModuleAccess(admin?.moduleAccess || []);
    } else {
      onSaveLocalStorage(
        STORAGE_KEY.MODULE_ACCESS,
        JSON.stringify(secretary?.moduleAccess || []),
      );
      setModuleAccess(secretary?.moduleAccess || []);
    }
  };

  const renderToggleChangePasswordModal = useMemo(() => {
    return (
      <Modal
        open={toggleChangePasswordModal}
        onOpenChange={setToggleChangePasswordModal}
        title="Change Password"
        showCloseButton={false}
        closeOnClickOutside={false}
        closeOnEsc={false}
      >
        <ChangePasswordForm
          setToggleChangePasswordModal={setToggleChangePasswordModal}
        />
      </Modal>
    );
  }, [toggleChangePasswordModal]);

  return (
    <>
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        className="px-0 lg:px-[200px]"
      >
        <Container
          bordered
          flexDisplay
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className="bg-card border-border/50"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
          >
            <Text secondary>Theme</Text>
            {(isPending || isMutating) && <Spinner />}
          </Container>
          <RadioSegmented
            value={optimisticTheme}
            items={themeItems}
            onValueChange={onUpdateTheme}
          />
        </Container>
        <Container
          bordered
          flexDisplay
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className="bg-card border-border/50"
        >
          <Text secondary>Password</Text>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setToggleChangePasswordModal(true)}
          >
            <MdEdit className="text-dodger-blue size-5" />
          </Button>
        </Container>
        <Container
          bordered
          flexDisplay
          justifyContent="space-between"
          className="bg-card border-border/50"
        >
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className="w-full"
          >
            <Text secondary>Module Access</Text>
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={isRefetchingUserDetails}
              onClick={onRefetchUserDetails}
            >
              {isRefetchingUserDetails ? (
                <Spinner />
              ) : (
                <TbReload className="text-dodger-blue size-5" />
              )}
            </Button>
          </Container>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            className="flex-wrap gap-2"
          >
            {moduleAccess?.map((module, i) => {
              return (
                <Container
                  key={i}
                  bordered
                  cornerRadius="full"
                  padding="none"
                  className="py-1 px-2"
                >
                  <TextSmall>
                    {onToPascalCase(module, {
                      removeCharacters: ["_"],
                      replaceCharactersWith: " ",
                    })}
                  </TextSmall>
                </Container>
              );
            })}
          </Container>
        </Container>
        <Container
          bordered
          flexDisplay
          justifyContent="space-between"
          className="bg-card border-border/50"
        >
          <Text secondary>Module Functions</Text>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            className="flex-wrap gap-2"
          >
            {moduleFunctions?.map((module, i) => {
              return (
                <Container
                  key={i}
                  bordered
                  cornerRadius="full"
                  padding="none"
                  className="py-1 px-2"
                >
                  <TextSmall>
                    {onToPascalCase(module, {
                      removeCharacters: ["_"],
                      replaceCharactersWith: " ",
                    })}
                  </TextSmall>
                </Container>
              );
            })}
          </Container>
        </Container>
      </Container>
      {renderToggleChangePasswordModal}
    </>
  );
};

export default Settings;
