import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const initialState = {
  authenticated: '',
  errorMessage: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        errorMessage: '',
        authenticated: action.payload,
      };
    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}
