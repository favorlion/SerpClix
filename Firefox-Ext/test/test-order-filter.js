
var orderFilter = require("../lib/order-filter");

exports["test filters expired order"] = function(assert) {
  var now = new Date(),
      threeHoursAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 3, now.getMinutes(),
          now.getSeconds()),
      sevenHoursAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 7, now.getMinutes(),
          now.getSeconds());
  orderFilter.setDoneOrders({1: threeHoursAgo.getTime(), 2: sevenHoursAgo.getTime()});
  orderFilter.handleOrderDone({id: 4});
  var filtered = orderFilter.filterDoneOrders([{id: 1}, {id: 2}, {id: 3}]);
  // only expired orders and new orders should be returned. i.e, only 2, 3. 1 is not expired and 4 has just been done
  assert.ok(filtered.length == 2, "Expected 2 orders, found " + filtered.length.toString() + " !");
  assert.ok(filtered.indexOf({id: 2}));
  assert.ok(filtered.indexOf({id: 3}));
};

require("sdk/test").run(exports);
