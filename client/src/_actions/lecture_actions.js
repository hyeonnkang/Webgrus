import axios from 'axios';
import {
    REGISTER_LECTURE,
    EDIT_LECTURE
} from './types';
import { LECTURE_SERVER } from '../components/Config.js';

export function registerLecture(dataToSubmit) {
    const request = axios.post(`${LECTURE_SERVER}/uploadLecture`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_LECTURE,
        payload: request
    }
}

export function editLecture(dataToSubmit) {
    const request = axios.post(`${LECTURE_SERVER}/editLecture`, dataToSubmit)
        .then(response => response.data);

    return {
        type: EDIT_LECTURE,
        payload: request
    }
}
