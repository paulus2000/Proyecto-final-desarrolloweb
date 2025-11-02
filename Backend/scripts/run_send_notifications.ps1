<#
PowerShell wrapper to run the Django management command that sends event notifications.

Usage:
 - Run manually from Backend folder: .\scripts\run_send_notifications.ps1
 - Configure Task Scheduler to run this script on an interval.

Notes:
 - The script will try to use a venv located at ../venv/Scripts/python.exe if present.
 - It writes stdout/stderr to logs/send_event_notifications.log next to the repo.
 - Environment variables (EMAIL_*) should be set at the user or system level so the scheduled task
   can access them. Avoid hard-coding passwords in this script.
#>

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir '..')
$LogDir = Join-Path $RepoRoot 'logs'
if (-not (Test-Path $LogDir)) { New-Item -Path $LogDir -ItemType Directory | Out-Null }
$LogFile = Join-Path $LogDir 'send_event_notifications.log'

Write-Output "Running send_event_notifications at $(Get-Date -Format o)" | Tee-Object -FilePath $LogFile -Append

# Prefer venv python if available
$VenvPython = Join-Path $RepoRoot 'venv\Scripts\python.exe'
if (Test-Path $VenvPython) { $Python = $VenvPython } else { $Python = 'python' }

$ManagePy = Join-Path $RepoRoot 'manage.py'
if (-not (Test-Path $ManagePy)) {
    Write-Output "ERROR: manage.py not found at $ManagePy" | Tee-Object -FilePath $LogFile -Append
    exit 2
}

# You can pass extra args through to manage.py by providing them to this script
$Extra = $args -join ' '

$Cmd = "`"$Python`" `"$ManagePy`" send_event_notifications $Extra"
Write-Output "Executing: $Cmd" | Tee-Object -FilePath $LogFile -Append

try {
    & $Python $ManagePy send_event_notifications $args 2>&1 | Tee-Object -FilePath $LogFile -Append
    $Exit = $LASTEXITCODE
} catch {
    Write-Output "Exception: $_" | Tee-Object -FilePath $LogFile -Append
    $Exit = 1
}

Write-Output "Finished at $(Get-Date -Format o) with exit code $Exit" | Tee-Object -FilePath $LogFile -Append
exit $Exit
