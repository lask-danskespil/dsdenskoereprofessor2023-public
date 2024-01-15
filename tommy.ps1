start-process powershell "npm run start"
start-process powershell "npm run watch"

Start-Sleep -Seconds 10

start-process "chrome.exe" "http://127.0.0.1:1339"