/*
  @desc filter orders coming from server based on which have been fulfilled in
        the last 6 hours
 */

var storage = require("sdk/simple-storage").storage;

if (!storage.doneOrders) {
  storage.doneOrders = {};  // a map from the order IDs to the last time they were clicked
}

var untrackExpiredOrders = function() {
  // untrack the orders that have had 6 hours passed on them
   const now = new Date(),
      hoursOnEpoch = 2; // new Date(0).getHours() returns 2. weird!
  for (var orderID in storage.doneOrders) {
    if (!storage.doneOrders.hasOwnProperty(orderID)) {
      continue;
    }
    var orderDate = new Date(storage.doneOrders[orderID]);
    var hoursPassedSinceOrderDone = new Date(now - orderDate).getHours() - hoursOnEpoch;
    if (hoursPassedSinceOrderDone >= 6) {
      delete storage.doneOrders[orderID];
    }
  }
  var newDoneOrders = storage.doneOrders;
  delete storage.doneOrders;
  storage.doneOrders = newDoneOrders;  // strange, but deleting storage.doneOrders does not notify storage of the change
};

var filterDoneOrders = function(orders) {
  // return only orders that have more than 6 hours passed on them, or never before seen
  untrackExpiredOrders();
  return orders.filter(function(order) {
    return !storage.doneOrders[order.id];
  });
};

var handleOrderDone = function(order) {
  // the order is assumed not to have been tracked before, because this module itself would prevent it
  // also, the storage module doesn't document that Date objects are supported, so we use numbers
  storage.doneOrders[order.id] = (new Date()).getTime();
};

module.exports = {
  filterDoneOrders: filterDoneOrders,
  handleOrderDone: handleOrderDone,
  setDoneOrders: function(doneOrders) {
    storage.doneOrders = doneOrders;
  }
};
