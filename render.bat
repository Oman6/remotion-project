@echo off
echo Installing dependencies...
cd /d "%~dp0"
call npm install
echo.
echo Rendering video...
call npx remotion render CaseMatePromo out\CaseMatePromo.mp4
echo.
echo Done! Video is at: %~dp0out\CaseMatePromo.mp4
pause
