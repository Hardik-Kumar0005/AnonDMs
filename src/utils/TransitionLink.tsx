"use client";

import { usePathname, useRouter } from "next/navigation";
import { animatePageOut } from "./animation";

interface Props {
    href: string,
    label: string
}

const TransitionLink: React.FC<Props> = ({ href, label }: Props) => {
    const router = useRouter(); 
    const pathname = usePathname();

    const handleClick = () => {
        if(pathname != href) {
            animatePageOut(href, router);
        }
    }

    return (
        <div 
        onClick={handleClick} 
        className=""
        >
            {label}
        </div>
    )
}

export default TransitionLink;
    