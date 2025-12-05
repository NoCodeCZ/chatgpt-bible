# Deployment Documentation

Guides and configuration files for deploying the ChatGPT Bible frontend.

## Contents

| File | Description |
|------|-------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | General deployment guide with environment setup |
| [VERCEL_DEPLOYMENT_STEPS.md](VERCEL_DEPLOYMENT_STEPS.md) | Step-by-step Vercel deployment |
| [Dockerfile](Dockerfile) | Docker container configuration |
| [docker-compose.yml](docker-compose.yml) | Docker Compose setup for local/production |

## Quick Start

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Environment Variables

Required environment variables for deployment:
- `NEXT_PUBLIC_DIRECTUS_URL` - Directus API URL
- `DIRECTUS_ACCESS_TOKEN` - Server-side Directus token (optional)

See `.env.local.example` in the project root for all available options.
