import React, { forwardRef } from "react"
import styled from "@emotion/styled"

import Paper from "@mui/material/Paper"
import Typography from '@mui/material/Typography';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import Checkbox from '@mui/material/Checkbox';
import MUILink from '@mui/material/Link';

import { SAIcon, RentalIcon, AreaIcon } from "../icons/Icons"

import { DocumentData } from "firebase/firestore";

/* import { AdvancedImage } from '@cloudinary/react'; */
import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { constants } from "buffer";

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { navigationSlice } from '../../redux/slices/navigationSlice';

const StyledPaper = styled(Paper)`
height: 200px;
width: 900px;
display: flex;
margin: auto;
flex-direction: row;
overflow: hidden;
border-radius: 10px;
margin-bottom: 1.5rem;
transition: transform 200ms ease 0s, -webkit-transform 200ms ease 0s;
&:hover {
    transform: scale(0.995)
    /* background-color: grey */
}
`

const BuildingContentsDiv = styled.div`
display: flex;
flex-direction: column;
width: 100%;
`

const BuildingTitleDiv = styled.div`
display:flex;
background-color: #0f0c50e6;
padding-bottom: 0.2rem;
position: relative;
`

const BuildingTitle = styled(MUILink)`
text-decoration: none;
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.6rem;
display: inline-block;
  position: relative;
  color: white;
cursor: pointer;
margin: auto;
margin-left: 25%;
text-shadow: 1px 1px 10px black;

  &::after {
    content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: red;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;

  }

  &:hover::after {
    transform: scaleX(1);
  transform-origin: bottom left;
  }


`

interface BuildingType {
    color: string
}

const BuildingTypeDiv = styled.div<BuildingType>`
display: flex;
z-index: 2;
position: absolute;
height: 100%;
width: 150px;
font-size: 11px;
background-color: ${props => props.color};
top: 0;
right: 0;
text-transform: uppercase;
font-weight: 900;
&::after {
    right: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136,183,213,0);
    border-right-color: ${props => props.color};
    border-width: 20px;
    border-right-width: 20px;
    top: 0;
}
`

const BuildingTypeText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.1rem;
color: white;
margin: auto;
/* margin-left: 0px; */
`

const BuildingDetailsDiv = styled.div`
display:flex;
position: relative;
height: 100%;
flex-direction: row;
padding-bottom: 0.5rem;
padding-left: 0.5rem;
`

const BuildingDetailsLeft = styled.div`
display:flex;
flex-direction: column;
width: 33%;
`

const BuildingDetailsMiddle = styled.div`
display:flex;
flex-direction: column;
width: 33%;
`

const BuildingDetailsRight = styled.div`
display:flex;
flex-direction: column;
width: 34%;
position: relative;
`

const BuildingDetailsCell = styled.div`
display:flex;
flex-direction: row;
width: 100%;
height: 33.333333%;
`

const BuildingDetailsText = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 400;
font-size: 1rem;
color: black;
margin: auto;
margin-left: 0px;
`

const IconDiv = styled.div`
width: 20%;
height: 100%;
display: flex;
`

interface HoverProps {
    hover: boolean;
    checked: boolean | undefined;
}

const StyledCheckbox = styled(Checkbox) <HoverProps>`
margin: auto;
margin-right: 0px;
& .MuiSvgIcon-root { 
    font-size: 30px;
    color: #e9130e;
    }
    visibility: ${props => props.hover || props.checked ? "visible" : "hidden"};
   
`

const StyledArrowCircle = styled(ArrowCircleUpOutlinedIcon)`
font-size: 4rem;
transform: rotate(90deg);
margin: auto;
margin-right: 1.5rem;
margin-left: 1.5rem;
fill: #1b14a5;
transition: all 0.5s ease;
cursor: pointer;

&:hover {
    fill: #e9130e;
    transform: scale(1.1) rotate(90deg);
}


`

const StyledLocationIcon = styled(LocationOnOutlinedIcon)`
font-size: 1.8rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledSuburbIcon = styled(LocationCityOutlinedIcon)`
font-size: 1.8rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledSAIcon = styled(SAIcon)`
font-size: 2.1rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledRentalIcon = styled(RentalIcon)`
font-size: 2.1rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledAreaIcon = styled(AreaIcon)`
font-size: 2.1rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`

const StyledParkingIcon = styled(DirectionsCarFilledOutlinedIcon)`
font-size: 1.8rem;
margin: auto;
/* margin-left: 1rem; */
fill: #1b14a5;
`


interface Props {
    buildingData: DocumentData,
    /* scrollRef: React.RefObject<HTMLDivElement> */

}

