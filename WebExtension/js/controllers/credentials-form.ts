/// <reference path="../../types/index.d.ts" />
/// <reference path="../addon/settings.ts" />
/// <reference path="../addon/global.ts" />


angular.module("serpClix")
    .controller("CredentialsPanelController", ["$scope", "$http", CredentialsPanelController]);

function CredentialsPanelController($scope, $http: ng.IHttpService) {

  var orderTab: browser.Tab;
  var orderTabClosed: boolean = false;
  $scope.login = {message: '', classes: '', username: '', password: ''};
  $scope.errorMessage = false;
  $scope.sendLogin = sendLogin;

  function handleLoginResult(loginResult: LoginInfo, digest: boolean=false) {
    if (loginResult.success) {
      $scope.login.message = "Login was successful!";
      $scope.login.classes = "login-message icon-msg slim success";
    }
    else {
      $scope.login.message = loginResult.message;
      $scope.login.classes = "login-message icon-msg slim error";
    }
    $scope.errorMessage = false;
    if (digest) {
      $scope.$digest();
    }
  }

  function showError(errorMessage) {
    $scope.login.message = errorMessage;
    $scope.login.classes = "login-message icon-msg slim error";
    $scope.errorMessage = true;
    $scope.$digest();
  }

  function sendLogin($event) {
    $event.preventDefault();
    
    browser.storage.local.get<UserData>().then((userData) => {
      if (userData.lastUsername && $scope.login.username !== userData.lastUsername) {
        handleLoginResult({internal: true, success: false,
          message: `You can't use more than one username per browser. Last username used: ${userData.lastUsername}`}, true);
      } else {
        $scope.login.message = "please wait ...";
        $scope.login.classes = "login-message slim";
        $http<LoginResponse>({
          method: "POST",
          url: URLS.loginURL,
          headers: {
            'authorization': `Basic ${btoa($scope.login.username + ":" + $scope.login.password)}`,
            'accept': "application/json"
          },
          data: {
            addon_version: browser.runtime.getManifest().version
          }
        }).then(response => {
          global.updateUserData({"lastUsername": $scope.login.username});
          global.setAuthToken(response.data.token);
          global.setRiskScore(response.data.risk_score);
          if (response.data.risk_score && response.data.risk_score >= 30) {
            browser.notifications.create({type: "basic", title: "IP Address Issue", 
              message: 'You seem to be using a low-quality proxy/IP. Please check the related FAQ entry for more information'});
          }
          openOrderListTab();
          browser.browserAction.setPopup({popup: ""});
          browser.browserAction.onClicked.addListener((tab) => {
            if (orderTabClosed) {
              openOrderListTab();
            }
          })
        }).catch(reason => {
          handleLoginResult({success: false, message: "No response from server. Please try again in a few moments"})
        });
      }
    });
  }
}


interface LoginInfo {
  internal?: boolean;
  success: boolean;
  message: string;
}

interface LoginResponse {
  token: string;
  risk_score: number;
  detail?: string;
}
