import React from "react";
import TransitionLink from "./TransitionLink"
import { channel } from "diagnostics_channel";


interface Props {
    href: string;
    label: string;
    className: string;
    children?: React.ReactNode;
}

const Navigation: React.FC<Props> = ({
    href,
    label,
    className,
    children,
}: Props) => {
    return (
        <nav className={className}>
            {children}
            <TransitionLink href={href} label={label} />
        </nav>
    )
}

export default Navigation;
