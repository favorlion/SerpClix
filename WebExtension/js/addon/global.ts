/// <reference path="../../types/webextensions.d.ts"/>

function setAuthToken(token) {
  updateUserData({authToken: token});
}

function makeAuthHeader(cb: (header: string) => void) {
  browser.storage.local.get<UserData>().then(userData => {
    if (userData.authToken === null) {
      throw "Authentication token not found while trying to make an authentication header"
    }
    cb(`Token ${userData.authToken}`);
  });
}

function setRiskScore(riskScore: number) {
  updateUserData({riskScore: riskScore});
}

function getRiskScore(cb: (riskScore: number) => void): void {
  browser.storage.local.get<UserData>().then(userData => {
    cb(userData.riskScore);
  });
}

function updateUserData(data: Object) {
  browser.storage.local.set(data);
}

const global = {
  getAuthHeader: makeAuthHeader,
  setAuthToken: setAuthToken,
  setRiskScore: setRiskScore,
  getRiskScore: getRiskScore,
  updateUserData: updateUserData
};

interface UserData {
  lastUsername: string;
  authToken: string;
  riskScore: number;
}
