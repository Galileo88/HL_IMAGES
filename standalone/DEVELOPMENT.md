# Current standalone version

The user supplied an updated `Hoopland League Studio.html` on September 14, 2026. Treat this HTML as the current authoritative application. It includes online location selection and other changes not yet synchronized to `league-editor/dist`.

Do not run `build-standalone.mjs` against the older source, because that would overwrite the user's updates. Before using the builder again, reconcile the current HTML's inline JavaScript, CSS, and data with the source files. For packaging only, zip the existing HTML and READ ME.txt directly.

The user wants standalone-only development. Do not deploy the hosted site unless explicitly requested.
