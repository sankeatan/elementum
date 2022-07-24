@echo off
set /p username=Enter remote username: 
set /p path_to_key=Enter path to private key: 
set /p passphrase=Enter private key passphrase: 
"C:\Program Files (x86)\WinSCP\WinSCP.com" ^
  /log="WinSCP.log" /ini=nul ^
  /command ^
    "open sftp://%username%@hogbod.dev/ -hostkey=""ssh-ed25519 255 +o5gMbuLVHUJ6UbMVRJgpgQd+anYwUERHLyFIVt1U5E"" -privatekey=""%path_to_key%"" -passphrase=""%passphrase%""" ^
    "put build /var/www/hogbod.dev/deploy/elementum/" ^
    "exit"

set username=
set path_to_key=
set passphrase=

set WINSCP_RESULT=%ERRORLEVEL%
if %WINSCP_RESULT% equ 0 (
  echo Success
) else (
  echo Error
)

exit /b %WINSCP_RESULT%
