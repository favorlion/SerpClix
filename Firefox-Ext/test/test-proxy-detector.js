var proxyDetector = require("../lib/proxy-detector"),
    settings = require("../lib/settings"),
    timers = require("sdk/timers"),
    prefs = require("sdk/preferences/service");

exports["test reports proxy change"] = function(assert, done) {
  var changeHandlerCalled = false;
  proxyDetector.registerChangeHandler(function() {
    changeHandlerCalled = true;
  });
  prefs.set("network.proxy.http", "123.123.123.123");
  timers.setTimeout(function() {
    assert.ok(changeHandlerCalled, "proxy change handler was called successfully");
    done();
  }, (settings.PROXY_CHECK_TIMEOUT * 1000) + 100);
};

require("sdk/test").run(exports);
