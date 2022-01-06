import React from "react"
import styled from "@emotion/styled"

import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import BuildingCard from "./../buildings/BuildingCard"

import AnimatedListItemBuildings from "./../buildings/AnimatedListItemBuildings"

import { motion, AnimatePresence } from 'framer-motion'


interface Props {

}

export const BuildingsPanel: React.FC<Props> = ({ }) => {

    const dispatch = useAppDispatch()

    /* const ref = React.createRef(); */

    const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

    

    return (

        <AnimatePresence>
            {buildingsData.map((building) => (
                <AnimatedListItemBuildings key={building.id} >
                    <BuildingCard key={building.id} buildingData={building} ></BuildingCard>
                </AnimatedListItemBuildings>
            ))}
        </AnimatePresence>


    )
}

export default BuildingsPanel