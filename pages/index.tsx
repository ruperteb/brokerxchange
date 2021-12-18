import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import { db, auth } from "../utils/firebaseClient"
import { signOut } from "firebase/auth";
import { firebaseAdmin, dbAdmin } from "../utils/firebaseAdmin"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData } from "firebase/firestore";
import { useCollectionDataSSR } from '../utils/useDataSSR';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { navigationSlice } from '../redux/slices/navigationSlice';
import { useEffect } from 'react';

import { useAuth } from '../utils/authProvider'

import Header from "../components/Header"
import Navigation from "../components/buildings/Navigation"
import BuildingsPanel from "../components/buildings/BuildingsPanel"

const StyledContainer = styled(Container)`
margin-top: 75px;
`

const BlankDiv = styled.div`
background-color: white;
height: 100px;
width: 100%;
position: fixed;
top: 0;
z-index:100;
`

const StyledBox = styled(Box)`
height: 500px;
width: 500px;
background-color: red;
margin: auto;
`

const StyledButton = styled(Button)`

  color: blue;

`

interface Props {
  buildings: DocumentData,
  landlords: DocumentData,
}

const Home: NextPage<Props> = ({ buildings, landlords }) => {

  const qBuildings = query(collection(db, "buildings"), orderBy("name_lowerCase", "asc"));

  const qLandlords = query(collection(db, "landlords"), orderBy("name_lowerCase", "asc"));

  const [buildingsDataFirebase, loadingBuildings, errorBuildings] = useCollectionDataSSR(qBuildings, {idField: "id", startWith: buildings });

  const [landlordsDataFirebase, loadingLandlords, errorLandlords] = useCollectionDataSSR(qLandlords, {idField: "id", startWith: landlords });

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(navigationSlice.actions.setBuildingsData(buildingsDataFirebase))
  }, [buildingsDataFirebase])

  useEffect(() => {
    dispatch(navigationSlice.actions.setLandlordsData(landlordsDataFirebase))
  }, [landlordsDataFirebase])



  const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

  const landlordsData = useAppSelector((state) => state.navigation.landlordsData)

  console.log(landlordsData)

  const user = useAuth()

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  const [text, setText] = useState("")

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const callApi = async () => {

    const info = {
      uid: user?.uid,
      value: text
    }
    /* 'https://brokerxchange2.netlify.app/api/test' */
    const res = await fetch('/api/test', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    })
    const data = await res.json()
    /* const data = await res.text() */
    await console.log(data)
  }



  return (
    <div style={{height: "150vh"}}>
      <Header></Header>
      <BuildingsPanel></BuildingsPanel>

      <StyledContainer maxWidth="xl">

       

        <h1>Home Page</h1>
        <p>lorem*15</p>

        <Link href="/login">
          <a>Login</a>
        </Link>

        <StyledButton onClick={handleSignOut}>Sign-Out</StyledButton>
        <TextField id="outlined-basic" label="Outlined" variant="outlined"
          value={text}
          onChange={handleTextChange}
        />
        <Button onClick={callApi}>API</Button>
        {/* <StyledBox></StyledBox> */}
      </StyledContainer>
    </div>
  );
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {

  /* const q = query(collection(dbAdmin, "buildings"), orderBy("name_lowerCase", "asc"));
  const querySnapshot = await getDocs(q); */

  const snapshotBuildings = await dbAdmin.collection("buildings").orderBy("name_lowerCase", "asc").get()

  const dataBuildings = snapshotBuildings.docs.map(doc => {
    let docData = doc
    return { ...docData.data(), id: doc.id }
  })

  const snapshotLandlords = await dbAdmin.collection("landlords").orderBy("name_lowerCase", "asc").get()

  const dataLandlords = snapshotLandlords.docs.map(doc => {
    let docData = doc
    return { ...docData.data(), id: doc.id }
  })



  /* const changeClaims = async () => {
    await firebaseAdmin.auth().setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
      admin: false,
    })

  }

  changeClaims() */

  return {
    props: {
      buildings: dataBuildings,
      landlords: dataLandlords
    }, // will be passed to the page component as props
  }
}