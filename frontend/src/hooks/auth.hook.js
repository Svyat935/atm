import {useCallback, useEffect, useState} from "react";

const STORAGE_NAME = "localData"

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userRights, setUserRights] = useState(null);

    const login = useCallback((token, user_rights) => {
        localStorage.setItem(STORAGE_NAME, JSON.stringify({"token": token, "user_rights": user_rights}));

        setToken(token);
        setUserRights(user_rights);
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUserRights(null);
        localStorage.removeItem(STORAGE_NAME);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_NAME));

        if (data && data.token && data.user_rights)
            login(data.token, data.user_rights);

    }, [login])

    return {login, logout, token, userRights}
}