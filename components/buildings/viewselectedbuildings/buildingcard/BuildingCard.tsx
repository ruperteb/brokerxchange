import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"


import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { navigationSlice } from "../../../../redux/slices/navigationSlice";

import BuildingCardImageSlider from "./BuildingCardImageSlider"
/* import Map from "./Map" */

import { SAIcon, RentalIcon, AreaIcon } from "../../../icons/Icons"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import Avatar from '@mui/material/Avatar';

import Divider from '@mui/material/Divider';

import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";

import Image from 'next/image'
import dynamic from 'next/dynamic'

import { Button } from "@mui/material";

import { db, auth } from "../../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc } from "firebase/firestore";


import BuildingCardPremisesList from "./BuildingCardPremisesList"


interface MediaProps {
    desktop: boolean
}

const StyledTitleDiv = styled.div`
display: flex;
/* margin: auto; */
margin-bottom: 1rem;
width: 100%;
background-color: #bb0f0b;
`

const StyledTitleText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.6rem;
color: white;
   /*  text-shadow: -1px 1px 1px #0000008a; */
   margin: auto;
`

const StyledDetailsContainer = styled(Card)`
display:flex;
flex-direction:column;
margin-top: 0px !important;
margin: auto;
width: 100%;
    
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
font-size: 0.9rem;
color: #353c48;
padding: 0.5rem;
padding-right: 0.5rem;
padding-left: 0px;
`

const StyledIconDiv = styled.div`
width: 50px;
height: 100%;
display: flex;
/* border-left: 1px solid #3a5e95;
border-right: 1px solid #3a5e95; */
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

const StyledMapImage = styled(Image)`
padding: 0.5rem !important;

`

const StyledAvatar = styled(Avatar)`
background-color: white;
margin-left: 0.5rem;
margin-top: 0.3rem;
margin-bottom: 0.3rem;
color: black;
font-weight: 600;
border: 1px solid black;
`



interface ImageListItem {
    url: string,
    checked: boolean,
}

interface Props {
    buildingData: DocumentData,
    index: number,
    handleCheckboxClick: (event: React.MouseEvent<unknown>, buildingId: string, premisesId: string) => void,
    handleCheckboxAllClick: (event: React.ChangeEvent<HTMLInputElement>, buildingId: string) => void,
    handleImageCheck: (buildingId: string, imageURL: string) => void,
    handleImageOrderSelect: (buildingId: string, imagesList: ImageListItem[]) => void,

}

export const BuildingDetails: React.FunctionComponent<Props> = ({ buildingData, index, handleCheckboxClick, handleCheckboxAllClick, handleImageCheck, handleImageOrderSelect }) => {

    const dispatch = useAppDispatch()

    const desktop = useMediaQuery('(min-width:1024px)');

    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });

    const logo = cld.image(buildingData.buildingsLogo).resize(fill().width(200).height(60)).delivery(format(auto()))
        .delivery(quality(qAuto())).toURL()


    var mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    var zoom = 16
    var width = 345
    var height = 345

    var mapURL = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-s+ff0000(${buildingData.lng},${buildingData.lat})/${buildingData.lng},${buildingData.lat},${zoom},0/${width}x${height}@2x?access_token=${mapBoxAccessToken}`


    return (
        <>

            <Stack
                style={{ margin: "auto", marginBottom: "2rem", width: "fit-content" }}

                direction="column"
            >

                <StyledTitleDiv>
                    <StyledAvatar>
                        {index + 1}
                    </StyledAvatar>
                    <StyledTitleText>
                        {buildingData.name}
                    </StyledTitleText>
                </StyledTitleDiv>

                <Stack direction="row" style={{ flexWrap: "wrap" }} >
                    <Stack direction="column" style={{ marginRight: "1rem" }}>
                        <StyledDetailsContainer>
                            <StyledDetailsTitleDiv>
                                <StyledDetailsTitleText>
                                    Building Details
                                </StyledDetailsTitleText>
                            </StyledDetailsTitleDiv>
                            <Stack direction="row" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}  >
                                <Stack direction="column">
                                    <StyledTextDiv>
                                        <StyledIconDivLeft ><StyledLocationIcon /></StyledIconDivLeft>
                                        <StyledDetailsText>{buildingData.address}, {buildingData.suburb}, {buildingData.province} </StyledDetailsText>
                                    </StyledTextDiv>
                                    <StyledTextDiv>
                                        <StyledIconDiv><StyledContactIcon /></StyledIconDiv>
                                        <StyledDetailsText>{buildingData.contactName}</StyledDetailsText>
                                        <StyledIconDiv><StyledEmailIcon /></StyledIconDiv>
                                        <StyledDetailsText>{buildingData.contactEmail}</StyledDetailsText>
                                        <StyledIconDiv><StyledMobileIcon /></StyledIconDiv>
                                        <StyledDetailsText>{buildingData.contactMobile}</StyledDetailsText>
                                        <StyledIconDiv><StyledOfficeIcon /></StyledIconDiv>
                                        <StyledDetailsText>{buildingData.contactOffice}</StyledDetailsText>
                                    </StyledTextDiv>

                                </Stack>

                            </Stack>



                        </StyledDetailsContainer>
                        <Stack direction="row" style={{ flexGrow: 1, marginTop: "1rem" }}>
                            <BuildingCardImageSlider id={buildingData.id} buildingImages={buildingData.imagesList} handleImageCheck={handleImageCheck} handleImageOrderSelect={handleImageOrderSelect}></BuildingCardImageSlider>


                            <Card style={{ position: "relative", height: "266.67px", width: "266.67px", marginLeft: "1rem" }}>
                                <StyledMapImage layout="fill" src={mapURL}></StyledMapImage>

                            </Card>

                        </Stack>

                    </Stack>

                    <BuildingCardPremisesList handleCheckboxClick={handleCheckboxClick} handleCheckboxAllClick={handleCheckboxAllClick} buildingId={buildingData.id} premises={buildingData.premises}></BuildingCardPremisesList>

                </Stack>


            </Stack>


        </>
    )

}

export default BuildingDetails