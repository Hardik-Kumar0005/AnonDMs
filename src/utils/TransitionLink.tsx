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
        <button 
        onClick={handleClick} 
        className="text-xl text-neutral-900 hover:text-neutral-600 bg-green-500 rounded-4xl p-1"
        >
            {label}
        </button>
    )
}

export default TransitionLink;
