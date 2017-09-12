angular.module("serpClix")
    .controller("CredentialsPanelController", ["$scope", CredentialsPanelController]);

function CredentialsPanelController($scope) {

  $scope.login = {message: '', classes: '', username: '', password: ''};
  $scope.errorMessage = false;
  $scope.sendLogin = sendLogin;

  self.port.on("loginResult", handleLoginResult);
  self.port.on("showError", showError);

  function handleLoginResult(loginResult) {
    if (loginResult.success) {
      $scope.login.message = "Login was successful!";
      $scope.login.classes = "login-message icon-msg slim success";
    }
    else {
      $scope.login.message = loginResult.message;
      $scope.login.classes = "login-message icon-msg slim error";
    }
    $scope.errorMessage = false;
    $scope.$digest();
  }

  function showError(errorMessage) {
    $scope.login.message = errorMessage;
    $scope.login.classes = "login-message icon-msg slim error";
    $scope.errorMessage = true;
    $scope.$digest();
  }

  function sendLogin($event) {
    $event.preventDefault();
    $scope.login.message = "please wait ...";
    $scope.login.classes = "login-message slim";
    self.port.emit("userCreds", {
        username: $scope.login.username,
        password: $scope.login.password
    });
  }
}
