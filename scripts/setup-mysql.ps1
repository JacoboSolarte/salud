$ErrorActionPreference = "Stop"

$mysqlCandidates = @(
  "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
  "C:\Program Files\MySQL\MySQL Workbench 8.0\mysql.exe"
)

$mysql = $mysqlCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $mysql) {
  throw "No se encontro mysql.exe. Instala MySQL Server/Workbench o agrega mysql.exe al PATH."
}

$sqlFile = Join-Path $PSScriptRoot "..\prisma\mysql-setup.sql"

if (-not (Test-Path -LiteralPath $sqlFile)) {
  throw "No se encontro el archivo SQL: $sqlFile"
}

Write-Host "Usando cliente MySQL: $mysql"
Write-Host "Ingresa la contrasena del usuario root de MySQL."

$securePassword = Read-Host "Password root" -AsSecureString
$passwordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
  $rootPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPtr)
  $env:MYSQL_PWD = $rootPassword

  Get-Content -LiteralPath $sqlFile -Raw | & $mysql -u root --protocol=tcp --host=127.0.0.1 --port=3306
}
finally {
  if ($passwordPtr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr)
  }

  Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}
