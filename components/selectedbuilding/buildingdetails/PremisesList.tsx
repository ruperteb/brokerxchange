import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DomainDisabledOutlinedIcon from '@mui/icons-material/DomainDisabledOutlined';
import { visuallyHidden } from '@mui/utils';

import Popover from '@mui/material/Popover';

import styled from "@emotion/styled"

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { navigationSlice, setEditPremisesDialog } from "../../../redux/slices/navigationSlice";
import { db } from '../../../utils/firebaseClient';
import { DocumentData, doc, deleteDoc, addDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';

import AddPremisesDialog from './AddPremisesDialog';
import EditPremisesDialog from './EditPremisesDialog';



const StyledTableHeadCell = styled(TableCell)`
text-align: center;
/* padding: 5px; */
/* font-size: 0.8rem; */
`

const StyledTableCell = styled(TableCell)`
text-align: center;
/* padding: 5px; */
padding-right: 30px;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
/* font-size: 0.8rem; */
`

const StyledTableHeaderDiv = styled.div`
display: flex;
padding: 1rem;
`

const StyledTableHeaderTitle = styled(Typography)`
font-family: 'Segoe UI', sans-serif;
font-weight: 600;
font-size: 1.4rem;
margin-left: auto;
margin-right: 1rem;

`

const StyledButton = styled(Button)`
margin-right: auto;
`

const StyledPopoverDiv = styled.div`
display: flex;
flex-direction: row;
`

const StyledPopoverConfirmButton = styled(Button)`
display:flex;
margin-left: 1rem;

`

const StyledPopoverCancelButton = styled(Button)`
display:flex;
margin-left: 0.5rem;
margin-right: 0.5rem;

`

interface Data {
    id: string,
    name: string,
    /* vacant: boolean, */
    floor: string,
    type: string,
    area: number,
    netRental: number,
    opCosts: number,
    otherRental: number,
    grossRental: number,
    openBays: number,
    openRate: number,
    openRatio: number,
    coveredBays: number,
    coveredRate: number,
    coveredRatio: number,
    shadedBays: number,
    shadedRate: number,
    shadedRatio: number,
    parkingRatio: number,
}



/* const rows: Data[] = [
    {
        name: "Premises 1",
        floor: 1,
        type: "Office",
        area: 500,
        netRental: 100,
        opCosts: 20,
        otherRental: 0,
        grossRental: 120,
        openBays: 30,
        openRate: 1000,
        coveredBays: 20,
        coveredRate: 1500,
        shadedBays: 0,
        shadedRate: 0,
        parkingRatio: 3.2,
    },
    {
        name: "Premises 2",
        floor: 1,
        type: "Office",
        area: 200,
        netRental: 120,
        opCosts: 30,
        otherRental: 0,
        grossRental: 150,
        openBays: 30,
        openRate: 1000,
        coveredBays: 20,
        coveredRate: 1500,
        shadedBays: 0,
        shadedRate: 0,
        parkingRatio: 3.2,
    }
]; */

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'floor',
        numeric: false,
        disablePadding: false,
        label: 'Floor/ Unit',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'area',
        numeric: true,
        disablePadding: false,
        label: 'Area',
    },
    {
        id: 'netRental',
        numeric: true,
        disablePadding: false,
        label: 'Net Rental',
    },
    {
        id: 'opCosts',
        numeric: true,
        disablePadding: false,
        label: 'Op Costs',
    },
    {
        id: 'otherRental',
        numeric: true,
        disablePadding: false,
        label: 'Other',
    },
    {
        id: 'grossRental',
        numeric: true,
        disablePadding: false,
        label: 'Gross Rental',
    },
    /* {
        id: 'openBays',
        numeric: true,
        disablePadding: false,
        label: 'Open Bays',
    },
    {
        id: 'openRate',
        numeric: true,
        disablePadding: false,
        label: 'Open Rate',
    },
    {
        id: 'coveredBays',
        numeric: true,
        disablePadding: false,
        label: 'Covered Bays',
    },
    {
        id: 'coveredRate',
        numeric: true,
        disablePadding: false,
        label: 'Covered Rate',
    },
    {
        id: 'shadedBays',
        numeric: true,
        disablePadding: false,
        label: 'Shaded Bays',
    },
    {
        id: 'shadedRate',
        numeric: true,
        disablePadding: false,
        label: 'Shaded Rate',
    }, */
    {
        id: 'parkingRatio',
        numeric: true,
        disablePadding: false,
        label: 'Parking Ratio',
    },

];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    /* rowCount: number; */
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, /* rowCount, */ onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell> */}
                {headCells.map((headCell, index) => {
                    if (index === 0) {
                        return (
                            <StyledTableHeadCell
                                style={{ width: "150px", textAlign: "left", paddingLeft: "15px" }}
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </StyledTableHeadCell>
                        )

                    } else {
                        return (
                            <StyledTableHeadCell
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </StyledTableHeadCell>
                        )

                    }

                })}
                {/* <StyledTableHeadCell
                    key="vacant"
                    sortDirection={orderBy === "vacant" ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === "vacant"}
                        direction={orderBy === "vacant" ? order : 'asc'}
                        onClick={createSortHandler("vacant")}
                    >
                        Vacant
                        {orderBy === "vacant"? (
                            <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>

                </StyledTableHeadCell> */}
                <StyledTableHeadCell style={{ width: "30px", padding: "0px", /* paddingRight: "0.5rem" */ }}>Vacant</StyledTableHeadCell>
                <StyledTableHeadCell style={{ width: "40px", padding: "0px", /* paddingRight: "1rem" */ }}></StyledTableHeadCell>
                <StyledTableHeadCell style={{ width: "40px", paddingLeft: "0px", paddingRight: "1rem" }}></StyledTableHeadCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

