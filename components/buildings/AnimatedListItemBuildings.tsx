import React from "react"
import { motion, usePresence } from 'framer-motion'



interface Props {

}

const AnimatedListItemFramer: React.FC <Props> =({ children }) => {
  const [isPresent, safeToRemove] = usePresence()


  const animations = {
    layout: true,
    initial: 'initial',
    
    animate: isPresent ? 'in' : 'out',
    whileTap: 'tapped',
    variants: {
      initial: { scaleY: 1, opacity: 0, transition: {  duration: 0.3 }  },
      in: { scaleY: 1, opacity: 1, transition: {  duration: 0.6 }  },
      out: { scaleY: 0.8, opacity: 0, transition: {  duration: 0.3 } },
      tapped: { scale: 0.98, opacity: 0.9, transition: { duration: 0.3 } }
    },
    //@ts-ignore
    onAnimationComplete: () => !isPresent && safeToRemove(),
    
  }

  return (
    <motion.div style={{width: "fit-content", margin: "auto"}} {...animations} >
      {children}
    </motion.div>
  )
}

export default AnimatedListItemFramer