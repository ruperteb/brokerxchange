import React from "react"
import styled from "@emotion/styled"
import Container from "@mui/material/Container"
import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import FlipMove from "react-flip-move";
import BuildingCard from "../buildings/BuildingCard"

import AddBuildingDialog from "./AddBuildingDialog"

const StyledContainer = styled(Container)`
margin-top: 160px;
display: flex;
flex-direction: column;
`

interface Props {

}

export const BuildingsPanel: React.FC<Props> = ({ }) => {

    /* const ref = React.createRef(); */

    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

    

    return (
        <StyledContainer maxWidth="xl">
            <FlipMove typeName={null}>
                {buildingsData.map((building, index) => (
                    <BuildingCard key={index} buildingData={building} /* ref={ref} */></BuildingCard>
                ))}
            </FlipMove>

            <AddBuildingDialog></AddBuildingDialog>

        </StyledContainer>
    )
}

export default BuildingsPanel