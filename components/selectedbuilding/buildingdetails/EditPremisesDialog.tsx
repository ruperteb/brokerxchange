import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
/* import DialogContentText from '@mui/material/DialogContentText'; */
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import InputAdornment from '@mui/material/InputAdornment';

import styled from "@emotion/styled"

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { navigationSlice } from "../../../redux/slices/navigationSlice";

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

import { db, auth } from "../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, doc, updateDoc } from "firebase/firestore";
import { Typography } from '@mui/material';
/* import { stringify } from 'querystring'; */


const StyledPremisesDetails = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
width: 500px;
`

const StyledInput = styled(TextField)`
&.MuiTextField-root {
    width: 50%;
    padding-right: 0.5rem;
    margin: auto;
/* margin-left: 0.5rem; */
}

`

const StyledPremisesName = styled(StyledInput)`
&.MuiTextField-root {
     width: 60%;
}
`


const StyledTypeSelect = styled(Select)`
width: 40%;
margin: auto;
padding: 0.5rem;
padding-right: 0px;
/* height: 40px; */
`

const StyledTextInput = styled(StyledInput)`
&.MuiTextField-root {
     width: 32%;
     margin-left: 0px;
     margin-top: 0.5rem;
     margin-bottom: 0.5rem;
     margin-right: auto;
}
& input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
`

const StyledParkingTextInput = styled(StyledTextInput)`
&.MuiTextField-root {
     width: 25%;
}
`

const StyledParkingLabel = styled(Typography)`
width: 15%;
margin: auto;
font-weight: 500;
`

const StyledInputAdornment = styled(InputAdornment)`
& .MuiTypography-root{
    font-size: 0.65rem;
    white-space: pre-wrap;
}

