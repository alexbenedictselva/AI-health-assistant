# AI Health Assistant

AI Health Assistant is a full-stack demo application that provides risk assessment, recommendations, and simple health metrics tracking for diabetes and cardiac risk. It includes a FastAPI backend (Python), a React + TypeScript frontend, simple JWT-based authentication, and admin features for user management.

This README documents how to run the project locally, the key features, how admin users are determined, and helpful troubleshooting notes inspired by general production-ready projects like Apache Fineract (build, Docker, and environment guidance).

---

## Contents
- `backend/` — FastAPI server, risk calculators, models, and auth
- `frontend/` — React + TypeScript SPA
- `data/`, `docs/` — static resources and documentation

## Key features
- Diabetes and Cardiac risk calculators (server-side)
- Explainable AI modules (explanation helpers for risk results)
- Recommendations generation and per-user storage
- User metrics storage and timeline
- JWT authentication; server enforces ownership of created records
- Admin role: users with emails ending in `@aiassistant.in` are created with `is_admin=true`. Admins can view and manage users via an admin dashboard.

## Requirements
- macOS / Linux / Windows with WSL
- Python 3.11+ (backend)
- Node.js 16+ / npm (frontend)
- MySQL / MariaDB (recommended) or PostgreSQL
- At least 8 GB RAM for a comfortable local dev experience (16GB suggested for heavier workloads)

## Quickstart — backend (development)
1. Create a Python virtualenv and install dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # zsh / bash
pip install -r requirements.txt
```

2. Configure your database in `backend/database.py` or via environment variables. Example (MySQL/MariaDB):

```bash
export DATABASE_URL=mysql+pymysql://root:password@127.0.0.1:3306/ai_health
```

3. Create or migrate the schema (this project modifies the DB directly in dev; if you use migrations, follow your migration flow). Then run:

```bash
uvicorn main:app --reload
```

The backend listens on `http://127.0.0.1:8000` by default.

API highlights:
- `POST /register` — create user (emails ending with `@aiassistant.in` become admins)
- `POST /login` — returns access token
- Protected endpoints require `Authorization: Bearer <token>` header

## Quickstart — frontend (development)
1. From the project root:

```bash
cd frontend
npm install
npm start
```

2. Open `http://localhost:3000` in your browser.

Notes:
- The frontend stores the JWT token and `user` in localStorage. When the backend returns `401 Unauthorized` (token invalid/expired), the frontend automatically logs out and redirects to `/login`.
- Admin users see a simplified dashboard with user management only.

## Docker / Container notes
This project can be containerized. For reference, projects such as Apache Fineract provide robust Docker Compose setups for the application and database. For a quick local containerized run you can:

1. Build the backend image (example pattern):

```bash
# from backend directory
docker build -t ai-health-backend:local .
```

2. Run a database container (MySQL / MariaDB) and pass connection envs to the app.

3. Use docker-compose to wire frontend, backend, and db together. (This repo does not include a finished docker-compose — add one to automate builds and environment wiring.)

If you plan to publish to Docker Hub or build CI images, keep these in mind:
- Pin base images and dependency versions.
- Use multi-stage builds to keep image sizes small.
- Keep secrets out of images; inject via environment variables or secret stores.

## Admin behavior & security notes
- Admin designation: when a user registers with an email ending in `@aiassistant.in`, `is_admin` is set to `true`. This is performed server-side during registration.
- Server-enforced ownership: endpoints that create or list user-specific data use the authenticated user's id — client-supplied user_id is ignored where ownership matters.
- Token expiry: frontend registers a global axios interceptor to dispatch `auth:invalid` on 401 responses; the React app listens and logs out the user and redirects to login using React Router.

## Common tasks
- Run backend tests (if present):

```bash
cd backend
pytest -q
```

- Build frontend production bundle:

```bash
cd frontend
npm run build
```

## Troubleshooting
- 500/OperationalError for missing DB columns: models may have changed — run migrations or add columns manually. We applied manual ALTERs during development to add `users.is_admin` and `*_recommendations.user_id`.
- Router / useNavigate errors: ensure React Router is mounted above components that call router hooks. In this project `AuthProvider` was adjusted to avoid calling `useNavigate` outside Router; navigation on auth-invalid is handled by a listener component mounted inside Router.

## Contributing
If you'd like to contribute:

1. Fork the repository and create a feature branch.
2. Follow the project's linting and formatting rules.
3. Add tests where applicable.
4. Open a pull request describing the change.

For larger infra changes (Docker, migrations), please open an issue first so we can coordinate.

## License
See project files. This demo repository uses code and assets from multiple sources — include correct licensing where applicable.

---

If you'd like, I can also:
- Add a `docker-compose.yml` that wires a MySQL/MariaDB container + backend + frontend for quick local dev.
- Add an Alembic migration folder and generate migrations for the DB schema changes we applied.
- Add a short `CONTRIBUTING.md` and `DEVELOPMENT.md` with exact dev environment steps.

If this looks good, I'll commit the README update to the repository.

