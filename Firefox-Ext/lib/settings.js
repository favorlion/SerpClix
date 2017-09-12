var SITE_URL = "https://serpclix.com/",
    ADDON_ENDPOINT_URL = SITE_URL + "addon-api/";

module.exports = {
    URLS: {
        loginURL: ADDON_ENDPOINT_URL + "auth/login/",
        listOrdersURL: ADDON_ENDPOINT_URL + "order/list/",
        createClickURL: ADDON_ENDPOINT_URL + "click/create/"
    },
    PROXY_CHECK_TIMEOUT: 10,  // seconds
    ORDER_UPDATE_TIMEOUT: 60 * 60 * 6 // 6 hours
};
