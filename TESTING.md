# Verification — 7 October 2026

Verified on Windows, Node 24.18.0, from a fresh isolated workspace created by the packaged setup script.

- Pinned `npm ci` dependency installation succeeded (252 packages).
- TypeScript typecheck passed.
- Nine automated tests passed: exact Knapsack DFS and optimum; nonoverlap and speech padding; cache identity; invalid domain/scene/index/diagram rejection; WAV duration and truncation; Two Sum pictured match; portrait bounds and table validation; invalid durations and negative pause rejection; disguised unrelated narration rejection.
- Skill Creator frontmatter validation passed using an existing Python environment with PyYAML.
- Manifest/asset paths, marketplace path, portable-file scan and nonempty-directory protection passed.
- Doctor found Windows David and Zira voices and an installed renderer.
- Full Two Sum rendering succeeded: 22 scenes, 422.67 seconds, H.264 720x1280 at 24fps, AAC audio, 20,138,597 bytes. Complete media decode passed with no errors.
- Map-table, code and complexity frames were rendered and inspected. No full subjective listening review was performed.
- Repeated preparation reported zero uncached clips.
- Plugin ZIP contains 29 entries with root plugin.json and no generated media, weights, dependencies, secrets or publisher-machine paths. Extraction and setup to another fresh folder succeeded; all nine tests passed on extracted files.
- ZIP SHA256: `CF9C44C6ABB580488AE7DC700F39D14575BAD34993ACB01C8042B8209285A964`.

Not verified: automatic installation UI across all Codex/ChatGPT versions, the optional personal marketplace installer against a real user's settings, macOS/Linux voices, Piper in this new package, or every possible authored lesson. Structural validation and blocklists do not replace factual review.

Official portal was inspected live. Upload is blocked by: "You need a verified developer identity before you can create or upload a plugin." No package was submitted to OpenAI and no marketplace approval is claimed.
