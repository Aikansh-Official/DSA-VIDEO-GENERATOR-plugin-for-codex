# Official directory handoff

Package: `dist/dsa-video-generator-1.0.0.zip` (created with `scripts/package.ps1`). Publisher: Aikansh Katiyar. This is a skills-only plugin with bundled local scripts, no remote MCP endpoint, account login, API key or publisher backend.

Official instructions: https://developers.openai.com/plugins/deploy/submission

Upload the ZIP at https://platform.openai.com/plugins under a verified developer identity. Complete package and skill scans, fix findings, and submit for review. Approval and publication are separate from GitHub release publication. A local execution-capable host is required and disclosed in the listing.

Reviewer cases:

1. Install the skill, ask to make a Two Sum video, choose a fresh local directory. Expected: setup, measured narration and a playable MP4 with problem, brute force, optimization, complexities and code.
2. Render the provided example again. Expected: unchanged speech clips are cached.
3. Try a lesson with `domain: marketing`. Expected: validation error before speech generation.
4. Try setup into an unrelated nonempty directory. Expected: refusal without changing those files.
5. Change narration to a longer sentence. Expected: scene duration increases rather than truncating or speeding up the voice.

No reviewer credentials are required. The README and screenshot provide the listing demonstration; the release sample demonstrates actual output. Windows execution is tested; other OS voice routes and installation in every client are not claimed verified.
