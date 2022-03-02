import React from 'react';
import { useSelector } from 'react-redux';
import MessageFeed from '../components/MessageFeed';
import MessageSubmit from '../components/MessageSubmit';
import UserList from '../components/UserList';

const HomePage = () => {
    const { isLoggedIn } = useSelector((store) => {
        return {
            isLoggedIn: store.isLoggedIn
        }
    })
    return (
        <div className="container">
            <div className='row'>
                <div className='col-6'>
                    <div className='mb-2'>
                        {isLoggedIn && <MessageSubmit />}
                    </div>
                    {<MessageFeed />}
                </div>
                <div className='col-6'>
                    <UserList />
                </div>
            </div>
        </div>
    );
};

export default HomePage; 