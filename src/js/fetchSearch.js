import axios from 'axios';
import { getDataInfo } from '../index'
export { getUrl }
export { getDataServer }

const getUrl = async (searchText, page) => {
    const baseUrl = 'https://pixabay.com/api';
    const searchParams = new URLSearchParams({
        key: '29162129-cd407d8c81083a7eed9c52ced',
        q: searchText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
    });
    const searchURL = baseUrl + `/?${searchParams}`;
    getDataInfo(searchURL);
}

const getDataServer = async (searchURL) => {
    try {
        const response = await axios.get(searchURL);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        throw response;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}