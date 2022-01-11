import {
    REGISTER_LECTURE,
    EDIT_LECTURE
} from '../_actions/types';


export default function(state={},action){
    switch(action.type){
        case REGISTER_LECTURE:
            return {...state, register: action.payload }
        case EDIT_LECTURE:
            return { ...state, edit: action.payload }
        default:
            return state;
    }
}
