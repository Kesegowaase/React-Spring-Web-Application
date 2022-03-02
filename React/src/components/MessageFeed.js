import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getMessages, getNewMessageCount, getNewMessages, getOldMessages } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import MessageView from './MessageView';
import Spinner from './Spinner';

const MessageFeed = () => {

    const [messagePage, setMessagePage] = useState({
        content: [],
        last: true,
        number: 0
    });

    const [newMessageCount, setNewMessageCount] = useState(0);
    const { t } = useTranslation();
    const { userID } = useParams();

    const path = userID ? `/api/1.0/users/${userID}/messages?page=` : '/api/1.0/messages?page=';
    const initialMessageLoadProgress = useApiProgress('get', path);

    let lastMessageId = 0;
    let firstMessageId = 0;
    if (messagePage.content.length > 0) {

        firstMessageId = messagePage.content[0].id;

        const lastMessagesIndex = messagePage.content.length - 1;
        lastMessageId = messagePage.content[lastMessagesIndex].id;
    }

    const oldMessagePath = userID ? `/api/1.0/users/${userID}/messages/${lastMessageId}` : `/api/1.0/messages/${lastMessageId}`;
    const loadOldMessagesProgress = useApiProgress('get', oldMessagePath, true);

    const newMessagePath = userID ? `/api/1.0/users/${userID}/messages/${firstMessageId}?direction=after` : `/api/1.0/messages/${firstMessageId}?direction=after`;
    const loadNewMessagesProgress = useApiProgress('get', newMessagePath, true);

    useEffect(() => {
        const getCount = async () => {
            const response = await getNewMessageCount(firstMessageId, userID);
            setNewMessageCount(response.data.count);
        }
        let looper = setInterval(getCount, 5000)
        return function cleaup() {
            clearInterval(looper);
        }

    }, [firstMessageId, userID])

    useEffect(() => {
        const loadMessages = async (page) => {
            try {
                const response = await getMessages(userID, page);
                setMessagePage((previousMessagePage) => ({
                    ...response.data,
                    content: [...previousMessagePage.content, ...response.data.content]
                }));
            }
            catch (error) {

            }
        }
        loadMessages();
    }, [userID]);

    const loadOldMessages = async () => {
        const response = await getOldMessages(lastMessageId, userID);
        setMessagePage((previousMessagePage) => ({
            ...response.data,
            content: [...previousMessagePage.content, ...response.data.content]
        }));
    }

    const loadNewMessages = async () => {
        const response = await getNewMessages(firstMessageId, userID);
        setMessagePage((previousMessagePage) => ({
            ...previousMessagePage,
            content: [...response.data, ...previousMessagePage.content]
        }));
        setNewMessageCount(0);
    }

    const onDeleteMessageSuccess = (id) => {
        setMessagePage(previousMessagePage => ({
            ...previousMessagePage,
            content: previousMessagePage.content.filter((message) => {
                if(message.id !== id){
                    return true;
                }
                return false;
            })
        }))
    }

    const { content, last } = messagePage;

    if (content.length === 0) {
        return < div className='alert alert-secondary text-center mt-2 p-1'>{initialMessageLoadProgress ? <Spinner /> : t('There is no message')}</div >
    }

    return (
        <div >
            {newMessageCount > 0 &&
                <div
                    className='alert alert-secondary text-center mb-2 p-1'
                    style={{ cursor: loadNewMessagesProgress ? 'not-allowed' : 'pointer' }}
                    onClick={loadNewMessagesProgress ? () => { } : loadNewMessages}
                >
                    {loadNewMessagesProgress ? <Spinner /> : t('There are new messages')}
                </div >}
            {content.map((message) => {
                return (
                    <MessageView
                        key={message.id}
                        message={message}
                        onDeleteMessage={onDeleteMessageSuccess}
                    />
                )
            })}
            {!last &&
                < div className='alert alert-secondary text-center mt-2 p-1'
                    style={{ cursor: loadOldMessagesProgress ? 'not-allowed' : 'pointer' }}
                    onClick={loadOldMessagesProgress ? () => { } : loadOldMessages}
                >
                    {loadOldMessagesProgress ? <Spinner /> : t('Load old messages')}
                </div >
            }
        </div>
    );
};

export default MessageFeed;