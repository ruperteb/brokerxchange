import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"


import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { navigationSlice } from "../../../redux/slices/navigationSlice";

import ImageSlider from "../buildingdetails/ImageSlider"
/* import Map from "./Map" */

import { SAIcon, RentalIcon, AreaIcon } from "../../icons/Icons"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';

import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";

import Image from 'next/image'
import dynamic from 'next/dynamic'

import { Button } from "@mui/material";

import { db, auth } from "../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc } from "firebase/firestore";

import EditBuildingDialog from "./EditBuildingDialog"
import PremisesList from "./PremisesList"

interface MediaProps {
    desktop: boolean
}

const StyledTitleDiv = styled.div`
display: flex;
margin: auto;
margin-bottom: 1rem;
`

const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.6rem;
color: red;
    text-shadow: -1px 1px 1px #0000008a;
`

const StyledDetailsContainer = styled(Card)`
display:flex;
flex-direction:column;
margin-top: 0px !important;
margin: auto;
    
`


const StyledDetailsContainerMap = styled(Card)`
display:flex;
flex-direction:column;
margin-top: 1rem;
/* margin: 0; */
flex-grow: 1;

    
`

const StyledDetailsTitleDiv = styled.div`
display: flex;
border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
background-color: #0f0c50e6;
padding: 0.5rem;
margin-bottom: 0;

border-bottom: 1px solid #dee2e6;
`


const StyledDetailsTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.2rem;
color: white;
margin: auto;
`

const StyledTextDiv = styled.div`
display:flex;
flex-direction: row;

`

const StyledDetailsText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1.1rem;
color: #353c48;
padding: 0.5rem;
padding-right: 1rem;
`

const StyledIconDiv = styled.div`
width: 50px;
height: 100%;
display: flex;
border-left: 1px solid #3a5e95;
border-right: 1px solid #3a5e95;
`
const StyledIconDivLeft = styled(StyledIconDiv)`
border-left: 0px ;

