export const urlDev = "http://192.168.1.136:44316/api/v1/"; // Developer // Test IsTest == true

export const urlProd = "https://pigeonapi.azurewebsites.net/open/api/v1/"; // Production // IsTest == false
export const urlTest = "https://pigeonapitest.azurewebsites.net/open/api/v1/"; // Test Prod // IsTest == true Debug // IsTest == false
export var initialUrl = urlProd;

export default {
  clientId: "8puWuJWZYls1Ylawxm6CMiYREhsGGSyw",
  url: initialUrl
};
