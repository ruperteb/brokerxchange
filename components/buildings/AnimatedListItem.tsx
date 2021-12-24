/* import { relative } from "path"; */
import /* React, */ { CSSProperties, forwardRef } from "react";

type Props = {
    children:any
    
};

const animatedPropertyListItemStyles: CSSProperties = {
/*  width: "fit-content",
 marginLeft: "auto",
 marginRight: "auto", */
 /* padding: "1rem" */
 position: "relative"
}

const AnimatedListItem = forwardRef<HTMLDivElement,Props>(( props, ref) => (
  <div ref ={ref} {...props} style={animatedPropertyListItemStyles}>
    {props.children}
  </div>
)


);




export default AnimatedListItem;