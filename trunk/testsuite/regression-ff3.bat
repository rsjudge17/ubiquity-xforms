"C:\Program Files\Mozilla Firefox\firefox.exe" "testsuite\selenium\core\TestRunner.html?test=..\..\issues\driverPages\SeleniumTests\TestSuite.html&auto=true&save=true&resultsUrl=..\..\regression-ff3-results.html&close=true"
ant -f "testsuite\build.xml"
if "%ERRORLEVEL%" == "1" exit 1