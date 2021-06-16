import React, {useContext} from "react";
import "./RegPage.css";
import {AuthContext} from "../auth/AuthContext";
import {useHistory} from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const registration = async (name, email, password) => {
    let response = await fetch("/registration", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: name,
            email: email,
            password: password
        })
    });

    return response;
}


export const RegPage = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [message, setMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToLogin = () => {
        history.push("/");
    }

    const handleRegistration = async () => {
        let username = document.getElementById("username").value,
            email = document.getElementById("email").value,
            password = document.getElementById("password").value,
            confirm_password = document.getElementById("confirm_password").value;

        if (username && email && password && confirm_password){
            if (validateEmail(email)){
                if (password === confirm_password){
                    let response = await registration(username, email, password);
                    if (response.status === 200){
                        setMessage("Пользовател создан. Ожидайте подтверждение вашего аккаунта администратором!");
                        handleClickOpen();
                    }else{
                        let json = await response.json();
                        setMessage(json["validation_error"]["body_params"][0]["msg"]);
                        handleClickOpen();
                    }
                }else{
                    setMessage("Простите, пароли не совпадают!");
                    handleClickOpen();
                }
            }else{
                setMessage("Простите, электронная почта имеет неизвестный формат!");
                handleClickOpen();
            }
        }else{
            setMessage("Заполните все поля!");
            handleClickOpen();
        }
    }

    return (
        <div>
            <div className={"container"}>
                <div className={"login"}>
                    <h1>РЕГИСТРАЦИЯ</h1>
                    <div className={"form"}>
                        <input type={"text"} id="username" className="input" placeholder={"Логин"}/>
                        <input type={"text"} id="email" className="input" placeholder={"Email"}/>
                        <input type={"text"} id="password" className="input" placeholder={"Пароль"}/>
                        <input type={"text"} id="confirm_password" className="input" placeholder={"Подтверждение пароля"}/>
                        <button className={"btn"} onClick={() => handleRegistration()}>ЗАРЕГИСТРИРОВАТЬСЯ</button>
                        <button className={"btn"} onClick={() => handleToLogin()}>К АВТОРИЗАЦИИ</button>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Авторизация"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{color: "#FFFFFF", background: "#403866"}}>
                        Ок
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}