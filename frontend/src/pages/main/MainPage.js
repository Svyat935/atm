import React, {useContext, useEffect, useState} from "react";
import "./MainPage.css";
import {useHistory} from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    DataGrid,
    GridApi,
    GridCellValue,
    GridToolbarContainer,
    GridToolbarExport,
    useGridApiRef
} from "@material-ui/data-grid";
import {AuthContext} from "../auth/AuthContext";

function validateData(data) {
    const re = /^\d{2}.\d.{2}\d{4}$/;
    return re.test(String(data).toLowerCase());
}

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

function CustomToolbar() {
    return (
        <GridToolbarContainer>

        </GridToolbarContainer>
    );
}

export function MainPage() {
    let refType = {}, refStatus = {}, refNumber = {};
    const history = useHistory();

    const apiRef = useGridApiRef();
    const [pageSize, setPageSize] = React.useState(5);
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const [rows, setRows] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [deletedRows, setDeletedRows] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [message, setMessage] = useState('');

    const [number, setNumber] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [audience, setAudience] = useState('');
    const [building, setBuilding] = useState('');
    const [delivery_data, setDeliveryData] = useState('');
    const [currentNumber, setCurrentNumber] = useState('');

    const [statusDialogMenu, setStatusDialogMenu] = useState(false);

    const columns = [
        {
            field: "edit",
            headerClassName: "my_header",
            headerName: "⚙",
            filterable: false,
            sortable: false,
            flex: 0.05,
            renderCell: (params) => {
                const onClick = () => {
                    if (params["row"]["id"] == 1){
                        history.push("/game2");
                    } else if (params["row"]["id"] == 2){
                        history.push("/game");
                    }
                };

                return (
                    <IconButton onClick={onClick}>
                        <PlayArrowIcon/>
                    </IconButton>
                )
            }
        },
        {field: 'number', headerClassName: "my_header", headerName: 'Номер Игры', flex: 0.14},
        {field: 'name', headerClassName: "my_header", headerName: 'Название Игры', flex: 0.14},
        {field: 'status', headerClassName: "my_header", headerName: 'Статус', flex: 0.14, },
        {field: "type", headerClassName: "my_header", headerName: "Тип", flex: 0.14, },
        {field: "description", headerClassName: "my_header", headerName: "Описание", flex: 0.14,},
    ];

    const handleUpdateDialog = async () => {
        let number = document.getElementById("number").value,
            status = document.getElementById("status").value,
            type = document.getElementById("type").value,
            description = document.getElementById("description").value,
            audience = document.getElementById("audience").value,
            building = document.getElementById("building").value,
            address = document.getElementById("address").value,
            delivery_data = document.getElementById("deliver_data").valueAsDate,
            id = rows[rows.length - 1]["id"];

        if (refType.current.reportValidity() &&
            refStatus.current.reportValidity() &&
            refNumber.current.reportValidity()
        ){
            delivery_data = delivery_data && delivery_data <= new Date() ? delivery_data : new Date();
            let data_for_send = delivery_data.getTime() / 1000;

            if (delivery_data) {
                let new_row = {
                    "number": number,
                    "status": status,
                    "type": type,
                    "description": description,
                    "audience": audience,
                    "building": building,
                    "address": address,
                    "delivery_data": data_for_send
                }

                let response = await update_techs([new_row]);
                console.log(response.json());

                if (response.status == 200) {
                    console.log("update data ok!")
                } else {
                    console.log("update data ne ok!")
                }

                let month = delivery_data.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                let day = delivery_data.getDate();
                day = day < 10 ? "0" + day : day;

                new_row["id"] = id;
                new_row["delivery_data"] = day + "." + month + "." + delivery_data.getFullYear();
                let old_rows = rows.filter((row) => row.number !== currentNumber);
                setRows([...old_rows, new_row]);

                setOpenDialog(false);
                setMessage("");
                setCurrentNumber('');
            }
        }
    }

    const handlePageSizeChange = (params) => {
        setPageSize(params.pageSize);
    };

    const handleRowSelection = (e) => {
        setDeletedRows([...deletedRows, ...rows.filter((r) => r.id === e.data.id)]);
    };

    const handlePurge = async () => {
        setRows(
            rows.filter((r) => deletedRows.filter((sr) => sr.id === r.id).length < 1)
        );
        let ids = [];
        deletedRows.forEach((row) => ids.push(row["number"]));
        let response = await delete_techs(ids);
        if (response) {
            console.log("ok!");
        } else {
            console.log("not ok!");
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        auth.logout();
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseOpenDialog = () => {
        setOpenDialog(false);
        setStatusDialogMenu(false);
        setNumber('');
        setStatus('');
        setType('');
        setDescription('');
        setAudience('');
        setBuilding('');
        setAddress('');
        setDeliveryData('');
        setCurrentNumber('');
    }

    const handleInsert = async () => {
        let number = document.getElementById("number").value,
            status = document.getElementById("status").value,
            type = document.getElementById("type").value,
            description = document.getElementById("description").value,
            audience = document.getElementById("audience").value,
            building = document.getElementById("building").value,
            address = document.getElementById("address").value,
            delivery_data = document.getElementById("deliver_data").valueAsDate;

        let id;
        if (rows.length > 0) {
            id = rows[rows.length -1]["id"];
            id = parseInt(id, 10) + 1 + "";
        } else {
            id = "1";
        }

        if (refNumber.current.reportValidity() &&
            refType.current.reportValidity() &&
            refStatus.current.reportValidity()
        ) {
            delivery_data = delivery_data && delivery_data <= new Date() ? delivery_data : new Date();
            let data_for_send = delivery_data.getTime() / 1000;

            if (!rows.filter((row) => row.number == number).length) {
                let new_row = {
                    "id": id,
                    "number": number,
                    "status": status,
                    "type": type,
                    "description": description,
                    "audience": audience,
                    "building": building,
                    "address": address,
                    "delivery_data": data_for_send
                }

                let response = await insert_techs(new_row);

                if (response.status == 200) {
                    console.log("insert data ok!")
                } else {
                    console.log("insert data ne ok!")
                }

                let month = delivery_data.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                let day = delivery_data.getDate();
                day = day < 10 ? "0" + day : day;

                new_row["delivery_data"] = day + "." + month + "." + delivery_data.getFullYear();
                setRows([...rows, new_row]);

                setOpenDialog(false);
                setMessage("");
                setOpenDialog(false);
                setStatusDialogMenu(false);
                setNumber('');
                setStatus('');
                setType('');
                setDescription('');
                setAudience('');
                setBuilding('');
                setAddress('');
                setDeliveryData('');
                setCurrentNumber('');
            }else{
                setMessage("Простите, но такой Номер уже существует.")
            }
        } else {
            setMessage("Простите, но поля: Номер, Статус и Тип обязательно должны быть заполнены.");
        }
    }

    const handleUpdate = async (e) => {
        let id = e["id"];
        let new_row = rows.filter((row) => row["id"] == id)[0];
        if (!(e["field"] in {"number": 1, "status": 1, "type": 1, "delivery_data": 1} && !e["props"]["value"])) {
            if (e["field"] === "delivery_data") {
                if (e["props"]["value"] instanceof Date) {
                    if (new Date().getTime() < e["props"]["value"].getTime()) {
                        e["props"]["value"] = new Date();
                    }
                    let month = e["props"]["value"].getMonth() + 1;
                    month = month < 10 ? "0" + month : month;
                    let day = e["props"]["value"].getDate();
                    day = day < 10 ? "0" + day : day;

                    let data_string = day + "." + month + "."
                        + e["props"]["value"].getFullYear();
                    e["props"]["value"] = data_string;
                }
            }

            new_row[e["field"]] = e["props"]["value"];

            let data_for_send = new_row["delivery_data"].split(".");
            data_for_send = new Date(data_for_send[2], data_for_send[1] - 1, data_for_send[0]).getTime() / 1000;

            let output = {
                "number": new_row["number"],
                "status": new_row["status"],
                "type": new_row["type"],
                "description": new_row["description"],
                "audience": new_row["audience"],
                "building": new_row["building"],
                "address": new_row["address"],
                "delivery_data": data_for_send
            }
            let response = await update_techs([output]);

            if (response) {
                console.log("ok");
            } else {
                console.log("ne ok!");
            }
        } else {
            e["props"]["value"] = new_row[e["field"]];
        }
    }

    const update_techs = async (objs) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/update_tech", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                data: objs
            })
        })
        return response
    }

    const delete_techs = async (objs) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/delete_tech", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                data: objs
            })
        })
        return response
    }

    const insert_techs = async (obj) => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/insert_tech", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                data: [obj]
            })
        })
        return response
    }

    useEffect(async () => {
        let token = JSON.parse(localStorage.getItem("localData"))["token"];
        let response = await fetch("/get_tech", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
            })
        })

        if (response.status == 200) {
            response = await response.json();

            let updateRows = [];
            let index = 1;
            response.forEach((row) => {
                console.log(row)
                updateRows.push({
                    id: index,
                    number: index,
                    name: row["name"],
                    status: row["status"],
                    type: row["type"],
                    description: row["description"],
                });
                index++;
            })

            setRows(updateRows);
        } else {
            alert("Извините, вышла проблема с подключением!");
        }
    }, [])

    return (
        <div className={classes.root}>
            <AppBar style={{background: "#403866"}} position="static">
                <Toolbar>
                    <div className={classes.menuButton}/>
                    <Typography variant="h6" className={classes.title}>
                        Главная Страница
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
                            <MenuItem onClick={handleClose}>Выход</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <div style={{height: "75vh", width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    onRowSelected={handleRowSelection}

                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    onEditCellChangeCommitted={(e) => handleUpdate(e)}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    )
}