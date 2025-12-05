@echo off
echo ===============================================
echo Azure Static Web Apps - Manual Deployment
echo ===============================================
echo.

echo Step 1: Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Azure Static Web Apps CLI...
call npm install -g @azure/static-web-apps-cli

echo.
echo ===============================================
echo Build complete! 
echo ===============================================
echo.
echo Next steps:
echo 1. Go to Azure Portal
echo 2. Create a Static Web App resource
echo 3. Choose "Other" as deployment source
echo 4. Copy the deployment token from the portal
echo 5. Run: swa deploy ./build --deployment-token YOUR_TOKEN
echo.
pause
