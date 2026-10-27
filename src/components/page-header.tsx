import Container from "./container";
import Avatar, { type AvatarProps } from "./avatar";
import { Text, Title } from "./typography";
import { useRef } from "react";
import { useInView, motion, type Variants } from "motion/react";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";

export type PageHeaderProps = {
  title: string;
  icon: string;
  iconSize?: AvatarProps["size"];
  description: string;
  onComponentInView?: (props: boolean) => void;
};

const variants: Variants = {
  hidden: {
    translateY: -50,
    opacity: 0,
  },
  visible: {
    translateY: 0,
    opacity: 1,
  },
};

const PageHeader = ({
  title,
  icon,
  iconSize = "lg",
  description,
  onComponentInView,
}: PageHeaderProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: "all" });

  useUpdateEffect(() => {
    onComponentInView?.(isInView);
  }, [isInView]);

  return (
    <div className="w-full" ref={ref}>
      <motion.div
        variants={variants}
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full flex flex-col items-center gap-[5px]"
      >
        <Container
          flexDisplay
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="sm"
          className="w-full"
          cornerRadius="none"
        >
          <Avatar size={iconSize} src={icon} className="rounded-none" />
          <Title level={1}>{title}</Title>
        </Container>
        <Text secondary className="w-full text-center">
          {description}
        </Text>
      </motion.div>
    </div>
  );
};

export default PageHeader;
