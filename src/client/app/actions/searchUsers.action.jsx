let action = {

  searchUsers: function(users) {
    return {
      type: "SEARCH_USERS",
      payload: users,
    }
  }
};

export default action;