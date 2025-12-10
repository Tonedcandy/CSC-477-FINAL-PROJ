// src/hooks/useAnimatedNumber.js

/*
 * This source file was developed by Monish Shanmugham Suresh with assistance from OpenAI tools
 * (ChatGPT and Codex). These tools were used for code suggestions and refactoring;
 * the human author is responsible for all design decisions and final content.
 */

import { useEffect, useState } from "react";

export function useAnimatedNumber(target, duration = 600) {
    const [value, setValue] = useState(target);

    useEffect(() => {
        let animationFrame;
        const start = performance.now();
        const initial = value;
        const diff = target - initial;

        const tick = (now) => {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / duration); // progress 0 → 1
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

            setValue(initial + diff * eased);

            if (t < 1) {
                animationFrame = requestAnimationFrame(tick);
            }
        };

        animationFrame = requestAnimationFrame(tick);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [target]); // re-run when target changes

    return value;
}