angular.module("serpClix")
    .controller("OrderSidebarController", ["$scope", "riskScoreQuality", OrderSidebarController]);

function OrderSidebarController($scope, riskScoreQuality) {
  
  $scope.message = '';
  $scope.country = '';
  $scope.tier = '';
  $scope.orderData = {country_name: '', tier_alias: '', orders: []};

  $scope.handleOrderClicked = handleOrderClicked;

  function init() {
    addon.port.on("orderArrival", function (orderData) {

      if (orderData.orders.length === 0) {
        var msg = "Sorry, there are no orders available at this time. Please check back later.";
        updateSidebarContent(orderData, msg);
      } else {
        updateSidebarContent(orderData);
      }
    });
    
    addon.port.on("updateFailure", function (defaultData) {
      updateSidebarContent(defaultData, "Failed to contact server. Please check your connection or your proxy settings");
    });
  }
 
  function handleOrderClicked($event, order) {
    $event.preventDefault();
    addon.port.emit("orderClicked", order);
  }

  var updateSidebarContent = function (orderData, message) {
    $scope.orderData = orderData;
    $scope.orderData.ipQuality = riskScoreQuality(orderData.risk_score);
    $scope.message = message;
    $scope.$digest();
  };
  
  init();
}
