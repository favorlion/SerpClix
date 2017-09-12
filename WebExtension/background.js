/// <reference path="./types/webextensions.d.ts"/>
/// <reference path="./js/addon/orderlist-tab-util.ts" />
browser.browserAction.onClicked.addListener((tab) => {
    if (orderTabClosed) {
        openOrderListTab();
    }
});
