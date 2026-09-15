# Current standalone version

The user supplied an updated `Hoopland League Studio.html` on September 14, 2026. Treat this HTML as the current authoritative application. It includes online location selection and other changes not yet synchronized to `league-editor/dist`.

Run `node build-standalone.mjs` to refresh embedded images, paths, dimensions, and categories from UBA, NCSA, and ads. The builder now preserves this HTML's application code and retains moved paths as import aliases. Ambiguous moves or new images without metadata stop the refresh. Do not rebuild from the older league-editor/dist application.

Run `node verify-standalone.mjs`, `node verify-standalone-picker.mjs`, and `node verify-standalone-assets.mjs` after refreshing. For packaging, zip the existing HTML and READ ME.txt directly.

The user wants standalone-only development. Do not deploy the hosted site unless explicitly requested.