`


const StyledLocationIcon = styled(LocationOnOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-bottom: 2px; */
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledSuburbIcon = styled(LocationCityOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`
const StyledParkingIcon = styled(DirectionsCarFilledOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledContactIcon = styled(PersonOutlineOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledEmailIcon = styled(EmailOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`
const StyledMobileIcon = styled(PhoneAndroidOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`
const StyledOfficeIcon = styled(LocalPhoneOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledTypeIcon = styled(MapsHomeWorkOutlinedIcon)`
/* font-size: 1.8rem; */
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`


const StyledSAIcon = styled(SAIcon)`
font-size: 2.1rem;
margin: auto;
margin-bottom: 0px;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledRentalIcon = styled(RentalIcon)`
font-size: 2.1rem;
margin: auto;
margin-bottom: 1px;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledAreaIcon = styled(AreaIcon)`
font-size: 2.1rem;
margin: auto;
margin-bottom: 1px;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledButtonDiv = styled.div`
display: flex;
flex-direction: column;
flex-wrap: wrap;
margin-top: 1rem;
margin-right: 1rem;
padding: 0.5rem;
`

const DynamicMap = dynamic(() => import('./Map'), {
    loading: () => <p>Loading...</p>, ssr: false
});

interface Props {

}

export const BuildingDetails: React.FunctionComponent<Props> = ({ }) => {

    const dispatch = useAppDispatch()

    const selectedBuilding = useAppSelector(state => state.navigation.selectedBuilding)

    console.log("builing details", selectedBuilding)

    const desktop = useMediaQuery('(min-width:1024px)');

    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });

    const logo = cld.image(selectedBuilding.buildingsLogo).resize(fill().width(200).height(60)).delivery(format(auto()))
        .delivery(quality(qAuto())).toURL()


    var tempImageArray: string[] = []

    const showUploadWidget = () => {
        // @ts-ignore: Unreachable code error
        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME,
                uploadPreset: "xblzxkc8",

                // Remove the comments from the code below to add 
                // additional functionality.
                // Note that these are only a few examples, to see 
                // the full list of possible parameters that you 
                // can add see:
                //   https://cloudinary.com/documentation/upload_widget_reference

                // cropping: true, //add a cropping step
                // showAdvancedOptions: true,  //add advanced options (public_id and tag)
                // sources: [ "local", "url"], // restrict the upload sources to URL and local files
                // multiple: false,  //restrict upload to a single file
                folder: `brokerxchange/${selectedBuilding?.name}`, //upload files to the specified folder
                // tags: ["users", "profile"], //add the given tags to the uploaded files
                // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
                // clientAllowedFormats: ["images"], //restrict uploading to image files only
                // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
                // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
                // theme: "purple", //change to a purple theme
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info.public_id);
                    /* handleUploadImages(result.info.public_id) */
                    tempImageArray.push(result.info.public_id)

                    /*  setTempImages(tempImages => [...tempImages, result.info.public_id]) */




                }

                if (result.event === "close") {
                    submitImages()

                }
            }
        );

        myWidget.open()

    }

    const submitImages = async () => {

        const docRef = doc(db, "buildings", selectedBuilding.id);
        var newImages: any = []

        if (selectedBuilding.images) {
            newImages = [...selectedBuilding.images, ...tempImageArray]
        } else newImages = [...tempImageArray]


        await updateDoc(docRef, {
            images: newImages
        })
    }

    const mapRef = React.useRef<HTMLDivElement>(null)
    const detailsContainerRef = React.useRef<HTMLDivElement>(null)

    var mapDivDimensions = {
        width: mapRef.current?.getBoundingClientRect().width,
        height: mapRef.current?.getBoundingClientRect().height,
    }

    const handleEditBuildingButton = () => {

        dispatch(navigationSlice.actions.setEditBuildingDialog(true))
        dispatch(navigationSlice.actions.setModalAdjustment(true))

    }


    return (
        <>
            <Stack

                direction="column"
            >
                <StyledTitleDiv>
                    <StyledTitleText>
                        {selectedBuilding.name}
                    </StyledTitleText>
                </StyledTitleDiv>
                <Stack direction="row" style={{ flexWrap: "wrap" }} >
                    <ImageSlider id={selectedBuilding.id} buildingImages={selectedBuilding.images}></ImageSlider>
                    <Stack direction="column" style={{ marginLeft: "1.5rem", marginRight: "auto" }}>
                        <StyledDetailsContainer ref={detailsContainerRef}>
                            <StyledDetailsTitleDiv>
                                <StyledDetailsTitleText>
                                    Building Details
                                </StyledDetailsTitleText>
                            </StyledDetailsTitleDiv>
                            <Stack direction="row" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}  >
                                <Stack direction="column">
                                    <StyledTextDiv>
                                        <StyledIconDivLeft ><StyledLocationIcon /></StyledIconDivLeft>
                                        <StyledDetailsText>{selectedBuilding.address}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDivLeft><StyledSuburbIcon /></StyledIconDivLeft>
                                        <StyledDetailsText>{selectedBuilding.suburb}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDivLeft><StyledSAIcon viewBox="0 0 700 700"></StyledSAIcon></StyledIconDivLeft>
                                        <StyledDetailsText>{selectedBuilding.province}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv style={{ position: "relative", height: "100%", width: "70%", margin: "auto" }}>
                                        <Image
                                            src={logo}
                                            layout="fill"
                                            objectFit="contain"
                                            objectPosition="right"
                                        /*  width={200}
                                         height={50} */
                                        />
                                    </StyledTextDiv>

                                </Stack>

                                <Stack direction="column">
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledAreaIcon viewBox="0 0 700 700" /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.vacantGLA? `${+selectedBuilding.vacantGLA.toFixed(2)}m² vacant`: ""}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledRentalIcon viewBox="0 0 700 700" /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.rentalLow ?`R${+selectedBuilding.rentalLow} to R${+selectedBuilding.rentalHigh} /m²`: ""}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledParkingIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.parkingRatio ?`${+selectedBuilding.parkingRatio.toFixed(1)} bays/100m²`: ""}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledTypeIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.type}</StyledDetailsText>
                                    </StyledTextDiv>
                                </Stack>

                                <Stack direction="column">
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledContactIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.contactName}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledEmailIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.contactEmail}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledMobileIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.contactMobile}</StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledOfficeIcon /></StyledIconDiv>
                                        <StyledDetailsText>{selectedBuilding.contactOffice}</StyledDetailsText>
                                    </StyledTextDiv>
                                </Stack>

                            </Stack>



                        </StyledDetailsContainer>
                        <Stack direction="row" style={{ flexGrow: 1 }}>
                            <Stack direction="column">
                                <StyledButtonDiv>
                                    <Button variant="outlined" onClick={handleEditBuildingButton}>Edit Details</Button>
                                </StyledButtonDiv>
                                <StyledButtonDiv>
                                    <Button variant="outlined" onClick={showUploadWidget}>Upload Images</Button>
                                </StyledButtonDiv>
                            </Stack>

                            {selectedBuilding? <StyledDetailsContainerMap ref={mapRef} >
                                <div /* style={{ padding: "0.5rem" }} */>
                                    <DynamicMap id={selectedBuilding.id} latMap={selectedBuilding.lat} lngMap={selectedBuilding.lng} mapDivDimensions={mapDivDimensions}></DynamicMap>
                                </div>
                            </StyledDetailsContainerMap>: <></>}
                        </Stack>
                    </Stack>
                </Stack>

                <PremisesList buildingId={selectedBuilding.id} premises={selectedBuilding.premises}></PremisesList>

            </Stack>
            <EditBuildingDialog></EditBuildingDialog>
        </>
    )

}

export default BuildingDetails