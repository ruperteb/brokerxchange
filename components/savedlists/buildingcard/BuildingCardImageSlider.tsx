import React from "react"

import styled from '@emotion/styled';

import Typography from '@mui/material/Typography';
import Card from "@mui/material/Card"
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';


import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";


interface MediaProps {
    desktop: boolean
}

const StyledGalleryCard = styled(Card)`
display:flex;
/* padding: 0.5rem; */
margin-top: 0px !important;
margin: auto;
width: 400px;
/* height: 345px; */
`

const StyledOverlayDiv = styled.div`
display: flex;
flex-direction: row;
position: absolute;
width: 100%;
z-index: 50;
background-color: #f0f8ff91;
`

const StyledImageNumberText = styled(Typography)`
display:flex;
margin: auto;
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.3rem;
`

const StyledImageSelectButton = styled(Button)`
display:flex;
margin-right: 1rem;
&:hover {
    background-color: #556cd63b;
}
`

const StyledImageDeleteButton = styled(IconButton)`
display:flex;
margin-right: 1rem;
&:hover {
    background-color: #556cd63b;
}
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
    buildingImages: string[],
    
}

export const BuildingCardImageSlider: React.FunctionComponent<Props> = ({ buildingImages }) => {

    const dispatch = useAppDispatch()

    const desktop = useMediaQuery('(min-width:1024px)');

    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME
        }
    });


    interface Image {
        original: string,
        thumbnail: string,

    }

    var images: Image[] | undefined = []

    if (buildingImages) {

        images = buildingImages.map((image) => {

            return {
                original: cld.image(image).resize(fill().width(1200).height(800)).delivery(format(auto()))
                    .delivery(quality(qAuto())).toURL(),
                thumbnail: cld.image(image).resize(fill().width(300).height(200)).delivery(format(auto()))
                    .delivery(quality(qAuto())).toURL(),


            }
        })

    } else {
        images = [{
            original: cld.image("/brokerxchange/General Media/LogoImage_e2wt2b.png").resize(fill().width(1200).height(800)).delivery(format(auto()))
                .delivery(quality(qAuto())).toURL(),
            thumbnail: cld.image("/brokerxchange/General Media/LogoImage_e2wt2b.png").resize(fill().width(300).height(200)).delivery(format(auto()))
                .delivery(quality(qAuto())).toURL(),

        }]
    }

    const galleryRef = React.useRef(null)

    







    


    





    return (

        <StyledGalleryCard>
            <ImageGallery showBullets showThumbnails={false} ref={galleryRef} useBrowserFullscreen={false} showPlayButton={false} items={images!}  />

        </StyledGalleryCard>


    )

}

export default BuildingCardImageSlider