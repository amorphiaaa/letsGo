# Kifu

Kifu is a React + Vite MVP for an AI-assisted Go learning platform. It includes a dashboard, learning curriculum, puzzle practice, a playable 9×9/13×13/19×19 board, game review, statistics, and profile settings.

## Run locally

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Run with Docker

```powershell
docker compose up --build
```

Then open `http://localhost:8080`. The image uses a multi-stage build: Vite compiles the React app and Nginx serves the optimized static output with SPA routing fallback.

The current data layer is intentionally local and deterministic so the product flow is usable before the FastAPI / KataGo services are connected. The UI keeps game rules and AI analysis as separate concepts so the REST integration can be added later.

## Stack

- React 18
- Vite 5
- CSS modules are not required; the product uses one shared visual system in `styles.css`
