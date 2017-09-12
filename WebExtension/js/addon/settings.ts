
const SITE_URL = "https://serpclix.com/",
    ADDON_ENDPOINT_URL = SITE_URL + "addon-api/";

const URLS = {
        loginURL: ADDON_ENDPOINT_URL + "auth/login/",
        listOrdersURL: ADDON_ENDPOINT_URL + "order/list/",
        createClickURL: ADDON_ENDPOINT_URL + "click/create/"
    };
const ORDER_UPDATE_TIMEOUT = 60 * 60 * 6 // 6 hours
