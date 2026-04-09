import { Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const useGSAPFadeIn = (element: string, delay = 0) => {
  if (typeof window !== "undefined") {
    gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
      },
    });
  }
};
