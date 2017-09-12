var self = require("sdk/self"),
    tabs = require("sdk/tabs"),
    requests = require("sdk/request"),
    url = require("sdk/url"),
    timers = require("sdk/timers"),
    credsPanel = require("./creds-panel"),
    mainToggleButton = require("./main-toggle-button"),
    settings = require("./settings"),
    global = require("./global");

var orderTab = null,
    fulfillHandlers = [],
    failHandler = null,
    orderDomainFound = false;

var openOrderTab = function(order) {
  tabs.open({
    url: "http://www.google.com",
    onReady: function(tab) {
      worker = tab.attach({
        contentScriptFile: [
          self.data.url("js/jquery.min.js"),
          self.data.url("js/URI.min.js"),
          self.data.url("js/order-manager.js")
        ]
      });
      worker.port.emit("load", order);
      worker.port.on("orderFailed", function() {
        failHandler(order);
      });
      worker.port.on("searchedKeyword", function(searchedKeyword) {
        order.searched_keyword = searchedKeyword;
      });
      orderTab = tab;
      if (!orderDomainFound && url.URL(tab.url).hostname === url.URL(order.url).hostname) {
        orderDomainFound = true;
        var randomWaitSecs = Math.floor(Math.random() * 20) + 20  // random wait between 20 -> 40 seconds
        const waitCountdownID = timers.setInterval(function() {
          mainToggleButton.badge = randomWaitSecs.toString();
          randomWaitSecs -= 1;
          if (randomWaitSecs == 0) {
            timers.clearInterval(waitCountdownID);
          }
        }, 1000);
        timers.setTimeout(postClick.bind(null, order), randomWaitSecs * 1000);
      }
    },
    onClose: function() {
      orderTab = null;
      orderDomainFound = false;
    }
  });
};

var postClick = function(orderParam) {
  requests.Request({
    url: settings.URLS.createClickURL,
    headers: {
     Authorization: global.makeAuthHeader(),
     Accept: "application/json"
    },
    content: {
      order_id: orderParam.id,
      searched_keyword: orderParam.searched_keyword
    },
    onComplete: function(response) {
      if (response.status === 444) {
        credsPanel.showError("Invalid search keyword detected. Play fair!");
      }
      fulfillHandlers.forEach(function(handler) {
        handler(orderParam);
      });
    }
  }).post();
};

var closeTab = function() {
  orderTab.close();
};

var isTabOpen = function() {
  return orderTab !== null;
};

var registerOrderFulfillHandler = function(handler) {
  fulfillHandlers.push(handler);
};

var registerOrderFailHandler = function(handler) {
  failHandler = handler;
};

module.exports.openOrderTab = openOrderTab;
module.exports.isTabOpen = isTabOpen;
module.exports.registerFulfillHandler = registerOrderFulfillHandler;
module.exports.registerFailHandler = registerOrderFailHandler;
module.exports.closeTab = closeTab;
