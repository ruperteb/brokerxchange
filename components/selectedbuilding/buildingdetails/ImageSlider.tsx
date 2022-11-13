import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import Popover from '@mui/material/Popover';
import Card from "@mui/material/Card"
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';


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

import { db, auth } from "../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc } from "firebase/firestore";

interface MediaProps {
    desktop: boolean
}

const StyledGalleryCard = styled(Card)`
display:flex;
/* padding: 0.5rem; */
margin-top: 0px !important;
margin: auto;
width: 600px;
height: 480px;
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
    id: string
}

export const ImageSlider: React.FunctionComponent<Props> = ({ buildingImages, id }) => {

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

    if (buildingImages && buildingImages.length > 0 ) {

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

    const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorElMenu);
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElMenu(event.currentTarget);
    };
    const handleCloseMenu = (key: number) => {
        if (key !== 0 || key !== undefined) {
            handleMenuSelect(key)
        }
        setAnchorElMenu(null);
    };

    const [anchorElPopover, setAnchorElPopover] = React.useState<HTMLButtonElement | null>(null);

    const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setAnchorElPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorElPopover(null);
    };

    const openPopover = Boolean(anchorElPopover);
    const PopoverId = openPopover ? 'simple-popover' : undefined;

    const handleMenuSelect = async (key: number) => {

        let imagesArray = buildingImages
        // @ts-ignore: Unreachable code error
        var selectedImage = imagesArray?.[galleryRef.current?.getCurrentIndex()]

        var rest = imagesArray?.filter(image => {
            return image !== selectedImage
        })

        var beforeSelectedImage = rest?.slice(0, key - 1)
        var afterSelectedImage = rest?.slice(key - 1)

        imagesArray = [...beforeSelectedImage!, selectedImage!, ...afterSelectedImage!]

        const docRef = doc(db, "buildings", id);

        await updateDoc(docRef, {
            images: imagesArray
        })
    }

    const handleDelete = async () => {

        let imagesArray = buildingImages

        // @ts-ignore: Unreachable code error
        var selectedImage = imagesArray?.[galleryRef.current?.getCurrentIndex()]

        var rest = imagesArray?.filter(image => {
            return image !== selectedImage
        })
        imagesArray = rest

        const docRef = doc(db, "buildings", id);

        await updateDoc(docRef, {
            images: imagesArray
        })

        await handleClosePopover()
    }

    const galleryOverlay = () => {

        return (
            <StyledOverlayDiv>
                <StyledImageNumberText>
                    Image {
                        // @ts-ignore: Unreachable code error
                        galleryRef.current?.getCurrentIndex() !== undefined ?
                            // @ts-ignore: Unreachable code error
                            galleryRef.current?.getCurrentIndex() + 1 : "loading"}
                </StyledImageNumberText>
                <StyledImageSelectButton
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClickMenu}
                >
                    Set Image
                </StyledImageSelectButton>
                <StyledImageDeleteButton onClick={handleClickPopover} color="primary" aria-label="save" >
                    <DeleteOutlinedIcon />
                </StyledImageDeleteButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorElMenu}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => handleCloseMenu(1)}>Primary</MenuItem>
                    <MenuItem onClick={() => handleCloseMenu(2)}>Secondary</MenuItem>
                    <MenuItem onClick={() => handleCloseMenu(3)}>Tertiary</MenuItem>
                </Menu>
                <Popover
                    id={PopoverId}
                    open={openPopover}
                    anchorEl={anchorElPopover}
                    onClose={handleClosePopover}
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
                        <Typography sx={{ p: 2 }}>Are you sure you want to delete this image?</Typography>
                        <StyledPopoverConfirmButton onClick={handleDelete}>Confirm</StyledPopoverConfirmButton>
                        <StyledPopoverCancelButton onClick={handleClosePopover}>Cancel</StyledPopoverCancelButton>
                    </StyledPopoverDiv>

                </Popover>
            </StyledOverlayDiv>
        )
    }





    return (

        <StyledGalleryCard>
            <ImageGallery ref={galleryRef} useBrowserFullscreen={false} showPlayButton={false} items={images!} renderCustomControls={galleryOverlay} />

        </StyledGalleryCard>


    )

}

export default ImageSlider