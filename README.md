# Hoopland League Studio

A standalone browser app for creating and editing Hoop Land leagues.

Open `standalone/Hoopland League Studio.html` in Chrome or Edge, or extract `standalone/Hoopland League Studio.zip` first. No server, installation, or ChatGPT account is required.

The app starts with no league or archive loaded. Choose New from template, Import league, or Restore Progress. Add your own local image folders or GitHub repositories through the image archive.

Each league image folder uses this structure:

```
League Name/
  Logos/
  Courts/
  Ads/
  README.txt
```

Save Progress stores a draft in your browser. Export creates a portable league TXT. Public image URLs are required for game imports; local images support previews and color sampling.

See `standalone/DEVELOPMENT.md` for validation and packaging instructions.
