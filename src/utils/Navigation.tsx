import React from "react";
import TransitionLink from "./TransitionLink"


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
}: Props) => {
    return (
        <nav className={className}>
            <TransitionLink href={href} label={label} />
        </nav>
    )
}

export default Navigation;
