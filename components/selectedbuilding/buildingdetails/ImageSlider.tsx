import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"


import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { navigationSlice } from "../../../redux/slices/navigationSlice";

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
width: 600px;
`


interface Props {
    buildingImages: string[]
}

export const ImageSlider: React.FunctionComponent<Props> = ({ buildingImages }) => {




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
            original: cld.image("/brokerxchange/Sunclare Building/Sunclare-Building-Claremont-5_ipnlpp.jpg").resize(fill().width(1200).height(800)).delivery(format(auto()))
                .delivery(quality(qAuto())).toURL(),
            thumbnail: cld.image("/brokerxchange/Sunclare Building/Sunclare-Building-Claremont-5_ipnlpp.jpg").resize(fill().width(300).height(200)).delivery(format(auto()))
                .delivery(quality(qAuto())).toURL(),
        }]
    }



    return (

        <StyledGalleryCard>
            <ImageGallery useBrowserFullscreen={false} showPlayButton={false} items={images!} />
        </StyledGalleryCard>

    )

}

export default ImageSlider