import { useEffect, useState } from 'react';
import axios from "axios";

export const useApiProgress = (apiMethod, apiPath, strictPath) => {
    const [pendingApiCall, setPendingApiCall] = useState(false);

    useEffect(() => {
        let requestInterceptors, responseInterceptors;

        const updateApiCallFor = (method, url, inProgress) => {
            if (method !== apiMethod) {
                return;
            }
            if (strictPath && url === apiPath) {
                setPendingApiCall(inProgress);
            }
            else if (!strictPath && url.startsWith(apiPath)) {
                setPendingApiCall(inProgress);
            }
        }

        const registerInterceptors = () => {
            requestInterceptors = axios.interceptors.request.use(request => {
                const { url, method } = request;
                updateApiCallFor(method, url, true)
                return request;
            });

            responseInterceptors = axios.interceptors.response.use(response => {
                const { url, method } = response.config;
                updateApiCallFor(method, url, false)
                return response
            }, error => {
                const { url, method } = error.config;
                updateApiCallFor(method, url, false)
                throw error;
            })
        }

        const unregisterInterceptors = () => {
            axios.interceptors.request.eject(requestInterceptors);
            axios.interceptors.response.eject(responseInterceptors);
        }

        registerInterceptors();

        return function unmount() {
            unregisterInterceptors();
        }
    }, [apiPath, apiMethod, strictPath]);

    return pendingApiCall;
}
