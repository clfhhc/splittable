// client/src/js/redux/actions/index.js

export const updateState = state => ({ type: 'UPDATE_STATE', state });
export const updateUserTable = users => ({ type: 'UPDATE_USER_TABLE', users });
export const updateCostTable = costs => ({ type: 'UPDATE_COST_TABLE', costs });
export const updateShareTable = shares => ({ type: 'UPDATE_SHARE_TABLE', shares });
