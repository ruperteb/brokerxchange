import React from "react"

import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useHeaderVisible } from "../../utils/useHeaderVisible";

import Logo from "../assets/Logo.png"

import useMediaQuery from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "../../redux/hooks"

import { useAuth } from '../../utils/authProvider'
import {navigationSlice} from "../../redux/slices/navigationSlice";


interface MediaProps {
    desktop: boolean
}

interface NavContainerProps {
    visible: boolean
}

interface StyledStackProps {
    visible: boolean
}

const NavContainer = styled.div<NavContainerProps>`
/* position: fixed; */
display:flex;
width: 100%;
/* transform: translate(-50%, 0); */
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
z-index: 100;
/* top: ${props => props.visible === true ? "80px" : "20px"}; */
/* box-shadow: 0px 10px 10px -15px #111; */
padding-bottom: 1rem;

background-color: white;
`

const StyledStack = styled(Stack) <StyledStackProps>`
margin: auto;
`

const StyledButton = styled(Button)`
margin-left: 1rem;
`



interface Props {

}

export const Navigation: React.FunctionComponent<Props> = ({ }) => {

    const user = useAuth()

    const [userClaims, setUserClaims] = React.useState()

    user?.getIdTokenResult().then((idTokenResult) => {
        setUserClaims(idTokenResult.claims.admin)
      })

    const visible = useHeaderVisible()

    const dispatch = useAppDispatch()
    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)  

    const desktop = useMediaQuery('(min-width:1024px)');

    const [value, setValue] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState('');

    const handleAddBuildingButton = () => {
        
            dispatch(navigationSlice.actions.setAddBuildingDialog(true))
            dispatch(navigationSlice.actions.setModalAdjustment(true))
        
    }



    return (

        <NavContainer visible={visible}>
            <StyledStack
                visible={visible}
                direction="row"
                /* justifyContent="space-evenly" */
                alignItems="center"
            /* spacing={2} */
            >

                <Autocomplete
                    size="small"
                    style={{ width: "300px" }}
                    value={value}
                    onChange={(event: any, newValue: string | null) => {
                        setValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="Search"
                    freeSolo
                    options={buildingsData.map((building) => building.name)}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                />

                <StyledButton variant="outlined" startIcon={<FilterAltOutlinedIcon/>}>Filter </StyledButton>

                {userClaims?<StyledButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddBuildingButton}>Add</StyledButton>: <></>}

            </StyledStack>
        </NavContainer>



    )

}

export default Navigation