# BYX Names

A simple, mobile-friendly web app for learning everyone's name, major,
housing, and hometown. No build step, no dependencies — just open
`index.html` (or serve the folder) in a browser.

This repo contains real names and photos, so the deployed site sits
behind a password gate (see [Access & hosting](#access--hosting)
below) — but the underlying repo, and anything in it, is only as
private as GitHub lets it be. Don't treat the password as real
security.

## Modes

- **Gallery** — a grid of photo cards (photo, name, major, housing,
  hometown). Tap a card to expand it in place and reveal the details
  below the name. Multiple cards can stay open at once. Adjust the
  number of columns (1–4) with the slider, and search/filter by name,
  major, housing, or hometown.
- **Flashcards** — one person at a time, photo only on the front so
  you can test yourself. Tap the card to flip and reveal the name and
  details. Step through with Previous/Next or shuffle the deck.
- **Test** — quiz mode. Shows a face and asks for first name, last
  name, major, housing, and hometown (multiple choice), then moves to
  the next person. Choose a short round or the whole roster, and get a
  score + missed-answer review at the end.
- **Match** — a matching game: tap a face, then tap the name you
  think goes with it. Pick a round size and start a new round anytime.
- **List** — a plain, searchable, sortable reference table of
  everyone's info, for quick lookup or old-school studying.

## Roster data

`js/data.js` holds the BYX Pledge Class 2026 roster (name, major,
housing, hometown, photo) parsed from `BYX_Pledge_Class_2026.pdf`.
Photos live in `assets/photos/`, resized/compressed for the web. If a
photo is ever missing or fails to load, the app automatically falls
back to a plain initials avatar, so nothing breaks.

To update or correct an entry, edit its object in the `PEOPLE` array in
`js/data.js` — each one follows this shape:

```js
{
  id:        1,
  firstName: "Jane",
  lastName:  "Doe",
  major:     "Biology",
  housing:   "Founders Hall",
  hometown:  "Dallas, TX",
  photo:     "assets/photos/jane-doe.jpg", // or "" for a placeholder avatar
  facePos:   "50% 35%" // optional; see note below
}
```

`facePos` is a CSS `object-position` value that biases the photo's
crop toward the person's face (auto-detected with OpenCV since these
are casual, uncropped photos) instead of a plain center-crop. It's a
best effort — if a specific photo still looks off, nudge the
percentages by eye (`"50% 20%"` moves the visible crop window up,
toward the top of the photo) or delete the field to fall back to a
sensible default.

> **Note:** this repo contains real names and photos of pledge class
> members. Keep the repository private, and check with the group
> before making it public.

## Running locally

Just open `index.html` directly in a browser, or serve the folder with
any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` — you'll need the password (see
below) since the whole app, including its data and photos, only loads
after it's entered.

## Access & hosting

The site is gated by a password screen (`js/auth.js`) before anything
in the roster — script, data, or photos — is even requested. This is
a casual deterrent, not real security: it's a static site with no
server, so anyone who opens devtools can still get at the underlying
files. Change the shipped placeholder password before sharing the
link — instructions are in the comment at the top of `js/auth.js`.

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
publishes this site to GitHub Pages automatically on every push to
`main` or `claude/name-learning-app-i6l2oe`. Two things to know:

- **GitHub Pages requires a public repo** on the free plan (private
  repo + Pages needs GitHub Pro or an org on Team/Enterprise).
- **The published site is a public URL either way** — repo privacy
  doesn't restrict who can load the deployed Pages site, only who can
  browse the repo itself. The password gate above is what actually
  keeps casual visitors out; a `noindex` tag keeps it out of search
  results.

One-time setup (repo owner only), once you've decided on repo
visibility: go to **Settings → Pages** and, under **Build and
deployment → Source**, choose **GitHub Actions**. After that, every
push deploys automatically to
`https://joshiscode.github.io/BYX-Names/`.
