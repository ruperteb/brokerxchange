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

export const LandlordsList: React.FC<Props> = ({ }) => {

    const user = useAuth()

    const dispatch = useAppDispatch()

    /* const ref = React.createRef(); */

    const landlordsData = useAppSelector((state) => state.navigation.landlordsData)
    console.log('landlords data', landlordsData)


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
        await deleteDoc(doc(db, "landlords", id));
        handleDeletePopoverClose()

    }

    const handleViewLandlord = (landlord: DocumentData) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        dispatch(navigationSlice.actions.setSelectedLandlord(landlord))
        dispatch(navigationSlice.actions.setViewLandlordDialogOpen(true))
    }

const cardRef = React.useRef<HTMLDivElement>(null)

    return (

        <AnimatePresence>
            {landlordsData.map((landlord) => (
                <AnimatedListItemBuildings key={landlord.id} >
                    <Card ref={cardRef} style={{ marginBottom: "1.5rem" }}>
                        <StyledCardDiv>
                            <StyledTopTextContainer>
                                <StyledTitleText>{landlord.name}</StyledTitleText>
                                <StyledButton color="secondary" variant="contained" onClick={()=>handleViewLandlord(landlord)}>View </StyledButton>
                                <StyledIconButton onClick={(e)=>handleDeletePopoverClick(e, landlord.id)} aria-label="delete" color="error">
                                    <DeleteIcon />
                                </StyledIconButton>
                                <Popover
                                    id={landlord.id}
                                    open={deletePopoverOpen === landlord.id ? true : false}
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
                                        <Typography sx={{ p: 2 }}>Are you sure you want to delete this landlord?</Typography>
                                        <StyledPopoverConfirmButton onClick={() => handleDelete(landlord.id)}>Confirm</StyledPopoverConfirmButton>
                                        <StyledPopoverCancelButton onClick={handleDeletePopoverClose}>Cancel</StyledPopoverCancelButton>
                                    </StyledPopoverDiv>

                                </Popover>
                            </StyledTopTextContainer>
                           {/*  <StyledBottomTextContainer>
                                <StyledSubTitleText>{list.subTitle}</StyledSubTitleText>
                                <StyledSubText >{getBuildingsNumber(list.buildings)} Buildings | Created: {getDate(list.lastUpdated)}</StyledSubText>

                            </StyledBottomTextContainer> */}

                        </StyledCardDiv>

                    </Card>
                </AnimatedListItemBuildings>
            ))}
        </AnimatePresence>


    )
}

export default LandlordsList