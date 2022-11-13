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
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
/* import { stringify } from 'querystring'; */


import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";

import Image from 'next/image'
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';



const StyledDialog = styled(Dialog)`
& .MuiDialog-paper {
    height: 100%;
}

& .MuiDialogContent-root {
    overflow-y: hidden;
    padding: 0px;
}

`

const StyledDetailsCard = styled(Card)`
display: flex;
flex-direction: column;
/* width: 60%; */
margin: auto;
margin-left: 2rem;
min-width: 350px;
`

const StyledTitleDiv = styled.div`
display: flex;
background-color: #0f0c50e6;
`

const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.2rem;
color: white;
padding: 0.5rem;
padding-right: 0.5rem;
padding-left: 0px;
margin: auto;
`

const StyledContentsDiv = styled.div`
display:flex;
flex-direction: column;

`

const StyledDetailsDiv = styled.div`
display:flex;
flex-direction: row;
padding: 0.4rem;
padding-right: 1rem;
`

const StyledIconDiv = styled.div`
margin: auto;
margin-left: 0.5rem;
display:flex;
`

const StyledNameIcon = styled(CorporateFareIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledLocationIcon = styled(LocationOnOutlinedIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledWebsiteIcon = styled(LanguageIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledEmailIcon = styled(EmailOutlinedIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledPersonIcon = styled(PersonOutlineOutlinedIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledMobileIcon = styled(PhoneAndroidOutlinedIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledOfficeIcon = styled(LocalPhoneOutlinedIcon)`
/* font-size: 1.8rem; */
/* margin: auto; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledDetailsText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1rem;
color: black;
margin: auto;
margin-left: 1rem;;
`

const StyledLogoCardDiv = styled.div`
display: flex;
flex-direction: column;
`

const StyledLogoCard = styled(Card)`
padding: 0.5rem;
width: 200px;
height: 100px;
position: relative;
margin-left: 1.5rem;
margin-right: 2rem;
`

const StyledImage = styled(Image)`
padding-right: 0.5rem !important;

`

const StyledTopContainer = styled.div`
display:flex;
flex-direction: row;
`

const StyledButton = styled(Button)`
width: fit-content;
margin: auto;
margin-top: 1rem;
margin-bottom: 0px;
`

const StyledContactsContainer = styled.div`
display: flex;
flex-direction: column;
margin-left: 2rem;
margin-right: 2rem;
margin-top: 2rem;
`

const StyledContactsTitleDiv = styled.div`
display: flex;
flex-direction: row;
`

const StyledContactsTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.4rem;
color: black;
margin: auto;
margin-right: 0px;
`

const StyledAddButton = styled(Button)`
width: fit-content;
margin: auto;
margin-left: 1rem;

`

const StyledContactCard = styled(Card)`
display: flex;
flex-direction: row;
display: table-row;
padding: 0.5rem;
`

const StyledTableContainer = styled.div`
display: table;
-webkit-border-vertical-spacing: 1rem;
`

/* const StyledTableRow = styled.div`
display: table-row;
` */

