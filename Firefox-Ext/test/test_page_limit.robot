*** Settings ***

Documentation   Test that the browser closes the order tab after the last search page is reached
Suite Setup     Open Browser With Addon Installed
Test Setup      Login As Addon
Suite Teardown  Close Browser
Library  Selenium2Library
Library  robohelp.keywords.AddonKeywords

*** Variables ***

${ADDON_IMAGE}  addon-toolbar-btn.png
${USERNAME_FIELD_IMAGE}  username-field.png
${PASSWORD_FIELD_IMAGE}  password-field.png
${USERNAME}  seller
${PASSWORD}  123456
${FOOABR_SIDEBAR_IMAGE}  foobar-order.png
${FOOBAR_ORDER_KEYWORD}  foobar
${BASE_URL}  about:home
${BROWSER_ID}  \


*** Test Cases ***

Test Addon Tab Closes After Last Search Page Is Reached
  [Tags]  addon  behavior
  wait until image appears  ${FOOABR_SIDEBAR_IMAGE}
  click image  ${FOOABR_SIDEBAR_IMAGE}
  switch browser  ${browser_id}
  input text  q  ${FOOBAR_ORDER_KEYWORD}
  input text  q  \n
  click link  xpath=//table[@id='nav']//a[@class='fl' and position()=6]
  sleep  3
  switch browser  1
  location should be  ${BASE_URL}


*** Keywords ***

Open Browser With Addon Installed
  ${addon_profile_dir}=  get addon profile dir
  ${id}=  open browser  {BASE_URL}  ff_profile_dir=${addon_profile_dir}
  set suite variable  ${BROWSER_ID}  ${id}

Login As Addon
  click image  ${ADDON_IMAGE}
  click image  ${USERNAME_FIELD_IMAGE}
  type input  ${USERNAME}
  click image  ${PASSWORD_FIELD_IMAGE}
  type input  ${PASSWORD}
  type input  \n
