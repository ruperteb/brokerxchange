import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from "../utils/firebaseClient"

import styled from "@emotion/styled"

import HeaderSimple from "../components/HeaderSimple"
import { Container } from '@mui/material';

const StyledAuthDiv = styled.div`
display:flex;
margin: auto;
margin-top: 4rem;
`

const StyledStyledFirebaseAuth = styled(StyledFirebaseAuth)`
width: 500px;
`

const LoginPage: NextPage = () => {

    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,

        ],
    };

    return (
        <div >
            <Head>
                <title>brokerXchange</title>
                <meta name="description" content="brokerXchange: Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HeaderSimple></HeaderSimple>
            <Container maxWidth="xl" style={{display: "flex"}}>
                <StyledAuthDiv>
                    <StyledStyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </StyledAuthDiv>

            </Container>



        </div>
    )
}

export default LoginPage
