import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;

            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            // console.log('check gender success', action);
            state.genders = action.data;
            state.isLoadingGender = false;

            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.genders = [];

            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;

            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];

            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;

            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];

            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;

            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = []

            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;