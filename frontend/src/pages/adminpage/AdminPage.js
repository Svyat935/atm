import React, {useContext, useEffect} from "react";
import "./AdminPage.css";
import {useHistory} from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DataGrid} from "@material-ui/data-grid";
import {AuthContext} from "../auth/AuthContext";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const columns = [
    {field: 'id', headerName: 'ID', width: 170,},
    {field: 'email', headerName: 'EMAIL', width: 170,},
    {field: 'login', headerName: 'LOGIN', width: 170,},
    {field: "rights", headerName: "RIGHTS", width: 170,}
];

const columns2 = [
    {field: 'id', headerName: 'id', width: 170,},
    {field: 'name', headerName: 'name', width: 170,},
    {field: 'type', headerName: 'type', width: 170,},
    {field: "description", headerName: "description", width: 170,},
    {field: "status", headerName: "status", width: 170}
];

export function AdminPage() {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [rowsGames, setRowsGames] = React.useState([]);
    const [deletedRows, setDeletedRows] = React.useState([]);
    const [deletedRowsGames, setDeletedRowsGames] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleRowSelection = (e) => {
        setDeletedRows([...deletedRows, ...rows.filter((r) => r.id === e.data.id)]);
    };

    const handleRowGamesSelection = (e) => {
        setDeletedRowsGames([...deletedRowsGames, ...rowsGames.filter((r) => r.id === e.data.id)])
    }

    const handleUpdatePatient = async () => {
        let ids = []
        let new_update_rows = []
        deletedRows.forEach((row) => {
            let right = 1;

            if (row["rights"] && row["rights"] != 0) {
                ids.push({
                    id: row["id"],
                    status: right,
                });
                new_update_rows.push({
                    "id": row["id"],
                    "email": row["email"],
                    "login": row["login"],
                    "rights": right
                })
            }
        });
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/update_user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                users: ids
            })
        });

        let new_ids = {}
        ids.forEach((obj) => {
            new_ids[obj["id"]] = 1
        })
        let new_list_rows = [...new_update_rows, ...rows.filter((r) => !(r["id"] in new_ids))];
        console.log(...rows.filter((r) => !(r["id"] in ids)));
        setRows(new_list_rows)
    };

    const handleUpdateTutor = async () => {
        let ids = []
        let new_update_rows = []
        deletedRows.forEach((row) => {
            let right = 2;

            if (row["rights"] && row["rights"] != 0) {
                ids.push({
                    id: row["id"],
                    status: right,
                });
                new_update_rows.push({
                    "id": row["id"],
                    "email": row["email"],
                    "login": row["login"],
                    "rights": right
                })
            }
        });
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/update_user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                users: ids
            })
        });

        let new_ids = {}
        ids.forEach((obj) => {
            new_ids[obj["id"]] = 1
        })
        let new_list_rows = [...new_update_rows, ...rows.filter((r) => !(r["id"] in new_ids))];
        console.log(...rows.filter((r) => !(r["id"] in ids)));
        setRows(new_list_rows)
    }

    const handleNewGame = async () => {
        let ids = []
        let new_update_rows = []
        deletedRowsGames.forEach((row) => {
            let right = 2;

            if (row["rights"] && row["rights"] != 0) {
                ids.push({
                    id: row["id"],
                    status: right,
                });
                new_update_rows.push({
                    "id": row["id"],
                    "email": row["email"],
                    "login": row["login"],
                    "rights": right
                })
            }
        });
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/update_tech", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                users: ids
            })
        });

        let new_ids = {}
        ids.forEach((obj) => {
            new_ids[obj["id"]] = 1
        })
        let new_list_rows = [...new_update_rows, ...rowsGames.filter((r) => !(r["id"] in new_ids))];
        console.log(...rowsGames.filter((r) => !(r["id"] in ids)));
        setRowsGames(new_list_rows)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        auth.logout();
    };

    useEffect(async () => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/get_users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
            })
        }).then(response => response.json());
        let response2 = await fetch("/get_tech", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        }).then(response => response.json());


        let updateRows = [];
        response.forEach((row) => {
            updateRows.push({
                id: row["id"],
                email: row["email"],
                login: row["login"],
                rights: row["rights"],
            })
        })

        setRows(updateRows);

        updateRows = [];
        response2.forEach((row) => {
            updateRows.push({
                id: row["id"],
                name: row["name"],
                type: row["type"],
                description: row["description"],
                status: row["status"]
            })
        })
        console.log(updateRows);
        setRowsGames(updateRows);
    }, []);

    return (
        <div className={classes.root}>
            <AppBar style={{background: "#403866"}} position="static">
                <Toolbar>
                    <div className={classes.menuButton}>
                        <MenuIcon/>
                    </div>
                    <Typography variant="h6" className={classes.title}>
                        AdminPage
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Exit</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <h3 className={"title"}>Users</h3>
            <div style={{height: "50vh", width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    onRowSelected={handleRowSelection}
                    checkboxSelection
                />
            </div>
            <div className={"buttons-container"}>
                <button className={"btn-mainpage"} onClick={() => handleUpdateTutor()}>Change User on Tutor role
                </button>
                <button className={"btn-mainpage"} onClick={() => handleUpdatePatient()}>Change User on Patient
                    role
                </button>
            </div>
            <h3 className={"title"}>Games</h3>
            <div style={{height: "50vh", width: '100%'}}>
                <DataGrid
                    rows={rowsGames}
                    columns={columns2}
                    pageSize={10}
                    onRowSelected={handleRowGamesSelection}
                    checkboxSelection
                />
                <div className={"buttons-container"}>
                    <button className={"btn-mainpage"} onClick={() => handleUpdateTutor()}>Add Game</button>
                    <button className={"btn-mainpage"} onClick={() => handleUpdateTutor()}>Delete Game</button>
                </div>
            </div>
        </div>
    )
}