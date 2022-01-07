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
import SavedLists from "./savedlists/SavedLists"
import Landing from "./Landing"

import dynamic from 'next/dynamic'

const ViewSavedListDialog = dynamic(() => import( "./savedlists/ViewSavedListDialog"), 
{ loading: () => <p>Loading</p>, ssr: false })

import { useAuth } from '../utils/authProvider'

const StyledContainer = styled(Container)`
margin-top: 160px;
display: flex;
flex-direction: column;
`

interface VisibilityProps {
    $modalAdjustment?: boolean
}

const StyledDrawerButtonDiv = styled(motion.div, transientOptions) <VisibilityProps>`
position: fixed;
top: 200px;
right: ${props => props.$modalAdjustment === true ? "67px" : "50px"};
`

interface Props {

}

export const BuildingsPanel: React.FC<Props> = ({ }) => {

    const user = useAuth()

    const dispatch = useAppDispatch()

    const modalAdjustment = useAppSelector((state) => state.navigation.modalAdjustment)

    const handleDrawerOpen = () => {
        dispatch(navigationSlice.actions.setSelectedBuildingsDrawerOpen(true))
    };

    const selectedBuildings = useAppSelector(state => state.navigation.selectedBuildings)

    const panelView = useAppSelector(state => state.navigation.panelView)

    const handleView = () => {
        switch (panelView) {
            case "landing":
                return <Landing />
            case "buildings":
                return <BuildingsList />
            case "lists":
                return <SavedLists />

            default:
                return <Landing />
        }
    }


    return (
        <StyledContainer maxWidth="xl" >

            {handleView()}



            <SelectedBuildingsDrawer></SelectedBuildingsDrawer>

            <AnimatePresence>
                {selectedBuildings.length !== 0 && (
                    <StyledDrawerButtonDiv
                        $modalAdjustment={modalAdjustment}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Fab color="primary" variant="extended" onClick={handleDrawerOpen}>
                            <ChevronLeftIcon style={{ fontSize: "2rem" }} /> Selection
                        </Fab>
                    </StyledDrawerButtonDiv>

                )}
            </AnimatePresence>


            <AddBuildingDialog></AddBuildingDialog>
            <ViewSelectedBuildingsDialog></ViewSelectedBuildingsDialog>
            {user?.uid ? <ViewSavedListDialog></ViewSavedListDialog> : <></>}
            <MenuDrawer></MenuDrawer>

        </StyledContainer>
    )
}

export default BuildingsPanel