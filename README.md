# BYX Names

A simple, mobile-friendly web app for learning everyone's name, major,
housing, and hometown. No build step, no dependencies — just open
`index.html` (or serve the folder) in a browser.

## Modes

- **🖼️ Gallery** — a grid of faces. Tap a face to flip it open in place
  and reveal major, housing, and hometown, right next to the others.
  Multiple cards can stay open at once. Adjust the number of columns
  with the slider, and search/filter by name, major, housing, or
  hometown.
- **🗂️ Flashcards** — one person at a time. Tap the card to flip
  between the face and the details. Step through with Prev/Next or
  shuffle the deck.
- **✅ Test** — quiz mode. Shows a face and asks for first name, last
  name, major, housing, and hometown (multiple choice), then moves to
  the next person. Choose a short round or the whole roster, and get a
  score + missed-answer review at the end.
- **🔗 Match** — a matching game: tap a face, then tap the name you
  think goes with it. Pick a round size and start a new round anytime.
- **📋 List** — a plain, searchable, sortable reference table of
  everyone's info, for quick lookup or old-school studying.

## Adding real data

Right now `js/data.js` is filled with **placeholder** names, majors,
housing, and hometowns so the app can be built and tested before the
real roster is available.

To load the real roster:

1. Open `js/data.js`.
2. Replace the entries in the `PEOPLE` array, keeping the same shape:

   ```js
   {
     id:        1,
     firstName: "Jane",
     lastName:  "Doe",
     major:     "Biology",
     housing:   "Founders Hall",
     hometown:  "Dallas, TX",
     photo:     "assets/photos/jane-doe.jpg" // or "" for a placeholder avatar
   }
   ```

3. (Optional) Drop real photos into `assets/photos/` and point `photo`
   at the file. If a photo is missing or fails to load, the app
   automatically falls back to a colored initials avatar, so nothing
   breaks while photos are still being collected.

## Running locally

Just open `index.html` directly in a browser, or serve the folder with
any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
