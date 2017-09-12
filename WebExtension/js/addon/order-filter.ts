/// <reference path="../../types/index.d.ts" />

/*
  @desc filter orders coming from server based on which have been fulfilled in
        the last 6 hours
 */


browser.storage.local.get<StoredOrderResponse>("doneOrders").then((data) => {
  if (Object.keys(data).length == 0) {
    browser.storage.local.set({doneOrders: {}});  // a map from the order IDs to the last time they were clicked
  }
});

var untrackExpiredOrders = function(cb: () => void) {
  // untrack the orders that have had 6 hours passed on them
  const now = moment();
  browser.storage.local.get<StoredOrderResponse>("doneOrders").then((data) => {
    var doneOrders = data.doneOrders;
    for (var orderID in doneOrders) {
      if (!doneOrders.hasOwnProperty(orderID)) {
        continue;
      }
      var orderDate = moment(doneOrders[orderID]);
      var hoursPassedSinceOrderDone = now.diff(orderDate) / (1000 * 60 * 60);
      if (hoursPassedSinceOrderDone >= 6) {
        delete doneOrders[orderID];
      }
    }
    browser.storage.local.set({doneOrders: doneOrders}).then(cb);
  });
};

function filterDoneOrders(orders: Order[], cb: (orders: Order[]) => void): void {
  // return only orders that have more than 6 hours passed on them, or never before seen
  untrackExpiredOrders(() => {
    browser.storage.local.get<StoredOrderResponse>("doneOrders").then((data) => {
      cb(orders.filter((order) => {
        return !data.doneOrders[order.id];
      }))
    });
  });
};

var handleOrderDone = function(order: Order) {
  // the order is assumed not to have been tracked before, because this module itself would prevent it
  // also, the storage module doesn't document that Date objects are supported, so we use numbers
  browser.storage.local.get<StoredOrderResponse>("doneOrders").then((data) => {
    data.doneOrders[order.id] = (new Date()).getTime();
    browser.storage.local.set({doneOrders: data.doneOrders});
  });
};

interface StoredOrder {
  [index: number]: number;
}

interface StoredOrderResponse {
  doneOrders: StoredOrder
}

const orderFilter = {
  filterDoneOrders: filterDoneOrders,
  handleOrderDone: handleOrderDone,
  setDoneOrders: function(doneOrders) {
    browser.storage.local.set({doneOrders: doneOrders});
  }
};
