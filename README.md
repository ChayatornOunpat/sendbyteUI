# sendbyteUI

## Local development

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` (example: `http://localhost:8000`).
3. Run:

```bash
pnpm install
pnpm dev
```

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy-ui.yml`
- It builds `dist/` and uploads it to the VPS API project directory.
