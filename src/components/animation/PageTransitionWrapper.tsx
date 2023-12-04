import {motion} from "framer-motion";
import {Settings} from "../../Settings";


export default function ({children,}: { children: any }) {


    if (Settings.REDUCE_ANIMATIONS) {
        return children
    }

    return <>
        {
            <motion.div
                initial={{transform: "scale(1)", opacity: 1}}
                animate={{transform: "scale(1)", opacity: 1}}
                exit={{transform: "scale(0.97)", opacity: 0.1}}
                transition={{duration: 0.3, type: "tween"}}
            >
                {children}
            </motion.div>
        }
    </>

}