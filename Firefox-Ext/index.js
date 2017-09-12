var requests = require("sdk/request"),
    base64 = require("sdk/base64"),
    storage = require("sdk/simple-storage").storage,
    self = require("sdk/self"),
    credsPanel = require("./lib/creds-panel"),
    mainToggleButton = require("./lib/main-toggle-button"),
    orderSidebar = require("./lib/order-sidebar"),
    settings = require("./lib/settings"),
    global = require("./lib/global"),
    util = require("./lib/util");


var handleLoginResponse = function (response, creds) {
  if (response.internal) {
    credsPanel.port.emit("loginResult", response);
  }
  else if (!response.json) {
    credsPanel.port.emit("loginResult", {success: false, message: "No response from server. Please try again in a few moments"});
  }
  else if (response.json.token) {
    global.setAuthToken(response.json.token);
    mainToggleButton.cutFromCredsPanel();
    credsPanel.hide();
    // credsPanel.destroy(); causes endless errors regarding referral to a dead object
    delete credsPanel;
    mainToggleButton.attachToSideBar();
    mainToggleButton.setToggle(true);
    orderSidebar.show();
    orderSidebar.updateOrderList(response.json.risk_score);
    storage.lastUsername = creds.username;
    util.notifyRiskScore(response.json.risk_score);
  } else if (response.json.detail) {
    credsPanel.port.emit("loginResult", {success: false, message: response.json.detail});
  }
};

function loginWrapper(responseHandler) {
  return function (creds) {
    // allow one user per browser
    if (storage.lastUsername && storage.lastUsername !== creds.username) {
      responseHandler({internal: true, success: false,
        message: "You can't use more than one username per browser. Last username used: " + storage.lastUsername});
      return;
    }
    requests.Request({
      url: settings.URLS.loginURL,
      headers: {
        Authorization: "Basic " + base64.encode(creds.username + ':' + creds.password, "utf-8"),
        Accept: "application/json"
      },
      content: {
        addon_version: self.version
      },
      onComplete: function(response) {
        responseHandler(response, creds);
      }
    }).post();
  };
}

var init = function () {
  mainToggleButton.attachToCredsPanel();
  credsPanel.port.on("userCreds", loginWrapper(handleLoginResponse));
};

init();

module.exports = {
  loginWrapper: loginWrapper
};
