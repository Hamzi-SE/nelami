const BASE_URL = process.env.REACT_APP_API_URL;

const customFetch = (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    return fetch(url, options); // Call the native fetch function here
};

export default customFetch;