// client/src/js/redux/reducers/index.js

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_STATE': {
      return { ...state, ...action.state };
    }
    case 'UPDATE_USER_TABLE': {
      return { ...state, users: action.users };
    }
    case 'UPDATE_COST_TABLE': {
      return { ...state, costs: action.costs };
    }
    case 'UPDATE_SHARE_TABLE': {
      return { ...state, shares: action.shares };
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;
