import React from "react"
import { useRouter } from 'next/router'
import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { navigationSlice } from '../../redux/slices/navigationSlice';

import { db, auth } from "../../utils/firebaseClient"
import { signOut } from "firebase/auth";
import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, doc } from "firebase/firestore";
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

}

const Building: NextPage<Props> = ({ buildingData }) => {

    const dispatch = useDispatch()

    const router = useRouter()
    const { buildingName, id } = router.query

    const docRef = doc(db, "buildings", id as string);

    const [buildingDataFirebase, loadingBuildings, errorBuildings] = useDocumentDataSSR(docRef, { idField: "id", startWith: buildingData });



    React.useEffect(() => {
        dispatch(navigationSlice.actions.setSelectedBuilding(buildingDataFirebase))
    }, [buildingDataFirebase])


    return (

        <div >
            <Head>
                <title>Building</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript">
                </script>
            </Head>
            <BuildingHeader></BuildingHeader>
            <StyledContainer maxWidth="xl">
                <BuildingDetails></BuildingDetails>


            </StyledContainer>
        </div>


    )
}

export default Building

export async function getStaticPaths() {

    const snapshotBuildings = await dbAdmin.collection("buildings").orderBy("name_lowerCase", "asc").get()

    const paths = snapshotBuildings.docs.map((doc) => ({
        params: { id: doc.id },
    }))

    return { paths, fallback: "blocking" }

}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const snapshotBuilding = await dbAdmin.collection("buildings").doc(params?.id as string).get()

    let building = snapshotBuilding.data()

    return {
        props: {
            buildingData: building,
        },
        revalidate: 60,
    }
}