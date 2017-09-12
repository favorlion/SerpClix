angular.module("serpClix")
	.factory("riskScoreQuality", [riskScoreRank]);

function riskScoreRank() {
  return function(riskScore) {
		if (riskScore === null) return "Unknown";
		if (riskScore < 5) {
			return "Excellent";
		} else if (riskScore < 20) {
			return "Good";
		} else if (riskScore < 30) {
			return "Ok";
		} else if (riskScore < 60) {
			return "Bad";
		} else {
			return "Very bad";
		}
  }
}
