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
margin-left: 1.5rem;
    
`

const StyledDetailsTitleDiv = styled.div`
display: flex;
border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
background-color: #3a5e95;
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

interface Props {

}

export const BuildingDetails: React.FunctionComponent<Props> = ({ }) => {


    const selectedBuilding = useAppSelector(state => state.navigation.selectedBuilding)

    const desktop = useMediaQuery('(min-width:1024px)');

    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });

    const logo = cld.image(selectedBuilding.buildingsLogo).resize(fill().width(200).height(60)).delivery(format(auto()))
        .delivery(quality(qAuto())).toURL()



    return (

        <Stack
      
            direction="column"
        >
            <StyledTitleDiv>
                <StyledTitleText>
                    {selectedBuilding.name}
                </StyledTitleText>
            </StyledTitleDiv>
            <Stack direction="row" style={{ flexWrap: "wrap" }} >
                <ImageSlider buildingImages={selectedBuilding.images}></ImageSlider>
                <StyledDetailsContainer>
                    <StyledDetailsTitleDiv>
                        <StyledDetailsTitleText>
                            Building Details
                        </StyledDetailsTitleText>
                    </StyledDetailsTitleDiv>
                    <Stack direction="row" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} >
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
                                <StyledDetailsText>{`${selectedBuilding.vacantGLA}m² vacant`}</StyledDetailsText>
                            </StyledTextDiv>
                            <StyledTextDiv>
                                <StyledIconDiv><StyledRentalIcon viewBox="0 0 700 700" /></StyledIconDiv>
                                <StyledDetailsText>{`R${selectedBuilding.rentalLow} to R${selectedBuilding.rentalHigh} /m²`}</StyledDetailsText>
                            </StyledTextDiv>
                            <StyledTextDiv>
                                <StyledIconDiv><StyledParkingIcon /></StyledIconDiv>
                                <StyledDetailsText>{`${selectedBuilding.parkingRatio} bays/100m²`}</StyledDetailsText>
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

            </Stack>



        </Stack>



    )

}

export default BuildingDetails