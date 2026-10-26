# BYX Names

A simple, mobile-friendly web app for learning everyone's name, major,
housing, and hometown. No build step, no dependencies — just open
`index.html` (or serve the folder) in a browser.

This repo contains real names and photos of pledge class members and
actives — there's no password or login, so anyone with the link (or
repo access) can see it. See [Access & hosting](#access--hosting)
below.

## Studying a subset

The **Studying:** dropdown at the top applies to every mode at once:

| Option | Who |
| --- | --- |
| Everyone | both rosters (188) |
| Pledge class | the pledge class (72) |
| Sanders → Whitefield — test range | pledge ids 1–36 |
| Hernandez → Priebe — the other 36 | pledge ids 37–72 |
| Actives | the actives (116) |
| Actives: Ty Boatright → Jake Boatright | active ids 1001–1065 (65) |
| Actives: Braden → Zapoli — the rest | active ids 1066–1116 (51) |

It's remembered per-browser. The dropdown is built from `RANGES` in
`js/scope.js`, counts included, so adding another named range later
(e.g. once a new test range is announced) means adding one entry
there and nothing else.

The two rosters hold different amounts of information: the pledge
class has major, housing, and hometown; the actives are face-to-name
only. Anything that depends on those details — the gallery's
expandable cards, the list's columns, Learn/Test questions about a
major, Match's "match with" choices — quietly drops out for people
who don't have them, so an actives-only scope is purely faces and
names.

## Modes

- **Gallery** — a grid of photo cards (photo, name, major, housing,
  hometown). Tap a card to expand it in place and reveal the details
  below the name. Multiple cards can stay open at once. Adjust the
  number of columns (1–4) with the slider, and search/filter by name,
  major, housing, or hometown.
- **Flashcards** — one person at a time, photo only on the front so
  you can test yourself. Tap the card to flip and reveal the name and
  details. Step through with Previous/Next or shuffle the deck.
- **Learn** — Quizlet-style, in small batches: see a photo, then
  answer a question about their name, major, housing, or hometown —
  a random mix of multiple choice and typed-answer questions,
  auto-graded (typed name answers need the full first and last name).
  A missed typed question requires correctly retyping the answer
  before it will move on. Missed questions come back around later in
  the same set; once you've gotten everyone right, move to the next
  set. Ends with a summary of anyone who took more than one try.
  Progress is remembered per-browser: anything answered right on the
  first try is marked mastered and won't come up again in a future
  session, and closing the tab mid-set offers a "Resume where you
  left off" button next time. A "Reset progress" button clears it all
  and starts fresh.
- **Test** — quiz mode. Shows a face and asks for first name, last
  name, major, housing, and hometown, then moves to the next person.
  Choose a short round or the whole roster, answer as multiple choice
  or type the answers yourself, and get a score + missed-answer
  review at the end.
- **Match** — a matching game: tap a face, then tap the info you
  think goes with it — name, major, housing, or hometown. Pick a
  round size and what to match on, and start a new round anytime.
  (When matching on major/housing/hometown, only one person per
  distinct value is included in a round, so no two tiles ever show
  the same text.)
- **List** — a plain, searchable, sortable reference table of
  everyone's info, for quick lookup or old-school studying. Columns
  nobody in the current study set has (the actives' major, housing,
  and hometown) are hidden instead of sitting there empty.

## Roster data

Two files, one per roster, combined by `js/scope.js`:

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

`js/data-actives.js` holds the actives, extracted from the
"BYX Actives Test 2026" slide deck — one slide per person: a name and
a photo, nothing else. (The deck itself isn't in the repo; it's 67 MB.)
Entries carry no major/housing/hometown, so they only need three
fields:

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

Then visit `http://localhost:8000`.

## Access & hosting

There's no password or login — the app loads straight in, for anyone
with the link. A `noindex`/`nofollow` tag keeps it out of search
results, but that's not access control, just a courtesy against
accidental discovery.

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
publishes this site to GitHub Pages automatically on every push to
`main` or `claude/name-learning-app-i6l2oe`. Two things to know:

- **GitHub Pages requires a public repo** on the free plan (private
  repo + Pages needs GitHub Pro or an org on Team/Enterprise).
- **The published site is a public URL either way** — repo privacy
  doesn't restrict who can load the deployed Pages site, only who can
  browse the repo itself.

If you want real access control back, the previous password-gate
implementation (a client-side SHA-256 check before the roster's
script/data/photos ever load) is still in git history — see the
`js/auth.js` file as it existed before this was removed.

One-time setup (repo owner only), once you've decided on repo
visibility: go to **Settings → Pages** and, under **Build and
deployment → Source**, choose **GitHub Actions**. After that, every
push deploys automatically to
`https://joshiscode.github.io/BYX-Names/`.
