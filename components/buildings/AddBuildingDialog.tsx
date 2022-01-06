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


const StyledBuildingDetails = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
width: 600px;
`

const StyledInput = styled(TextField)`
&.MuiTextField-root {
    width: 50%;
    padding-right: 0.5rem;
    margin: auto;
    margin-top: 0.5rem;
/* margin-left: 0.5rem; */
}

`

const StyledBuildingName = styled(StyledInput)`
&.MuiTextField-root {
     width: 70%;
}
`

const StyledBuildingAddress = styled(StyledInput)`
&.MuiTextField-root {
    width: 100%;
    padding-right: 0px;
    margin-top: 8px;
    margin-bottom: 8px;
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

export const AddBuildingDialog: React.FC<Props> = ({ }) => {

    const router = useRouter()

    const dispatch = useAppDispatch()
    const addBuildingDialogOpen = useAppSelector((state) => state.navigation.addBuildingDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setAddBuildingDialog(false))
    };

    const clearBuildingDetails = () => {
        setBuildingDetails({
            name: "",
            name_lowerCase: "",
            address: "",
            buildingsLogo: "",
            contactEmail: "",
            contactMobile: "",
            contactName: "",
            contactOffice: "",
            landlord: "",
            landlordId: "",
            lastUpdated: "",  //Date.now().toISOString()
            province: "",
            suburb: "",
            suburb_lowerCase: "",
            type: "",
        })
        setBuildingDetailsError({
            name: false,
            nameExists: false,
            address: false,
            contactName: false,
            landlord: false,
            province: false,
            suburb: false,
            type: false,
        })
    }

    const landlordsData = useAppSelector((state) => state.navigation.landlordsData)
    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)


    var formattedLandlordNames = landlordsData.map((landlord) => {
        return { value: landlord.name, label: landlord.name, id: landlord.id, buildingsLogo: landlord.buildingsLogo }
    })

    var typeOptions = [
        { value: "Office", label: "Office" },
        { value: "Industrial", label: "Industrial" },
        { value: "Retail", label: "Retail" },
        { value: "Mixed Use", label: "Mixed Use" },
        { value: "Other", label: "Other" },
    ]

    var suburbData = buildingsData.map((building: any) => { return building.suburb })

    var distinctSuburbs: string[] = Array.from(new Set(suburbData.map((suburb: string) => { return suburb })))

    var formattedSuburbs = distinctSuburbs.map((suburb) => {
        return { value: suburb, label: suburb }
    })

    var provinceOptions = [
        { value: "Western Cape", label: "Western Cape" },
        { value: "Gauteng", label: "Gauteng" },
        { value: "KwaZulu-Natal", label: "KwaZulu Natal" },
        { value: "Eastern Cape", label: "Eastern Cape" },
        { value: "Free State", label: "Free State" },
        { value: "Northern Cape", label: "Northern Cape" },
        { value: "Limpopo", label: "Limpopo" },
        { value: "North West", label: "North West" },
        { value: "Mpumalanga", label: "Mpumalanga" },
    ]

    interface BuildingDetails {
        name?: string,
        name_lowerCase?: string,
        address?: string,
        buildingsLogo?: string,
        contactEmail?: string,
        contactMobile?: string,
        contactName?: string,
        contactOffice?: string,
        images?: string[],
        landlord?: string,
        landlordId?: string,
        lastUpdated?: string   //Date.now().toISOString()
        parkingRatio?: number,
        province?: string,
        rentalHigh?: number,
        rentalLow?: number,
        suburb?: string,
        suburb_lowerCase?: string,
        type?: string,
        vacantGLA?: number,
    }

    const [buildingDetails, setBuildingDetails] = React.useState<BuildingDetails>({
        name: "",
        name_lowerCase: "",
        address: "",
        buildingsLogo: "",
        contactEmail: "",
        contactMobile: "",
        contactName: "",
        contactOffice: "",
        landlord: "",
        landlordId: "",
        lastUpdated: "",  //Date.now().toISOString()
        province: "",
        suburb: "",
        suburb_lowerCase: "",
        type: "",
    })

    interface BuildingDetailsError {
        name: boolean,
        nameExists: boolean,
        address: boolean,
        province: boolean,
        suburb: boolean,
        type: boolean,
        landlord: boolean,
        contactName: boolean,
    }

    const [buildingDetailsError, setBuildingDetailsError] = React.useState<BuildingDetailsError>({
        name: false,
        nameExists: false,
        address: false,
        contactName: false,
        landlord: false,
        province: false,
        suburb: false,
        type: false,
    })

    console.log(buildingDetails, buildingDetailsError)

    const customSelectStyles = {
        /* option: (provided: any, state: any) => ({
            ...provided,
            

        }), */

        control: (provided: any, state: any) => ({

            ...provided,
            height: "40px",

        }),
        container: (provided: any, state: any) => ({
            ...provided,
            width: "auto",
            height: "fit-content"
        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            zIndex: 100000,
            position: "absolute"
        }),
        menuPortal: (provided: any, state: any) => ({
            ...provided,
            zIndex: 100000,
        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            maxHeight: "200px"
        }),

    }

    interface ContactDetails {
        value: string;
        email: string;
        office: string;
        mobile: string;

    }

    const [landlordContacts, setLandlordContacts] = React.useState<ContactDetails[]>()

    const getlandlordContacts = async (landlordId: string) => {

        const qLandlordContacts = query(collection(db, "landlords/" + landlordId + "/contacts"), orderBy("name", "asc"));

        const querySnapshot = await getDocs(qLandlordContacts);
        let contacts: DocumentData[] = []
        querySnapshot.docs.map((doc) => {
            let contact = { ...doc.data(), id: doc.id }
            contacts = [...contacts, contact]
        })
        return contacts
    }

    const onSelectType = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setBuildingDetails({ ...buildingDetails, type: value.value })
            }
            if (actionType.action === "create-option") {
                setBuildingDetails({ ...buildingDetails, type: value.value })
            }
            if (actionType.action === "clear") {
                setBuildingDetails({ ...buildingDetails, type: "" })
            }
        }, [buildingDetails])

    const onSelectSuburb = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setBuildingDetails({ ...buildingDetails, suburb: value.value, suburb_lowerCase: value.value.toLowerCase() })
            }
            if (actionType.action === "create-option") {
                setBuildingDetails({ ...buildingDetails, suburb: value.value })
            }
            if (actionType.action === "clear") {
                setBuildingDetails({ ...buildingDetails, suburb: "", suburb_lowerCase: "" })
            }
        }, [buildingDetails])

    const onSelectProvince = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setBuildingDetails({ ...buildingDetails, province: value.value })
            }
            if (actionType.action === "create-option") {
                setBuildingDetails({ ...buildingDetails, province: value.value })
            }
            if (actionType.action === "clear") {
                setBuildingDetails({ ...buildingDetails, province: "" })
            }
        }, [buildingDetails])


    const onSelectLandlord = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setBuildingDetails({ ...buildingDetails, landlord: value.value, landlordId: value.id, buildingsLogo: value.buildingsLogo, contactName: "", contactEmail: "", contactMobile: "", contactOffice: "" })

                getlandlordContacts(value.id).then((contacts) => {
                    var formattedLandlordContacts = contacts.map((contact) => {
                        return { value: contact.name, label: contact.name, email: contact.email, mobile: contact.mobile, office: contact.office }
                    })
                    setLandlordContacts(formattedLandlordContacts)
                })
            }
            if (actionType.action === "create-option") {
                setBuildingDetails({ ...buildingDetails, landlord: value.value })
            }
            if (actionType.action === "clear") {
                setBuildingDetails({ ...buildingDetails, landlord: "", landlordId: "", buildingsLogo: "" })
                setLandlordContacts(undefined)
            }
        }, [buildingDetails])

    const onSelectContact = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setBuildingDetails({ ...buildingDetails, contactName: value.value, contactEmail: value.email, contactMobile: value.mobile, contactOffice: value.office })
            }
            /* if (actionType.action === "create-option") {
                setBuildingDetails({ ...buildingDetails, province: value.value })
            } */
            if (actionType.action === "clear") {
                setBuildingDetails({ ...buildingDetails, contactName: "", contactEmail: "", contactMobile: "", contactOffice: "" })
            }
        }, [buildingDetails])


    const handleNameChange = React.useCallback(
        (e: any) => {
            setBuildingDetails({ ...buildingDetails, name: e.target.value, name_lowerCase: e.target.value.toLowerCase() })
        }, [buildingDetails])

    const handleAddressChange = React.useCallback(
        (e: any) => {
            setBuildingDetails({ ...buildingDetails, address: e.target.value })
        }, [buildingDetails])


    const validateBuildingDetails = async () => {
        var name = false
        var address = false
        var contactName = false
        var landlord = false
        var province = false
        var suburb = false
        var type = false

        if (buildingDetails.name === "") {
            name = true;
        } else name = false
        if (buildingDetails.address === "") {
            address = true;
        } else address = false
        if (buildingDetails.contactName === "") {
            contactName = true;
        } else contactName = false
        if (buildingDetails.landlord === "") {
            landlord = true;
        } else landlord = false
        if (buildingDetails.province === "") {
            province = true;
        } else province = false
        if (buildingDetails.suburb === "") {
            suburb = true;
        } else suburb = false
        if (buildingDetails.type === "") {
            type = true;
        } else type = false

        return {
            name: name,
            address: address,
            contactName: contactName,
            landlord: landlord,
            province: province,
            suburb: suburb,
            type: type
        }
    };

    const checkBuildingName = async () => {
        if (buildingDetails.name !== "") {
            const docRef = doc(db, "buildings", buildingDetails.name!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return true
            } else {
                return false
            }
        } else return false

    }

    const checkErrors = async (errors: any, buildingExists: boolean) => {
        setBuildingDetailsError({ ...errors, nameExists: buildingExists })
        if (errors.name || errors.address || errors.contactName || errors.landlord || errors.province || errors.suburb || errors.type || buildingExists) {
            return true
        } else return false

    }


    const handleSubmit = async () => {

        var buildingExists = await checkBuildingName()
        var errors = await validateBuildingDetails()
        var errorState = await checkErrors(errors, buildingExists)



        if (!errorState) {
            submitBuilding().then(() => {
                router.push(`/building/${encodeURIComponent(buildingDetails.name!)}`)
            })
        }

    }


    const submitBuilding = async () => {

        var search = `${buildingDetails.address}, ${buildingDetails.suburb} `

        const coordinateRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?country=za&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
        const coordinateData: any = await coordinateRes.json()


        await setDoc(doc(db, "buildings", buildingDetails.name!), {
            name: buildingDetails.name,
            name_lowerCase: buildingDetails.name_lowerCase,
            address: buildingDetails.address,
            buildingsLogo: buildingDetails.buildingsLogo,
            contactEmail: buildingDetails.contactEmail,
            contactMobile: buildingDetails.contactMobile,
            contactName: buildingDetails.contactName,
            contactOffice: buildingDetails.contactOffice,
            landlord: buildingDetails.landlord,
            landlordId: buildingDetails.landlordId,
            lastUpdated: new Date().toISOString(),
            province: buildingDetails.province,
            suburb: buildingDetails.suburb,
            suburb_lowerCase: buildingDetails.suburb_lowerCase,
            type: buildingDetails.type,
            lat: coordinateData.features[0].center[1],
            lng: coordinateData.features[0].center[0]

        }, { merge: true })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })


        dispatch(navigationSlice.actions.setAddBuildingDialog(false))
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
            return "Building already exists"
        } else return ""
    }


    return (
        <div>

            <Dialog
                maxWidth="xl"
                closeAfterTransition={true} open={addBuildingDialogOpen} onClose={handleClose}
                TransitionProps={{
                    onExited: () => {
                        dispatch(navigationSlice.actions.setModalAdjustment(false))
                        clearBuildingDetails()
                    }
                    // timeout: {
                    //   enter: 1000,
                    //   exit: 1000
                    // }
                }}
            /* transitionDuration={{ enter: 1000, exit: 1000 }} */
            >
                <DialogTitle>Add Building</DialogTitle>
                <DialogContent>
                    <StyledBuildingDetails>
                        <StyledBuildingName
                            size="small"
                            id="Building Name"
                            label="Building Name"
                            variant="outlined"
                            onChange={handleNameChange}
                            /* defaultValue="Hello World" */
                            error={getNameError(buildingDetailsError.name, buildingDetailsError.nameExists)} helperText={getNameHelperText(buildingDetailsError.name, buildingDetailsError.nameExists)}
                        />
                        <StyledSelectDiv style={{ width: "30%", paddingLeft: "0.5rem" }}>
                            <StyledSelect
                                $error={buildingDetailsError.type}
                                classNamePrefix="react-select"
                                key="Building Type"
                                /* isMulti */
                                placeholder="Building Type"
                                styles={customSelectStyles}
                                options={typeOptions}
                                onChange={onSelectType}
                                menuPortalTarget={document.body}
                                value={buildingDetails.type !== "" ? { value: buildingDetails.type, label: buildingDetails.type } : null}

                            />
                            {buildingDetailsError.type ? <StyledSelectHelperText>Required</StyledSelectHelperText> : <></>}
                        </StyledSelectDiv>

                        <StyledBuildingAddress
                            size="small"
                            id="Address"
                            label="Address"
                            variant="outlined"
                            onChange={handleAddressChange}
                            /* defaultValue="Hello World" */
                            error={buildingDetailsError.address} helperText={buildingDetailsError.address ? `Required` : ``}
                        />
                        <StyledSelectDiv>
                            <StyledSelect
                                $error={buildingDetailsError.suburb}
                                classNamePrefix="react-select"
                                isClearable
                                key="suburb"
                                /* isMulti */
                                placeholder="Suburb"
                                styles={customSelectStyles}
                                menuPortalTarget={document.body}
                                options={formattedSuburbs}
                                onChange={onSelectSuburb}
                                value={buildingDetails.suburb !== "" ? { value: buildingDetails.suburb, label: buildingDetails.suburb } : null}
                            />
                            {buildingDetailsError.suburb ? <StyledSelectHelperText>Required</StyledSelectHelperText> : <></>}
                        </StyledSelectDiv>
                        <StyledSelectDiv style={{ paddingLeft: "1rem" }}>
                            <StyledSelect
                                $error={buildingDetailsError.landlord}
                                classNamePrefix="react-select"
                                key="Landlord"
                                /* isMulti */
                                isClearable
                                placeholder="Landlord"
                                styles={customSelectStyles}
                                options={formattedLandlordNames}
                                onChange={onSelectLandlord}

                                menuPortalTarget={document.body}
                                value={buildingDetails.landlord !== "" ? { value: buildingDetails.landlord, label: buildingDetails.landlord } : null}
                            />
                            {buildingDetailsError.landlord ? <StyledSelectHelperText>Required</StyledSelectHelperText> : <></>}
                        </StyledSelectDiv>
                        <StyledSelectDiv>
                            <StyledSelect
                                $error={buildingDetailsError.province}
                                classNamePrefix="react-select"
                                isClearable
                                key="province"
                                /* isMulti */
                                placeholder="Province"
                                styles={customSelectStyles}
                                menuPortalTarget={document.body}
                                options={provinceOptions}
                                onChange={onSelectProvince}
                                value={buildingDetails.province !== "" ? { value: buildingDetails.province, label: buildingDetails.province } : null}
                            />
                            {buildingDetailsError.province ? <StyledSelectHelperText>Required</StyledSelectHelperText> : <></>}
                        </StyledSelectDiv>
                        <StyledSelectDiv style={{ paddingLeft: "1rem" }}>
                            <StyledSelect
                                $error={buildingDetailsError.contactName}
                                classNamePrefix="react-select"
                                isDisabled={landlordContacts === [] || landlordContacts === undefined ? true : false}
                                isClearable
                                key="contact"
                                /* isMulti */
                                placeholder="Contact"
                                styles={customSelectStyles}
                                menuPortalTarget={document.body}
                                options={landlordContacts}
                                onChange={onSelectContact}
                                value={buildingDetails.contactName !== "" ? { value: buildingDetails.contactName, label: buildingDetails.contactName } : null}
                            />
                            {buildingDetailsError.contactName ? <StyledSelectHelperText>Required</StyledSelectHelperText> : <></>}
                        </StyledSelectDiv>
                    </StyledBuildingDetails>



                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddBuildingDialog