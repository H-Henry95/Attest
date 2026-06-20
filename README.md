# Attest

Attest is a React + Vite prototype for formatting meeting transcripts into compliance-aware records for regulated industries. It is designed as a demo workspace to structure legal, medical, and financial meeting notes with clear headers, retention designations, and a polished record output.

## Features

- Industry-specific record templates for Legal, Medical, and Financial use cases
- Auto-redaction toggle for identifiers like names, addresses, and account numbers
- Consent gating before generation
- Copy and export-ready certified record display
- Sample transcripts for quick preview

## Tech stack

- React 18
- Vite
- JavaScript

## Getting started

```bash
cd ConfidentialRecordSystem/Attest
npm install
npm run dev
```

Open the local URL shown in your terminal to view the app.

## Build for production

```bash
npm run build
```

The production-ready static output will be generated in the `dist` folder.

## Notes

- This is a prototype. The current app is intended for demo and design review only.
- The app currently uses a client-side AI fetch in the demo flow. For a secure published deployment, move the AI integration to a backend or proxy service and avoid exposing API keys in the browser.
- Do not paste real patient, client, or privileged information into this prototype.

## File structure

- `Attest.jsx` — main app component and UI
- `main.jsx` — React entry point
- `index.html` — application shell
- `package.json` — project metadata and scripts
- `vite.config.js` — Vite configuration
