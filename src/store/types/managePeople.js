import { createThunkRoutine } from 'redux-thunk-routine';

export const getEditors = createThunkRoutine('PEOPLE/GET_EDITORS');
export const fetchPeopleToShare = createThunkRoutine('PEOPLE/GET_PEOPLE_DATA');
export const permisionEdit = createThunkRoutine('PEOPLE/PERMISION_EDIT');
export const sendStatus = createThunkRoutine('PEOPLE/SEND_STATUS');
export const changeOwnership = createThunkRoutine('PEOPLE/CHANGE_OWNERSHIP');
export const fetchFollowers = createThunkRoutine('PEOPLE/FETCH_FOLLOWERS');
