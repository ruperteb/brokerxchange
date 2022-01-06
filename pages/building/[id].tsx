import React from "react"
import { useRouter } from 'next/router'
import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { navigationSlice } from '../../redux/slices/navigationSlice';

import { db, auth } from "../../utils/firebaseClient"
import { signOut } from "firebase/auth";
import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, doc, where } from "firebase/firestore";
import { useCollectionDataSSR, useDocumentDataSSR } from '../../utils/useDataSSR';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

import styled from '@emotion/styled';

import Container from "@mui/material/Container";

import BuildingHeader from "../../components/selectedbuilding/BuildingHeader"
import BuildingDetails from "../../components/selectedbuilding/buildingdetails/BuildingDetails"
import { useDispatch } from "react-redux"

const StyledContainer = styled(Container)`
margin-top: 75px;
`

interface Props {
    buildingData: DocumentData,
    premisesData: DocumentData[],

}

const Building: NextPage<Props> = ({ buildingData, premisesData }) => {

    const dispatch = useDispatch()

    const router = useRouter()
    const { id } = router.query


    const docRef = doc(db, "buildings", decodeURIComponent(id as string));

    const [buildingDataFirebase, loadingBuildings, errorBuildings] = useDocumentDataSSR(docRef, { idField: "id", startWith: buildingData });

    const qPremises = query(collection(db, "buildings/" + buildingDataFirebase.id + "/premises"), orderBy("name_lowerCase", "asc"));

    const [premisesDataFirebase, loadingPremises, errorPremises] = useCollectionDataSSR(qPremises, { idField: "id", startWith: premisesData });

    React.useEffect(() => {
        dispatch(navigationSlice.actions.setSelectedBuilding({ ...buildingDataFirebase, premises: premisesDataFirebase }))
    }, [buildingDataFirebase, premisesDataFirebase])


    return (

        <div >
            <Head>
                <title>Building</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />

            </Head>
            <Script id="Cloudinary Widget" src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" strategy="lazyOnload">
            </Script>
            <BuildingHeader></BuildingHeader>
            <StyledContainer maxWidth="xl">
                {loadingBuildings || loadingPremises ?
                    <div>Loading</div> :
                    <BuildingDetails></BuildingDetails>}


            </StyledContainer>
        </div>


    )
}

export default Building

export async function getStaticPaths() {

    const snapshotBuildings = await dbAdmin.collection("buildings").orderBy("name_lowerCase", "asc").get()

    const paths = snapshotBuildings.docs.map((doc) => ({
        params: { id: encodeURI(doc.id) },
    }))

    return { paths, fallback: "blocking" }

}

export const getStaticProps: GetStaticProps = async ({ params }) => {



    /* const qBuildings = query(collection(db, "buildings"), where("name", "==", params?.name)); */

    const snapshotBuilding = await dbAdmin.collection("buildings").doc(decodeURI(params?.id as string)).get()

    /* const snapshotBuilding = await dbAdmin.collection("buildings").where("name", "==", decodeURIComponent(params?.name as string)).limit(1).get()


    const building = snapshotBuilding.docs.map(doc => {
        let docData = doc
        return { ...docData.data(), id: doc.id }
    }) */


    let building = { ...snapshotBuilding.data(), id: snapshotBuilding.id }

    const snapshotPremises = await dbAdmin.collection("buildings/" + decodeURI(params?.id as string) + "/premises").orderBy("name_lowerCase", "asc").get()

    const premises = snapshotPremises.docs.map(doc => {
        let docData = doc
        return { ...docData.data(), id: doc.id }
    })


    return {
        props: {
            buildingData: building,
            premisesData: premises
        },
        revalidate: 60,
    }
}