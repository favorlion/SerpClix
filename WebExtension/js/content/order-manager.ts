/// <reference path="../../types/index.d.ts" />

var shadow = "0px 0px 0px 2000px rgba(143,143,143,1)",
    order = null,
    lastAddress = null,
    maxSearchPage = 7;

browser.runtime.onMessage.addListener((message: ContentMessage) => {
  if (message.event == "OrderList.order") {
    order = message.message;
  }
});

var searchPerformed = function () {
  return window.location.href.search(new RegExp("q=.*")) !== -1;
};


// since Google moves between pages via AJAX, the 'load' event is not always emitted
// we complement the original technique when this script is not reloaded by periodically
// checking the current URL

setInterval(checkPageChanged, 1000);


function setPageHints(order: Order) {
  if (searchPerformed()) {
    $("input[name='q']").attr("placeholder", "");
    $("#sfdiv").css("box-shadow", "");
  } else { // this is not needed to execute after the first page load but it won't hurt after that
    $("input[name='q']").attr("placeholder", "type '" + order.keyword + "' here");
    $("#sfdiv").css("box-shadow", shadow);
  }
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

function processPage(order: Order) {
  setPageHints(order);
  if (searchPerformed()) {
    browser.runtime.sendMessage({event: "OrderManager.searchedKeyword", message: $("input[name='q']").val()});
    var orderLinkFound = findOrderLink(order);
    if (!orderLinkFound) {
      var currentActiveNav = $("td.cur").text(),
          currentNavIndex = parseInt(currentActiveNav);
      if (currentNavIndex >= maxSearchPage) {
        browser.runtime.sendMessage({event: "OrderManager.orderFailed", message: "The " + maxSearchPage.toString() + "-page limit was exceeded"});
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

function findOrderLink(order: Order) {
  var pageLinks = $("h3.r a"),
        a = document.createElement("a");
  var orderURL = URI(formatURL(order.url)),
      orderLinkFound = false;
  pageLinks.each(function () {
    if (orderLinkFound) return;
    var linkTarget = URI(this.href);
    if (orderURL.equals(linkTarget)) {
      orderLinkFound = true;
      $(this).attr("style", "color: #DD4B39 !important").css("font-size", "24px").css("font-weight", "bolder");
    }
  });
  return orderLinkFound;
}

function formatURL(url: string) {
  if (!url.endsWith("/") && !URI(url).query()) {
    url = url + '/';
  }
  return url.startsWith("http") ? url : "http://" + url;
}
