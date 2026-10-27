import Container from "@/components/container";
import { TextSmall } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

export type ToastProps = {
  title: string;
  description: string;
  type?: "success" | "error";
  showClose?: boolean;
};

export const useToast = () => {
  const onShowToast = ({
    title,
    description,
    type = "success",
    showClose = true,
  }: ToastProps) => {
    toast.custom(
      t => {
        return (
          <Container
            className={cn(
              "pointer-events-auto",
              "bg-card",
              type === "error" ? "border-destructive" : "border-success",
            )}
            bordered
            flexDisplay
            padding="md"
            flexDirection="row"
            alignItems="center"
          >
            <FaCheckCircle
              className={cn(
                type === "error"
                  ? "text-destructive"
                  : "text-success dark:text-turtle-green",
              )}
            />
            <Container padding="none" flexDisplay gap="none" className="gap-1">
              <TextSmall
                className={cn(
                  "",
                  type === "error"
                    ? "text-destructive"
                    : "text-success dark:text-turtle-green",
                )}
              >
                {title}
              </TextSmall>
              {description && (
                <TextSmall
                  className={cn(
                    "",
                    type === "error"
                      ? "text-destructive"
                      : "text-success dark:text-turtle-green",
                  )}
                >
                  {description}
                </TextSmall>
              )}
            </Container>
            {showClose && (
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => toast.dismiss(t)}
              >
                <IoClose />
              </Button>
            )}
          </Container>
        );
      },
      {
        duration: 5000,
      },
    );
  };

  return { onShowToast };
};
