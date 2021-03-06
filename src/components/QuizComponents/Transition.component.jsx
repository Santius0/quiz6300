import React from "react";

import {motion} from "framer-motion";

export const defaultFadeTransition = {
    in: {
        opacity: 1
    },
    out: {
        opacity: 0
    }
};

// fade transition component based on Framer Motion's AnimatePresence and motion.div components
const TransitionComponent = (props) => {
    return(
        <motion.div initial={"out"} animate={"in"} exit={"out"} variants={props.variants ? props.variants : defaultFadeTransition} transition={{ duration: 1.0, repeat: 0}}>
            {props.children}
        </motion.div>
    )
}

export default TransitionComponent;