`

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
}

interface Props {
    buildingId: string,
    premises: Premises[],
    selectedPremises: Premises,
    
}

export const EditPremisesDialog: React.FC<Props> = ({ buildingId, premises, selectedPremises }) => {

    const dispatch = useAppDispatch()
    const editPremisesDialogOpen = useAppSelector((state) => state.navigation.editPremisesDialogOpen)


    const handleClose = () => {
        dispatch(navigationSlice.actions.setEditPremisesDialog(false))
        setCompleted({});
        setActiveStep(0)
        
    };



    var typeOptions = [
        { value: "Office", label: "Office" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Retail", label: "Retail" },
        { value: "Other", label: "Other" },
    ]



    interface PremisesDetails {
        name: string,
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
    }

    const [premisesDetails, setPremisesDetails] = React.useState<PremisesDetails>({
        name: selectedPremises.name,
        floor: selectedPremises.floor,
        type: selectedPremises.type,
        area: selectedPremises.area,
        netRental: selectedPremises.netRental,
        opCosts: selectedPremises.opCosts,
        otherRental: selectedPremises.otherRental,
        grossRental: selectedPremises.grossRental,
        openBays: selectedPremises.openBays,
        openRate: selectedPremises.openRate,
        openRatio: selectedPremises.openRatio,
        coveredBays: selectedPremises.coveredBays,
        coveredRate: selectedPremises.coveredRate,
        coveredRatio: selectedPremises.coveredRatio,
        shadedBays: selectedPremises.shadedBays,
        shadedRate: selectedPremises.shadedRate,
        shadedRatio: selectedPremises.shadedRatio,
        parkingRatio: selectedPremises.parkingRatio,
    })

    React.useEffect(() => {
        setPremisesDetails(selectedPremises)
    }, [selectedPremises])

    const customSelectStyles = {
        /* option: (provided: any, state: any) => ({
            ...provided,
            

        }), */
        control: (provided: any, state: any) => ({

            ...provided,
            height: "40px"
        }),
        container: (provided: any, state: any) => ({

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



        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            maxHeight: "200px"
        }),

    }


    const onSelectType = React.useCallback(
        (value: any, actionType: any) => {
            if (actionType.action === "select-option") {
                setPremisesDetails({ ...premisesDetails, type: value.value })
            }
            if (actionType.action === "create-option") {
                setPremisesDetails({ ...premisesDetails, type: value.value })
            }
            if (actionType.action === "clear") {
                setPremisesDetails({ ...premisesDetails, type: "" })
            }
        }, [premisesDetails])


    /*  const dialogRef = React.useRef<HTMLDivElement | null>(); */

    const [dialogRef, setdialogRef] = React.useState<HTMLDivElement | null>()

    console.log(dialogRef)


    const handleNameChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, name: e.target.value })
        }, [premisesDetails])
    const handleFloorChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, floor: e.target.value })
        }, [premisesDetails])
    const handleAreaChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, area: Number(e.target.value) })
        }, [premisesDetails])
    const handleNetRentalChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, netRental: Number(e.target.value) })
        }, [premisesDetails])
    const handleOpCostsChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, opCosts: Number(e.target.value) })
        }, [premisesDetails])
    const handleOtherRentalChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, otherRental: Number(e.target.value) })
        }, [premisesDetails])
    const handleGrossRentalChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, grossRental: Number(e.target.value) })
        }, [premisesDetails])
    const handleOpenBaysChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, openBays: Number(e.target.value), openRatio: Number(e.target.value) / (premisesDetails.area / 100) })
        }, [premisesDetails])
    const handleOpenRateChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, openRate: Number(e.target.value) })
        }, [premisesDetails])
    const handleOpenRatioChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, openRatio: Number(e.target.value), openBays: (Number(e.target.value) * premisesDetails.area) / 100 })
        }, [premisesDetails])
    const handleCoveredBaysChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, coveredBays: Number(e.target.value), coveredRatio: Number(e.target.value) / (premisesDetails.area / 100) })
        }, [premisesDetails])
    const handleCoveredRateChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, coveredRate: Number(e.target.value) })
        }, [premisesDetails])
    const handleCoveredRatioChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, coveredRatio: Number(e.target.value), coveredBays: (Number(e.target.value) * premisesDetails.area) / 100 })
        }, [premisesDetails])
    const handleShadedBaysChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, shadedBays: Number(e.target.value), shadedRatio: Number(e.target.value) / (premisesDetails.area / 100) })
        }, [premisesDetails])
    const handleShadedRateChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, shadedRate: Number(e.target.value) })
        }, [premisesDetails])
    const handleShadedRatioChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, shadedRatio: Number(e.target.value), shadedBays: (Number(e.target.value) * premisesDetails.area) / 100 })
        }, [premisesDetails])
    const handleParkingRatioChange = React.useCallback(
        (e: any) => {
            setPremisesDetails({ ...premisesDetails, parkingRatio: Number(e.target.value) })
        }, [premisesDetails])


    const submitPremises = async () => {

        const premisesRef = doc(db, "buildings/" + buildingId + "/premises", selectedPremises.id)

        await updateDoc(premisesRef, {
            name: premisesDetails.name,
            name_lowerCase: premisesDetails.name.toLowerCase(),
            /* vacant: true, */
            floor: premisesDetails.floor,
            type: premisesDetails.type,
            area: premisesDetails.area,
            netRental: premisesDetails.netRental,
            opCosts: premisesDetails.opCosts,
            otherRental: premisesDetails.otherRental,
            grossRental: premisesDetails.grossRental,
            openBays: premisesDetails.openBays,
            openRate: premisesDetails.openRate,
            openRatio: premisesDetails.openRatio,
            coveredBays: premisesDetails.coveredBays,
            coveredRate: premisesDetails.coveredRate,
            coveredRatio: premisesDetails.coveredRatio,
            shadedBays: premisesDetails.shadedBays,
            shadedRate: premisesDetails.shadedBays,
            shadedRatio: premisesDetails.shadedRatio,
            parkingRatio: premisesDetails.openRatio + premisesDetails.coveredRatio + premisesDetails.shadedRatio
        })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })

        const q = query(collection(db, "buildings/" + buildingId + "/premises"));

        const querySnapshot = await getDocs(q);
        const premises: DocumentData[] = []
        querySnapshot.forEach((doc) => {
            let docData = doc
            premises.push({ ...docData.data(), id: doc.id })
        });


        const geVacantGLA = () => {
            var vacantGLA = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    vacantGLA += premises.area
                }
            })
            return vacantGLA
        }

        const geOverallParkingRatio = () => {
            var totalVacantArea = 0
            var totalVacantBays = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    totalVacantArea += premises.area
                    totalVacantBays += (premises.openBays + premises.coveredBays + premises.shadedBays)
                }
            })
            return (totalVacantBays / (totalVacantArea / 100))
        }

        const getMinMaxRental = () => {
            var rentalArray: number[] = []
            premises.map((premises) => {
                if (premises.vacant) {
                    rentalArray.push(premises.grossRental)
                }
            })
            return [Math.min(...rentalArray), Math.max(...rentalArray)]

        }


        const buildingRef = doc(db, "buildings", buildingId)

        await updateDoc(buildingRef, {
            vacantGLA: geVacantGLA(),
            parkingRatio: geOverallParkingRatio(),
            rentalLow: getMinMaxRental()[0],
            rentalHigh: getMinMaxRental()[1]
        })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })

        /* setPremisesDetails({
            name: "",
            floor: "",
            type: "",
            area: 0,
            netRental: 0,
            opCosts: 0,
            otherRental: 0,
            grossRental: 0,
            openBays: 0,
            openRate: 0,
            openRatio: 0,
            coveredBays: 0,
            coveredRate: 0,
            coveredRatio: 0,
            shadedBays: 0,
            shadedRate: 0,
            shadedRatio: 0,
            parkingRatio: 0,
        }) */
        setCompleted({});
        setActiveStep(0)
        dispatch(navigationSlice.actions.setEditPremisesDialog(false))
    }

    const steps = ['Basic Details', "Parking Details"];

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const PremisesContent = (activeStep: number) => {
        switch (activeStep) {
            case 0:

                return (
                    <StyledPremisesDetails>
                        <StyledPremisesName
                            size="small"
                            id="Premises Name"
                            label="Premises Name"
                            variant="outlined"
                            onChange={handleNameChange}
                            value={premisesDetails.name}
                        />
                        <StyledTypeSelect

                            /* ref={suburbRef} */
                            key="Premises Type"
                            /* isMulti */
                            placeholder="Premises Type"
                            styles={customSelectStyles}
                            options={typeOptions}
                            onChange={onSelectType}
                            menuPortalTarget={document.body}
                            value={premisesDetails.type !== "" ? { value: premisesDetails.type, label: premisesDetails.type } : null}
                        />
                        <StyledTextInput
                            size="small"
                            id="Floor / Unit"
                            label="Floor / Unit"
                            variant="outlined"
                            onChange={handleFloorChange}
                            value={premisesDetails.floor !== "" ? premisesDetails.floor : null}
                        />
                        <StyledTextInput
                            type="number"
                            size="small"
                            id="Area"
                            label="Area"
                            variant="outlined"
                            onChange={handleAreaChange}
                            value={premisesDetails.area !== 0 ? premisesDetails.area : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">m²</StyledInputAdornment>,
                            }}
                        />

                        <StyledTextInput
                            style={{ marginRight: "0px", paddingRight: 0 }}
                            type="number"
                            size="small"
                            id="Net Rental"
                            label="Net Rental"
                            variant="outlined"
                            onChange={handleNetRentalChange}
                            value={premisesDetails.netRental !== 0 ? premisesDetails.netRental : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/m²</StyledInputAdornment>,
                            }}
                        />
                        <StyledTextInput
                            type="number"
                            size="small"
                            id="Op Costs"
                            label="Op Costs"
                            variant="outlined"
                            onChange={handleOpCostsChange}
                            value={premisesDetails.opCosts !== 0 ? premisesDetails.opCosts : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/m²</StyledInputAdornment>,
                            }}
                        />
                        <StyledTextInput
                            type="number"
                            size="small"
                            id="Other Rental"
                            label="Other Rental"
                            variant="outlined"
                            onChange={handleOtherRentalChange}
                            value={premisesDetails.otherRental !== 0 ? premisesDetails.otherRental : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/m²</StyledInputAdornment>,
                            }}
                        />
                        <StyledTextInput
                            style={{ marginRight: "0px", paddingRight: 0 }}
                            type="number"
                            size="small"
                            id="Gross Rental"
                            label="Gross Rental"
                            variant="outlined"
                            onChange={handleGrossRentalChange}
                            value={premisesDetails.grossRental !== 0 ? premisesDetails.grossRental : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/m²</StyledInputAdornment>,
                            }}
                        />

                    </StyledPremisesDetails>
                )

            case 1:
                return (
                    <StyledPremisesDetails>
                        <StyledParkingLabel>Open:</StyledParkingLabel>
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Open Bays"
                            label="Bays"
                            variant="outlined"
                            onChange={handleOpenBaysChange}
                            value={premisesDetails.openBays !== 0 ? premisesDetails.openBays : null}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Open Rate"
                            label="Rate"
                            variant="outlined"
                            onChange={handleOpenRateChange}
                            value={premisesDetails.openRate !== 0 ? premisesDetails.openRate : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/bay</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Open Ratio"
                            label="Ratio"
                            variant="outlined"
                            onChange={handleOpenRatioChange}
                            value={premisesDetails.openRatio !== 0 ? premisesDetails.openRatio : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">bays / 100m²</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingLabel>Covered:</StyledParkingLabel>
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Covered Bays"
                            label="Bays"
                            variant="outlined"
                            onChange={handleCoveredBaysChange}
                            value={premisesDetails.coveredBays !== 0 ? premisesDetails.coveredBays : null}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Covered Rate"
                            label="Rate"
                            variant="outlined"
                            onChange={handleCoveredRateChange}
                            value={premisesDetails.coveredRate !== 0 ? premisesDetails.coveredRate : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/bay</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Covered Ratio"
                            label="Ratio"
                            variant="outlined"
                            onChange={handleCoveredRatioChange}
                            value={premisesDetails.coveredRatio !== 0 ? premisesDetails.coveredRatio : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">bays / 100m²</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingLabel>Shaded:</StyledParkingLabel>
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Shaded Bays"
                            label="Bays"
                            variant="outlined"
                            onChange={handleShadedBaysChange}
                            value={premisesDetails.shadedBays !== 0 ? premisesDetails.shadedBays : null}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Shaded Rate"
                            label="Rate"
                            variant="outlined"
                            onChange={handleShadedRateChange}
                            value={premisesDetails.shadedRate !== 0 ? premisesDetails.shadedRate : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">R/bay</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <StyledParkingTextInput
                            type="number"
                            size="small"
                            id="Shaded Ratio"
                            label="Ratio"
                            variant="outlined"
                            onChange={handleShadedRatioChange}
                            value={premisesDetails.shadedRatio !== 0 ? premisesDetails.shadedRatio : null}
                            InputProps={{
                                endAdornment: <StyledInputAdornment position="end">bays / 100m²</StyledInputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                     
                    </StyledPremisesDetails>
                )
        }
    }

    return (
        <div>

            <Dialog
                maxWidth="xl"
                ref={(node) => {
                    setdialogRef(node)
                }}
                closeAfterTransition={true} open={editPremisesDialogOpen} onClose={handleClose}
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
                <DialogTitle>Edit Premises</DialogTitle>
                <DialogContent>
                    <Stepper nonLinear activeStep={activeStep} style={{
                        width: "90%",
                        margin: "auto",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        borderRadius: "20%",
                    }}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton color="inherit" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                    {PremisesContent(activeStep)}



                </DialogContent>
                <DialogActions style={{ paddingBottom: "1rem" }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    {completedSteps() !== totalSteps() ?
                        <Button style={{ paddingRight: "2rem" }} onClick={handleComplete}>Next</Button> :
                        <Button style={{ paddingRight: "2rem" }} onClick={submitPremises}>Submit</Button>}
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default EditPremisesDialog