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


const StyledLandlordDetails = styled.div`
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



interface SelectProps {
    $error: boolean
}

const StyledSelect = styled(Select, transientOptions) <SelectProps>`

padding: 0.5rem;
padding-right: 0px;
padding-left: 0px;
& .react-select__control {
    border-color: ${props => props.$error ? "red" : "#cccccc"};
}

& .react-select__control:hover {
    border-color: ${props => props.$error ? "red" : "#585858"};
}

&&& .react-select__control--menu-is-open {
    border-color: ${props => props.$error ? "red" : "#556cd6"};
    box-shadow: ${props => props.$error ? "0 0 0 1px red" : "0 0 0 1px #556cd6"};
    
}

`


const StyledSelectDiv = styled.div`
display: flex;
flex-direction: column;
width: 50%;
`

const StyledSelectHelperText = styled.div`
font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
    text-align: left;
    margin-top: -5px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    color: #ff1744;
    padding-left: 1rem;
`

interface Props {

}

export const AddLandlordDialog: React.FC<Props> = ({ }) => {

    const router = useRouter()

    const dispatch = useAppDispatch()
    const addLandlordDialogOpen = useAppSelector((state) => state.navigation.addLandlordDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setAddLandlordDialog(false))
    };

    const clearLandlordDetails = () => {
        setLandlordDetails({
            name: "",
            name_lowerCase: "",
            address: "",
            website: "",
            email: "",
            office: ""
        })
        setLandlordDetailsError({
            name: false,
            name_lowerCase: false,
            address: false,
            website: false,
            email: false,
            office: false,
            nameExists: false,
        })
    }

    const landlordsData = useAppSelector((state) => state.navigation.landlordsData)





    interface LandlordDetails {
        name?: string,
        name_lowerCase?: string,
        address?: string,
        website?: string,
        email?: string,
        office?: string,
    }

    const [landlordDetails, setLandlordDetails] = React.useState<LandlordDetails>({
        name: "",
        name_lowerCase: "",
        address: "",
        website: "",
        email: "",
        office: "",
    })

    interface LandlordDetailsError {
        name?: boolean,
        name_lowerCase?: boolean,
        address?: boolean,
        website?: boolean,
        email?: boolean,
        office?: boolean,
        nameExists: boolean,
    }

    const [landlordDetailsError, setLandlordDetailsError] = React.useState<LandlordDetailsError>({
        name: false,
        name_lowerCase: false,
        address: false,
        website: false,
        email: false,
        office: false,
        nameExists: false
    })

    console.log(landlordDetails, landlordDetailsError)



    const validateLandlordDetails = async () => {
        var name = false
        var address = false
        var website = false
        var email = false
        var office = false

        if (landlordDetails.name === "") {
            name = true;
        } else name = false
        /* if (landlordDetails.address === "") {
            address = true;
        } else address = false
        if (landlordDetails.website === "") {
            website = true;
        } else website = false
        if (landlordDetails.email === "") {
            email = true;
        } else email = false
        if (landlordDetails.office === "") {
            office = true;
        } else office = false */


        return {
            name: name,
            address: address,
            website: website,
            email: email,
            office: office,
        }
    };

    const checkLandlordName = async () => {
        if (landlordDetails.name !== "") {
            const docRef = doc(db, "landlords", landlordDetails.name!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return true
            } else {
                return false
            }
        } else return false

    }

    const checkErrors = async (errors: any, landlordExists: boolean) => {
        setLandlordDetailsError({ ...errors, nameExists: landlordExists })
        if (errors.name || /* errors.address || errors.website || errors.email || errors.office  || */ landlordExists) {
            return true
        } else return false

    }


    const handleSubmit = async () => {

        var landlordExists = await checkLandlordName()
        var errors = await validateLandlordDetails()
        var errorState = await checkErrors(errors, landlordExists)



        if (!errorState) {
            submitLandlord().then(() => {
                /* router.push(`/building/${encodeURIComponent(buildingDetails.name!)}`) */
            })
        }

    }


    const submitLandlord = async () => {

        await setDoc(doc(db, "landlords", landlordDetails.name!), {
            name: landlordDetails.name,
            name_lowerCase: landlordDetails.name_lowerCase,
            address: landlordDetails.address,
            website: landlordDetails.website,
            email: landlordDetails.email,
            office: landlordDetails.office,


        }, { merge: true })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })


        dispatch(navigationSlice.actions.setAddLandlordDialog(false))
    }




    const getNameError = (name: boolean, nameExists: boolean) => {
        if (name) {
            return true
        } else if (nameExists) {
            return true
        } else return false
    }

    const getNameHelperText = (name: boolean, nameExists: boolean) => {
        if (name) {
            return "Required"
        } else if (nameExists) {
            return "Landlord already exists"
        } else return ""
    }

    const handleNameChange = React.useCallback(
        (e: any) => {
            setLandlordDetails({ ...landlordDetails, name: e.target.value,  name_lowerCase: e.target.value.toLowerCase() })
        }, [landlordDetails])

    const handleAddressChange = React.useCallback(
        (e: any) => {
            setLandlordDetails({ ...landlordDetails, address: e.target.value })
        }, [landlordDetails])


    const handleWebsiteChange = React.useCallback(
        (e: any) => {
            setLandlordDetails({ ...landlordDetails, website: e.target.value })
        }, [landlordDetails])


    const handleEmailChange = React.useCallback(
        (e: any) => {
            setLandlordDetails({ ...landlordDetails, email: e.target.value })
        }, [landlordDetails])

    const handleOfficeChange = React.useCallback(
        (e: any) => {
            setLandlordDetails({ ...landlordDetails, office: e.target.value })
        }, [landlordDetails])


    return (
        <div>

            <Dialog
                maxWidth="xl"
                closeAfterTransition={true} open={addLandlordDialogOpen} onClose={handleClose}
                TransitionProps={{
                    onExited: () => {
                        dispatch(navigationSlice.actions.setModalAdjustment(false))
                        clearLandlordDetails()
                    }
                    // timeout: {
                    //   enter: 1000,
                    //   exit: 1000
                    // }
                }}
            /* transitionDuration={{ enter: 1000, exit: 1000 }} */
            >
                <DialogTitle>Add Landlord</DialogTitle>
                <DialogContent>
                    <StyledLandlordDetails>
                        <StyledInput
                            size="small"
                            id="Landlord Name"
                            label="Landlord Name"
                            variant="outlined"
                            onChange={handleNameChange}
                            value={landlordDetails.name}
                            /* defaultValue="Hello World" */
                            error={getNameError(landlordDetailsError.name!, landlordDetailsError.nameExists!)} helperText={getNameHelperText(landlordDetailsError.name!, landlordDetailsError.nameExists!)}
                        />
                        <StyledInput
                            size="small"
                            id="address"
                            label="Address"
                            variant="outlined"
                            onChange={handleAddressChange}
                            value={landlordDetails.address}
                            /* defaultValue="Hello World" */
                            error={landlordDetailsError.address} helperText={landlordDetailsError.address ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="website"
                            label="Website"
                            variant="outlined"
                            onChange={handleWebsiteChange}
                            value={landlordDetails.website}
                            /* defaultValue="Hello World" */
                            error={landlordDetailsError.website} helperText={landlordDetailsError.website ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={handleEmailChange}
                            value={landlordDetails.email}
                            /* defaultValue="Hello World" */
                            error={landlordDetailsError.email} helperText={landlordDetailsError.email ? `Required` : ``}
                        />
                        <StyledInput
                            size="small"
                            id="office"
                            label="Office"
                            variant="outlined"
                            onChange={handleOfficeChange}
                            value={landlordDetails.office}
                            /* defaultValue="Hello World" */
                            error={landlordDetailsError.office} helperText={landlordDetailsError.office ? `Required` : ``}
                        />






                    </StyledLandlordDetails>



                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddLandlordDialog