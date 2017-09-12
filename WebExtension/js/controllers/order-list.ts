/// <reference path="../../types/index.d.ts" />
/// <reference path="../../types/common.d.ts" />
/// <reference path="../addon/global.ts" />
/// <reference path="../addon/settings.ts" />
/// <reference path="../addon/order-filter.ts" />

angular.module("serpClix")
    .controller("OrderSidebarController", ["$scope", "$http", "riskScoreQuality", OrderSidebarController]);

function OrderSidebarController($scope, $http: ng.IHttpService, riskScoreQuality) {
  
  const defaultOrderData = {
    tier: "Unknown",
    tier_alias: "",
    country_name: "Unknown",
    orders: []
  }
  const orderTab = {
    open: false,
    orderUrlVisited: false,
    searched_keyword: null
  }
  const betweenClickRestSeconds = 60;
  var restingFromFulfill = false;
  $scope.message = '';
  $scope.country = '';
  $scope.tier = '';
  $scope.orderData = {country_name: '', tier_alias: '', orders: []};

  $scope.handleOrderClicked = handleOrderClicked;

  function init() {
    global.getAuthHeader(authHeader => {
      $http<OrderData>({
      method: "GET",
      url: URLS.listOrdersURL,
      headers: {
        authorization: authHeader,
        accept: "application/json"
      }
    }).then(response => {
        orderFilter.filterDoneOrders(response.data.orders, (filteredOrders) => {
          response.data.orders = filteredOrders;
          if (filteredOrders.length === 0) {
            var msg = "Sorry, there are no orders available at this time. Please check back later.";
            updateTabContent(response.data, msg);
          } else {
            updateTabContent(response.data);
          }
          browser.browserAction.setBadgeText({text: response.data.orders.length.toString()});
        });
      }).catch((error) => {
        updateTabContent(defaultOrderData, "Failed to contact server. Please check your connection or your proxy settings");
      });
    });
  }
 
  function handleOrderClicked($event, order: Order) {
    $event.preventDefault();
    orderTab.orderUrlVisited = false;
    if (orderTab.open || restingFromFulfill) return;
    browser.tabs.create({url: "http://www.google.com"}).then(tab => {
      orderTab.open = true;
      handleURLChanges(tab, order);
      browser.runtime.onMessage.addListener((message: ContentMessage) => {
        if (message.event == "OrderManager.searchedKeyword") {
          orderTab.searched_keyword = message.message;
        } else if (message.event == "OrderManager.orderFailed") {
          browser.tabs.remove(tab.id);
        }
      });
      browser.tabs.executeScript(tab.id, {file: browser.runtime.getURL("js/vendor/jquery.min.js")})
      .then(() => {
        browser.tabs.executeScript(tab.id, {file: browser.runtime.getURL("js/vendor/URI.min.js")})
        .then(() => {
          browser.tabs.executeScript(tab.id, {file: browser.runtime.getURL("js/content/order-manager.js")})
          .then(() => {
            browser.tabs.sendMessage(tab.id, {event: "OrderList.order", message: order});
          });
        });
      });
    });
  }

  function handleURLChanges(tab: browser.Tab, order: Order) {
    browser.tabs.onUpdated.addListener(_urlChangeListener.bind(null, tab, order));   
  }

  function _urlChangeListener(tab: browser.Tab, order: Order, tabId, changeInfo, updatedTab) {
      if (tabId === tab.id && changeInfo.url && URI(changeInfo.url).domain() === URI(order.url).domain() 
            && changeInfo.status === "loading" && !orderTab.orderUrlVisited) {
        orderTab.orderUrlVisited = true;
        var tabCloseTimeout = Math.floor(Math.random() * 20) + 20;
        setTimeout(() => {
          global.getAuthHeader(authHeader => {
            $http({
            method: "POST",
            url: URLS.createClickURL,
            headers: {
              Authorization: authHeader,
              Accept: "application/json"
            },
            data: {
              order_id: order.id,
              searched_keyword: orderTab.searched_keyword
            }
          }).then(clickDoneHandler.bind(null, order, tab)).catch(clickDoneHandler.bind(null, order, tab));
        });
        }, tabCloseTimeout * 1000);
        var tabClosingTimer = setInterval(() => {
          tabCloseTimeout -= 1;
          if (tabCloseTimeout == 0) {
            clearInterval(tabClosingTimer);
          }
          browser.browserAction.setBadgeText({text: tabCloseTimeout.toString()});
        }, 1000);
      }
    }

  function updateTabContent(orderData: OrderData, message?) {
    $scope.orderData = orderData;
    global.getRiskScore(riskScore => {
      $scope.orderData.ipQuality = riskScoreQuality(riskScore);
      $scope.$digest();
    });
    $scope.message = message;
  };

  function clickDoneHandler(order: Order, tab: browser.Tab) {
    restingFromFulfill = true;
    orderFilter.handleOrderDone(order);
    $scope.orderData.orders = $scope.orderData.orders.filter((o: Order) => {
      return o.id != order.id;
    });
    browser.tabs.remove(tab.id);
    orderTab.open = false;
    var restingFromFulfillCountdown = betweenClickRestSeconds;
    var restingFromFulfillTimer = setInterval(() => {
      restingFromFulfillCountdown -= 1;
      if (restingFromFulfillCountdown == 0) {
        clearInterval(restingFromFulfillTimer);
        restingFromFulfill = false;
        browser.browserAction.setBadgeText({text: $scope.orderData.orders.length.toString()});
      } else {
        browser.browserAction.setBadgeText({text: restingFromFulfillCountdown.toString()});
      }
    }, 1000);
  }
  
  init();
}

interface OrderData {
  orders: Order[];
  country_name: string;
  tier: string;
  tier_alias: string;
}
