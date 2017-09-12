var prefs = require("sdk/preferences/service"),
    timers = require("sdk/timers"),
    settings = require("./settings");

var changeHandlers = [],
    proxySetting = "network.proxy.http",
    lastProxy = prefs.get(proxySetting);

var registerChangeHandler = function(callback) {
  changeHandlers.push(callback);
};

var hasProxyChanged = function() {
  var currentProxy = prefs.get(proxySetting);
  if (currentProxy === lastProxy) {
    return false;
  }
  lastProxy = currentProxy;
  for (var i=0; i < changeHandlers.length; ++i) {
    changeHandlers[i](lastProxy);
  }
  return true;
};

timers.setInterval(hasProxyChanged, settings.PROXY_CHECK_TIMEOUT * 1000);

module.exports.registerChangeHandler = registerChangeHandler;
