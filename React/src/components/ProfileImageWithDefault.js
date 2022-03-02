import React from 'react';
import defaultPicture from '../assets/profile.png'

const ProfileImageWithDefault = (props) => {
    const { image, tempimage } = props;
    let imageSource = defaultPicture;
    if (image) {
        imageSource = 'images/profile/' + image;
    }
    return (
        <img
            {...props}
            alt={`profile`}
            src={tempimage || imageSource}
            onError={(event) => {
                event.target.src = defaultPicture;
            }}
        />
    );
};

export default ProfileImageWithDefault;