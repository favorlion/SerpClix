jasmine.getFixtures().fixturesPath = 'base/Firefox-Ext/test/fixtures';

describe("OrderSidebarController", function() {

  var $scope, orderArrivalHandler, updateFailureHandler;
  beforeEach(module("serpClix"));
  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    spyOn(addon.port, "on").and.callFake(function(eventName, handler) {
      // store event handlers to simulate calls to them later
      if (eventName === "orderArrival") {
        orderArrivalHandler = handler;
      } else {
        updateFailureHandler = handler;
      }
    });
    $controller("OrderSidebarController", {$scope: $scope});
  }));

  it("should attach to addon port events", function() {
    expect(addon.port.on).toHaveBeenCalledWith("orderArrival", jasmine.any(Function));
    expect(addon.port.on).toHaveBeenCalledWith("updateFailure", jasmine.any(Function));
  });
  
  it("should set the message when no orders arrive", function() {
    loadFixtures("order-sidebar.html");
    var orderData = {orders: []};
    orderArrivalHandler(orderData);
    $scope.$digest();
    expect($scope.orderData).toEqual(orderData);
    expect($scope.message).toContain("Sorry");
    // expect($("h2.no-orders").text()).toContain("Sorry");
  });

});
