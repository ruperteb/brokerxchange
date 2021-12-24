import React from "react"
import { createRef } from "react"
import styled from "@emotion/styled"
import Container from "@mui/material/Container"
import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import FlipMove from "react-flip-move";
import BuildingCard from "../buildings/BuildingCard"

import AddBuildingDialog from "./AddBuildingDialog"
import AnimatedListItem from "./AnimatedListItem"

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
    const selectedBuilding = useAppSelector((state) => state.navigation.selectedBuilding)

    /* var scrollRef = React.useRef<HTMLDivElement>(null) */

    return (
        <StyledContainer maxWidth="xl">
            <FlipMove typeName={null}>
                {buildingsData.map((building, index) => (
                    <AnimatedListItem key={index} ref={createRef()}>
                        <BuildingCard key={index} buildingData={building} /* scrollRef={scrollRef} */></BuildingCard>
                    </AnimatedListItem>
                ))}
            </FlipMove>

            <AddBuildingDialog></AddBuildingDialog>

        </StyledContainer>
    )
}

export default BuildingsPanel