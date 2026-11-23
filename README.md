# DroneHub

Drone rental website: customers browse the catalogue and request rentals; shop owners and the admin approve requests, manage orders and maintain the catalogue.

- `frontend/` — React 19 + Vite + Tailwind CSS 4
- `backend/` — Express + MongoDB (Mongoose), JWT auth, image uploads

## Running locally

```bash
# 1. API (http://localhost:5000)
cd backend
npm install
npm run dev

# 2. Website (http://localhost:5173), in a second terminal
cd frontend
npm install
npm run dev
```

**No database setup is needed for development.** If `backend/.env` has no `MONGO_URI`, the backend
starts a local MongoDB automatically (the binary is downloaded once on first start, ~100 MB) and stores
its data in `backend/.data/`. An empty database is seeded with demo accounts, drones and bookings.
Delete `backend/.data/` to start over.

To use MongoDB Atlas (or any server) instead, copy `backend/.env.example` to `backend/.env` and set
`MONGO_URI`. Set `SEED_IF_EMPTY=true` to seed an empty remote database. In `NODE_ENV=production` a
`MONGO_URI` is required.

Uploaded product images and customer documents are saved in `backend/uploads/` and served at `/uploads/...`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@dronehub.com | admin123 |
| Shop owner (SkyRent) | owner@dronehub.com | owner123 |
| Shop owner (AeroTech) | owner2@dronehub.com | owner123 |
| Customer | user@dronehub.com | user123 |

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
