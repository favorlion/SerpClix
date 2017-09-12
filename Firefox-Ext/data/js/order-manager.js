// this content script is loaded on every page load like searching and navigating.
// it can't keep state across loads

var searchPerformed = function () {
  return window.location.href.search(new RegExp("q=.*")) !== -1;
};

var shadow = "0px 0px 0px 2000px rgba(143,143,143,1)",
    order = null,
    lastAddress = window.location.href,
    maxSearchPage = 5;

self.port.on("load", function (orderParam) {
  order = orderParam;
  processPage(order);
});


// since Google moves between pages via AJAX, the 'load' event is not always emitted
// we complement the original technique when this script is not reloaded by periodically
// checking the current URL

setInterval(checkPageChanged, 1000);


function setPageHints(order) {
  if (searchPerformed()) {
    $("input[name='q']").attr("placeholder", "");
    $("#sfdiv").css("box-shadow", "");
  } else { // this is not needed to execute after the first page load but it won't hurt after that
    $("input[name='q']").attr("placeholder", "type '" + order.keyword + "' here");
    $("#sfdiv").css("box-shadow", shadow);
  }
}

function onOrderPage(order) {
  var curPageURL = URI(addHTTP(window.location.href));
  var orderURL = URI(addHTTP(order.url));
  return curPageURL.domain() === orderURL.domain();
}

function checkPageChanged() {
  var currentAddress = window.location.href;
  if (currentAddress !== lastAddress) {
    lastAddress = currentAddress;
    setTimeout(function () {
      // give some time for the ajax to load fully
      processPage(order);
    }, 500);
  }
}

function processPage(order) {
  setPageHints(order);
  if (searchPerformed()) {
    self.port.emit("searchedKeyword", $("input[name='q']").val());
    var orderLinkFound = findOrderLink(order);
    if (!orderLinkFound) {
      var currentActiveNav = $("td.cur").text(),
          currentNavIndex = parseInt(currentActiveNav);
      if (currentNavIndex >= maxSearchPage) {
        self.port.emit("orderFailed", "The " + maxSearchPage.toString() + "-page limit was exceeded");
      } else {
        var bottomLinks = $("#nav td"),
            nextLinkIndex = currentNavIndex + 1;
        bottomLinks.each(function (index) {
          var $thisLink = $(this);
          if (parseInt($thisLink.text()) !== nextLinkIndex) {
            $thisLink.hide();
          } else {
            $thisLink.css("box-shadow", shadow);
          }
        });
      }
    }
  }
}

function findOrderLink(order) {
  var pageLinks = $("h3.r a"),
        a = document.createElement("a");
  var orderURL = URI(addHTTP(order.url)),
      orderDomain = orderURL.domain(),
      orderLinkFound = false;
  pageLinks.each(function () {
    if (orderLinkFound) return;
    var linkTarget = URI(this.href).domain();
    if (orderDomain == linkTarget) {
      orderLinkFound = true;
      $(this).attr("style", "color: #DD4B39 !important").css("font-size", "24px").css("font-weight", "bolder");
    }
  });
  return orderLinkFound;
}

function addHTTP(url) {
  return url.startsWith("http") ? url : "http://" + url;
}
