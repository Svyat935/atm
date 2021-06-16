import React, {useContext} from "react";
import "./AuthPage.css";
import {AuthContext} from "./AuthContext";
import {useHistory} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


const authentication = async (login, password) => {
    let response = await fetch("authentication", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: login,
            password: password,
        })
    });
    if (response.status === 200)
        return response.json();
    else
        return false;
};

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [message, setMessage] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToRegistration = () => {
        history.push("/reg");
    }

    const handleAuthorization = async () => {
        let username = document.getElementById("username").value,
            password = document.getElementById("password").value;

        if (username && password){
            let response = await authentication(username, password);
            if (response["token"]) {
                if (response["user_rights"] != null || response["user_rights"] != undefined) {
                    auth.login(response["token"], response["user_rights"]);
                } else {
                    setMessage(2);
                    handleClickOpen();
                }
            } else {
                setMessage(1);
                handleClickOpen();
            }
        }else{
            setMessage(3);
            handleClickOpen();
        }
    }

    return (
        <div>
            <div className={"container"}>
                <div className={"login"}>
                    <h1>АВТОРИЗАЦИЯ</h1>
                    <div className={"form"}>
                        <input type={"text"} id={"username"} className="input-username" placeholder={"Логин"}/>
                        <input type={"text"} id={"password"} className="input-password" placeholder={"Пароль"}/>
                        <div className="settings">
                            <input type="checkbox" checked={true} id="remember_me"/>
                            <label htmlFor="remember_me">Запомнить меня.</label>
                        </div>
                        <button className={"btn"} onClick={() => handleAuthorization()}>АВТОРИЗОВАТЬСЯ</button>
                        <button className={"btn"} onClick={() => handleToRegistration()}>К РЕГИСТРАЦИИ</button>
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
                    {message == 3 &&
                    <DialogContentText id="alert-dialog-description1">
                        Простите, но вы не заполнили поля!
                    </DialogContentText>}
                    {message == 2 &&
                    <DialogContentText id="alert-dialog-description1">
                        Простите, но администратор ещё не подтвердил ваш аккаунт!
                    </DialogContentText>}
                    {message == 1 &&
                    <DialogContentText id="alert-dialog-description2">
                        Простите, но пользователя с такими данными нету!
                    </DialogContentText>}
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