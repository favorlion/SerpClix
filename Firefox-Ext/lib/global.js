var authToken = null;

var setAuthToken = function(token) {
  authToken = token;
}

var makeAuthHeader = function() {
  if (module.exports.authToken === null) {
    throw "Authentication token not found while trying to make an authentication header"
  }
  return "Token " + authToken;
}

module.exports = {
  makeAuthHeader: makeAuthHeader,
  setAuthToken: setAuthToken
};
