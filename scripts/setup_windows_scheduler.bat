@echo off
echo =======================================================
echo Setting up Sunday Suspense Daily 7:00 PM IST Sync Task
echo =======================================================

set TASK_NAME=SundaySuspenseDailySync
set SCRIPT_PATH=%~dp0fetch_playlist.py

schtasks /Create /SC DAILY /TN "%TASK_NAME%" /TR "python \"%SCRIPT_PATH%\"" /ST 19:00 /F

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Windows Task "%TASK_NAME%" successfully scheduled for 7:00 PM daily!
) else (
    echo [ERROR] Could not create scheduled task. You may need to run this batch file as Administrator.
)
pause
