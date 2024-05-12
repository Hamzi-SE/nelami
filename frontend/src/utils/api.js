const BASE_URL = process.env.REACT_APP_API_URL;

const customFetch = (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    // Ensure credentials are included
    const fetchOptions = {
        credentials: 'include',
        ...options,
    };

    return fetch(url, fetchOptions);
    
};

export default customFetch;