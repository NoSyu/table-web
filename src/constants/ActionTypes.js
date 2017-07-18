
const getRequestActionTypes = actionType => ({
  request: `${actionType}:REQUEST`,
  success: `${actionType}:SUCCESS`,
  failure: `${actionType}:FAILURE`
});

export const GET_GROUP_INDEX = getRequestActionTypes('GET_GROUP_INDEX');
export const CREATE_GROUP = getRequestActionTypes('CREATE_GROUP');
export const GET_GROUP = getRequestActionTypes('GET_GROUP');
export const GET_CURRENT_USER = getRequestActionTypes('GET_CURRENT_USER');
export const GET_TRANSACTIONS = getRequestActionTypes('GET_TRANSACTIONS');
export const CREATE_TRANSACTION = getRequestActionTypes('CREATE_TRANSACTION');
export const LOGIN = getRequestActionTypes('LOGIN');
export const LOGOUT = getRequestActionTypes('LOGOUT');