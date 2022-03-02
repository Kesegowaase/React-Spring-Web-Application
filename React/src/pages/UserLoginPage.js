import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { useDispatch } from 'react-redux';
import { loginHandler } from '../redux/authActions';

const UserLoginPage = (props) => {

    const [userID, setUserID] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        setError(undefined);
    }, [userID, password])

    const onClickLogin = async event => {
        event.preventDefault();
        const creds = {
            userID: userID,
            password
        }

        setError(undefined);
        const { history } = props;
        const { push } = history;

        try {
            await dispatch(loginHandler(creds));
            push('/');
        } catch (apiError) {
            setError(apiError.response.data.message);
        }

    };

    const { t } = useTranslation();
    const pendingApiCall = useApiProgress('post', '/api/1.0/auth');
    const buttonEnabled = userID && password;
    return (

        <div className="container">
            <form>
                <h1 className="text-center">{t('Login')}</h1>
                <Input label={t("ID")} onChange={(event) => { setUserID(event.target.value); }} />
                <Input label={t("Password")} onChange={(event) => { setPassword(event.target.value) }} type="password" />
                &nbsp;
                {error && <div className="alert alert-danger"> {error} </div>}
                &nbsp;
                <div className="form-group text-center">
                    <ButtonWithProgress
                        className="form-group btn btn-primary"
                        onClick={onClickLogin}
                        pendingApiCall={pendingApiCall}
                        disabled={!buttonEnabled || pendingApiCall}
                        label={t('Login')}
                    />
                </div>
            </form>
        </div>
    );
}


export default UserLoginPage;