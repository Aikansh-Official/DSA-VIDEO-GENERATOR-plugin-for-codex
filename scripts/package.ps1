$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$pluginRoot = Join-Path $repoRoot 'plugins\dsa-video-generator'
$distPath = Join-Path $repoRoot 'dist'
New-Item -ItemType Directory -Force -Path $distPath | Out-Null
$archivePath = Join-Path $distPath 'dsa-video-generator-1.0.0.zip'
if (Test-Path -LiteralPath $archivePath) { throw 'Archive already exists. Choose a new release version or move the old ZIP first.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($pluginRoot, $archivePath)
$zip = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  if (-not ($zip.Entries.FullName -contains 'plugin.json')) { throw 'ZIP is missing root manifest' }
  if ($zip.Entries.FullName -match 'node_modules|\.env|\.wav$|\.mp4$|\.onnx$') { throw 'Unexpected generated/dependency files in ZIP' }
  Write-Host "Validated package: $($zip.Entries.Count) entries"
} finally { $zip.Dispose() }
Get-FileHash -LiteralPath $archivePath -Algorithm SHA256
