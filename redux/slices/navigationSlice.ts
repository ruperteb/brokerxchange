import { /* createAsyncThunk,  */createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState,/*  AppThunk  */ } from '../../redux/store';
/* import { current } from '@reduxjs/toolkit' */

import { DocumentData } from "firebase/firestore";

interface CheckProps {
    id: string;
    checked: string
}

export interface NavigationState {

    panelView: string,

    buildingsSearch: string,
    menuDrawerOpen: boolean,

    selectedBuilding: DocumentData,
    selectedBuildings: DocumentData[]
    selectedBuildingsDrawerOpen: boolean,
    viewSelectedBuildingsDialogOpen: boolean,

    viewSavedListDialogOpen: boolean,
    selectedList: DocumentData,
    viewPreviewPDFDialogOpen: boolean,
    previewPDFData: DocumentData,

    viewLandlordDialogOpen: boolean,
    selectedLandlord: DocumentData,

    buildingsData: DocumentData[],
    landlordsData: DocumentData[],
    savedListsData: DocumentData[],

    modalAdjustment: boolean,

    addBuildingDialogOpen: boolean,
    editBuildingDialogOpen: boolean,

    addPremisesDialogOpen: boolean,
    editPremisesDialogOpen: boolean,

    addLandlordDialogOpen: boolean,
    editLandlordDialogOpen: boolean,

    addContactDialogOpen: boolean,
    editContactDialogOpen: boolean,

    headerVisible: boolean,

}

const initialState: NavigationState = {

    panelView: "landing",

    buildingsSearch: "",
    menuDrawerOpen: false,

    selectedBuilding: {},
    selectedBuildings: [],
    selectedBuildingsDrawerOpen: false,
    viewSelectedBuildingsDialogOpen: false,

    viewSavedListDialogOpen: false,
    selectedList: [],
    viewPreviewPDFDialogOpen: false,
    previewPDFData: {},

    viewLandlordDialogOpen: false,
    selectedLandlord: {},

    buildingsData: [],
    landlordsData: [],
    savedListsData: [],

    modalAdjustment: false,

    addBuildingDialogOpen: false,
    editBuildingDialogOpen: false,

    addPremisesDialogOpen: false,
    editPremisesDialogOpen: false,

    addLandlordDialogOpen: false,
    editLandlordDialogOpen: false,

    addContactDialogOpen: false,
    editContactDialogOpen: false,

    headerVisible: false,

};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setPanelView: (state, action: PayloadAction<string>) => {
            state.panelView = action.payload;
        },
        setBuildingsSearch: (state, action: PayloadAction<string>) => {
            state.buildingsSearch = action.payload;
        },
        setMenuDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.menuDrawerOpen = action.payload;
        },
        setSelectedBuilding: (state, action: PayloadAction<DocumentData>) => {
            state.selectedBuilding = action.payload;
        },
        setSelectedBuildingsDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.selectedBuildingsDrawerOpen = action.payload;
        },
        setViewSelectedBuildingsDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.viewSelectedBuildingsDialogOpen = action.payload;
        },
        setViewSavedListDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.viewSavedListDialogOpen = action.payload;
        },
        setSelectedList: (state, action: PayloadAction<DocumentData>) => {
            state.selectedList = action.payload;
        },
        setViewPreviewPDFDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.viewPreviewPDFDialogOpen = action.payload;
        },
        setPreviewPDFData: (state, action: PayloadAction<DocumentData>) => {
            state.previewPDFData = action.payload;
        },
        setViewLandlordDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.viewLandlordDialogOpen = action.payload;
        },
        setSelectedLandlord: (state, action: PayloadAction<DocumentData>) => {
            state.selectedLandlord = action.payload;
        },
        setBuildingsData: (state, action: PayloadAction<DocumentData[]>) => {
            state.buildingsData = action.payload;
        },
        setLandlordsData: (state, action: PayloadAction<DocumentData[]>) => {
            state.landlordsData = action.payload;
        },
        setSavedListsData: (state, action: PayloadAction<DocumentData[]>) => {
            state.savedListsData = action.payload;
        },
        addSelectedBuilding: (state, action: PayloadAction<DocumentData>) => {
            state.selectedBuildings.push(action.payload)
        },
        removeSelectedBuilding: (state, action: PayloadAction<string>) => {
            const temp = state.selectedBuildings.filter(building => building.id !== action.payload)
            // "Mutate" the existing state to save the new array
            state.selectedBuildings = temp
        },
        clearSelectedBuildings: (state, /* action: PayloadAction<DocumentData> */) => {
            state.selectedBuildings = []
        },
        setModalAdjustment: (state, action: PayloadAction<boolean>) => {
            state.modalAdjustment = action.payload;
        },
        setAddBuildingDialog: (state, action: PayloadAction<boolean>) => {
            state.addBuildingDialogOpen = action.payload;
        },
        setEditBuildingDialog: (state, action: PayloadAction<boolean>) => {
            state.editBuildingDialogOpen = action.payload;
        },
        setAddPremisesDialog: (state, action: PayloadAction<boolean>) => {
            state.addPremisesDialogOpen = action.payload;
        },
        setEditPremisesDialog: (state, action: PayloadAction<boolean>) => {
            state.editPremisesDialogOpen = action.payload;
        },
        setAddLandlordDialog: (state, action: PayloadAction<boolean>) => {
            state.addLandlordDialogOpen = action.payload;
        },
        setEditLandlordDialog: (state, action: PayloadAction<boolean>) => {
            state.editLandlordDialogOpen = action.payload;
        },
        setAddContactDialog: (state, action: PayloadAction<boolean>) => {
            state.addContactDialogOpen = action.payload;
        },
        setEditContactDialog: (state, action: PayloadAction<boolean>) => {
            state.editContactDialogOpen = action.payload;
        },
        setHeaderVisible: (state, action: PayloadAction<boolean>) => {
            state.headerVisible = action.payload;
        },


    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    /* extraReducers: (builder) => {
        builder
            .addCase(incrementAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value += action.payload;
            });
    }, */
});

export const {
    setPanelView,
    setBuildingsSearch,
    setMenuDrawerOpen,
    setSelectedBuilding,
    setSelectedBuildingsDrawerOpen,
    setViewSelectedBuildingsDialogOpen,
    setBuildingsData,
    setLandlordsData,
    setSavedListsData,
    setViewSavedListDialogOpen,
    setSelectedList,
    setViewPreviewPDFDialogOpen,
    setPreviewPDFData,
    setViewLandlordDialogOpen,
    setSelectedLandlord,
    addSelectedBuilding,
    setModalAdjustment,
    setAddBuildingDialog,
    setEditBuildingDialog,
    setAddPremisesDialog,
    setEditPremisesDialog,
    setAddLandlordDialog,
    setEditLandlordDialog,
    setAddContactDialog,
    setEditContactDialog,
    setHeaderVisible,
} = navigationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectSelectedBuilding = (state: RootState) => state.navigation.selectedBuilding;



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

export default navigationSlice.reducer;
