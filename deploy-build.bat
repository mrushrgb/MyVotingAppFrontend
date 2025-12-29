@echo off
echo ========================================
echo Deploying Frontend Build to Azure
echo ========================================
echo.

REM Build the project
echo [1/2] Building React app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Build complete! Files are in the 'build' folder.
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Go to Azure Portal: https://portal.azure.com
echo 2. Find your Static Web App
echo 3. Go to Deployment section
echo 4. Upload the contents of the 'build' folder
echo.
echo OR use the Azure Static Web Apps CLI:
echo    npm install -g @azure/static-web-apps-cli
echo    swa deploy ./build
echo ========================================
pause
