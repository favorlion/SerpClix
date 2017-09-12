/// <reference path="../../types/webextensions.d.ts"/>

var orderTab: browser.Tab;
var orderTabClosed: boolean = false;

function openOrderListTab() {
    browser.tabs.create({url: browser.runtime.getURL("html/order-list.html")}).then((tab) => {
        orderTab = tab;
        browser.tabs.onRemoved.addListener((tabId) => {
        // this is not being executed when a tab is closed. why?
        if (tabId == orderTab.id) {
            orderTabClosed = true;
        }
        });
    });
}
