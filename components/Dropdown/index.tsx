import { AppProps } from "next/app";
import Link from "next/link";
import React from "react";

interface DropdownProps extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  href: string;
  className?: string;
}
const Dropdown = (props: DropdownProps) => {
  const { children, href, className } = props;
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
};

export default Dropdown;
