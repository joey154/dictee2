# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

French spelling practice app for Grade 2 students (Brielle, Groupe B). React 18 + TypeScript + Vite + Tailwind CSS. Deployed to Netlify.

## Commands

```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # tsc -b && vite build → dist/
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Asset Generation (Python)

Generates audio (Gemini TTS), sentences (Gemini), and images (Imagen) for words in `public/words_of_week.txt`.

```bash
cd /home/jhundert/dictee2-brielle
source scripts/venv/bin/activate
export GOOGLE_PROJECT_NAME=gen-lang-client-0238447054
python scripts/generate_assets.py              # Prompts for sound theme (e.g. "eau")
python scripts/generate_assets.py --image-rate-limit 0   # Skip rate limiting
```

Requires: Google Cloud ADC at `~/.config/gcloud/application_default_credentials.json` (via `gcloud auth application-default login`). gcloud lives at `~/google-cloud-sdk/bin/gcloud`.

The script is **incremental** — only generates missing assets, safe to re-run.

## Architecture

### Data Flow

```
public/words_of_week.txt    ← human edits (one word per line)
        ↓
scripts/generate_assets.py  ← generates all assets via Vertex AI
        ↓
public/manifest.json        ← word data + asset paths (app reads this)
public/metadata.yaml        ← sound theme + generation date
public/audio/{word}_word.wav, {word}_sentence.wav
public/images/{word}.png
        ↓
src/hooks/useWordList.ts    ← loads manifest.json into React state
src/hooks/useSpeech.ts      ← plays audio files, falls back to Web Speech API
```

### Key Directories

- `src/components/modes/` — Four game modes: AudioMatch, LettresPerdues, DicteeFantome, Exploration
- `src/hooks/` — useWordList (data loading), useProgress (localStorage mastery tracking), useSpeech (audio playback), useMetadata
- `src/utils/wordUtils.ts` — French letter patterns (`FRENCH_PATTERNS`), accent-insensitive comparison, letter removal logic for LettresPerdues
- `src/types/index.ts` — TypeScript interfaces (Word, WordProgress, GameSession, GameMode)

### Progress System

Stored in localStorage key `dictee_progress`. 3 consecutive correct = mastered. Word selection prioritizes unpracticed → unmastered → least recent.

### Audio Playback

Pre-generated WAV files (24kHz mono 16-bit) are preferred. Falls back to Web Speech API with French voice at 0.8x rate if files missing.

## Deployment

- **Branch `brielle-class`** — Brielle's customized version
- **Branch `main`** — stable releases
- **Netlify** — builds from `npm run build`, publishes `dist/`
- Generated assets (audio, images, manifest.json) must be committed — they are served as static files

## Weekly Workflow

1. Edit `public/words_of_week.txt` with new words
2. Run `generate_assets.py` (sound theme prompt, ~8min with image rate limiting)
3. Verify with `npm run dev`
4. Commit generated assets + word list
5. Deploy to Netlify

## Admin

`/admin` route, password: `dictee2024`. Shows word list and mastery status.
