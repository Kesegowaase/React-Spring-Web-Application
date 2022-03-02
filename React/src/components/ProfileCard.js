import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import Input from './Input';
import { deleteUser, updateUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { logoutSuccess, updateSuccess } from '../redux/authActions'
import Modal from './Modal';
import { useHistory } from 'react-router-dom';

const ProfileCard = (props) => {
    const { userID: loggedInUserID } = useSelector((store) => {
        return {
            userID: store.userID
        }
    });


    const [inEditMode, setInEditMode] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState();
    const [user, setUser] = useState({});
    const [editable, setEditable] = useState(false);
    const [newImage, setNewImage] = useState();
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    const { userID, username, image } = user;
    const pendingApiCallDeleteUser = useApiProgress('delete', `/api/1.0/users/${userID}`, true);
    const routeParams = useParams();
    const [modalVisible, setModalVisible] = useState(false);
    const history = useHistory();

    const pathUserID = routeParams.userID;
    const { t } = useTranslation();

    const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + userID);

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect(() => {
        setEditable(pathUserID === loggedInUserID);
    }, [pathUserID, loggedInUserID])

    useEffect(() => {
        setValidationErrors((previousValidationErrors) => {
            return {
                ...previousValidationErrors,
                username: undefined
            };
        });
    }, [updatedUsername])

    useEffect(() => {
        setValidationErrors((previousValidationErrors) => {
            return {
                ...previousValidationErrors,
                image: undefined
            };
        });
    }, [newImage])

    useEffect(() => {
        if (!inEditMode) {
            setUpdatedUsername(undefined);
            setNewImage(undefined);
        }
        else {
            setUpdatedUsername(username);
        }

    }, [inEditMode, username]);

    const onClickSave = async () => {
        let image;
        if (newImage) {
            image = newImage.split(',')[1]
        }

        const body = {
            username: updatedUsername,
            image: image
        }
        try {
            const response = await updateUser(userID, body);
            setInEditMode(false);
            setUser(response.data);
            dispatch(updateSuccess(response.data));
        }
        catch (error) {
            setValidationErrors(error.response.data.validationErrors);
        }
    }

    const onChangeFile = (event) => {
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }

    const onClickCancel = () => {
        setModalVisible(false);
    }

    const onClickDeleteUser = async() => {
        await deleteUser(userID);
        setModalVisible(false);
        dispatch(logoutSuccess());
        history.push('/');
    }

    const { username: usernameError, image: imageError } = validationErrors;


    return (
        <div className='card text-center'>
            <div className='card-header'>
                <ProfileImageWithDefault
                    className='rounded-circle'
                    width="128"
                    height="128"
                    alt={`${userID} profile`}
                    image={image}
                    tempimage={newImage}
                />
            </div>
            <div className='card-body'>
                {!inEditMode && (
                    <>
                        <h3>
                            {`${username}@${userID}`}
                        </h3>
                        {editable &&
                            (<>
                                <button className='btn btn-success d-inline-flex' onClick={() => {
                                    setInEditMode(true);
                                }}>
                                    <span className="material-icons">
                                        edit
                                    </span>
                                    {t('Edit')}
                                </button>
                                <div className='pt-2'>
                                    <button className='btn btn-danger d-inline-flex' onClick={() => {
                                        setModalVisible(true);
                                    }}>
                                        <span className="material-icons">
                                            directions_run
                                        </span>
                                        {t('Delete My Account')}
                                    </button>
                                </div>
                            </>)
                        }
                    </>
                )}
                {inEditMode && (
                    <div>
                        <Input
                            label={t("Change Username")}
                            defaultValue={username}
                            error={usernameError}
                            onChange={(event) => {
                                setUpdatedUsername(event.target.value);
                            }}
                        />
                        {/* <div class="mt-2 col-5">
                            <label for="formFile" className="form-label">Change picture</label>
                            <input className="form-control" type="file" onChange={onChangeFile} />
                        </div> */}
                        <Input type="file"
                            error={imageError}
                            onChange={onChangeFile}
                        />
                        <div className='mt-3'>
                            <ButtonWithProgress
                                className='btn btn-primary d-inline-flex'
                                onClick={onClickSave}
                                disabled={pendingApiCall}
                                pendingApiCall={pendingApiCall}
                                label={
                                    <>
                                        <span className='material-icons'>
                                            save
                                        </span>
                                        {t('Save')}
                                    </>
                                }
                            />
                            <button className='btn btn-danger d-inline-flex ms-3'
                                onClick={() => {
                                    setInEditMode(false);
                                }}
                                disabled={pendingApiCall}
                            >
                                <span className="material-icons">
                                    close
                                </span>
                                {t('Cancel')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                okButton={t('Delete My Account')}
                title={t('Delete My Account')}
                visible={modalVisible}
                onClickCancel={onClickCancel}
                onClikOk={onClickDeleteUser}
                message={t('Are you sure to delete your account?')}
                pendingApiCall={pendingApiCallDeleteUser}
            />
        </div>
    );
};

export default ProfileCard;