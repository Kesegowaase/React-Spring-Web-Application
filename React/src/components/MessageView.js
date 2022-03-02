import React, { useState } from 'react';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { deleteMessage } from '../api/apiCalls';
import Modal from './Modal';
import { useApiProgress } from '../shared/ApiProgress'

const MessageView = (props) => {
    const loggedInUser = useSelector(store => store.userID);
    const { message, onDeleteMessage } = props;
    const { user, content, timestamp, fileAttachment, id } = message;
    const { userID, username, image } = user;
    const [modalVisible, setModalVisible] = useState(false);

    const pendingApiCall = useApiProgress('delete', `/api/1.0/messages/${id}`, true)

    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const onClickDelete = async () => {
        await deleteMessage(id);
        onDeleteMessage(id);
    }

    const onClickCancel = () => {
        setModalVisible(false);
    }

    const formatted = format(timestamp, i18n.language);

    const ownedByLoggedInUser = loggedInUser === userID;


    return (
        <>
            <div className='card p-1'>
                <div className='d-flex'>
                    <ProfileImageWithDefault
                        image={image}
                        width="24"
                        height="24"
                        className="rounded-circle m-1"
                    />
                    <div className='flex-fill mt-auto ps-1'>
                        <Link to={`/user/${userID}`} className="text-dark" style={{ textDecoration: 'none' }}>
                            <h6 className='d-inline'>
                                {username}@{userID}
                            </h6>
                            <span className='ps-3'>
                                {formatted}
                            </span>
                        </Link>
                    </div>
                    {ownedByLoggedInUser &&
                        <button className='btn btn-delete-link btn-sm' onClick={() => {
                            setModalVisible(true);
                        }}>
                            <span className="material-icons">
                                delete_outline
                            </span>
                        </button>
                    }
                </div>
                <div className='ps-4'>
                    {content}
                </div>
                {fileAttachment && (
                    <div>
                        {fileAttachment.fileType.startsWith('image') &&
                            (<img className='img-fluid' src={'images/attachments/' + fileAttachment.name} alt={content} />)}
                        {!fileAttachment.fileType.startsWith('image') &&
                            (
                                <strong>
                                    {t('This attachment type has not been supported!')}
                                </strong>
                            )}
                    </div>
                )}
            </div>
            <Modal
                visible={modalVisible}
                onClickCancel={onClickCancel}
                onClikOk={onClickDelete}
                title={t('Delete Message')}
                okButton={t('Delete Message')}
                message={
                    <div>
                        <div>
                            <strong>
                                {t('Are you sure to delete this message ?')}
                            </strong>
                            <div>
                                {content}
                            </div>
                        </div>
                    </div>
                }
                pendingApiCall={pendingApiCall}
            />
        </>
    );
};

export default MessageView;