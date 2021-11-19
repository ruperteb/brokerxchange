import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';

const StyledBox = styled(Box)`
height: 500px;
width: 500px;
background-color: red;
margin: auto;
`

const Home: NextPage = () => {
  return (
    <Container maxWidth="sm">
      <h1>Home Page</h1>
      <p>lorem*15</p>
      <StyledBox></StyledBox>
    </Container>
  );
}

export default Home
