import React from "react"
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


import styled from "@emotion/styled"

import HeaderSimple from "../components/HeaderSimple"
import Container from '@mui/material/Container';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../utils/authProvider";

import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebaseClient"

import { useRouter } from 'next/router'


const StyledSignUpDiv = styled.div`
display:flex;
margin: auto;
margin-top: 4rem;
`

const StyledCard = styled(Card)`
display: flex;
`

const StyledStack = styled(Stack)`
display: flex;
flex-direction: column;
padding: 24px;
width: 360px;
`

const StyledCardHeading = styled(Typography)`
color: rgba(0,0,0,.87);
direction: ltr;
font-size: 20px;
font-weight: 500;
line-height: 24px;
margin: 0;
padding-bottom: 16px;
text-align: left;
width: 100%;
`

const StyledInput = styled(TextField)`
/* margin-top: 1rem; */
margin-bottom: 1rem;
`

const StyledButton = styled(Button)`
margin-top: 1rem;
margin-left: auto;
`


const SignUpPage: NextPage = () => {

    interface UserDetails {
        name: string,
        email: string,
        organisation?: string,
        password: string,
        passwordValidate: string,
    }

    const [userDetails, setUserDetails] = React.useState<UserDetails>({
        name: "",
        email: "",
        organisation: "",
        password: "",
        passwordValidate: "",
    })

    interface UserDetailsError {
        name: boolean,
        email: boolean,
        organisation?: boolean,
        password: boolean,
        passwordValidate: boolean,
    }

    const [userDetailsError, setUserDetailsError] = React.useState<UserDetailsError>({
        name: false,
        email: false,
        organisation: false,
        password: false,
        passwordValidate: false,
    })

    const [firebaseError, setFirebaseError] = React.useState("")

    const validName = new RegExp('^[a-zA-Z- ]{2,30}$')
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPassword = new RegExp('(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$');

    const [signUpStep, setSignUpStep] = React.useState(0)

    const validateDetails = async () => {
        var name = false
        var email = false
        /* var organisation = false */
        var password = false
        if (!validName.test(userDetails.name)) {
            name = true;
        } else name = false
        if (!validEmail.test(userDetails.email)) {
            email = true;
        } else email = false
        /*  if (!validName.test(userDetails.name)) {
             name = true;
         } else name = false */
        if (!validPassword.test(userDetails.password)) {
            password = true;
        } else password = false
       
        setUserDetailsError({ ...userDetailsError, name: name, email: email, password: password })

        return {
            name: name,
            email: email,
            password: password
        }

    };

    const checkErrors = async (errors: any) => {
        if (errors.name === true || errors.email || errors.organisation || errors.password) {
            return true
        } else return false

    }

    const handleNext = async () => {
        var errors = await validateDetails()

        var errorState = await checkErrors(errors)

        if (!errorState) {
            setSignUpStep(1)
        } else setSignUpStep(0)

    }

    const validatePassword = async () => {
        if (userDetails.password !== userDetails.passwordValidate) {
            setUserDetailsError({ ...userDetailsError, passwordValidate: true })
            return true
        } else {
            setUserDetailsError({ ...userDetailsError, passwordValidate: false })
            return false
        }

    }

    /* const auth = useAuth() */

    const callApi = async (uid: string) => {

        const body = {
            uid: uid
        }

        const res = await fetch('/api/createUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        await console.log(data)
    }

    const handleSubmit = async () => {
        var passwordError = await validatePassword()
        if (!passwordError) {

            const auth = getAuth();

            createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
                .then((userCredential) => {
                    // Signed in 
                    const uid = userCredential.user.uid;
                    callApi(uid)
                   /*  userCredential.user.getIdToken(true) */
                    return uid
                    // ...
                })
                .then((uid) => {
                    setDoc(doc(db, "users", uid), {
                        name: userDetails.name,
                        email: userDetails.email,
                        organisation: userDetails.organisation
                    });
                })
                /* .then(() => {
                    auth.currentUser?.getIdToken(true)
                }) */
                .then(() => {
                    var referrer = document.referrer
                    if (referrer !== "" || referrer !== undefined) {
                        router.push(referrer)
                    } else router.push("/")

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    if (errorCode === "auth/email-already-in-use") {
                        setFirebaseError("Email already in use")
                    }
                    console.log(errorCode)
                    // ..
                });





        }

    }


    const handleNameChange = React.useCallback(
        (e: any) => {
            setUserDetails({ ...userDetails, name: e.target.value })
        }, [userDetails])

    const handleEmailChange = React.useCallback(
        (e: any) => {
            setUserDetails({ ...userDetails, email: e.target.value })
        }, [userDetails])

    const handleOrganisationChange = React.useCallback(
        (e: any) => {
            setUserDetails({ ...userDetails, organisation: e.target.value })
        }, [userDetails])

    const handlePasswordChange = React.useCallback(
        (e: any) => {
            setUserDetails({ ...userDetails, password: e.target.value })
        }, [userDetails])

    const handlePasswordValidateChange = React.useCallback(
        (e: any) => {
            setUserDetails({ ...userDetails, passwordValidate: e.target.value })
        }, [userDetails])

    const router = useRouter()

    return (
        <div >
            <Head>
                <title>brokerXchange</title>
                <meta name="description" content="brokerXchange: Sign Up" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HeaderSimple></HeaderSimple>
            <Container maxWidth="xl" style={{ display: "flex" }}>
                <StyledSignUpDiv>
                    <StyledCard>
                        <StyledStack>
                            <StyledCardHeading>Sign Up</StyledCardHeading>
                            {signUpStep === 0 ?
                                <>
                                    <StyledInput id="Name" value={userDetails.name} onChange={handleNameChange} error={userDetailsError.name} helperText={userDetailsError.name ? `Invalid Name` : ``} autoFocus label="Name" variant="standard" size="small">
                                        Name
                                    </StyledInput>
                                    <StyledInput id="Email" value={userDetails.email} onChange={handleEmailChange} error={userDetailsError.email} helperText={userDetailsError.email ? `Invalid Email` : ``} label="Email" variant="standard" size="small">
                                        Email
                                    </StyledInput>
                                    <StyledInput id="Organisation" value={userDetails.organisation} onChange={handleOrganisationChange} error={userDetailsError.organisation} helperText={userDetailsError.organisation ? `Invalid Organisation` : ``} label="Organisation" variant="standard" size="small">
                                        Organisation
                                    </StyledInput>
                                    <StyledInput id="Password" value={userDetails.password} onChange={handlePasswordChange} error={userDetailsError.password} helperText={userDetailsError.password ? `Requires 1 lowercase letter, 1 uppercase letter, 1 number, and must be at least 8 characters long` : ``} label="Password" variant="standard" size="small">
                                        Password
                                    </StyledInput>
                                    <StyledButton onClick={handleNext} variant="contained">Next</StyledButton></> :
                                <>
                                    <StyledInput id="Validate Password" value={userDetails.passwordValidate} onChange={handlePasswordValidateChange} error={userDetailsError.passwordValidate} helperText={userDetailsError.passwordValidate ? `Password does not match` : ``} label="Validate Password" variant="standard" size="small">
                                        Validate Password
                                    </StyledInput>
                                    <Typography style={{color: "red"}}>{firebaseError}</Typography>
                                    <Stack direction="row">
                                        <StyledButton style={{ marginLeft: "0px" }} onClick={() => setSignUpStep(0)} variant="outlined">Back</StyledButton>
                                        <StyledButton onClick={handleSubmit} variant="contained">Submit</StyledButton>
                                    </Stack></>


                            }
                        </StyledStack>
                    </StyledCard>

                </StyledSignUpDiv>

            </Container>



        </div>
    )
}

export default SignUpPage
