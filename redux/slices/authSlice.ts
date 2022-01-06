import { /* createAsyncThunk,  */createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState,/*  AppThunk  */ } from '../../redux/store';
/* import { current } from '@reduxjs/toolkit' */

import { DocumentData } from "firebase/firestore";

interface Auth extends DocumentData  {
    role?: string | undefined,
    landlordId?: string | undefined,
    uid?: string | undefined
}

export interface AuthState {
    auth: Auth
    
}

const initialState: AuthState = {

auth: {}

};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setAuth: (state, action: PayloadAction<Auth>) => {
            state.auth = action.payload;
        },



    },

});

export const {
    setAuth,

} = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

/* export const selectSelectedBuilding = (state: RootState) => state.navigation.selectedBuilding; */



// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
/* export const incrementIfOdd = (amount: number): AppThunk => (
    dispatch,
    getState
) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
        dispatch(incrementByAmount(amount));
    }
}; */

export default authSlice.reducer;
