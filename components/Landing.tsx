import React from "react"
import styled from "@emotion/styled"
import Container from "@mui/material/Container"
import { useAppSelector, useAppDispatch } from "../redux/hooks"

import AddBuildingDialog from "./buildings/AddBuildingDialog"
import ViewSelectedBuildingsDialog from "./buildings/viewselectedbuildings/ViewSelectedBuildingsDialog"

import { motion, AnimatePresence } from 'framer-motion'

import SelectedBuildingsDrawer from "./buildings/viewselectedbuildings/SelectedBuildingsDrawer"
import { navigationSlice } from "../redux/slices/navigationSlice"

import Fab from '@mui/material/Fab';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuDrawer from "./buildings/MenuDrawer"

import { transientOptions } from "../utils/transientOptions"

import BuildingsList from "./buildings/BuildingsList"

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';




interface VisibilityProps {
    $modalAdjustment?: boolean
}


const StyledContainer = styled.div`
display: flex;
flex-direction: column;
margin: auto;

`

const StyledTitleDiv = styled.div`
display: flex;
flex-direction: row;
margin-top: 20%;
margin-bottom: 0px;
`

const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1.5rem;
font-style: italic;
margin: auto;
margin-right: 0.2rem;
`

const StyledTitleTextLogo1 = styled(Typography)`
font-family: 'Ubuntu', sans-serif;
font-weight: 400;
font-size: 2.5rem;
color: #1b14a5;
margin: auto;
margin-left: 0px;
margin-right: 0px;
`
const StyledTitleTextLogo2 = styled(Typography)`
font-family: 'Ubuntu', sans-serif;
font-weight: 400;
font-size: 3rem;
color: #ff0000;
margin: auto;
margin-left: 0px;
margin-right: 0px;
`

const StyledSubTitleDiv = styled.div`
display: flex;
flex-direction: row;
margin: auto;
margin-top: 1.5rem;
margin-bottom: 0px;
`
const StyledSubTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1.4rem;
font-style: italic;
margin: auto;
`

const StyledButtonContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: 1.5rem;
margin-bottom: auto;
`

const StyledButtonDiv = styled.div`
display: flex;
flex-direction: row;
margin: auto;
`

const StyledButton = styled(Button)`
margin: auto;
`

const StyledButtonText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1rem;
margin: auto;
`

interface Props {

}

export const Landing: React.FC<Props> = ({ }) => {

    const dispatch = useAppDispatch()

    const modalAdjustment = useAppSelector((state) => state.navigation.modalAdjustment)

    const handleBuildingsClick = () => {
        dispatch(navigationSlice.actions.setPanelView("buildings"))
    };



    return (
        <StyledContainer>
            <StyledTitleDiv>
                <StyledTitleText style={{ paddingRight: "0.5rem" }}>Welcome to</StyledTitleText><StyledTitleTextLogo1>broker</StyledTitleTextLogo1><StyledTitleTextLogo2>X</StyledTitleTextLogo2><StyledTitleTextLogo1 style={{marginRight: "auto"}}>change</StyledTitleTextLogo1>
            </StyledTitleDiv>
            <StyledSubTitleDiv>
                <StyledSubTitleText>A centralised repository of landlord vacancy data</StyledSubTitleText>
            </StyledSubTitleDiv>
            <StyledButtonContainer>
                <StyledButtonDiv>
                    <StyledButton style={{marginRight: "1rem"}} variant="outlined" href="/login">Login</StyledButton ><StyledButton variant="outlined" href="/signUp">Sign Up</StyledButton >
                </StyledButtonDiv>
                <StyledButtonDiv style={{marginTop: "1.5rem"}}>
                    <StyledButtonText style={{marginRight: "1rem"}}>Or proceed to</StyledButtonText>  <StyledButton variant="contained" onClick={handleBuildingsClick} startIcon={<HomeWorkOutlinedIcon />}>Buildings</StyledButton>
                </StyledButtonDiv>

            </StyledButtonContainer>
        </StyledContainer>
    )
}

export default Landing