const StyledTableCell = styled.div`
display: table-cell;
padding: 0.5rem;
vertical-align: middle;
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

export const LandlordDialog: React.FC<Props> = ({ }) => {



    const dispatch = useAppDispatch()
    const viewLandlordDialogOpen = useAppSelector((state) => state.navigation.viewLandlordDialogOpen)
    const selectedLandlordData = useAppSelector((state) => state.navigation.selectedLandlord)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setViewLandlordDialogOpen(false))
    };

    interface Contact {
        id: string,
        email: string,
        mobile: string,
        name: string,
        office: string,
    }

    interface SelectedLandlord {
        id: string,
        buildingsLogo: string,
        name: string,
        name_lowerCase: string,
        address: string,
        website: string,
        email: string,
        office: string,
        contacts: Contact[]
    }

    const [selectedLandlord, setSelectedLandlord] = React.useState<SelectedLandlord>()

    const [selectedContact, setSelectedContact] = React.useState<Contact>({
        id: "",
        name: "",
        email: "",
        mobile: "",
        office: "",
    })

    React.useEffect(() => {
        if (selectedLandlordData) {

            const fetchContactData = async (id: string) => {
                const qContacts = query(collection(db, "landlords/" + id + "/contacts"));
                const contactsSnapshot = await getDocs(qContacts);
                var tempContacts: DocumentData[] = []
                contactsSnapshot.forEach((doc) => {
                    let docData = doc
                    tempContacts.push({ ...docData.data(), id: doc.id })
                });
                return tempContacts
            }

            const combine = async (): Promise<DocumentData> => {
                var tempContacts = await fetchContactData(selectedLandlordData.id)
                return { ...selectedLandlordData, contacts: tempContacts }
            }

            combine().then((result) => {
                setSelectedLandlord({
                    id: result.id,
                    buildingsLogo: result.buildingsLogo,
                    name: result.name,
                    name_lowerCase: result.name_lowerCase,
                    address: result.address,
                    website: result.website,
                    email: result.email,
                    office: result.office,
                    contacts: result.contacts,
                })
            })

        }


    }, [selectedLandlordData, selectedContact])


    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });

    const logo = cld.image(selectedLandlord?.buildingsLogo).resize(fill().width(150).height(50)).delivery(format(auto()))
        .delivery(quality(qAuto())).toURL()

    /* const menuRef = React.useRef(null) */;
    const [anchorMenu, setAnchorMenu] = React.useState<HTMLButtonElement | null>(null);
    const [menuOpen, setMenuOpen] = React.useState("")

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>,name: string) => {
        /*  dispatch(navigationSlice.actions.setModalAdjustment(true)) */
        setAnchorMenu(event.currentTarget);
        setMenuOpen(name)
    }

    const handleMenuClose = () => {
        /*  dispatch(navigationSlice.actions.setModalAdjustment(false)) */
        setMenuOpen("")
    }



    const handleEditContactClick = (contact: Contact) => {
        setSelectedContact(contact)
        dispatch(navigationSlice.actions.setEditContactDialog(true))
        setMenuOpen("")
    }

    const [anchorDeletePopover, setAnchorDeletePopover] = React.useState<HTMLLIElement | null>(null);

    const [deletePopoverOpen, setDeletePopoverOpen] = React.useState("")

    const handleDeletePopoverClick = (event: React.MouseEvent<HTMLLIElement>, name: string) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setAnchorDeletePopover(event.currentTarget);
        setDeletePopoverOpen(name)
        setMenuOpen("")
    };

    const handleDeletePopoverClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorDeletePopover(null);
        setDeletePopoverOpen("")
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "landlords/" + selectedLandlord?.id + "/contacts", id));
        setSelectedContact({
            id: "",
            name: "",
            email: "",
            mobile: "",
            office: "",
        })
        handleDeletePopoverClose()

    }

    const handleAddContactDialogOpen = () => {
       /*  dispatch(navigationSlice.actions.setModalAdjustment(true)) */
        dispatch(navigationSlice.actions.setAddContactDialog(true))
    }

    return (
        <div>


            <StyledDialog
                style={{ height: "fit-content" }}
                /*  fullWidth={true} */
                maxWidth="lg"
                closeAfterTransition={true} open={viewLandlordDialogOpen} onClose={handleClose}
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
                <DialogTitle>
                    Selected Landlord
                </DialogTitle>
                <DialogContent>

                    <StyledTopContainer>

                        <StyledDetailsCard>
                            <StyledTitleDiv>
                                <StyledTitleText>Details</StyledTitleText>
                            </StyledTitleDiv>
                            <StyledContentsDiv>
                                <StyledDetailsDiv>
                                    <StyledIconDiv>
                                        <StyledNameIcon></StyledNameIcon>
                                        <StyledDetailsText>{selectedLandlord?.name}</StyledDetailsText>
                                    </StyledIconDiv>
                                </StyledDetailsDiv>
                                <StyledDetailsDiv>
                                    <StyledIconDiv>
                                        <StyledLocationIcon></StyledLocationIcon>
                                        <StyledDetailsText>{selectedLandlord?.address}</StyledDetailsText>
                                    </StyledIconDiv>
                                </StyledDetailsDiv>
                                <StyledDetailsDiv>
                                    <StyledIconDiv>
                                        <StyledWebsiteIcon></StyledWebsiteIcon>
                                        <StyledDetailsText>{selectedLandlord?.website}</StyledDetailsText>
                                    </StyledIconDiv>
                                </StyledDetailsDiv>
                                <StyledDetailsDiv>
                                    <StyledIconDiv>
                                        <StyledEmailIcon></StyledEmailIcon>
                                        <StyledDetailsText>{selectedLandlord?.email}</StyledDetailsText>
                                    </StyledIconDiv>
                                </StyledDetailsDiv>
                                <StyledDetailsDiv>
                                    <StyledIconDiv>
                                        <StyledOfficeIcon></StyledOfficeIcon>
                                        <StyledDetailsText>{selectedLandlord?.office}</StyledDetailsText>
                                    </StyledIconDiv>
                                </StyledDetailsDiv>
                            </StyledContentsDiv>


                        </StyledDetailsCard>
                        <StyledLogoCardDiv>
                            <StyledLogoCard>
                                {selectedLandlord?.buildingsLogo ? <StyledImage

                                    src={logo}
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"

                                /*  width={200}
                                 height={50} */
                                /> : <></>}
                            </StyledLogoCard>
                            <StyledButton variant='outlined'>
                                Upload Logo
                            </StyledButton>
                            <StyledButton variant='outlined'>
                                Edit Details
                            </StyledButton>

                        </StyledLogoCardDiv>



                    </StyledTopContainer>

                    <StyledContactsContainer>
                        <StyledContactsTitleDiv>
                            <StyledContactsTitleText>Contacts</StyledContactsTitleText>
                            <StyledAddButton  variant="outlined" onClick={handleAddContactDialogOpen}>Add</StyledAddButton>
                        </StyledContactsTitleDiv>
                        <StyledTableContainer>

                            {selectedLandlord?.contacts.map((contact) =>
                                <StyledContactCard>
                                    <StyledTableCell>
                                        <StyledIconDiv>
                                            <StyledPersonIcon></StyledPersonIcon>
                                            <StyledDetailsText>{contact?.name}</StyledDetailsText>
                                        </StyledIconDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <StyledIconDiv>
                                            <StyledEmailIcon></StyledEmailIcon>
                                            <StyledDetailsText>{contact?.email}</StyledDetailsText>
                                        </StyledIconDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <StyledIconDiv>
                                            <StyledMobileIcon></StyledMobileIcon>
                                            <StyledDetailsText>{contact?.mobile}</StyledDetailsText>
                                        </StyledIconDiv>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <StyledIconDiv>
                                            <StyledOfficeIcon></StyledOfficeIcon>
                                            <StyledDetailsText>{contact?.office}</StyledDetailsText>
                                        </StyledIconDiv>
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: "40px" }}>
                                        <IconButton /* ref={anchorMenu} */ onClick={(e) => handleMenuOpen(e ,contact.id)}>
                                            <MoreVertOutlinedIcon width={20} height={20} />
                                        </IconButton>
                                        <Menu
                                            open={menuOpen === contact.id ? true : false}
                                            anchorEl={anchorMenu}
                                            onClose={handleMenuClose}
                                            PaperProps={{
                                                sx: { width: "fit-content", maxWidth: '100%' }
                                            }}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                        >



                                            <MenuItem onClick={() => handleEditContactClick(contact)} sx={{ color: 'text.secondary' }}>
                                                <ListItemIcon>
                                                    <EditOutlinedIcon width={24} height={24} />
                                                </ListItemIcon>
                                                <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                                            </MenuItem>

                                            <MenuItem onClick={(e) => handleDeletePopoverClick(e, contact.id)} sx={{ color: 'text.secondary' }}>
                                                <ListItemIcon>
                                                    <DeleteOutlinedIcon width={24} height={24} />
                                                </ListItemIcon>
                                                <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                                            </MenuItem>


                                        </Menu>
                                        <Popover
                                            id={contact.id}
                                            open={deletePopoverOpen === contact.id ? true : false}
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
                                                <Typography sx={{ p: 2 }}>Are you sure you want to delete this premises?</Typography>
                                                <StyledPopoverConfirmButton onClick={() => handleDelete(contact.id)}>Confirm</StyledPopoverConfirmButton>
                                                <StyledPopoverCancelButton onClick={handleDeletePopoverClose}>Cancel</StyledPopoverCancelButton>
                                            </StyledPopoverDiv>

                                        </Popover>
                                    </StyledTableCell>
                                </StyledContactCard>
                            )}

                        </StyledTableContainer>



                    </StyledContactsContainer>




                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Close</Button>

                </DialogActions>
            </StyledDialog>

            <AddContactDialog landlordId={selectedLandlord?.id!} setSelectedContact={setSelectedContact}></AddContactDialog>
            <EditContactDialog landlordId={selectedLandlord?.id!} selectedContact={selectedContact} setSelectedContact={setSelectedContact}></EditContactDialog>
        </div>
    );
}

export default LandlordDialog