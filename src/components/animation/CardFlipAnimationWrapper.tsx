import {AnimatePresence, motion} from "framer-motion";
import {Settings} from "../../Settings";

export default function ({animation, children}: { animation: "front" | "back" | null, children: any }) {
    const animationVariants = {
        front: {rotateY: 0},
        back: {rotateY: 180}
    };

    if (Settings.REDUCE_ANIMATIONS) {
        return children
    }

    return <AnimatePresence>
        <motion.div
            variants={animationVariants}
            animate={animation ?? ""}
            transition={{duration: Settings.CARD_FLIP_TRANSITION_DURATION / 1000}}
        >
            <motion.div
                variants={animationVariants}
                animate={animation ?? ""}
                transition={{duration: Settings.CARD_FLIP_TRANSITION_DURATION / 1000}}
            >
                {children}
            </motion.div>
        </motion.div>

    </AnimatePresence>
}