import { cn } from "@/lib/utils";
import Container from "../container";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-secondary-color/30 dark:bg-accent animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

const FormLoading = () => {
  return (
    <Container
      padding="none"
      cornerRadius="none"
      className="w-full"
      flexDisplay
    >
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
    </Container>
  );
};

const TableLoading = () => {
  return (
    <Container
      padding="none"
      cornerRadius="none"
      className="w-full"
      flexDisplay
    >
      <Container
        cornerRadius="none"
        padding="none"
        flexDisplay
        flexDirection="row"
      >
        <Skeleton className="h-8 rounded-sm flex-1" />
        <Skeleton className="h-8 rounded-sm flex-1" />
        <Skeleton className="h-8 rounded-sm flex-1" />
      </Container>
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Container
        padding="none"
        cornerRadius="none"
        flexDisplay
        flexDirection="row"
        justifyContent="space-between"
      >
        <Skeleton className="h-8 rounded-sm w-32" />
        <Skeleton className="h-8 rounded-sm w-56" />
      </Container>
    </Container>
  );
};

const ShortDetailsLoading = () => {
  return (
    <Container padding="none" flexDisplay cornerRadius="none">
      <Skeleton className="h-16 w-[300px] rounded-sm" />
      <Skeleton className="h-8 rounded-sm w-52" />
    </Container>
  );
};

export const ProjectLoading = () => {
  return (
    <Container padding="none" cornerRadius="none" flexDisplay>
      <Skeleton className="h-16 w-[300px] rounded-sm" />
      <Skeleton className="h-8 rounded-sm w-full" />
      <Skeleton className="h-8 rounded-sm w-[80%]" />
      <Skeleton className="h-8 rounded-sm w-[50%]" />
    </Container>
  );
};

export const NotificationLoading = () => {
  return (
    <Container padding="none" cornerRadius="none" flexDisplay>
      <Skeleton className="h-[50px] rounded-sm w-full" />
      <Skeleton className="h-[50px] rounded-sm w-full" />
      <Skeleton className="h-[50px] rounded-sm w-full" />
      <Skeleton className="h-[50px] rounded-sm w-full" />
      <Skeleton className="h-[50px] rounded-sm w-full" />
    </Container>
  );
};

export { Skeleton, TableLoading, FormLoading, ShortDetailsLoading };
