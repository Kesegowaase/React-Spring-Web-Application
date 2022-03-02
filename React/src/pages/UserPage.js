import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser } from '../api/apiCalls';
import { useTranslation } from "react-i18next";
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from '../components/Spinner';
import MessageFeed from '../components/MessageFeed';

const UserPage = (props) => {
    const [user, setUser] = useState({});
    const [notFound, setNotFound] = useState(false);

    const { userID } = props.match.params;
    const { t } = useTranslation();

    const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + userID, true);

    useEffect(() => {
        setNotFound(false);
    }, [user])

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getUser(userID);
                setUser(response.data);
            }
            catch (error) {
                setNotFound(true);
            }
        }
        loadUser();
    }, [userID])

    if (notFound) {
        return (
            <div className='container'>
                <div className='alert alert-danger text-center'>
                    <div>
                        <span className="material-icons " style={{ fontSize: '48px' }}>
                            error
                        </span>
                    </div>
                    {t('User not found!')}
                </div>
            </div>
        )
    }

    if (pendingApiCall || user.userID !== userID) {
        return (
            <Spinner />
        )
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-6'>
                    <ProfileCard user={user} />
                </div>
                <div className='col-6'>
                    <MessageFeed />
                </div>
            </div>
        </div>
    );
};

export default UserPage;