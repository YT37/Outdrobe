# Outdrobe

An AI stylist that starts from the clothes you already own. Snap your wardrobe, then ask for an outfit for a presentation, a coffee date or a trip, by text or by voice. Outdrobe identifies each item's type and colour, builds combinations around the occasion, remembers what you've worn, and points you to affordable pieces when something is missing.

**Live:** [outdrobe.tech](https://outdrobe.tech)

## Why we built it

*StyleUp* (YC W13) gave people daily outfit suggestions based on the weather and their lifestyle. It made getting dressed simpler, but the suggestions were one-size-fits-all. We asked what StyleUp would look like if it were built today with AI at its core. Outdrobe is our answer: instead of generic weather tips, it looks at your real wardrobe, the context of your day or trip, and colour theory to put together looks that are personal and coherent.

## What it does

- **Wardrobe:** upload photos of your clothes; each one is captioned by an image model and tagged with its type, colour and category.
- **AI stylist:** chat with an agent that suggests outfits for an event, season or mood using the items in your wardrobe.
- **Voice:** talk to the stylist and hear it answer, with speech-to-text and text-to-speech.
- **Marketplace:** browse matching pieces to fill gaps in your wardrobe.
- **3D avatar:** preview looks on an avatar in the browser.

## How it fits together

```
Browser (Source Code/webiste)
  │  React + Vite, hosted on Google Cloud Storage + CDN
  │  VITE_API_URL ──▶
  ▼
Cloud Run API (Source Code/functions)          Flask
  ├─ POST /converse ──▶ Elastic Agent Builder (Kibana)   fashion agent
  ├─ POST /tts, /stt ─▶ Fish Audio                        voice in and out
  ├─ POST /classify ──▶ Image server ─────────────┐
  └─ GET  /health                                  │
                                                   ▼
Image server (Source Code/server)               Flask + BLIP-2 (blip2-opt-2.7b)
  Compute Engine VM, n1-standard-4 with an NVIDIA T4, us-east1-c
  POST /classify: base64 image in, item type / colour / category out
```

| Folder | What it is | Stack |
| --- | --- | --- |
| `Source Code/webiste` | The web app | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Three Fiber |
| `Source Code/functions` | Public API that the web app calls; keeps API keys server-side | Python, Flask, gunicorn, Cloud Run |
| `Source Code/server` | GPU image-captioning service | Python, Flask, PyTorch, Hugging Face Transformers, Docker |

## Running it locally

You need Node.js 20+, Python 3.11+ and, for deploys, the `gcloud` CLI signed in to the `outdrobe` project.

### Web app

```bash
cd "Source Code/webiste"
npm install
echo 'VITE_API_URL=http://localhost:8080' > .env   # or the deployed Cloud Run URL
npm run dev
```

### API (functions)

```bash
cd "Source Code/functions"
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export KIBANA_API_KEY=...   # Elastic Agent Builder key
export FISH_API_KEY=...     # Fish Audio key
python app.py               # serves on http://localhost:8080
```

`/classify` forwards to the image server address set in `SERVER_URL` at the top of `app.py`.

### Image server

The BLIP-2 model needs an NVIDIA GPU (the deployed VM uses a 16 GB T4) and the NVIDIA Container Toolkit. It downloads several gigabytes of weights into `./cache` on first start.

```bash
cd "Source Code/server"
docker compose up --build   # serves on http://localhost:8080
```

The API also defaults to port 8080, so run one of them on another port (`PORT=8081 python app.py`) when you run both locally.

## Deploying

| Part | Command | Where it goes |
| --- | --- | --- |
| Web app | `npm run setup` once, then `npm run deploy` (in `Source Code/webiste`) | `gs://outdrobe-website` behind Cloud CDN at outdrobe.tech |
| API | `./deploy.sh` (in `Source Code/functions`) | Cloud Run service `outdrobe-functions` in `us-central1`; `KIBANA_API_KEY` and `FISH_API_KEY` come from Secret Manager |
| Image server | `./deploy.sh`, then `./vm-manage.sh start / stop / status / logs / ssh / update` (in `Source Code/server`) | Compute Engine VM `outdrobe-server` |

Stop the GPU VM with `./vm-manage.sh stop` when you're not using it; it bills by the hour.

## Team

Built by Yug, Avishek and Keshava.

## License

[MIT](LICENSE)
