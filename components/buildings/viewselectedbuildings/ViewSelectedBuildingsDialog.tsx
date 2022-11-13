import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
/* import DialogContentText from '@mui/material/DialogContentText'; */
import DialogTitle from '@mui/material/DialogTitle';

import styled from "@emotion/styled"

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { navigationSlice } from "../../../redux/slices/navigationSlice";

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

import { db, auth } from "../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc } from "firebase/firestore";
/* import { stringify } from 'querystring'; */

import BuildingCard from './buildingcard/BuildingCard'


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



interface Props {

}

export const ViewSelectedBuildingsDialog: React.FC<Props> = ({ }) => {

    const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

    const handleSaveDialogOpen = () => {
        setSaveDialogOpen(true);
    };

    const handleSaveDialogClose = () => {
        setSaveDialogOpen(false);
        setListDetails({
            title: "",
            subTitle: "",
        })
    };

    const [PDFTitleDialogOpen, setPDFTitleDialogOpen] = React.useState(false);

    const handlePDFTitleDialogOpen = () => {
        setPDFTitleDialogOpen(true);
    };

    const handlePDFTitleDialogClose = () => {
        setPDFTitleDialogOpen(false);
        setListDetails({
            title: "",
            subTitle: "",
        })
    };

    const userAuth = useAppSelector(state => state.auth.auth)

    const dispatch = useAppDispatch()
    const viewSelecedBuildingsDialogOpen = useAppSelector((state) => state.navigation.viewSelectedBuildingsDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setViewSelectedBuildingsDialogOpen(false))
    };

    /* const landlordsData = useAppSelector((state) => state.navigation.landlordsData)
    const buildingsData = useAppSelector((state) => state.navigation.buildingsData) */
    const selectedBuildingsData = useAppSelector((state) => state.navigation.selectedBuildings)

    interface ImageListItem {
        url: string,
        checked: boolean,
    }

    interface BuildingDetails {
        id?: string,
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
        premises: Premises[]
        imagesList: ImageListItem[]
    }

    interface Premises {
        id: string,
        name: string,
        vacant: boolean,
        floor: string,
        type: string,
        area: number,
        netRental: number,
        opCosts: number,
        otherRental: number,
        grossRental: number,
        openBays: number,
        openRate: number,
        openRatio: number,
        coveredBays: number,
        coveredRate: number,
        coveredRatio: number,
        shadedBays: number,
        shadedRate: number,
        shadedRatio: number,
        parkingRatio: number,
        selected: boolean,
    }

    type SelectedBuildings = BuildingDetails[] | DocumentData



    /*  const [buildingDetails, setBuildingDetails] = React.useState<SelectedBuildings>({
         name: selectedBuilding.name,
         name_lowerCase: selectedBuilding.name_lowerCase,
         address: selectedBuilding.address,
         buildingsLogo: selectedBuilding.buildingsLogo,
         contactEmail: selectedBuilding.contactEmail,
         contactMobile: selectedBuilding.contactMobile,
         contactName: selectedBuilding.contactName,
         contactOffice: selectedBuilding.contactOffice,
         landlord: selectedBuilding.landlord,
         landlordId: selectedBuilding.landlordId,
         lastUpdated: selectedBuilding.lastUpdated, 
         province: selectedBuilding.province,
         suburb: selectedBuilding.suburb,
         suburb_lowerCase: selectedBuilding.suburb_lowerCase,
         type: selectedBuilding.type,
     }) */

    const [selectedBuildings, setSelectedBuildings] = React.useState<SelectedBuildings>([])

    console.log("selected buidlings", selectedBuildings)

    React.useEffect(() => {

        const fetchPremisesData = async (id: string) => {
            const qPremises = query(collection(db, "buildings/" + id + "/premises"), orderBy("name_lowerCase", "asc"));
            const premisesSnapshot = await getDocs(qPremises);
            var tempPremises: DocumentData[] = []
            premisesSnapshot.forEach((doc) => {
                let docData = doc
                tempPremises.push({ ...docData.data(), id: doc.id, selected: true })
            });
            return tempPremises
        }

        const fetchData = async () => {

            var tempSelectedBuildings = selectedBuildingsData.map(async (building) => {
                const result = await fetchPremisesData(building.id);
                const imagesList = building.images?.map((image: string) => {
                    return { url: image, checked: true }
                })
                if (imagesList) {
                    return { ...building, premises: result, imagesList: imagesList };
                } else return { ...building, premises: result, imagesList: [] };


            })
            return Promise.all(tempSelectedBuildings)
        }

        fetchData().then((buildings) => {
            setSelectedBuildings(buildings)
        })

    }, [selectedBuildingsData])

    /* var keyValuePairs: any = []

    selectedBuildings.map((building: DocumentData) => {
        keyValuePairs.push([building.id, building.premises])
    })

    var objFromEntries = Object.fromEntries(keyValuePairs) */



    const listApiQuery = async () => {

        const fetchPremisesData = async (id: string) => {
            const qPremises = query(collection(db, "buildings/" + id + "/premises"), orderBy("name_lowerCase", "asc"));
            const premisesSnapshot = await getDocs(qPremises);
            var tempPremises: DocumentData[] = []
            premisesSnapshot.forEach((doc) => {
                let docData = doc
                tempPremises.push({ ...docData.data(), id: doc.id })
            });
            return tempPremises
        }

        var buildingsList = selectedBuildings.map((building: BuildingDetails) => {
            return building.id
        })

        const res = await fetch('/api/queryList', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildingsList)
        })
        const data = await res.json()


        const combineData = async () => {
            var tempCombinedList = await data.buildingList.map(async (building: DocumentData) => {

                const result = await fetchPremisesData(building.id);
                return { ...building, premises: result };
            })
            return Promise.all(tempCombinedList)

        }

        combineData().then((combinedList) => { console.log("combine", combinedList) })


    }


    const submitList = async () => {

        const getBuildingData = async () => {

            const getImages = async (building: any) => {

                var filteredImages = building.imagesList?.filter((image: any) => {
                    return image.checked === true
                })

                var tempImages = filteredImages?.map((image: any) => {
                    if (image.checked === true) {
                        return image.url
                    }
                })
                return tempImages
            }

            const combineData = async () => {

                var keyValuePairsBuildings = await selectedBuildings.map(async (building: DocumentData) => {

                    var tempPremises = building.premises?.filter((premises: any) => {
                        return premises.selected === true
                    })

                    var tempImages = await getImages(building)

                    return [building.id, { premises: tempPremises, images: tempImages }]

                })

                return Promise.all(keyValuePairsBuildings)

            }

            var buildings = await combineData()
            return buildings

        }

        const docRef = collection(db, "users/" + userAuth.uid + "/lists");

        var keyValuePairsBuildings = await getBuildingData()

        var objFromEntriesBuildings = Object.fromEntries(keyValuePairsBuildings)

        var errors = await validateListDetails()
        var errorState = await checkErrors(errors)

        if (!errorState) {

            await addDoc(docRef, {
                title: listDetails.title,
                subTitle: listDetails.subTitle,
                buildings: objFromEntriesBuildings,
                lastUpdated: new Date().toISOString(),

            })
                .then((result) => {
                    console.log(result)

                })
            handleSaveDialogClose()

        }



    }

    const handleCheckboxClick = (event: React.MouseEvent<unknown>, buildingId: string, premisesId: string) => {

        var newSelectedBuildings = selectedBuildings.map((building: BuildingDetails) => {

            var tempPremises = building.premises.map((premises: Premises) => {
                if (premises.id === premisesId) {
                    return { ...premises, selected: !premises.selected }
                } else return premises
            })

            if (building.id === buildingId) {
                return { ...building, premises: tempPremises }
            } else return building
        })

        setSelectedBuildings(newSelectedBuildings)
    };

    const handleCheckboxAllClick = (event: React.ChangeEvent<HTMLInputElement>, buildingId: string) => {

        var newSelectedBuildings = selectedBuildings.map((building: BuildingDetails) => {

            var tempPremises = building.premises.map((premises: Premises) => {
                if (event.target.checked) {
                    return { ...premises, selected: true }
                } else return { ...premises, selected: false }
            })

            if (building.id === buildingId) {
                return { ...building, premises: tempPremises }
            } else return building
        })

        setSelectedBuildings(newSelectedBuildings)
    };

    const handleImageCheck = (buildingId: string, imageURL: string) => {

        var newSelectedBuildings = selectedBuildings.map((building: BuildingDetails) => {

            var tempImagesList = building.imagesList?.map((image: ImageListItem) => {
                if (image.url === imageURL) {
                    return { ...image, checked: !image.checked }
                } else return image
            })

            if (building.id === buildingId) {
                return { ...building, imagesList: tempImagesList }
            } else return building
        })

        setSelectedBuildings(newSelectedBuildings)
    }

    const handleImageOrderSelect = (buildingId: string, imagesList: ImageListItem[]) => {

        var newSelectedBuildings = selectedBuildings.map((building: BuildingDetails) => {

            if (building.id === buildingId) {
                return { ...building, imagesList: imagesList }
            } else return building
        })

        setSelectedBuildings(newSelectedBuildings)
    }

    interface ListDetails {
        title: string,
        subTitle: string,
    }

    interface ListDetailsError {
        title: boolean,
        subTitle: boolean,
    }

    const [listDetails, setListDetails] = React.useState<ListDetails>({
        title: "",
        subTitle: "",
    })

    const [listDetailsError, setListDetailsError] = React.useState<ListDetailsError>({
        title: false,
        subTitle: false,
    })

    const handleTitleChange = React.useCallback(
        (e: any) => {
            setListDetails({ ...listDetails, title: e.target.value })
        }, [listDetails])

    const handleSubTitleChange = React.useCallback(
        (e: any) => {
            setListDetails({ ...listDetails, subTitle: e.target.value })
        }, [listDetails])

    const validateListDetails = async () => {
        var title = false
        var subTitle = false

        if (listDetails.title === "") {
            title = true;
        } else title = false
        /* if (buildingDetails.address === "") {
            address = true;
        } else address = false */

        return {
            title: title,
            subTitle: subTitle,
        }
    };

    const checkErrors = async (errors: any) => {
        setListDetailsError({ ...errors })
        if (errors.title || errors.subTitle) {
            return true
        } else return false

    }

    const previewPDFClick = async () => {

        const getBuildingData = async () => {

            const getImages = async (building: any) => {

                var filteredImages = building.imagesList?.filter((image: any) => {
                    return image.checked === true
                })

                var tempImages = filteredImages?.map((image: any) => {
                    if (image.checked === true) {
                        return image.url
                    }
                })
                return tempImages
            }

            const combineData = async () => {

                var tempBuildingData = await selectedBuildings.map(async (building: DocumentData) => {
                    var tempPremises = building.premises?.filter((premises: any) => {
                        return premises.selected === true
                    })
                    var tempImages = await getImages(building)
                    return { ...building, images: tempImages, premises: tempPremises }
                })
                return Promise.all(tempBuildingData)
            }
            var buildings = await combineData()
            return buildings
        }

        dispatch(navigationSlice.actions.setPreviewPDFData({
            title: listDetails.title,
            subTitle: listDetails.subTitle,
            buildings: await getBuildingData(),
            lastUpdated: new Date().toISOString(),
        }))
        setPDFTitleDialogOpen(false)
        dispatch(navigationSlice.actions.setViewPreviewPDFDialogOpen(true))
    }


    return (
        <div>

            <Dialog
                fullWidth={true}
                maxWidth={false}
                closeAfterTransition={true} open={viewSelecedBuildingsDialogOpen} onClose={handleClose}
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
                <DialogTitle>Selected Buildings</DialogTitle>
                <DialogContent>
                    {selectedBuildings?.map((building: BuildingDetails, index: number) =>
                        <BuildingCard key={building.id} buildingData={building} index={index} handleCheckboxClick={handleCheckboxClick} handleCheckboxAllClick={handleCheckboxAllClick} handleImageCheck={handleImageCheck} handleImageOrderSelect={handleImageOrderSelect} ></BuildingCard>
                    )}




                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={handleSaveDialogOpen}>Save List</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={handlePDFTitleDialogOpen}>Preview PDF</Button>
                    <Button style={{ paddingRight: "2rem" }} onClick={() => listApiQuery()}>List</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose}>
                <DialogTitle>Save List</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="Title"
                        label="List Title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        onChange={handleTitleChange}
                        value={listDetails.title}
                        error={listDetailsError.title} helperText={listDetailsError.title ? `Required` : ``}
                    />
                    <TextField
                        /*  autoFocus */
                        margin="dense"
                        id="SubTitle"
                        label="List Sub Title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        onChange={handleSubTitleChange}
                        value={listDetails.subTitle}
                        error={listDetailsError.subTitle} helperText={listDetailsError.subTitle ? `Required` : ``}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveDialogClose}>Cancel</Button>
                    <Button onClick={submitList}>Save List</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={PDFTitleDialogOpen} onClose={handlePDFTitleDialogClose}>
                <DialogTitle>List Details</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="Title"
                        label="List Title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        onChange={handleTitleChange}
                        value={listDetails.title}
                        error={listDetailsError.title} helperText={listDetailsError.title ? `Required` : ``}
                    />
                    <TextField
                        /*  autoFocus */
                        margin="dense"
                        id="SubTitle"
                        label="List Sub Title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        onChange={handleSubTitleChange}
                        value={listDetails.subTitle}
                        error={listDetailsError.subTitle} helperText={listDetailsError.subTitle ? `Required` : ``}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePDFTitleDialogClose}>Cancel</Button>
                    <Button onClick={previewPDFClick}>Preview PDF</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default ViewSelectedBuildingsDialog