import { combineReducers } from 'redux';
import user from './user_reducer';
import lecture from './lecture_reducer';

const rootReducer = combineReducers({
    user,
    lecture
});

export default rootReducer;
