param([string]$Request, [switch]$List)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$lessonSpeaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  if ($List) {
    $names = @($lessonSpeaker.GetInstalledVoices() | Where-Object Enabled | ForEach-Object { $_.VoiceInfo.Name })
    ConvertTo-Json -InputObject $names -Compress
  } else {
    $batch = Get-Content -LiteralPath $Request -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($batch.voice) { $lessonSpeaker.SelectVoice($batch.voice) }
    $lessonSpeaker.Rate = [int]$batch.rate
    $lessonSpeaker.Volume = [int]$batch.volume
    foreach ($segment in $batch.segments) {
      $lessonSpeaker.SetOutputToWaveFile($segment.output)
      $lessonSpeaker.Speak([string]$segment.text)
    }
  }
} finally { $lessonSpeaker.SetOutputToNull(); $lessonSpeaker.Dispose() }
