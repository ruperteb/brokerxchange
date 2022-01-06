import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import IconButton from '@mui/material/IconButton';
import { useHeaderVisible } from "../utils/useHeaderVisible";

import Logo from "../assets/Logo.png"

import Navigation from "../components/buildings/Navigation"

import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "./../redux/hooks"
import { navigationSlice } from "./../redux/slices/navigationSlice";

import UserAuth from "../components/userAuth/UserAuth"

import { transientOptions } from "../utils/transientOptions"
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";


interface VisibilityProps {
    $visible?: boolean,
    $modalAdjustment?: boolean
}

interface MediaProps {
    $desktop: boolean
}

/* direction="row"
                justifyContent="space-evenly"
                alignItems="center" */

const StyledOuterDiv = styled(motion.div, transientOptions) <VisibilityProps>`
position: fixed;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
/* background-color: #6e717a73; */
z-index: 100;
width: 100%;
top: ${props => props.$visible === true ? 0 : "-50px"};
background-color: white;
display: flex;
flex-direction: column;
justify-content: "space-evenly";
align-items: "center";
box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
padding-right: ${props => props.$modalAdjustment === true ? "17px" : 0};

`

const LogoDiv = styled.div<VisibilityProps>`
position: relative;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
top: ${props => props.$visible === true ? 0 : "-20px"};
display: flex;
flex-direction: row;
padding: 0.75rem;
margin: auto;
`

const StyledImg = styled.img`
object-fit: contain;
width: 100%;
height: 75px;
cursor: pointer;
`

const StyledLogoText = styled(Typography, transientOptions) <MediaProps>`
&& {
    font-family: 'Ubuntu', sans-serif;
font-size: ${props => props.$desktop === true ? "2.125rem" : "1.5rem"};
cursor: pointer;
}
`

const StyledLogoText1 = styled(StyledLogoText)`
&& {
    color: #1b14a5;
line-height: 1.4;
}
`

const StyledLogoText2 = styled(StyledLogoText)`
&& {
color: #ff0000;
font-size: 2.5rem;
}
`

const StyledAuthOuterDiv = styled.div<VisibilityProps>`
z-index: 150;
display: flex;
position: absolute;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
top: ${props => props.$visible === true ? "35px" : "70px"};
right: ${props => props.$modalAdjustment === true ? "57px" : "40px"};
`

const StyledMenuOuterDiv = styled.div<VisibilityProps>`
z-index: 150;
display: flex;
position: absolute;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
top: ${props => props.$visible === true ? "30px" : "60px"};
/* right: ${props => props.$modalAdjustment === true ? "57px" : "40px"}; */
left: 40px;
`

interface Props {

}

export const Header: React.FunctionComponent<Props> = ({ }) => {

    const dispatch = useAppDispatch()

    const handleMenuClick = () => {
        dispatch(navigationSlice.actions.setMenuDrawerOpen(true))
        if (document.body.scrollHeight >= document.body.clientHeight) {

            console.log("scrollheight", document.body.scrollHeight)
            console.log("clientheight", document.body.clientHeight)
            dispatch(navigationSlice.actions.setModalAdjustment(true))
        }
    }


    const modalAdjustment = useAppSelector(state => state.navigation.modalAdjustment)

    const panelView = useAppSelector(state => state.navigation.panelView)

    const visible = useHeaderVisible()

    /* const memoHeader: boolean = React.useMemo(()=> useHeader, [useHeader])

    const dispatchVisible = React.useCallback(() => {
        
        dispatch(navigationSlice.actions.setHeaderVisible(memoHeader))
    }, [memoHeader])

    React.useEffect(() => {
        dispatchVisible()

    }, [memoHeader]) */


    const desktop = useMediaQuery('(min-width:1024px)');

    const scrollTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    var logoDivRef = React.useRef<HTMLDivElement>(null)
    const getLogoDivRefHeight = () => {
        if (logoDivRef.current)
            return logoDivRef.current.getBoundingClientRect().height
    }


    const variants = {
        landing: { height: getLogoDivRefHeight() },
        buildings: { height: "auto" },
    }

    const getVariant = () => {
        if (panelView === "landing") {
            return "landing"
        } else return "buildings"
    }

    return (

        <StyledOuterDiv
            $visible={visible}
            $modalAdjustment={modalAdjustment}
            /* initial={{ height: 0 }} */
            animate={getVariant()}
            variants={variants}
        >

            <LogoDiv ref={logoDivRef} $visible={visible}>
                {/* <StyledImg onClick={scrollTop} src={Logo}></StyledImg> */}
                <StyledLogoText1 onClick={scrollTop} $desktop={desktop} style={{}} variant="h4" >
                    broker
                </StyledLogoText1>
                <StyledLogoText2 onClick={scrollTop} $desktop={desktop} style={{}} variant="h4" >
                    X
                </StyledLogoText2>
                <StyledLogoText1 onClick={scrollTop} $desktop={desktop} style={{}} variant="h4" >
                    change
                </StyledLogoText1>

            </LogoDiv>




            <AnimatePresence>
                {panelView !== "landing" && (
                    <motion.div

                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Navigation></Navigation>
                    </motion.div>

                )}
            </AnimatePresence>


            <AnimatePresence>
                {panelView !== "landing" && (
                    <StyledAuthOuterDiv $visible={visible} $modalAdjustment={modalAdjustment}>
                        <UserAuth></UserAuth>
                    </StyledAuthOuterDiv>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {panelView !== "landing" && (
                    <StyledMenuOuterDiv $visible={visible} $modalAdjustment={modalAdjustment}>
                        <IconButton onClick={handleMenuClick} aria-label="menu" size="large">
                            <MenuOutlinedIcon fontSize="inherit" />
                        </IconButton>
                    </StyledMenuOuterDiv>
                )}
            </AnimatePresence>


        </StyledOuterDiv>



    )

}

export default Header