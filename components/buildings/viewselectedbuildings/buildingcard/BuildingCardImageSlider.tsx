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
import Checkbox from '@mui/material/Checkbox';


import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { navigationSlice } from "../../../../redux/slices/navigationSlice";

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import { Cloudinary } from "@cloudinary/url-gen";

// Import any actions required for transformations.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";

import { db, auth } from "../../../../utils/firebaseClient"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, addDoc, updateDoc, doc } from "firebase/firestore";

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

interface ImageListItem {
    url: string,
    checked: boolean,
}

interface Props {
    buildingImages: ImageListItem[],
    id: string,
    handleImageCheck: (buildingId: string, imageURL: string) => void,
    handleImageOrderSelect: (buildingId: string, imagesList: ImageListItem[]) => void,
}

export const BuildingCardImageSlider: React.FunctionComponent<Props> = ({ buildingImages, id, handleImageCheck, handleImageOrderSelect }) => {

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
                original: cld.image(image.url).resize(fill().width(1200).height(800)).delivery(format(auto()))
                    .delivery(quality(qAuto())).toURL(),
                thumbnail: cld.image(image.url).resize(fill().width(300).height(200)).delivery(format(auto()))
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

        handleImageOrderSelect(id, imagesArray)

        /*  const docRef = doc(db, "buildings", id); */

        /*  await updateDoc(docRef, {
             images: imagesArray
         }) */
    }

    const getChecked = (key: number) => {

        if (buildingImages) {
            let imagesArray = buildingImages
            // @ts-ignore: Unreachable code error
            var selectedImage = imagesArray?.[key]
            if (selectedImage) {
                return selectedImage.checked
            } else return false

        } else return false


    }

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        let imagesArray = buildingImages
        // @ts-ignore: Unreachable code error
        var selectedImage = imagesArray?.[galleryRef.current?.getCurrentIndex()]

        handleImageCheck(id, selectedImage.url)
    }


    const galleryOverlay = () => {

        return (
            <StyledOverlayDiv>
                {buildingImages ? <StyledImageNumberText>
                    Image {
                        // @ts-ignore: Unreachable code error
                        galleryRef.current?.getCurrentIndex() !== undefined ?
                            // @ts-ignore: Unreachable code error
                            galleryRef.current?.getCurrentIndex() + 1 : "loading"}
                </StyledImageNumberText>: <StyledImageNumberText>Placeholder</StyledImageNumberText> }
                {buildingImages ? <StyledImageSelectButton
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClickMenu}
                >
                    Set Image
                </StyledImageSelectButton> : <></>}
                {buildingImages ? <Checkbox
                    // @ts-ignore
                    checked={getChecked(galleryRef.current?.getCurrentIndex())}
                    onChange={handleCheck}
                    inputProps={{ 'aria-label': 'controlled' }}
                /> : <></>}

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

            </StyledOverlayDiv>
        )
    }





    return (

        <StyledGalleryCard>
            <ImageGallery showBullets showThumbnails={false} ref={galleryRef} useBrowserFullscreen={false} showPlayButton={false} items={images!} renderCustomControls={galleryOverlay} />

        </StyledGalleryCard>


    )

}

export default BuildingCardImageSlider