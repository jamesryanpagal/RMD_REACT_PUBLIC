import React from "react";
import {
  Breadcrumb as ShadBreadcrumb,
  type BreadcrumbProps as ShadBreadcrumbProps,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link } from "react-router-dom";
import { TextSmall } from "./typography";

export type BreadcrumbItemProps = {
  label: string;
  link?: string;
};

export type BreadcrumbProps = ShadBreadcrumbProps & {
  items: BreadcrumbItemProps[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <ShadBreadcrumb>
      <BreadcrumbList>
        {items.map(({ label, link }, i, arr) => {
          const isLastItem = i === arr.length - 1;
          return (
            <React.Fragment key={i}>
              {i !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem
                className={
                  !isLastItem
                    ? "hover:underline hover:underline-offset-4 decoration-secondary-color"
                    : ""
                }
              >
                <BreadcrumbLink asChild>
                  {isLastItem ? (
                    <TextSmall secondary>{label}</TextSmall>
                  ) : (
                    <Link to={link || ""}>{label}</Link>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
};

export default Breadcrumb;
