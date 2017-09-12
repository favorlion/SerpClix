var self = require("sdk/self"),
	tabs = require("sdk/tabs");

function notify(message, severity) {
  tabs.activeTab.attach({
	contentScriptFile: [
		self.data.url("js/jquery.min.js"),
		self.data.url("js/jquery.noty.packaged.min.js")
		],
	contentScript: "noty({text:'" + message + "', type:'" + severity + "', closeWith: ['button']});"
  })
}

function notifyRiskScore(riskScore) {
  if (riskScore === null) return;
  if (riskScore >= 30) {
	notify('You seem to be using a low-quality proxy/IP. Please check the FAQ entry <a href="http://serpclix.com/panel/">here</a> for more information', "warning");
  }
}

module.exports = {
  notify: notify,
  notifyRiskScore: notifyRiskScore
}
