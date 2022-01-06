import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { navigationSlice } from "../../redux/slices/navigationSlice";
import { authSlice } from "../../redux/slices/authSlice";
import styled from "@emotion/styled"

import { db, auth } from "../../utils/firebaseClient"
import { signOut } from "firebase/auth";
import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"
import { collection, query, onSnapshot, orderBy, getDocs, DocumentData, doc, where, getDoc, DocumentReference } from "firebase/firestore";

import { useAuth } from '../../utils/authProvider'
import { useAppSelector } from '../../redux/hooks';

import Link from 'next/dist/client/link';
import  Button  from '@mui/material/Button';



const StyledAuthDiv = styled.div`
z-index: 150;
display: flex;
position: relative;
transition-duration: .3s;
transition-property: top;
transition-timing-function: cubic-bezier(.4,0,.2,1);
`

const StyledSignInOutDiv = styled.div`
display: flex;
margin-top: 7px;
flex-direction: row;
`

const StyledSignInButton = styled(Button)`

`

interface Props {

}

export const UserAuth: React.FC<Props> = ({ }) => {
    const dispatch = useDispatch()

    const userAuth = useAppSelector(state => state.auth.auth)

    const user = useAuth()

    var getTokenResult = () => {
        return user?.getIdTokenResult()
    }

    var getRef = async (uid: string) => {
        return doc(db, "users", uid)
    }

    var getSnap = (ref: DocumentReference<DocumentData>) => {
        return getDoc(ref)
    }

    const getData = async () => {
        await user?.getIdToken(true)
        let tokenResult = await getTokenResult()
        let ref = await getRef(tokenResult?.claims.user_id)
        let snap = await getSnap(ref)

        let claims = { role: await tokenResult?.claims.role, landlordId: tokenResult?.claims.landlordId }

        return { ...snap.data(), uid: snap.id, role: claims.role, landlordId: claims.landlordId }

    }



    React.useEffect(() => {
        if (getTokenResult()) {
            getData().then((result) => {
                dispatch(authSlice.actions.setAuth(result))
            })
        } else {
            dispatch(authSlice.actions.setAuth({}))
        }

    }, [user])



    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            user?.refreshToken
        }).catch((error) => {
            // An error happened.
        });
    }



    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <StyledAuthDiv>
                {userAuth.uid !== undefined ? <Tooltip title="Account">
                    <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>{userAuth?.name ? userAuth?.name[0] : undefined}</Avatar>
                    </IconButton>
                </Tooltip> :
                    <StyledSignInOutDiv>
                        <StyledSignInButton href="/login">
                            Login
                        </StyledSignInButton>
                        <StyledSignInButton href="/signUp">
                            Sign Up
                        </StyledSignInButton>
                    </StyledSignInOutDiv>}
            </StyledAuthDiv>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default UserAuth