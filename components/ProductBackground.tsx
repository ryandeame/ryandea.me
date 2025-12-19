"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export default function ProductBackground() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <div ref={ref} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-[#0a0a0a] w-full h-full" />

            {/* Animated SVG Elements */}
            <motion.div
                style={{
                    y: y1,
                    backgroundImage: 'linear-gradient(to bottom right, rgb(147, 51, 234), rgb(88, 28, 135))'
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0],
                    filter: ["blur(40px)", "blur(50px)", "blur(40px)"],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[5%] left-[-5%] w-[250px] h-[250px] md:w-[40vw] md:h-[40vw] opacity-70 md:opacity-60 rounded-full z-10"
            />

            <motion.div
                style={{
                    y: y2,
                    backgroundImage: 'linear-gradient(to bottom right, rgb(37, 99, 235), rgb(29, 78, 216))'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -15, 0],
                    filter: ["blur(35px)", "blur(45px)", "blur(35px)"],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-[5%] right-[-5%] w-[200px] h-[200px] md:w-[35vw] md:h-[35vw] opacity-70 md:opacity-60 rounded-full z-10"
            />

            <motion.div
                style={{
                    y: y3,
                    backgroundImage: 'linear-gradient(to bottom right, rgb(99, 102, 241), rgb(139, 92, 246))'
                }}
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, 30, 0],
                    filter: ["blur(30px)", "blur(40px)", "blur(30px)"],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-[30%] left-[20%] w-[180px] h-[180px] md:w-[25vw] md:h-[25vw] opacity-60 md:opacity-50 rounded-full z-10"
            />

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
