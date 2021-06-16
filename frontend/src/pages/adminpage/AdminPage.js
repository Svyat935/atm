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

export function AdminPage() {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [deletedRows, setDeletedRows] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleRowSelection = (e) => {
        setDeletedRows([...deletedRows, ...rows.filter((r) => r.id === e.data.id)]);
    };

    const handlePurge = async () => {
        let ids = []
        let new_update_rows = []
        deletedRows.forEach((row) => {
            if (!row["rights"] && row["rights"] != 0) {
                ids.push(row["id"]);
                new_update_rows.push({
                    "id": row["id"],
                    "email": row["email"],
                    "login": row["login"],
                    "rights": 1
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
                ids: ids
            })
        });

        let new_ids = {}
        ids.forEach((id_) => {
            new_ids[id_] = 1
        })
        let new_list_rows = [...new_update_rows, ...rows.filter((r) => !(r["id"] in new_ids))];
        console.log(...rows.filter((r) => !(r["id"] in ids)));
        setRows(new_list_rows)
    };

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

        let updateRows = [];
        console.log(response);
        response.forEach((row) => {
            updateRows.push({
                id: row["id"],
                email: row["email"],
                login: row["login"],
                rights: row["rights"]
            })
        })

        setRows(updateRows);
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
            <div style={{height: "75vh", width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    onRowSelected={handleRowSelection}
                    checkboxSelection
                />
            </div>
            <div className={"buttons-container"}>
                <button className={"btn-mainpage"} onClick={() => handlePurge()}>Verify User</button>
            </div>
        </div>
    )
}