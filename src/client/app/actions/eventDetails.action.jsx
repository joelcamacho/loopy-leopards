let action = {

  groupUsers: function(groupUsers) {
    return {
      type: "GROUP_USERS",
      payload: groupUsers,
    }
  },

  usersData: function(usersData) {
  	return {
  		type: "USERS_DATA",
  		payload: usersData,
  	}
  }

};

export default action;