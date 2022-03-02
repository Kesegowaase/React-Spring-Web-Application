import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { postMessage, postMessageAttachment } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import Input from './Input';
import AutoUploadImage from './AutoUploadImage';

const MessageSubmit = () => {
    const { image } = useSelector((store) => {
        return {
            image: store.image
        }
    })

    const [focused, setFocused] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [newImage, setNewImage] = useState();
    const [attachmentId, setAttachmentId] = useState();

    const pendingApiCall = useApiProgress('post', '/api/1.0/messages');
    const pendingFileUpload = useApiProgress('post', '/api/1.0/message-attachments', true);

    useEffect(() => {
        if (!focused) {
            setMessage('');
            setErrors({});
            setNewImage();
            setAttachmentId(); 
        }
    }, [focused])

    useEffect(() => {
        setErrors({});
    }, [message])

    const onClickMessage = async () => {
        const body = {
            content: message,
            attachmentId: attachmentId
        }

        try {
            await postMessage(body);
            setFocused(false);
        }
        catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            }
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
            uploadFile(file);
        }
        fileReader.readAsDataURL(file);
    }

    const uploadFile = async (file) => {
        const attachment = new FormData();
        attachment.append('file', file);
        const response = await postMessageAttachment(attachment);
        setAttachmentId(response.data.id);
    }

    const { t } = useTranslation();

    let textAreaClass = 'form-control';
    if (errors.content) {
        textAreaClass += ' is-invalid';
    }

    return (
        <div className='card p-2 flex-row'>
            <ProfileImageWithDefault
                image={image}
                width="24"
                height="24"
                className="rounded-circle"
            />
            <div className='flex-fill ms-2'>
                <textarea
                    className={textAreaClass}
                    rows={focused ? "3" : "1"}
                    onFocus={() => {
                        setFocused(true);
                    }}
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    value={message}
                />
                <div className="invalid-feedback">{errors.content}</div>
                {focused && (
                    <>
                        {!newImage && <Input type="file" onChange={onChangeFile} />}
                        {newImage && <AutoUploadImage image={newImage} uploading={pendingFileUpload} />}
                        <div className='text-end mt-2'>
                            <ButtonWithProgress
                                className='btn btn-primary'
                                onClick={onClickMessage}
                                label={t("Send")}
                                pendingApiCall={pendingApiCall}
                                disabled={pendingApiCall || pendingFileUpload}
                            />

                            <button className='btn btn-danger d-inline-flex ms-2'
                                onClick={() => {
                                    setFocused(false);
                                }}
                                disabled={pendingApiCall || pendingFileUpload}
                            >
                                <span className="material-icons">
                                    close
                                </span>
                                {t('Cancel')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageSubmit;