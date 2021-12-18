import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import { useHeaderVisible } from "../utils/useHeaderVisible";

import Logo from "../assets/Logo.png"

import Navigation from "../components/buildings/Navigation"

import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "./../redux/hooks"
import { navigationSlice } from "./../redux/slices/navigationSlice";


interface VisibilityProps {
    visible?: boolean,
    modalAdjustment?: boolean
}

interface MediaProps {
    desktop: boolean
}


const StyledStack = styled(Stack) <VisibilityProps>`
position: fixed;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
/* background-color: #6e717a73; */
z-index: 100;
width: 100%;
top: ${props => props.visible === true ? 0 : "-50px"};
background-color: white;
display: flex;
flex-direction: column;
box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
padding-right: ${props => props.modalAdjustment === true ? "17px" : 0};

`

const LogoDiv = styled.div<VisibilityProps>`
position: relative;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
top: ${props => props.visible === true ? 0 : "-20px"};
display: flex;
flex-direction: row;
padding: 0.75rem;
`

const StyledImg = styled.img`
object-fit: contain;
width: 100%;
height: 75px;
cursor: pointer;
`

const StyledLogoText = styled(Typography) <MediaProps>`
&& {
    font-family: 'Ubuntu', sans-serif;
font-size: ${props => props.desktop === true ? "2.125rem" : "1.5rem"};
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

interface Props {

}

export const Header: React.FunctionComponent<Props> = ({ }) => {
    
    const modalAdjustment = useAppSelector(state => state.navigation.modalAdjustment)

    const visible = useHeaderVisible()
    const desktop = useMediaQuery('(min-width:1024px)');

    const scrollTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    return (

        <StyledStack
            visible={visible}
            modalAdjustment={modalAdjustment}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
        >

            <LogoDiv visible={visible}>
                {/* <StyledImg onClick={scrollTop} src={Logo}></StyledImg> */}
                <StyledLogoText1 onClick={scrollTop} desktop={desktop} style={{}} variant="h4" >
                    broker
                </StyledLogoText1>
                <StyledLogoText2 onClick={scrollTop} desktop={desktop} style={{}} variant="h4" >
                    X
                </StyledLogoText2>
                <StyledLogoText1 onClick={scrollTop} desktop={desktop} style={{}} variant="h4" >
                    change
                </StyledLogoText1>

            </LogoDiv>
            <Navigation></Navigation>

        </StyledStack>



    )

}

export default Header