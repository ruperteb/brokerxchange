import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
/* import DialogContentText from '@mui/material/DialogContentText'; */
import DialogTitle from '@mui/material/DialogTitle';

import styled from "@emotion/styled"

import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { navigationSlice } from "../../redux/slices/navigationSlice";

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

import { db, auth } from "../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
/* import { stringify } from 'querystring'; */

import BuildingCard from './buildingcard/BuildingCard'
import Typography from '@mui/material/Typography';

import SavedListPDF from "./SavedListPDF"
import { PDFViewer } from '@react-pdf/renderer';


const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.5rem;
color: black;
margin: auto;
/* margin-left: 1.5rem; */
`

const StyledDialog = styled(Dialog)`
& .MuiDialog-paper {
    height: 100%;
}

& .MuiDialogContent-root {
    overflow-y: hidden;
    padding: 0px;
}

`



interface Props {

}

export const PreviewPDFDialog: React.FC<Props> = ({ }) => {



    const dispatch = useAppDispatch()
    const viewPreviewPDFDialogOpen = useAppSelector((state) => state.navigation.viewPreviewPDFDialogOpen)
    const previewPDFData = useAppSelector((state) => state.navigation.previewPDFData)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setViewPreviewPDFDialogOpen(false))
    };




    return (
        <div>

            <StyledDialog
            style={{height: "100%"}}
                fullWidth={true}
                maxWidth={false}
                closeAfterTransition={true} open={viewPreviewPDFDialogOpen} onClose={handleClose}
                TransitionProps={{
                    /* onExited: () => {
                        dispatch(navigationSlice.actions.setModalAdjustment(false))
                    } */
                    // timeout: {
                    //   enter: 1000,
                    //   exit: 1000
                    // }
                }}
            /* transitionDuration={{ enter: 1000, exit: 1000 }} */
            >
                <DialogTitle>
                    Preview PDF
                </DialogTitle>
                <DialogContent>

                    <PDFViewer width="100%" height="100%" style={{border: "0px"}}>
                        <SavedListPDF previewPDFData={previewPDFData}  />
                    </PDFViewer>




                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Close</Button>
                    
                </DialogActions>
            </StyledDialog>



        </div>
    );
}

export default PreviewPDFDialog