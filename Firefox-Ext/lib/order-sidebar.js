var sidebars = require("sdk/ui/sidebar"),
    timers = require("sdk/timers"),
    self = require("sdk/self"),
    requests = require("sdk/request"),
    mainToggleButton = require("./main-toggle-button"),
    orderTab = require("./order-tab"),
    global = require("./global"),
    proxyDetector = require("./proxy-detector"),
    settings = require("./settings"),
    orderFilter = require("./order-filter");

var orderSidebarWorker = null,
    defaultOrderData = {
      tier: "Unknown",
      country_name: "Unknown",
      orders: []
    },
    orderData = defaultOrderData,
    restingFromFulfill = false;

var handleOrderClicked = function (orderParam) {
  if (orderTab.isTabOpen() || restingFromFulfill) return;
  orderTab.openOrderTab(orderParam);
  orderTab.registerFulfillHandler(function () {
    orderFilter.handleOrderDone(orderParam);
    orderData.orders = orderData.orders.filter(function (order) {
      return order.id !== orderParam.id;
    });
    orderSidebarWorker.port.emit("orderArrival", orderData);
    mainToggleButton.badge = orderData.orders.length;
    restingFromFulfill = true;
    timers.setTimeout(function () {
      restingFromFulfill = false;
      mainToggleButton.badge = orderData.orders.length;
    }, 61 * 1000);
    orderTab.closeTab();
  });
  orderTab.registerFulfillHandler(function(order) {
    var restCountdown = 60;
    const restCountdownIntervalID = timers.setInterval(function() {
      mainToggleButton.badge = restCountdown.toString();
      restCountdown -= 1;
      if (restCountdown == 0) {
        timers.clearInterval(restCountdownIntervalID);
      }
    }, 1000);
  });
  orderTab.registerFailHandler(function (order) {
    orderTab.closeTab();
  });
};

var orderSidebar = sidebars.Sidebar({
  id: "order-sidebar",
  title: "SerpClix Sidebar",
  url: self.data.url("html/order-sidebar.html"),
  onHide: function () {
    mainToggleButton.setToggle(false);
  }
});

orderSidebar.on("ready", function (worker) {
  worker.port.on("orderClicked", handleOrderClicked);
  worker.port.emit("orderArrival", orderData);
  orderSidebarWorker = worker;
});

var updateOrderList = function (riskScore) {
  requests.Request({
    url: settings.URLS.listOrdersURL,
    headers: {
      Authorization: global.makeAuthHeader(),
      Accept: "application/json"
    },
    onComplete: function (data) {
      if (!data.json) {
        orderSidebarWorker.port.emit("updateFailure", defaultOrderData);
      } else {
        var temp = data.json;
        temp.orders = orderFilter.filterDoneOrders(temp.orders);
        orderData = temp;
        mainToggleButton.badge = orderData.orders.length;
        orderData.risk_score = riskScore;
        orderSidebarWorker.port.emit("orderArrival", orderData);
      }
    }
  }).get();
};

// update the order list on regular intervals and when the proxy is changed
timers.setInterval(updateOrderList, settings.ORDER_UPDATE_TIMEOUT * 1000);
proxyDetector.registerChangeHandler(updateOrderList);


module.exports = orderSidebar;
module.exports.updateOrderList = updateOrderList;
