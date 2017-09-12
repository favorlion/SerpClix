var buttons = require("sdk/ui/button/toggle"),
    self = require("sdk/self");


var mainToggleButton = buttons.ToggleButton({
    id: "serpclix-main",
    label: "SerpClix ClickSense",
    icon: {
        "16": self.data.url("icons/plugin-16.png"),
        "32": self.data.url("icons/plugin-32.png"),
        "64": self.data.url("icons/plugin-64.png")
    }
});

var handleToggleChange = function (state) {
    var credsPanel = require("./creds-panel")
    if (state.checked) {
        credsPanel.show();
    } else {
        credsPanel.hide();
    }
};

var attachToCredsPanel = function() {
  mainToggleButton.on("change", handleToggleChange);
}

var cutFromCredsPanel = function() {
  mainToggleButton.removeListener("change", handleToggleChange);
};

var attachToSideBar = function() {
  var orderSidebar = require("./order-sidebar");
  mainToggleButton.on("change", function(state) {
    if (state.checked) {
      orderSidebar.show();
    } else {
      orderSidebar.hide();
    }
  });
}

var setToggle = function(state) {
  mainToggleButton.state("window", {checked: state});
}

module.exports = mainToggleButton;
module.exports.attachToCredsPanel = attachToCredsPanel
module.exports.cutFromCredsPanel = cutFromCredsPanel;
module.exports.setToggle = setToggle
module.exports.attachToSideBar = attachToSideBar
