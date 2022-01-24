import axios from 'axios';
import {
    REGISTER_STUDYGROUP,
    EDIT_STUDYGROUP
} from './types';
import { STUDYGROUP_SERVER } from '../components/Config.js';

export function registerStudyGroup(dataToSubmit) {
    const request = axios.post(`${STUDYGROUP_SERVER}/uploadStudyGroup`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_STUDYGROUP,
        payload: request
    }
}

export function editStudyGroup(dataToSubmit) {
    const request = axios.post(`${STUDYGROUP_SERVER}/editStudyGroup`, dataToSubmit)
        .then(response => response.data);

    return {
        type: EDIT_STUDYGROUP,
        payload: request
    }
}
