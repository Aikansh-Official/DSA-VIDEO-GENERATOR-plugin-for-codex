# Local voices

Run `node scripts/lab.mjs voices` to list installed voices. On Windows choose one using `node scripts/lab.mjs configure --backend windows --voice "Microsoft David Desktop" --rate -1 --pause 1.2`. Use a voice actually listed on that machine. Generate a sample with `node scripts/lab.mjs voice-sample`.

macOS uses the installed `say` command; Linux uses `espeak`. These paths are included but not verified on those operating systems. The bundled optional `scripts/install-piper.mjs` installs a Python environment and downloads a model only when explicitly requested. Read its download and model-license information before use. Configure Piper with `node scripts/lab.mjs configure --backend piper --python <absolute-python> --model <absolute-model.onnx>`; adjacent ONNX JSON is required. Windows system voice works without Python or model downloads.

The `silent` backend is only for explicitly requested silent development previews. Never silently fall back to a silent final video. The renderer does not clone voices.
