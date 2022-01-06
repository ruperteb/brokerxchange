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

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';

import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { navigationSlice } from "../../../redux/slices/navigationSlice";

import { motion, AnimatePresence } from 'framer-motion'

import Link from 'next/link'

import { transientOptions } from "../../../utils/transientOptions"



interface VisibilityProps {
    $modalAdjustment?: boolean
}

const drawerWidth = 360;

const StyledDrawer = styled(Drawer, transientOptions) <VisibilityProps>`
& .MuiDrawer-paperAnchorDockedRight{
    padding-right: ${props => props.$modalAdjustment === true ? "17px" : 0};
    width: ${props => props.$modalAdjustment === true ? "377px" : "360px"};
}

`

const DrawerHeader = styledMUI('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const StyledListItemContainer = styled(motion.div) `
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

const SelectedBuildingsDrawer: React.FC<Props> = ({ }) => {

    const dispatch = useAppDispatch()
    const theme = useTheme();

    const handleDrawerClose = () => {
        dispatch(navigationSlice.actions.setSelectedBuildingsDrawerOpen(false))
    };

    const selectedBuildingsDrawerOpen = useAppSelector(state => state.navigation.selectedBuildingsDrawerOpen)

    const selectedBuildings = useAppSelector(state => state.navigation.selectedBuildings)

    const handleClear = () => {
        dispatch(navigationSlice.actions.clearSelectedBuildings())
    }

    const handleRemove = (id: string) => {
        dispatch(navigationSlice.actions.removeSelectedBuilding(id))
    }

    const handleView = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        dispatch(navigationSlice.actions.setViewSelectedBuildingssDialogOpen(true))
    }

    const modalAdjustment = useAppSelector(state => state.navigation.modalAdjustment)

    const getPadding =()=> {
        if(modalAdjustment) {
            return "17px"
        } else return "0px"
    }

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
            variant="persistent"
            anchor="right"
            open={selectedBuildingsDrawerOpen}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                <Typography style={{ fontWeight: "bold", margin: "auto" }}>Selected Buildings</Typography>
                <IconButton style={{ margin: "auto" }} onClick={handleClear}>
                    <DeleteSweepOutlinedIcon></DeleteSweepOutlinedIcon>
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <AnimatePresence>
                    {selectedBuildings.map((building) => (
                        <StyledListItemContainer
                           
                            layout={!modalAdjustment}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={building.id}>
                            <ListItem style={{ padding: "0px"}}>
                                <ListItemIcon onClick={() => handleRemove(building.id)}>
                                    <IconButton color='error' style={{ marginLeft: "8px" }}>
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                </ListItemIcon>
                                <Link href={`/building/${encodeURIComponent(building.id)}`}>
                                    <ListItem button key={building.id}>

                                        <ListItemText primary={building.name} />
                                    </ListItem>
                                </Link>
                            </ListItem>

                        </StyledListItemContainer>

                    ))}
                </AnimatePresence>
            </List>
            <Divider style={{ marginTop: "auto" }} />
            <StyledViewButton onClick={handleView} variant="outlined" startIcon={<FormatListNumberedOutlinedIcon />}>
                View List
            </StyledViewButton>
        </StyledDrawer>
    );
}

export default SelectedBuildingsDrawer