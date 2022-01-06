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
import { navigationSlice } from "../../redux/slices/navigationSlice";

import { transientOptions } from "../../utils/transientOptions"




const NavContainer = styled.div`

display:flex;
width: 100%;

transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
z-index: 100;
padding-bottom: 1rem;

background-color: white;
`

const StyledStack = styled(Stack)`
margin: auto;
`

const StyledButton = styled(Button)`
margin-left: 1rem;
`



interface Props {

}

export const Navigation: React.FunctionComponent<Props> = ({ }) => {


    const userAuth = useAppSelector(state => state.auth.auth)


    const dispatch = useAppDispatch()
    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

    const desktop = useMediaQuery('(min-width:1024px)');

    const [value, setValue] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        dispatch(navigationSlice.actions.setBuildingsSearch(inputValue))
    }, [inputValue])

    const handleAddBuildingButton = () => {

        dispatch(navigationSlice.actions.setAddBuildingDialog(true))
        dispatch(navigationSlice.actions.setModalAdjustment(true))

    }



    return (

        <NavContainer>
            <StyledStack

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

                <StyledButton variant="outlined" startIcon={<FilterAltOutlinedIcon />}>Filter </StyledButton>

                {userAuth.role === "admin" ? <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddBuildingButton}>Add</StyledButton> : <></>}

            </StyledStack>
        </NavContainer>



    )

}

export default Navigation