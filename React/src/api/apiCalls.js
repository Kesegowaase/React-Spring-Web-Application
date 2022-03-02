import axios from "axios";

export const signup = (body) => {
    return axios.post('/api/1.0/users', body);
};

export const login = creds => {
    return axios.post('/api/1.0/auth', creds);
}

export const logout = () => {
    return axios.post('/api/1.0/logout');
}

export const changeLanguage = language => {
    axios.defaults.headers['accept-language'] = language;
};

export const getUsers = (page = 0, size = 3) => {
    return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
}

export const setAuthorizationHeader = ({ isLoggedIn, token }) => {
    console.log(token);
    if (isLoggedIn) {
        const authorizationHeaderValue = `Bearer ${token}`;
        axios.defaults.headers['Authorization'] = authorizationHeaderValue;
    }
    else {
        delete axios.defaults.headers['Authorization'];
    }
}

export const getUser = (userID) => {
    return axios.get(`/api/1.0/users/${userID}`);
}

export const updateUser = (userID, body) => {
    return axios.put(`/api/1.0/users/${userID}`, body);
}

export const postMessage = message => {
    return axios.post('/api/1.0/messages', message);
}

export const getMessages = (userID, page = 0) => {
    const path = userID ? `/api/1.0/users/${userID}/messages?page=` : '/api/1.0/messages?page=';
    return axios.get(path + page);
}

export const getOldMessages = (id, userID) => {
    const path = userID ? `/api/1.0/users/${userID}/messages/${id}` : `/api/1.0/messages/${id}`;
    return axios.get(path);
}

export const getNewMessageCount = (id, userID) => {
    const path = userID ? `/api/1.0/users/${userID}/messages/${id}?count=true` : `/api/1.0/messages/${id}?count=true`;
    return axios.get(path);
}

export const getNewMessages = (id, userID) => {
    const path = userID ? `/api/1.0/users/${userID}/messages/${id}?direction=after` : `/api/1.0/messages/${id}?direction=after`;
    return axios.get(path);
}

export const postMessageAttachment = (attachment) => {
    return axios.post('/api/1.0/message-attachments', attachment);
}

export const deleteMessage = (id) => {
    return axios.delete(`/api/1.0/messages/${id}`);
}

export const deleteUser = userID => {
    return axios.delete(`/api/1.0/users/${userID}`);
}