# BYX Names

A simple, mobile-friendly web app for learning everyone's name, major,
housing, and hometown. No build step, no dependencies — just open
`index.html` (or serve the folder) in a browser.

Two rosters live side by side, picked with the switch under the title:

- **Pledge Class** (72) — full details: name, major, housing, hometown.
- **Actives** (116) — face-to-name only; that's all the source deck had.
- **Everyone** (188) — both at once.

Every mode works with either, and anything that depends on details
(the gallery's expandable cards, the list's columns, the test's
major/housing/hometown questions) simply drops out for people who
don't have them.

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

Two files, one per group, combined by `js/roster.js`:

| File | Array | Who | Photos |
| --- | --- | --- | --- |
| `js/data.js` | `PEOPLE` | Pledge Class 2026, with details | `assets/photos/` |
| `js/data-actives.js` | `ACTIVES` | Actives, name + photo only | `assets/photos/actives/` |

If a photo is ever missing or fails to load, the app automatically
falls back to a plain initials avatar, so nothing breaks.

### Pledge class

`js/data.js` holds the BYX Pledge Class 2026 roster (name, major,
housing, hometown, photo) parsed from `BYX_Pledge_Class_2026.pdf`.
Photos live in `assets/photos/`, resized/compressed for the web.

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

### Actives

`js/data-actives.js` holds the actives, extracted from
`raw/BYX Actives Test 2026.pptx` (one slide per person: a name and a
photo, nothing else). Entries carry no major/housing/hometown, so they
only need three fields:

```js
{ id: 1001, firstName: "Jane", lastName: "Doe", photo: "assets/photos/actives/jane-doe.jpg" }
```

IDs start at 1001 so they can never collide with the pledge-class IDs.
Adding `major`, `housing`, or `hometown` to an entry is enough to make
that person's details show up everywhere — nothing else needs changing.

These photos are casual shots (group photos, selfies, action shots)
rather than posed roster pictures, so instead of nudging the crop in
CSS the way the pledge entries do, the crop is **baked into the image**:
each one was cropped to a 3:4 frame centred on the person's head
(OpenCV's YuNet face detector, largest and most central face) when it
was pulled out of the deck. That means no `facePos`/`faceZoom` on these
entries, and a replacement photo just needs to be a head-and-shoulders
crop to match. A handful of the slides are group photos where the
subject is genuinely ambiguous — if a card shows the wrong person,
re-crop that one photo by hand.

> **Note:** this repo contains real names and photos of pledge class
> members and actives. Keep the repository private, and check with the
> group before making it public.

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