export const BuildingCard: React.FC<Props> = ({ buildingData, /* scrollRef */ }) => {
    BuildingCard.displayName = "BuildingCard";
    const scrollRef = React.useRef<HTMLDivElement>(null)

   /*  console.log(scrollRef.current?.offsetTop) */




    const dispatch = useAppDispatch()
    const selectedBuilding = useAppSelector(state => state.navigation.selectedBuilding)
    const selectedBuildings = useAppSelector(state => state.navigation.selectedBuildings)

    


   


    const router = useRouter()

    const handleClick = (e: any) => {
        e.preventDefault()
        router.push({
            pathname: '/building/[id]',
            query: { id: buildingData.id, name: buildingData.name },
        })
    }

    const getCheckStatus = () => {
        var checked = false
        if (selectedBuildings)
            selectedBuildings.map((building) => {
                if (building.id === buildingData.id) {
                    checked = true
                }
            })
        return checked
    }

    const handleCheckbox = () => {
        if (getCheckStatus()) {
            dispatch(navigationSlice.actions.removeSelectedBuilding(buildingData.id))
        } else dispatch(navigationSlice.actions.addSelectedBuilding(buildingData))
    }





    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });

    var images: string[] | undefined = []

    if (buildingData?.images) {
        images = buildingData.images.map((image: string) => {
            return image
        })
    }

    var cardImage: string = ""
    if (images?.[0]) {
        cardImage = cld.image(images![0]).resize(fill().width(600).height(400)).delivery(format(auto()))
            .delivery(quality(qAuto())).toURL()
    } else {
        cardImage = cld.image("/brokerxchange/Sunclare Building/Sunclare-Building-Claremont-5_ipnlpp.jpg").resize(fill().width(600).height(400)).delivery(format(auto()))
            .delivery(quality(qAuto())).toURL()
    }


    const logo = cld.image(buildingData.buildingsLogo).resize(fill().width(200).height(60)).delivery(format(auto()))
        .delivery(quality(qAuto())).toURL()


    const handleBuildingTypeColor = () => {
        switch (buildingData.type) {
            case "Office":
                return "#bb0f0b"
                break;
            case "Industrial":
                return "#5c676d"
                break;
            case "Retail":
                return "green"
                break;

            default:
                return "#7c1b95"
                break;
        }

    }

    const [hover, setHover] = React.useState(false);



    return (

        <StyledPaper ref={scrollRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}  >
            <Image
                src={cardImage}
                layout="intrinsic"
                width={300}
                height={200}
            />
            <BuildingContentsDiv>
                <BuildingTitleDiv>
                    <Link
                        passHref
                        href={{
                            pathname: '/building/[id]',
                            query: { id: buildingData.id, name: buildingData.name },
                        }}>

                        <BuildingTitle>{buildingData.name}</BuildingTitle>

                    </Link>
                    <BuildingTypeDiv color={handleBuildingTypeColor()}>
                        <BuildingTypeText>{buildingData.type}</BuildingTypeText>
                    </BuildingTypeDiv>
                </BuildingTitleDiv>
                <BuildingDetailsDiv>
                    <BuildingDetailsLeft>
                        <BuildingDetailsCell>
                            <IconDiv>
                                <StyledLocationIcon></StyledLocationIcon>
                            </IconDiv>
                            <BuildingDetailsText>{buildingData.address}</BuildingDetailsText>
                        </BuildingDetailsCell>
                        <BuildingDetailsCell>
                            <IconDiv>
                                <StyledSuburbIcon></StyledSuburbIcon>
                            </IconDiv>
                            <BuildingDetailsText>{buildingData.suburb}</BuildingDetailsText>
                        </BuildingDetailsCell>
                        <BuildingDetailsCell>
                            <IconDiv>
                                <StyledSAIcon viewBox="0 0 700 700" style={{ marginLeft: "5px", marginBottom: "5px" }}></StyledSAIcon>
                            </IconDiv>
                            <BuildingDetailsText>{buildingData.province}</BuildingDetailsText>
                        </BuildingDetailsCell>

                    </BuildingDetailsLeft>
                    <BuildingDetailsMiddle>
                        <BuildingDetailsCell>
                            {buildingData.vacantGLA ?
                                <>
                                    <IconDiv>
                                        <StyledAreaIcon viewBox="0 0 700 700" style={{ marginLeft: "5px", marginBottom: "5px" }}></StyledAreaIcon>
                                    </IconDiv>
                                    <BuildingDetailsText>{`${+buildingData.vacantGLA.toFixed(2)}m² vacant`}</BuildingDetailsText>
                                </>
                                : <></>}
                        </BuildingDetailsCell>
                        <BuildingDetailsCell>
                            {buildingData.rentalLow || buildingData.rentalHigh ?
                                <>
                                    <IconDiv>
                                        <StyledRentalIcon viewBox="0 0 700 700" style={{ marginLeft: "5px", marginBottom: "5px" }}></StyledRentalIcon>
                                    </IconDiv>
                                    <BuildingDetailsText>{`R${+buildingData.rentalLow.toFixed(2)}/m² to R${+buildingData.rentalHigh.toFixed(2)}/m²`}</BuildingDetailsText>
                                </>
                                : <></>}
                        </BuildingDetailsCell>
                        <BuildingDetailsCell>
                            {buildingData.parkingRatio ?
                                <>
                                    <IconDiv>
                                        <StyledParkingIcon></StyledParkingIcon>
                                    </IconDiv>
                                    <BuildingDetailsText>{`${+buildingData.parkingRatio.toFixed(1)} bays/100m² `}</BuildingDetailsText>
                                </>
                                : <></>}
                        </BuildingDetailsCell>

                    </BuildingDetailsMiddle>
                    <BuildingDetailsRight>
                        {/*  <BuildingDetailsCell></BuildingDetailsCell> */}
                        <BuildingDetailsCell style={{ height: "66.6666666%" }}>
                            <StyledCheckbox
                                checked={getCheckStatus()}
                                onChange={handleCheckbox} hover={hover}></StyledCheckbox>
                            <StyledArrowCircle onClick={handleClick}></StyledArrowCircle>
                        </BuildingDetailsCell>
                        <BuildingDetailsCell style={{ position: "relative" }}>
                            <Image
                                src={logo}
                                layout="fill"
                                objectFit="contain"
                                objectPosition="right"
                            /*  width={200}
                             height={50} */
                            />
                        </BuildingDetailsCell>

                    </BuildingDetailsRight>


                </BuildingDetailsDiv>


            </BuildingContentsDiv>


            {/*  <img style={{ width: "600px", height: "400px" }} src={cardImage}></img> */}
        </StyledPaper>




    )
}

export default BuildingCard