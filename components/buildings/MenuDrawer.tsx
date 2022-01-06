import * as React from 'react';
import { styled as styledMUI, useTheme } from '@mui/material/styles';
import styled from "@emotion/styled"
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';


import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { navigationSlice } from "../../redux/slices/navigationSlice";

import { motion, AnimatePresence } from 'framer-motion'

import Link from 'next/link'

import { transientOptions } from "../../utils/transientOptions"



interface VisibilityProps {
    $modalAdjustment?: boolean
}

const drawerWidth = 250;

const StyledDrawer = styled(Drawer, transientOptions) <VisibilityProps>`
/* & .MuiDrawer-paperAnchorDockedRight{
    padding-right: ${props => props.$modalAdjustment === true ? "17px" : 0};
    width: ${props => props.$modalAdjustment === true ? "377px" : "360px"};
} */

`

const DrawerHeader = styledMUI('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const StyledListItemContainer = styled(motion.div)`
display: flex;

`

const StyledViewButton = styled(Button)`
width: fit-content;
margin: auto;
margin-top: 1rem;
margin-bottom: 1rem;
`

interface Props {

}

const MenuDrawer: React.FC<Props> = ({ }) => {

    const dispatch = useAppDispatch()
    const theme = useTheme();

    const handleDrawerClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        dispatch(navigationSlice.actions.setMenuDrawerOpen(false))
    };

    const menuDrawerOpen = useAppSelector(state => state.navigation.menuDrawerOpen)





    /* const handleView = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        dispatch(navigationSlice.actions.setViewSelectedBuildingssDialogOpen(true))
    } */

    const modalAdjustment = useAppSelector(state => state.navigation.modalAdjustment)

    const getPadding = () => {
        if (modalAdjustment) {
            return "17px"
        } else return "0px"
    }

    const handleBuildingsClick = () => {
        dispatch(navigationSlice.actions.setPanelView("buildings"))
    };

    const handleSavedListsClick = () => {
        dispatch(navigationSlice.actions.setPanelView("lists"))
    };

    return (
        <StyledDrawer
            $modalAdjustment={modalAdjustment}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            /* variant="persistent" */
            anchor="left"
            open={menuDrawerOpen}
            onClose={handleDrawerClose}
        >
            <DrawerHeader>
                <Typography style={{ fontWeight: "bold", margin: "auto",  marginLeft: "4rem" }}>Menu</Typography>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>


            </DrawerHeader>
            <Divider />
            <List>
                <ListItem button >
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                </ListItem>
                <ListItem button onClick={handleBuildingsClick} >
                    <ListItemIcon>
                        <HomeWorkOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Buildings"} />
                </ListItem>
                <ListItem button onClick={handleSavedListsClick} >
                    <ListItemIcon>
                        <FormatListNumberedOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"My Lists"} />
                </ListItem>
                

            </List>
            <Divider />
            <DrawerHeader>
                <Typography style={{ fontWeight: "bold", margin: "auto", marginLeft: "4rem" }}>Admin</Typography>
            </DrawerHeader>
            <Divider />
            <List>

                <ListItem button >
                    <ListItemIcon>
                        <PeopleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Users"} />
                </ListItem>
                <ListItem button >
                    <ListItemIcon>
                        <BusinessOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Landlords"} />
                </ListItem>

            </List>

        </StyledDrawer>
    );
}

export default MenuDrawer