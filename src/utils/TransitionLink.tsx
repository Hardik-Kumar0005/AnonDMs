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
        className="text-xl text-neutral-900 hover:text-green-400 p-1 hover:text-2xl transition-all duration-300 ease-in-out rounded-lg active:scale-95
        /*Note to self: FIX CSS HERE*/
        w-full flex flex-col items-center justify-center bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 px-6 hover:scale-105 transition transform"
        >
            {label}
        </button>
    )
}

export default TransitionLink;
    