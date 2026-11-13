# Little Dugout

Baseball gear for kids that the customer designs: a jersey, a trucker cap and an engraved baseball.

**Live site:** https://little-dugout.vercel.app

## What it does today

- Three products, each with its own designer.
  - **Jersey:** name on the back, number on the front and back in four lettering styles (or the customer's own name and number artwork), each one draggable and resizable, plus the customer's own logo placed anywhere.
  - **Cap:** the customer's logo on the front panel.
  - **Ball:** engraved text or the customer's own artwork.
- Logo upload with checks: PNG only, up to 10 MB, and a warning when the image is under 1000 px.
- Front/back preview of the jersey that the customer can rotate.
- Bag with quantities and subtotal, kept in the browser so it survives a reload.
- English by default with a Spanish switch; the choice is remembered.
- Contact form for custom requests and an Instagram section with embedded reels.

## How it is built

- `index.html`: the whole storefront in plain HTML, CSS and JavaScript, with no framework.
- `api/upload.js`: a Vercel Function that gives the browser a short-lived token, so a customer's PNG goes straight to Vercel Blob storage.
- `api/designs.js`: a Vercel Function that checks a design and saves it in a Postgres database (Neon), and reads it back by id.
- `lib/design.js`: the rules a design must pass before it is saved.
- `vendor/blob-client.js`: the browser upload helper, bundled from `src/blob-client.js` with `npm run build:vendor`.

The repository is connected to Vercel, so every change merged into `main` is published automatically.
Storage keys live only in the Vercel project settings (`BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`); they are never in this repository.

## Not built yet

It does not take payments or create orders yet. Prices are placeholders.
Uploads are open to any visitor (PNG only, up to 10 MB each), with no rate limit yet.

## Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| 0 | Repository on GitHub with automatic deploys on Vercel | Done |
| 1 | Prices, persistent bag, English/Spanish, contact form | Done |
| 2 | Save designs and uploaded logos | Done |
| 3 | Payments | Next |
| 4 | Private order dashboard | Planned |
| 5 | Order and shipping emails | Planned |
| 6 | Marketing: newsletter, discount codes, analytics | Planned |
| 7 | Go live: real payments, policies, custom domain | Planned |
