import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../redux/authActions';
import ProfileImageWithDefault from './ProfileImageWithDefault'


const TopBar = (props) => {

    const { t } = useTranslation();
    const { userID, isLoggedIn, username, image } = useSelector((store) => {
        return {
            userID: store.userID,
            isLoggedIn: store.isLoggedIn,
            username: store.username,
            image: store.image
        }
    });

    const menuArea = useRef(null);

    useEffect(() => {
        document.addEventListener('click', menuClickTracker);
        return () => {
            document.removeEventListener("click", menuClickTracker);
        }
    }, [isLoggedIn])

    const menuClickTracker = (event) => {
        if (menuArea.current === null || !menuArea.current.contains(event.target)) {
            setMenuVisible(false);
        }
    }

    const [menuVisible, setMenuVisible] = useState(false);

    const dispatch = useDispatch();

    const onLogoutSuccess = () => {
        dispatch(logoutSuccess());
    }

    let links = (
        <ul className='navbar-nav ms-auto'>
            <li>
                <Link className='nav-link' to="/login">
                    {t("Login")}
                </Link>
            </li>
            <li>
                <Link className='nav-link' to="/signup">
                    {t("Sign Up")}
                </Link>
            </li>
        </ul>
    );

    if (isLoggedIn) {
        let dropDownClass = "dropdown-menu shadow";

        if (menuVisible === true) {
            dropDownClass += " show"
        }

        links = (
            <ul className='navbar-nav ms-auto' ref={menuArea}>
                <li className='nav-item dropdown'>
                    <div
                        className='d-flex align-items-center'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setMenuVisible(true);
                        }}>
                        <ProfileImageWithDefault
                            className="rounded-circle"
                            image={image}
                            width="24"
                            height="24"
                        />
                        <span className='nav-link dropdown-toggle'>
                            {username}
                        </span>
                    </div>
                    <div className={dropDownClass}>
                        <Link
                            className='dropdown-item d-flex'
                            to={`/user/${userID}`}
                            onClick={() => {
                                setMenuVisible(false);
                            }}>
                            <span className="material-icons me-1">
                                account_box
                            </span>
                            {t("My Profile")}
                        </Link>
                        <span className='dropdown-item d-flex' onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
                            <span className="material-icons me-1 text-danger">
                                power_settings_new
                            </span>
                            {t("Logout")}
                        </span>
                    </div>
                </li>
            </ul>
        );
    }

    return (
        <div className='shadow-sm bg-light mb-2'>
            <nav className='navbar navbar-light container navbar-expand'>
                <Link className='navbar-brand' to='/'>
                    <img src={logo} width="16" height="32" alt='logo' />
                    EXAMPLE
                </Link>
                {links}
            </nav>
        </div>
    );
}

export default TopBar;