interface ParkingPopoverContentsProps {
    row: Data
}

const ParkingPopoverContents: React.FC<ParkingPopoverContentsProps> = ({ row }) => {

    return (
        <TableContainer style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem;" }}>
            <Table sx={{ /* minWidth: 750, */ /* s */ width: "fit-content" }}>

                <TableHead>
                    <TableRow>
                        <TableCell>Open Bays</TableCell>
                        <TableCell>Open Rate</TableCell>
                        <TableCell>Open Ratio</TableCell>
                        <TableCell>Covered Bays</TableCell>
                        <TableCell>Covered Rate</TableCell>
                        <TableCell>Covered Ratio</TableCell>
                        <TableCell>Shaded Bays</TableCell>
                        <TableCell>Shaded Rate</TableCell>
                        <TableCell>Shaded Ratio</TableCell>
                        <TableCell>Overall Ratio</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                        <TableCell style={{ textAlign: "center" }}>{+row.openBays.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.openRate.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.openRatio.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.coveredBays.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.coveredRate.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.coveredRatio.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.shadedBays.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.shadedRate.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.shadedRatio.toFixed(2)}</TableCell>
                        <TableCell style={{ textAlign: "center" }}>{+row.parkingRatio.toFixed(2)}</TableCell>



                    </TableRow>

                </TableBody>

            </Table>
        </TableContainer>
    )
}

interface Premises {
    id: string,
    name: string,
    vacant: boolean,
    floor: string,
    type: string,
    area: number,
    netRental: number,
    opCosts: number,
    otherRental: number,
    grossRental: number,
    openBays: number,
    openRate: number,
    openRatio: number,
    coveredBays: number,
    coveredRate: number,
    coveredRatio: number,
    shadedBays: number,
    shadedRate: number,
    shadedRatio: number,
    parkingRatio: number,
}


interface Props {
    buildingId: string,
    premises: Premises[],
}

