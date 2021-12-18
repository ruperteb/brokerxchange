import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import styled from "@emotion/styled"

import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { navigationSlice } from "../../redux/slices/navigationSlice";

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

import { db, auth } from "../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc } from "firebase/firestore";
import { stringify } from 'querystring';


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

const StyledTypeSelect = styled(Select)`
width: 30%;
margin: auto;
padding: 0.5rem;
padding-right: 0px;
/* height: 40px; */
`

const StyledSuburbSelect = styled(CreatableSelect)`
width: 50%;
margin: auto;
padding: 0.5rem;
padding-left: 0px;
`

const StyledProvinceSelect = styled(Select)`
width: 50%;
margin: auto;
padding: 0.5rem;
padding-left: 0px;
`

const StyledLandlordSelect = styled(Select)`
width: 50%;
margin: auto;
padding: 0.5rem;
padding-right: 0px;
`

const StyledContactSelect = styled(Select)`
width: 50%;
margin: auto;
padding: 0.5rem;
padding-right: 0px;
`

export default function FormDialog() {
    /* const [open, setOpen] = React.useState(false); */

    const dispatch = useAppDispatch()
    const addBuildingDialogOpen = useAppSelector((state) => state.navigation.addBuildingDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setAddBuildingDialog(false))
    };

    const landlordsData = useAppSelector((state) => state.navigation.landlordsData)
    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

    /* var landlordNameData = landlordsData.map((landlord: any) => { return landlord.name }) */

    /*  let combinedLandlordNameData: any = [] */

    /* landlordNameData.map((landlord) => {
        landlord.map((name:any) => {
            combinedLandlordNameData = [...combinedLandlordNameData, name]
        })
    }) */

    /* var distinctLandlordNames: string[] = Array.from(new Set(landlordNameData.map((name: string) => { return name }))) */

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
        lastUpdated: "",  //Date.now().toISOString()
        province: "",
        suburb: "",
        suburb_lowerCase: "",
        type: "",
    })

    console.log(buildingDetails)

    const customSelectStyles = {
        /* option: (provided: any, state: any) => ({
            ...provided,
            

        }), */
        control: (provided: any, state: any) => ({

            ...provided,
            height: "40px"
        }),
        /*  container: (provided: any, state: any) => ({
             
             ...provided,
             width: "auto",
             marginTop: "1rem",
             margin: "0.5rem",
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
 
            
 
         }),*/
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
                setBuildingDetails({ ...buildingDetails, landlord: value.value, buildingsLogo: value.buildingsLogo, contactName: "", contactEmail: "", contactMobile: "", contactOffice: ""  })
               
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
                setBuildingDetails({ ...buildingDetails, landlord: "", buildingsLogo: "" })
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

    /*  const dialogRef = React.useRef<HTMLDivElement | null>(); */

    const [dialogRef, setdialogRef] = React.useState<HTMLDivElement | null>()


    const handleNameChange = React.useCallback(
        (e: any) => {
            setBuildingDetails({ ...buildingDetails, name: e.target.value, name_lowerCase: e.target.value.toLowerCase() })
        }, [buildingDetails])

    const handleAddressChange = React.useCallback(
        (e: any) => {
            setBuildingDetails({ ...buildingDetails, address: e.target.value })
        }, [buildingDetails])


        const submitBuilding = async () => {
            
            await addDoc(collection(db, "buildings"), {
                name: buildingDetails.name,
                name_lowerCase: buildingDetails.name_lowerCase,
                address: buildingDetails.address,
                buildingsLogo: buildingDetails.buildingsLogo,
                contactEmail: buildingDetails.contactEmail,
                contactMobile: buildingDetails.contactMobile,
                contactName: buildingDetails.contactName,
                contactOffice: buildingDetails.contactOffice,
                landlord: buildingDetails.landlord,
                lastUpdated: new Date().toISOString(),
                province: buildingDetails.province,
                suburb: buildingDetails.suburb,
                suburb_lowerCase: buildingDetails.suburb_lowerCase,
                type: buildingDetails.type,
            })
                .then((result) => {
                    console.log(result.id)
                   /*  if (result.id) { */
                        /*  setSuccess(true) */
                       /*  notify() */
                    })
    
                
            dispatch(navigationSlice.actions.setAddBuildingDialog(false))
        }









    return (
        <div>

            <Dialog
                maxWidth="xl"
                ref={(node) => {
                    setdialogRef(node)
                }}
                closeAfterTransition={true} open={addBuildingDialogOpen} onClose={handleClose}
                TransitionProps={{
                    onExited: () => {
                        dispatch(navigationSlice.actions.setModalAdjustment(false))
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
                        />
                        <StyledTypeSelect
                            /* ref={suburbRef} */
                            key="Building Type"
                            /* isMulti */
                            placeholder="Building Type"
                            styles={customSelectStyles}
                            options={typeOptions}
                            onChange={onSelectType}

                            menuPortalTarget={dialogRef}
                            value={buildingDetails.type !== "" ? { value: buildingDetails.type, label: buildingDetails.type } : null}
                        />
                        <StyledBuildingAddress
                            size="small"
                            id="Address"
                            label="Address"
                            variant="outlined"
                            onChange={handleAddressChange}
                        /* defaultValue="Hello World" */
                        />
                        <StyledSuburbSelect
                            /* ref={suburbRef} */
                            /*  components={{ Placeholder, Input, ValueContainer }} */

                            isClearable
                            key="suburb"
                            /* isMulti */
                            placeholder="Suburb"
                            styles={customSelectStyles}
                            menuPortalTarget={dialogRef}
                            options={formattedSuburbs}
                            onChange={onSelectSuburb}
                            value={buildingDetails.suburb !== "" ? { value: buildingDetails.suburb, label: buildingDetails.suburb } : null}
                        />
                        <StyledLandlordSelect
                            /* ref={suburbRef} */
                            key="Landlord"
                            /* isMulti */
                            isClearable
                            placeholder="Landlord"
                            styles={customSelectStyles}
                            options={formattedLandlordNames}
                            onChange={onSelectLandlord}

                            menuPortalTarget={dialogRef}
                            value={buildingDetails.landlord !== "" ? { value: buildingDetails.landlord, label: buildingDetails.landlord } : null}
                        />
                        <StyledProvinceSelect
                            /* ref={suburbRef} */
                            /*  components={{ Placeholder, Input, ValueContainer }} */

                            isClearable
                            key="province"
                            /* isMulti */
                            placeholder="Province"
                            styles={customSelectStyles}
                            menuPortalTarget={dialogRef}
                            options={provinceOptions}
                            onChange={onSelectProvince}
                            value={buildingDetails.province !== "" ? { value: buildingDetails.province, label: buildingDetails.province } : null}
                        />
                        <StyledContactSelect
                            /* ref={suburbRef} */
                            /*  components={{ Placeholder, Input, ValueContainer }} */
                            isDisabled={landlordContacts === [] || landlordContacts === undefined ? true: false}
                            isClearable
                            key="contact"
                            /* isMulti */
                            placeholder="Contact"
                            styles={customSelectStyles}
                            menuPortalTarget={dialogRef}
                            options={landlordContacts}
                            onChange={onSelectContact}
                            value={buildingDetails.contactName !== "" ? { value: buildingDetails.contactName, label: buildingDetails.contactName } : null}
                        />
                    </StyledBuildingDetails>



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitBuilding}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}