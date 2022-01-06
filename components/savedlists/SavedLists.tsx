import React from "react"
import styled from "@emotion/styled"

import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import Card from "@mui/material/Card"
import Popover  from "@mui/material/Popover"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AnimatedListItemBuildings from "../buildings/AnimatedListItemBuildings"

import { motion, AnimatePresence } from 'framer-motion'

import { DocumentData, doc, deleteDoc, addDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { navigationSlice, setEditPremisesDialog } from "../../redux/slices/navigationSlice";
import { db } from '../../utils/firebaseClient';
import { useAuth } from "../../utils/authProvider"



const StyledCardDiv = styled.div`
display:flex;
flex-direction:column;

width: 600px;
`

const StyledTopTextContainer = styled.div`
display:flex;
flex-direction:row;
width: 100%;
background-color: #0f0c50e6;
padding: 0.5rem;
`

const StyledBottomTextContainer = styled.div`
display:flex;
flex-direction:row;
width: 100%;
padding: 0.5rem;

`

const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.4rem;
color: white;
padding-left: 1rem;
/* color: #353c48;
padding: 0.5rem;
padding-right: 0.5rem;
padding-left: 0px; */

`

const StyledSubTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1.1rem;
padding-left: 1rem;
/* color: #353c48;
padding: 0.5rem;
padding-right: 0.5rem;
padding-left: 0px; */

`

const StyledSubText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 0.9rem;
margin: auto;
margin-right: 0.5rem;
/* color: #353c48;
padding: 0.5rem;
padding-right: 0.5rem;
padding-left: 0px; */

`

const StyledButton = styled(Button)`
margin: auto;
margin-right: 0.5rem;
`

const StyledIconButton = styled(IconButton)`
margin: auto;
margin-right: 0.5rem;
margin-left: 0px;
color: white;
transition: all 0.2s ease;
&:hover {
background-color: white;
color: red;
}
`

const StyledPopoverDiv = styled.div`
display: flex;
flex-direction: row;
`

const StyledPopoverConfirmButton = styled(Button)`
display:flex;
margin-left: 1rem;

`

const StyledPopoverCancelButton = styled(Button)`
display:flex;
margin-left: 0.5rem;
margin-right: 0.5rem;

`

interface Props {

}

export const SavedLists: React.FC<Props> = ({ }) => {

    const user = useAuth()

    const dispatch = useAppDispatch()

    /* const ref = React.createRef(); */

    const savedListsData = useAppSelector((state) => state.navigation.savedListsData)
    console.log('lists', savedListsData)

    const getDate = (date: string) => {
        var formattedDate = new Date(date).toLocaleDateString('en-GB');
        return formattedDate
    }

    const getBuildingsNumber = (buildings: any) => {
        var keys = Object.keys(buildings)
        return keys.length
    }

    const [anchorDeletePopover, setAnchorDeletePopover] = React.useState<HTMLButtonElement | null>(null);

    const [deletePopoverOpen, setDeletePopoverOpen] = React.useState("")

    const handleDeletePopoverClick = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
        /* if (cardRef.current?.scrollHeight !== undefined && (cardRef.current?.scrollHeight >= document.body.clientHeight)) { */
            dispatch(navigationSlice.actions.setModalAdjustment(true))
       /*  } */
        setAnchorDeletePopover(event.currentTarget);
        setDeletePopoverOpen(name)
        
    };

    const handleDeletePopoverClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorDeletePopover(null);
        setDeletePopoverOpen("")
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "users/" + user?.uid + "/lists", id));
        handleDeletePopoverClose()

    }

    const handleViewSavedList = (list: DocumentData) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        dispatch(navigationSlice.actions.setSelectedList(list))
        dispatch(navigationSlice.actions.setViewSavedListDialogOpen(true))
    }

const cardRef = React.useRef<HTMLDivElement>(null)

    return (

        <AnimatePresence>
            {savedListsData.map((list) => (
                <AnimatedListItemBuildings key={list.id} >
                    <Card ref={cardRef} style={{ marginBottom: "1.5rem" }}>
                        <StyledCardDiv>
                            <StyledTopTextContainer>
                                <StyledTitleText>{list.title}</StyledTitleText>
                                <StyledButton color="secondary" variant="contained" onClick={()=>handleViewSavedList(list)}>View </StyledButton>
                                <StyledIconButton onClick={(e)=>handleDeletePopoverClick(e, list.id)} aria-label="delete" color="error">
                                    <DeleteIcon />
                                </StyledIconButton>
                                <Popover
                                    id={list.id}
                                    open={deletePopoverOpen === list.id ? true : false}
                                    anchorEl={anchorDeletePopover}
                                    onClose={handleDeletePopoverClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <StyledPopoverDiv >
                                        <Typography sx={{ p: 2 }}>Are you sure you want to delete this list?</Typography>
                                        <StyledPopoverConfirmButton onClick={() => handleDelete(list.id)}>Confirm</StyledPopoverConfirmButton>
                                        <StyledPopoverCancelButton onClick={handleDeletePopoverClose}>Cancel</StyledPopoverCancelButton>
                                    </StyledPopoverDiv>

                                </Popover>
                            </StyledTopTextContainer>
                            <StyledBottomTextContainer>
                                <StyledSubTitleText>{list.subTitle}</StyledSubTitleText>
                                <StyledSubText >{getBuildingsNumber(list.buildings)} Buildings | Created: {getDate(list.lastUpdated)}</StyledSubText>

                            </StyledBottomTextContainer>

                        </StyledCardDiv>

                    </Card>
                </AnimatedListItemBuildings>
            ))}
        </AnimatePresence>


    )
}

export default SavedLists