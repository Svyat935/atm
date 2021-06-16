import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {AuthPage} from "./pages/auth/AuthPage";
import {MainPage} from "./pages/main/MainPage";
import {RegPage} from "./pages/register/RegPage";
import {AdminPage} from "./pages/adminpage/AdminPage";


export const useRoutes = (isAuth) => {
    if (isAuth === 0){
        return(
            <Switch>
                <Route exact path="/">
                    <AdminPage/>
                </Route>
            </Switch>
        )
    }

    if (isAuth === 1){
        return (
            <Switch>
                <Route exact path="/">
                    <MainPage/>
                </Route>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route exact path="/">
                <AuthPage/>
            </Route>
            <Route exact path="/reg">
                <RegPage/>
            </Route>
        </Switch>
    )
}
