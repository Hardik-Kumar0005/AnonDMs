import { gsap } from "gsap";
import App from "next/app";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const animatePageIn = () => {
    const b1 = document.getElementById("b1");
    const b2 = document.getElementById("b2");
    const b3 = document.getElementById("b3");
    const b4 = document.getElementById("b4");

    if( b1 && b2 && b3 && b4 ) {
        const tl = gsap.timeline();

        tl.set([b1, b2, b3, b4], { 
            xPercent: 0 
        }).to([b1, b2, b3, b4], {
            xPercent: -100,
            stagger: 0.1
        });
    } 
}


export const animatePageOut = (href: string, router: AppRouterInstance) => {
    const b1 = document.getElementById("b1");
    const b2 = document.getElementById("b2");
    const b3 = document.getElementById("b3");
    const b4 = document.getElementById("b4");

    if( b1 && b2 && b3 && b4 ) {
        const tl = gsap.timeline();

        tl.to([b1, b2, b3, b4], {
            xPercent: 100,
            stagger: 0.1,
            onComplete: () => {
                router.push(href);
            }
        });
    } 
}