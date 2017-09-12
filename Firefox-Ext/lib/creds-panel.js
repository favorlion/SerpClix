var panels = require("sdk/panel"),
    self = require("sdk/self"),
    mainToggleButton = require("./main-toggle-button");


var credsPanel = panels.Panel({
  id: "credentials-panel",
  contentURL: self.data.url("html/credentials-panel.html"),
  contentScriptFile: [
      self.data.url("js/angular.js"),
      self.data.url("js/modules/serpclix.js"),
      self.data.url("js/controllers/credentials-panel.js")
    ],
  position: mainToggleButton,
  onHide: function() {
    mainToggleButton.setToggle(false);
  }
});

function showError(errorMessage) {
  credsPanel.port.emit("showError", errorMessage);
  credsPanel.show();
}

module.exports = credsPanel;
module.exports.showError = showError;