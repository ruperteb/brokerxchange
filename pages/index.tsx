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
  buildings: DocumentData
}

const Home: NextPage<Props> = ({ buildings }) => {

  const q = query(collection(db, "buildings"), orderBy("name_lowerCase", "asc"));

  const [values, loading, error] = useCollectionDataSSR(q, { startWith: buildings });

  console.log("values", values)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(navigationSlice.actions.setBuildingsData(values))
  }, [values])

  const buildingsData = useAppSelector((state) => state.navigation.buildingsData)

  console.log("redux", buildingsData)

  const user = useAuth()
  console.log("authUser", user?.getIdToken(true))
  console.log(user)

  user?.getIdTokenResult().then((idTokenResult) => {
    console.log(idTokenResult.claims)
  })

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  const [text, setText] = useState("")
  console.log(text)

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const callApi = async () => {

    const info = {
      uuid: "hHXGoLUOSMgtstnrJBcQnWQzTMj1",
      value: false
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
    <Container maxWidth="sm">
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
      <StyledBox></StyledBox>
    </Container>
  );
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {

  /* const q = query(collection(dbAdmin, "buildings"), orderBy("name_lowerCase", "asc"));
  const querySnapshot = await getDocs(q); */

  const snapshot = await dbAdmin.collection("buildings").get()

  const data = snapshot.docs.map(doc => {
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
      buildings: data
    }, // will be passed to the page component as props
  }
}