export const PremisesList: React.FC<Props> = ({ buildingId, premises }) => {

    var rows: Premises[] = []

    rows = premises

    const dispatch = useDispatch()

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState("")

    const handleMenuOpen = (name: string) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setMenuOpen(name)
    }

    const handleMenuClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setMenuOpen("")
    }

    const handleAddPremisesDialogOpen = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        dispatch(navigationSlice.actions.setAddPremisesDialog(true))
    }

    const [anchorParkingPopover, setAnchorParkingPopover] = React.useState<HTMLButtonElement | null>(null);

    const [parkingPopoverOpen, setParkingPopoverOpen] = React.useState("")

    const handleParkingPopoverClick = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setAnchorParkingPopover(event.currentTarget);
        setParkingPopoverOpen(name)
    };

    const handleParkingPopoverClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorParkingPopover(null);
        setParkingPopoverOpen("")
    };

    const [anchorDeletePopover, setAnchorDeletePopover] = React.useState<HTMLLIElement | null>(null);

    const [deletePopoverOpen, setDeletePopoverOpen] = React.useState("")

    const handleDeletePopoverClick = (event: React.MouseEvent<HTMLLIElement>, name: string) => {
        dispatch(navigationSlice.actions.setModalAdjustment(true))
        setAnchorDeletePopover(event.currentTarget);
        setDeletePopoverOpen(name)
        setMenuOpen("")
    };

    const handleDeletePopoverClose = () => {
        dispatch(navigationSlice.actions.setModalAdjustment(false))
        setAnchorDeletePopover(null);
        setDeletePopoverOpen("")
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "buildings/" + buildingId + "/premises", id));
        handleDeletePopoverClose()

    }

    const handleDuplicate = async (row: Premises) => {

        await addDoc(collection(db, "buildings/" + buildingId + "/premises"), {
            name: row.name,
            name_lowerCase: row.name.toLowerCase(),
            vacant: true,
            floor: row.floor,
            type: row.type,
            area: row.area,
            netRental: row.netRental,
            opCosts: row.opCosts,
            otherRental: row.otherRental,
            grossRental: row.grossRental,
            openBays: row.openBays,
            openRate: row.openRate,
            openRatio: row.openRatio,
            coveredBays: row.coveredBays,
            coveredRate: row.coveredRate,
            coveredRatio: row.coveredRatio,
            shadedBays: row.shadedBays,
            shadedRate: row.shadedBays,
            shadedRatio: row.shadedRatio,
            parkingRatio: row.openRatio + row.coveredRatio + row.shadedRatio
        })
            .then((result) => {
                console.log(result.id)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })

        const q = query(collection(db, "buildings/" + buildingId + "/premises"));

        const querySnapshot = await getDocs(q);
        const premises: DocumentData[] = []
        querySnapshot.forEach((doc) => {
            let docData = doc
            premises.push({ ...docData.data(), id: doc.id })
        });


        const getVacantGLA = () => {
            var vacantGLA = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    vacantGLA += premises.area
                }
            })
            return vacantGLA
        }

        const getOverallParkingRatio = () => {
            var totalVacantArea = 0
            var totalVacantBays = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    totalVacantArea += premises.area
                    totalVacantBays += (premises.openBays + premises.coveredBays + premises.shadedBays)
                }
            })
            return (totalVacantBays / (totalVacantArea / 100))
        }

        const getMinMaxRental = () => {
            var rentalArray: number[] = []
            premises.map((premises) => {
                if (premises.vacant) {
                    rentalArray.push(premises.grossRental)
                }
            })
            return [Math.min(...rentalArray), Math.max(...rentalArray)]

        }

        const docRef = doc(db, "buildings", buildingId)

        await updateDoc(docRef, {
            vacantGLA: getVacantGLA(),
            parkingRatio: getOverallParkingRatio(),
            rentalLow: getMinMaxRental()[0],
            rentalHigh: getMinMaxRental()[1]
        })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })
        setMenuOpen("")
        dispatch(navigationSlice.actions.setModalAdjustment(false))
    }

    const handleToggleVacant = async (row: Premises) => {

        const premisesRef = doc(db, "buildings/" + buildingId + "/premises", row.id)

        await updateDoc(premisesRef, {
            vacant: !row.vacant,
        })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })

        const q = query(collection(db, "buildings/" + buildingId + "/premises"));

        const querySnapshot = await getDocs(q);
        const premises: DocumentData[] = []
        querySnapshot.forEach((doc) => {
            let docData = doc
            premises.push({ ...docData.data(), id: doc.id })
        });


        const getVacantGLA = () => {
            var vacantGLA = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    vacantGLA += premises.area
                }
            })
            return vacantGLA
        }

        const getOverallParkingRatio = () => {
            var totalVacantArea = 0
            var totalVacantBays = 0

            premises.map((premises) => {
                if (premises.vacant) {
                    totalVacantArea += premises.area
                    totalVacantBays += (premises.openBays + premises.coveredBays + premises.shadedBays)
                }
            })
            return (totalVacantBays / (totalVacantArea / 100))
        }

        const getMinMaxRental = () => {
            var rentalArray: number[] = []
            premises.map((premises) => {
                if (premises.vacant) {
                    rentalArray.push(premises.grossRental)
                }
            })
            return [Math.min(...rentalArray), Math.max(...rentalArray)]

        }

        const docRef = doc(db, "buildings", buildingId)

        await updateDoc(docRef, {
            vacantGLA: getVacantGLA(),
            parkingRatio: getOverallParkingRatio(),
            rentalLow: getMinMaxRental()[0],
            rentalHigh: getMinMaxRental()[1]
        })
            .then((result) => {
                console.log(result)
                /*  if (result.id) { */
                /*  setSuccess(true) */
                /*  notify() */
            })
        /* setMenuOpen("") */
    }

    const [selectedPremises, setSelectedPremises] = React.useState<Premises>({
        id: "",
        vacant: true,
        name: "",
        floor: "",
        type: "",
        area: 0,
        netRental: 0,
        opCosts: 0,
        otherRental: 0,
        grossRental: 0,
        openBays: 0,
        openRate: 0,
        openRatio: 0,
        coveredBays: 0,
        coveredRate: 0,
        coveredRatio: 0,
        shadedBays: 0,
        shadedRate: 0,
        shadedRatio: 0,
        parkingRatio: 0,
    })

    const handleEditPremisesClick = (row: Premises) => {
        setSelectedPremises(row)
        dispatch(navigationSlice.actions.setEditPremisesDialog(true))
        setMenuOpen("")
    }



    return (
        <Box sx={{ width: 'fit-content', marginTop: "2rem", marginBottom: "1rem", marginLeft: "auto", marginRight: "auto" }}>
            <StyledTableHeaderDiv>
                <StyledTableHeaderTitle>Premises</StyledTableHeaderTitle>
                <StyledButton variant="outlined" onClick={handleAddPremisesDialogOpen}>Add</StyledButton>
            </StyledTableHeaderDiv>
            <Paper sx={{ width: 'fit-content', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}

                <TableContainer>
                    <Table
                        sx={{ /* minWidth: 750, */ /* s */ width: "fit-content" }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            /* rowCount={rows.length} */
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    console.log(row)
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            /* onClick={(event) => handleClick(event, row.name)} */
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            {/* <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell> */}
                                            {/*  <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell> */}
                                            {/* <TableCell align="right">{row.name}</TableCell> */}
                                            <StyledTableCell style={{ textAlign: "left", paddingLeft: "15px" }}>{row.name}</StyledTableCell>
                                            <StyledTableCell>{row.floor}</StyledTableCell>
                                            <StyledTableCell>{row.type}</StyledTableCell>
                                            <StyledTableCell>{+row.area.toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{+row.netRental.toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{+row.opCosts.toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{+row.otherRental.toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{+row.grossRental.toFixed(2)}</StyledTableCell>
                                            {/* <StyledTableCell>{row.openBays}</StyledTableCell>
                                            <StyledTableCell>{row.openRate}</StyledTableCell>
                                            <StyledTableCell>{row.coveredBays}</StyledTableCell>
                                            <StyledTableCell>{row.coveredRate}</StyledTableCell>
                                            <StyledTableCell>{row.shadedBays}</StyledTableCell>
                                            <StyledTableCell>{row.shadedRate}</StyledTableCell> */}
                                            <StyledTableCell>{+row.parkingRatio.toFixed(1)}</StyledTableCell>
                                            <StyledTableCell style={{paddingTop: "16px", paddingRight: "16px"}}>{row.vacant ? <CheckCircleOutlinedIcon color="primary"/> : <CancelOutlinedIcon color="error"/>}</StyledTableCell>
                                            <StyledTableCell style={{paddingRight: "0px"}}>
                                                <IconButton onClick={(e) => handleParkingPopoverClick(e, row.id)}>
                                                    <DirectionsCarOutlinedIcon width={20} height={20} />
                                                </IconButton>
                                                <Popover
                                                    id={row.id}
                                                    open={parkingPopoverOpen === row.id ? true : false}
                                                    anchorEl={anchorParkingPopover}
                                                    onClose={handleParkingPopoverClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <ParkingPopoverContents row={row} />
                                                </Popover>
                                            </StyledTableCell>
                                            <StyledTableCell style={{paddingRight: "16px"}}>
                                                <IconButton ref={menuRef} onClick={() => handleMenuOpen(row.id)}>
                                                    <MoreVertOutlinedIcon width={20} height={20} />
                                                </IconButton>
                                                <Menu
                                                    open={menuOpen === row.id ? true : false}
                                                    anchorEl={menuRef.current}
                                                    onClose={handleMenuClose}
                                                    PaperProps={{
                                                        sx: { width: "fit-content", maxWidth: '100%' }
                                                    }}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                
                                                    <MenuItem onClick={()=>handleToggleVacant(row)} sx={{ color: 'text.secondary' }}>
                                                        <ListItemIcon>
                                                            <DomainDisabledOutlinedIcon width={24} height={24} />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Toggle Vacant" primaryTypographyProps={{ variant: 'body2' }} />
                                                    </MenuItem>

                                                    <MenuItem onClick={() => handleEditPremisesClick(row)} sx={{ color: 'text.secondary' }}>
                                                        <ListItemIcon>
                                                            <EditOutlinedIcon width={24} height={24} />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                                                    </MenuItem>

                                                    <MenuItem onClick={(e) => handleDeletePopoverClick(e, row.id)} sx={{ color: 'text.secondary' }}>
                                                        <ListItemIcon>
                                                            <DeleteOutlinedIcon width={24} height={24} />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                                                    </MenuItem>

                                                    <MenuItem onClick={() => handleDuplicate(row)} sx={{ color: 'text.secondary' }}>
                                                        <ListItemIcon>
                                                            <ContentCopyOutlinedIcon width={24} height={24} />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Duplicate" primaryTypographyProps={{ variant: 'body2' }} />
                                                    </MenuItem>
                                                </Menu>
                                                <Popover
                                                    id={row.id}
                                                    open={deletePopoverOpen === row.id ? true : false}
                                                    anchorEl={anchorDeletePopover}
                                                    onClose={handleDeletePopoverClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <StyledPopoverDiv >
                                                        <Typography sx={{ p: 2 }}>Are you sure you want to delete this premises?</Typography>
                                                        <StyledPopoverConfirmButton onClick={() => handleDelete(row.id)}>Confirm</StyledPopoverConfirmButton>
                                                        <StyledPopoverCancelButton onClick={handleDeletePopoverClose}>Cancel</StyledPopoverCancelButton>
                                                    </StyledPopoverDiv>

                                                </Popover>
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
            </Paper>
            {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}

            <AddPremisesDialog buildingId={buildingId} premises={premises}></AddPremisesDialog>
            <EditPremisesDialog buildingId={buildingId} premises={premises} selectedPremises={selectedPremises} ></EditPremisesDialog>
        </Box>
    );
}

export default PremisesList