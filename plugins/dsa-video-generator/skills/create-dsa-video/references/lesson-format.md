# Version 1 lesson format

Use `lessons/<id>.json`. Required lesson fields: `version: 1`, lowercase hyphenated `id`, `title`, `domain` (dsa, algorithms, computer-science, mathematics, physics), `codeLines` (array of strings), nonempty `scenes`. Optional `orientation` is portrait or landscape; default landscape. `sourceUrl` records the original problem.

Every scene requires a unique lowercase hyphenated `id`, `title`, `layout`, and nonempty `narration`. Use `chapter`, `equation`, `note` for concise teaching annotations. Captions are not burned into the video.

Portrait `layout: "visual"` fields: `array` (up to six numeric/string values), `activeIndices`, `target`, `seen` (pairs of number and earlier index), `success` boolean, `codeLines` (scene-specific code), `highlight` (zero-based line indices). For long code, the renderer shows a window around the first highlighted line; choose successive scenes to explain the rest. Portrait code should use short lines. The bundled Two Sum lesson demonstrates separate lookup/insertion scenes and code explanation.

Landscape layouts: `concept`, `array`, `code-stack`, `diagram`. A `stack` contains oldest-to-newest descriptions (up to eight). `returnValue`, `compare`, `capacity`, `maxCapacity` annotate recursion. Lesson `items` holds up to five `{label, weight, value}` entries. Scene `activeItem` identifies the relevant item. Diagrams contain nodes `{id,label,x,y}` and edges `{from,to,label}` on a 480x260 canvas; x 55–425 and y 25–235, at most twelve nodes and twenty edges. Split complex diagrams into steps.

Never stuff a different problem into a sorting schema: expected output need not match input length. Independently check the mathematics and example states. The structural validator is not a semantic topic classifier or proof of algorithm correctness.

Commands: `validate`, `prepare`, `still --frame N`, `render`, each with `--lesson <id>`. `--limit N` renders an explicitly labeled sample; deliver a full render without that flag. `preview --port 3021` starts Studio after preparation. Generated timing is in `public/compiled.json`; narration WAVs are cached under `public/narration`. Transcripts and chapter timestamps are in `out`.
