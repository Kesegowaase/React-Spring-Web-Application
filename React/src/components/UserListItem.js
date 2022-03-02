import React from 'react';
import {Link} from 'react-router-dom';
import ProfileImageWithDefault from './ProfileImageWithDefault';

const UserListItem = (props) => {
    const { user } = props;
    const { userID, username, image} = user;

    return (
        <Link to={`/user/${userID}`} className='list-group-item list-group-item-action'>
            <ProfileImageWithDefault
                className='rounded-circle'
                width="32"
                height="32"
                alt={`${userID} profile`}
                image={image} />
            <span className='ps-2'>
                {username}@{userID}
            </span>
        </Link>
    );
};

export default UserListItem;