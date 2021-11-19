import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { db } from "../utils/firebaseClient"
import { firebaseAdmin, dbAdmin} from "../utils/firebaseAdmin"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData } from "firebase/firestore";
import { useCollectionDataSSR } from '../utils/useDataSSR';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

const admin = require('firebase-admin')

const StyledBox = styled(Box)`
height: 500px;
width: 500px;
background-color: red;
margin: auto;
`

interface Props {
  buildings: DocumentData
}

const Home: NextPage <Props> = ({buildings}) => {

  const q = query(collection(db, "buildings"), orderBy("name_lowerCase", "asc"));

  const [values, loading, error] = useCollectionDataSSR (q, { startWith: buildings } );

  console.log("values", values)


  return (
    <Container maxWidth="sm">
      <h1>Home Page</h1>
      <p>lorem*15</p>
      <StyledBox></StyledBox>
    </Container>
  );
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => {

  const firebaseApp =
  //@ts-ignore
  global.firebaseApp ??
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "brokerxchange-253e7",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })

// store on global object so we can reuse it if we attempt
// to initialize the app again
  //@ts-ignore
global.firebaseApp = firebaseApp

//@ts-ignore
const dbAdmin2 = global.firebaseApp.firestore()
  /* const q = query(collection(dbAdmin, "buildings"), orderBy("name_lowerCase", "asc"));
  const querySnapshot = await getDocs(q); */

 const snapshot = await dbAdmin2.collection("buildings").get()
//@ts-ignore
const data = snapshot.docs.map(doc => {
  let docData = doc
  return { ...docData.data(), id: doc.id }
})  

    /* console.log(data)

     const changeClaims = async () => {
        await authAdmin.setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
            admin: true,
        })

    }

    changeClaims()  */
  
  return {
    props: {
      buildings: data 
    }, // will be passed to the page component as props
  }
}