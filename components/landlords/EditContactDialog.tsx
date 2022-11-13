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
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
/* import { stringify } from 'querystring'; */

import { transientOptions } from "../../utils/transientOptions"
import { useRouter } from 'next/router';


const StyledContactDetails = styled.div`
display: flex;
flex-direction: column;
flex-wrap: wrap;
width: 400px;
`

const StyledInput = styled(TextField)`
&.MuiTextField-root {
    width: 100%;
    padding-right: 0.5rem;
    margin: auto;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
/* margin-left: 0.5rem; */
}

`





interface Contact {
    id: string,
    email: string,
    mobile: string,
    name: string,
    office: string,
}

interface Props {
    landlordId: string,
    selectedContact: Contact,
    setSelectedContact: React.Dispatch<React.SetStateAction<Contact>>
}

export const EditContactDialog: React.FC<Props> = ({ landlordId, setSelectedContact, selectedContact }) => {

    const router = useRouter()

    const dispatch = useAppDispatch()
    const editContactDialogOpen = useAppSelector((state) => state.navigation.editContactDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setEditContactDialog(false))
    };

    const clearBuildingDetails = () => {
        setContactDetails({
            name: "",
            email: "",
            mobile: "",
            office: "",
        })
        setContactDetailsError({
            name: false,
            email: false,
            mobile: false,
            office: false,
        })
    }

    interface Contact {

        email: string,
        mobile: string,
        name: string,
        office: string,
    }

    const [contactDetails, setContactDetails] = React.useState<Contact>({
        name: selectedContact.name,
        email: selectedContact.email,
        mobile: selectedContact.mobile,
        office: selectedContact.office,
    })

    React.useEffect(() => {
        setContactDetails({
            name: selectedContact.name,
            email: selectedContact.email,
            mobile: selectedContact.mobile,
            office: selectedContact.office,
        })
    }, [selectedContact])


    interface ContactDetailsError {

        email: boolean,
        mobile: boolean,
        name: boolean,
        office: boolean,
    }

    const [contactDetailsError, setContactDetailsError] = React.useState<ContactDetailsError>({

        email: false,
        mobile: false,
        name: false,
        office: false,
    })

    const handleNameChange = React.useCallback(
        (e: any) => {
            setContactDetails({ ...contactDetails, name: e.target.value })
        }, [contactDetails])

    const handleEmailChange = React.useCallback(
        (e: any) => {
            setContactDetails({ ...contactDetails, email: e.target.value })
        }, [contactDetails])

    const handleMobileChange = React.useCallback(
        (e: any) => {
            setContactDetails({ ...contactDetails, mobile: e.target.value })
        }, [contactDetails])

    const handleOfficeChange = React.useCallback(
        (e: any) => {
            setContactDetails({ ...contactDetails, office: e.target.value })
        }, [contactDetails])


    const validateContactDetails = async () => {
        var name = false
        var email = false
        var mobile = false
        var office = false


        if (contactDetails.name === "") {
            name = true;
        } else name = false
        if (contactDetails.email === "") {
            email = true;
        } else email = false
        if (contactDetails.mobile === "") {
            mobile = true;
        } else mobile = false
        if (contactDetails.office === "") {
            office = true;
        } else office = false


        return {
            name: name,
            email: email,
            mobile: mobile,
            office: office,
        }
    };

    /* const checkBuildingName = async () => {
        if (buildingDetails.name !== "") {
            const docRef = doc(db, "buildings", buildingDetails.name!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return true
            } else {
                return false
            }
        } else return false

    } */

    const checkErrors = async (errors: any) => {
        setContactDetailsError({ ...errors })
        if (errors.name || errors.email || errors.mobile || errors.office) {
            return true
        } else return false

    }


    const handleSubmit = async () => {

        /* var buildingExists = await checkBuildingName() */
        var errors = await validateContactDetails()
        var errorState = await checkErrors(errors)



        if (!errorState) {
            submitContact().then(() => {
                /* router.push(`/building/${encodeURIComponent(buildingDetails.name!)}`) */

            })
        }

    }


    const submitContact = async () => {


        await setDoc(doc(db, "landlords/" + landlordId + "/contacts", selectedContact.id), {
            name: contactDetails.name,
            email: contactDetails.email,
            mobile: contactDetails.mobile,
            office: contactDetails.office,


        }, { merge: true })
            .then((result) => {
                console.log(result)
                setSelectedContact({
                    id: contactDetails.name,
                    name: contactDetails.name,
                    email: contactDetails.email,
                    mobile: contactDetails.mobile,
                    office: contactDetails.office,
                })
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })


        dispatch(navigationSlice.actions.setEditContactDialog(false))
    }

    return (
        <div>

            <Dialog
                maxWidth="xl"
                closeAfterTransition={true} open={editContactDialogOpen} onClose={handleClose}
                TransitionProps={{
                    onExited: () => {
                       /*  dispatch(navigationSlice.actions.setModalAdjustment(false)) */
                        clearBuildingDetails()
                    }
                    // timeout: {
                    //   enter: 1000,
                    //   exit: 1000
                    // }
                }}
            /* transitionDuration={{ enter: 1000, exit: 1000 }} */
            >
                <DialogTitle>Edit Contact</DialogTitle>
                <DialogContent>
                    <StyledContactDetails>

                        <StyledInput
                            size="small"
                            id="name"
                            label="Name"
                            variant="outlined"
                            onChange={handleNameChange}
                            value={contactDetails.name}
                            /* defaultValue="Hello World" */
                            error={contactDetailsError.name} helperText={contactDetailsError.name ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={handleEmailChange}
                            value={contactDetails.email}
                            /* defaultValue="Hello World" */
                            error={contactDetailsError.email} helperText={contactDetailsError.email ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="mobile"
                            label="Mobile"
                            variant="outlined"
                            onChange={handleMobileChange}
                            value={contactDetails.mobile}
                            /* defaultValue="Hello World" */
                            error={contactDetailsError.mobile} helperText={contactDetailsError.mobile ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="office"
                            label="Office"
                            variant="outlined"
                            onChange={handleOfficeChange}
                            value={contactDetails.office}
                            /* defaultValue="Hello World" */
                            error={contactDetailsError.office} helperText={contactDetailsError.office ? `Required` : ``}
                        />



                    </StyledContactDetails>



                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditContactDialog