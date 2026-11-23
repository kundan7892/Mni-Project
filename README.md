# DroneHub

Drone rental website: customers browse the catalogue and request rentals; shop owners and the admin approve requests, manage orders and maintain the catalogue.

- `frontend/` — React 19 + Vite + Tailwind CSS 4
- `backend/` — Express + MongoDB (Mongoose), JWT auth, image uploads

## Running locally

### Quick start — no database needed

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Without a backend, the site runs entirely in the browser (`frontend/src/services/localApi.js`):
the 18-drone catalogue and demo bookings are built in, and everything — sign in, renting, approvals,
catalogue edits, image uploads, analytics — works and is saved in the browser's `localStorage`.
Because the data lives in one browser, sign in as admin and as customer **in the same browser** to see
requests flow between them. Clear site data (or `localStorage.removeItem('dronehub_local_db_v1')`)
to start over. This also works for a static deploy (e.g. Vercel) with no server.

### Full stack — Express + MongoDB

```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

The frontend checks `/api/health` on load and uses the real backend automatically when it reports a
connected database. Force a mode with `VITE_API_MODE=local` or `VITE_API_MODE=server` in `frontend/.env`.

If `backend/.env` has no `MONGO_URI`, the backend starts a local MongoDB for development (binary
downloaded once, ~100 MB) and stores data in `backend/.data/`. For MongoDB Atlas, copy
`backend/.env.example` to `backend/.env` and set `MONGO_URI` (`SEED_IF_EMPTY=true` seeds an empty
database). Uploaded files go to `backend/uploads/`.

## Demo accounts

Sign in at `/auth/login` and pick the matching role (Customer / Shop Owner / Admin).

| Panel | URL after sign-in | Email | Password |
| --- | --- | --- | --- |
| Admin | `/admin/dashboard` | admin@dronehub.com | admin123 |
| Shop owner — SkyRent Bengaluru | `/owner/dashboard` | owner@dronehub.com | owner123 |
| Shop owner — AeroTech Mumbai | `/owner/dashboard` | owner2@dronehub.com | owner123 |
| Customer | `/user/dashboard` | user@dronehub.com | user123 |
| Customer (extra demo) | `/user/dashboard` | aarav@example.com | customer123 |
| Customer (extra demo) | `/user/dashboard` | priya@example.com | customer123 |
| Customer (extra demo) | `/user/dashboard` | rohan@example.com | customer123 |

Admin accounts can't be created from the sign-up page. Change these passwords before deploying anywhere public.

## Catalogue

The catalogue starts with the 18 drones and prices from the original site
(`frontend/src/data/drones.js`, mirrored in `backend/seeders/catalogue.js`). SkyRent drones belong to `owner@`, AeroTech drones to `owner2@`,
and the rest to the admin. Drones the admin or a shop owner adds in **Catalogue** are stored in the
database and appear in the store immediately (unless hidden).

## Rental flow

1. **Customer** opens a drone → *Choose dates* → picks dates and extras, fills in details, uploads an ID → *Send request*.
   The server re-prices the request and rejects dates that overlap a confirmed rental.
2. **Admin / shop owner** → *Requests*: approve or decline (with a reason).
3. *Orders*: mark the rental *picked up* (drone becomes "rented"), then *returned* (drone available again, payment marked paid).
   Payments can also be recorded or refunded by hand. Customers can cancel until pickup.

Customers follow every step under **My rentals**.

## Admin panel (`/admin`)

- **Overview** — revenue, pending requests, latest orders
- **Requests** — pending rental requests with one-click approve
- **Orders** — every booking with status tabs, search, CSV export and lifecycle actions
- **Catalogue** — add / edit products (title, brand, category, description, price, deposit, specs, multiple images with upload or link), hide from the store, delete
- **Customers** — sign-ups with rentals and spend; deactivate accounts
- **Analytics** — revenue and bookings by month, booking outcomes, top drones, revenue by category

Shop owners get the same pages at `/owner`, limited to their own drones and bookings.

## Useful API endpoints

| Method | Path | Who |
| --- | --- | --- |
| `GET` | `/api/drones` · `/api/drones/:id` · `/api/drones/:id/availability` | public |
| `POST` / `PUT` / `DELETE` | `/api/drones[/:id]` | owner, admin |
| `POST` | `/api/bookings/quote` · `/api/bookings` | signed in |
| `PATCH` | `/api/bookings/:id/status` · `/api/bookings/:id/payment` | owner, admin |
| `PATCH` | `/api/bookings/:id/cancel` | customer, owner, admin |
| `POST` | `/api/uploads` (multipart field `files`) | signed in |
| `GET` | `/api/admin/analytics` | owner, admin |
| `GET` / `PATCH` | `/api/admin/users` · `/api/admin/users/:id/status` | admin |
