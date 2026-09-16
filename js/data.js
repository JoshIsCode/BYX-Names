/**
 * BYX Pledge Class 2026 roster.
 *
 * Source: BYX_Pledge_Class_2026.pdf. Photos live in assets/photos/.
 * If a photo is missing or fails to load, the app automatically falls
 * back to a plain initials avatar — see js/utils.js.
 *
 * Entry shape:
 *   { id, firstName, lastName, major, housing, hometown, photo, facePos, faceZoom }
 *
 * `facePos` and `faceZoom` are auto-detected (OpenCV's YuNet face
 * detector) since these are casual, uncropped photos — most are full
 * body or waist-up shots, not headshots.
 *   - `facePos` is a CSS object-position value ("X% Y%") biasing the
 *     cover-crop toward the person's head (the raw face box expanded
 *     a bit above/below/around so hair and chin aren't clipped),
 *     clamped to a shared vertical band (10%-45%) so every card crops
 *     with the same amount of headroom.
 *   - `faceZoom` is a CSS transform: scale() factor (applied in
 *     js/utils.js, anchored at facePos) that zooms in so the head
 *     actually fills the frame instead of just being centered in an
 *     otherwise-unchanged crop. It targets a consistent head-width
 *     across cards, capped at 2.6x so very distant shots don't blow
 *     up into a blurry mess — a handful of extreme photos (subject
 *     very far away, or already a tight close-up with nowhere to
 *     zoom out to) still won't quite match the rest.
 * Both are a best effort, not perfect: if a specific photo still
 * crops oddly, nudge facePos/faceZoom by eye, or remove them (that
 * falls back to sensible defaults in js/utils.js). A few group-photo
 * entries were hand-picked since the largest detected face wasn't the
 * pledge — see henry-lanier for one that's still ambiguous.
 */

const PEOPLE = [
  { id: 1, firstName: "Sanders", lastName: "Wiggins", major: "Business", housing: "Callaway House", hometown: "Texarkana, TX", photo: "assets/photos/sanders-wiggins.jpg", facePos: "51.9% 26.8%", faceZoom: 2.6 },
  { id: 2, firstName: "Maddox", lastName: "Montgomery", major: "Business", housing: "Villas on Rio", hometown: "Austin, TX", photo: "assets/photos/maddox-montgomery.jpg", facePos: "50.3% 39.1%", faceZoom: 1.0 },
  { id: 3, firstName: "Henry", lastName: "Lanier", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/henry-lanier.jpg", facePos: "58.2% 45%", faceZoom: 2.6 },
  { id: 4, firstName: "Kyle", lastName: "Kreuz", major: "Neuroscience", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/kyle-kreuz.jpg", facePos: "50.5% 27.1%", faceZoom: 1.18 },
  { id: 5, firstName: "Crawford", lastName: "Heininger", major: "Environmental Science", housing: "The Castilian", hometown: "Austin, TX", photo: "assets/photos/crawford-heininger.jpg", facePos: "60.7% 25.1%", faceZoom: 2.6 },
  { id: 6, firstName: "Taylor", lastName: "Mackey", major: "Mechanical Engineering", housing: "Moontower", hometown: "Dallas, TX", photo: "assets/photos/taylor-mackey.jpg", facePos: "41.9% 29.1%", faceZoom: 2.08 },
  { id: 7, firstName: "Simon", lastName: "Pate", major: "Economics (BS)", housing: "Callaway House", hometown: "Fort Worth, TX", photo: "assets/photos/simon-pate.jpg", facePos: "52.4% 45%", faceZoom: 2.28 },
  { id: 8, firstName: "Bobby", lastName: "Frazer", major: "Journalism", housing: "The Castilian", hometown: "Austin, TX", photo: "assets/photos/bobby-frazer.jpg", facePos: "50.6% 28.4%", faceZoom: 1.79 },
  { id: 9, firstName: "William", lastName: "Marrs", major: "Biology", housing: "Duren", hometown: "Houston, TX", photo: "assets/photos/william-marrs.jpg", facePos: "49.1% 40.1%", faceZoom: 1.0 },
  { id: 10, firstName: "Caleb", lastName: "Karr", major: "Computer Science", housing: "Jester East", hometown: "Austin, TX", photo: "assets/photos/caleb-karr.jpg", facePos: "50.9% 19.0%", faceZoom: 1.85 },
  { id: 11, firstName: "Joshua", lastName: "Karr", major: "Computer Science", housing: "Jester East", hometown: "Austin, TX", photo: "assets/photos/joshua-karr.jpg", facePos: "31.8% 24.2%", faceZoom: 1.65 },
  { id: 12, firstName: "Stephen", lastName: "Pipkin", major: "Business", housing: "Jester West", hometown: "Houston, TX", photo: "assets/photos/stephen-pipkin.jpg", facePos: "82.4% 36.8%", faceZoom: 2.6 },
  { id: 13, firstName: "Mark", lastName: "Meloy", major: "Petroleum Engineer", housing: "Callaway House", hometown: "Houston, TX", photo: "assets/photos/mark-meloy.jpg", facePos: "49.8% 45%", faceZoom: 1.44 },
  { id: 14, firstName: "Jackson", lastName: "Winton", major: "Business", housing: "Moore-Hill Hall", hometown: "Dallas, TX", photo: "assets/photos/jackson-winton.jpg", facePos: "52.2% 25.3%", faceZoom: 1.96 },
  { id: 15, firstName: "Harrison", lastName: "Hayes", major: "Communications", housing: "Callaway House", hometown: "Fort Worth, TX", photo: "assets/photos/harrison-hayes.jpg", facePos: "49.1% 12.5%", faceZoom: 1.68 },
  { id: 16, firstName: "Rodrigo", lastName: "Arista", major: "Advertising", housing: "Waterloo", hometown: "Mexico City, Mexico", photo: "assets/photos/rodrigo-arista.jpg", facePos: "17.9% 34.2%", faceZoom: 2.11 },
  { id: 17, firstName: "Ty", lastName: "Bergeson", major: "Business", housing: "The Castilian", hometown: "Georgetown, TX", photo: "assets/photos/ty-bergeson.jpg", facePos: "47.1% 20.5%", faceZoom: 1.55 },
  { id: 18, firstName: "Matthew", lastName: "Holloway", major: "Business", housing: "Callaway House", hometown: "Dallas, TX", photo: "assets/photos/matthew-holloway.jpg", facePos: "47.7% 22.2%", faceZoom: 2.6 },
  { id: 19, firstName: "Lawson", lastName: "Young", major: "Public Affairs", housing: "Callaway House", hometown: "Tuscaloosa, AL", photo: "assets/photos/lawson-young.jpg", facePos: "45.3% 35.4%", faceZoom: 2.56 },
  { id: 20, firstName: "Dylan", lastName: "Jones", major: "Kinesiology", housing: "Jester East", hometown: "Fort Worth, TX", photo: "assets/photos/dylan-jones.jpg", facePos: "56.9% 16.5%", faceZoom: 2.6 },
  { id: 21, firstName: "Landon", lastName: "Meyer", major: "Petroleum Engineering", housing: "Duren", hometown: "Austin, TX", photo: "assets/photos/landon-meyer.jpg", facePos: "53.5% 31.2%", faceZoom: 1.0 },
  { id: 22, firstName: "Richard", lastName: "Geng", major: "Petroleum Engineering", housing: "Union on 24th", hometown: "Austin, TX", photo: "assets/photos/richard-geng.jpg", facePos: "47.7% 15.5%", faceZoom: 1.44 },
  { id: 23, firstName: "Jacob", lastName: "Gunn", major: "Public Affairs", housing: "San Jacinto Hall", hometown: "Houston, TX", photo: "assets/photos/jacob-gunn.jpg", facePos: "49.4% 44.8%", faceZoom: 2.6 },
  { id: 24, firstName: "Ben", lastName: "Harp", major: "CAP Program", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/ben-harp.jpg", facePos: "53.1% 23.4%", faceZoom: 1.68 },
  { id: 25, firstName: "Levi", lastName: "Smith", major: "Art", housing: "Moore-Hill Hall", hometown: "San Antonio, TX", photo: "assets/photos/levi-smith.jpg", facePos: "44.9% 45%", faceZoom: 1.0 },
  { id: 26, firstName: "Ben", lastName: "Soto", major: "Business", housing: "San Jacinto Hall", hometown: "Houston, TX", photo: "assets/photos/ben-soto.jpg", facePos: "62.1% 43.4%", faceZoom: 2.54 },
  { id: 27, firstName: "Finn", lastName: "Dooley", major: "Business", housing: "The Castilian", hometown: "Dallas, TX", photo: "assets/photos/finn-dooley.jpg", facePos: "49.8% 31.6%", faceZoom: 1.0 },
  { id: 28, firstName: "Rhett", lastName: "Brindley", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/rhett-brindley.jpg", facePos: "48.9% 20.6%", faceZoom: 1.0 },
  { id: 29, firstName: "Stuart", lastName: "Haney", major: "Business", housing: "Living at Home", hometown: "Buda, TX", photo: "assets/photos/stuart-haney.jpg", facePos: "44.7% 23.6%", faceZoom: 1.77 },
  { id: 30, firstName: "Ryder", lastName: "Toothman", major: "Biology", housing: "San Jacinto Hall", hometown: "Dallas, TX", photo: "assets/photos/ryder-toothman.jpg", facePos: "48.9% 21.5%", faceZoom: 1.61 },
  { id: 31, firstName: "Alex", lastName: "Parsons", major: "Radio-Film-TV", housing: "The Castilian", hometown: "Fort Worth, TX", photo: "assets/photos/alex-parsons.jpg", facePos: "47.2% 40.1%", faceZoom: 1.0 },
  { id: 32, firstName: "Jake", lastName: "Williams", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/jake-williams.jpg", facePos: "43.4% 23.2%", faceZoom: 1.04 },
  { id: 33, firstName: "Griffin", lastName: "Donnelly", major: "Business", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/griffin-donnelly.jpg", facePos: "50.5% 26.4%", faceZoom: 1.27 },
  { id: 34, firstName: "Luke", lastName: "Srubar", major: "Chemical Engineering", housing: "Montgomery House", hometown: "Houston, TX", photo: "assets/photos/luke-srubar.jpg", facePos: "52.3% 43.8%", faceZoom: 1.0 },
  { id: 35, firstName: "Vail", lastName: "Kleinpeter", major: "Advertising", housing: "Blanton", hometown: "Boerne, TX", photo: "assets/photos/vail-kleinpeter.jpg", facePos: "44.4% 21.5%", faceZoom: 1.0 },
  { id: 36, firstName: "Whitefield", lastName: "Powell", major: "Classics", housing: "Union on 24th", hometown: "Austin, TX", photo: "assets/photos/whitefield-powell.jpg", facePos: "39.3% 18.6%", faceZoom: 2.6 },
  { id: 37, firstName: "Felipe", lastName: "Hernandez", major: "Economics", housing: "Skyloft", hometown: "Houston, TX", photo: "assets/photos/felipe-hernandez.jpg", facePos: "48.8% 44.8%", faceZoom: 1.55 },
  { id: 38, firstName: "Thorsten", lastName: "Pfeiffer", major: "Advertising", housing: "Waterloo", hometown: "Princeton, NJ", photo: "assets/photos/thorsten-pfeiffer.jpg", facePos: "45.9% 31.7%", faceZoom: 1.76 },
  { id: 39, firstName: "Ephrem", lastName: "Ryan", major: "Communications", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/ephrem-ryan.jpg", facePos: "61.7% 42.8%", faceZoom: 2.11 },
  { id: 40, firstName: "Mitchell", lastName: "Lunsford", major: "Civics", housing: "San Jacinto Hall", hometown: "Dallas, TX", photo: "assets/photos/mitchell-lunsford.jpg", facePos: "66.2% 28.7%", faceZoom: 1.55 },
  { id: 41, firstName: "Luke", lastName: "Brindley", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/luke-brindley.jpg", facePos: "51.6% 20.9%", faceZoom: 1.59 },
  { id: 42, firstName: "Lincoln", lastName: "Leeser", major: "Civics", housing: "The Castilian", hometown: "Houston, TX", photo: "assets/photos/lincoln-leeser.jpg", facePos: "51.8% 39.9%", faceZoom: 1.0 },
  { id: 43, firstName: "Caden", lastName: "Hutchison", major: "Business", housing: "Duren", hometown: "San Antonio, TX", photo: "assets/photos/caden-hutchison.jpg", facePos: "70.1% 25.5%", faceZoom: 1.36 },
  { id: 44, firstName: "Reid", lastName: "Leipsner", major: "Human Dimensions of Organizations", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/reid-leipsner.jpg", facePos: "51.4% 25.0%", faceZoom: 1.47 },
  { id: 45, firstName: "Jackson", lastName: "Lueders", major: "Business", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/jackson-lueders.jpg", facePos: "44.9% 31.9%", faceZoom: 1.35 },
  { id: 46, firstName: "Slaton", lastName: "Boothe", major: "Civics", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/slaton-boothe.jpg", facePos: "43.7% 30.8%", faceZoom: 1.0 },
  { id: 47, firstName: "Preston", lastName: "Burks", major: "Health and society", housing: "The rise", hometown: "Dallas, TX", photo: "assets/photos/preston-burks.jpg", facePos: "53.8% 43.0%", faceZoom: 2.39 },
  { id: 48, firstName: "Ray", lastName: "Ugalde", major: "Geography", housing: "Block 25th E", hometown: "Houston, TX", photo: "assets/photos/ray-ugalde.jpg", facePos: "38.1% 25.7%", faceZoom: 1.05 },
  { id: 49, firstName: "George", lastName: "Eastland", major: "Civil Engineering", housing: "Brackenridge Hall", hometown: "Kerrville, TX", photo: "assets/photos/george-eastland.jpg", facePos: "17.7% 45%", faceZoom: 2.6 },
  { id: 50, firstName: "Nathan", lastName: "Griffin", major: "Psychology", housing: "Moore-Hill Hall", hometown: "Houston, TX", photo: "assets/photos/nathan-griffin.jpg", facePos: "49.5% 37.9%", faceZoom: 1.03 },
  { id: 51, firstName: "Micah", lastName: "Hinson", major: "Petroleum Engineering", housing: "Brackenridge Hall", hometown: "Dallas, TX", photo: "assets/photos/micah-hinson.jpg", facePos: "46.9% 34.6%", faceZoom: 1.69 },
  { id: 52, firstName: "Colby", lastName: "Wilks", major: "Mechanical Engineer", housing: "San Jacinto Hall", hometown: "Dallas, TX", photo: "assets/photos/colby-wilks.jpg", facePos: "49.9% 26.6%", faceZoom: 2.6 },
  { id: 53, firstName: "Harrison", lastName: "Penn", major: "Business", housing: "Villas on Rio", hometown: "Jacksonville, TX", photo: "assets/photos/harrison-penn.jpg", facePos: "30.3% 41.1%", faceZoom: 1.41 },
  { id: 54, firstName: "Carter", lastName: "Shelton", major: "Biology", housing: "Montgomery House", hometown: "Houston, TX", photo: "assets/photos/carter-shelton.jpg", facePos: "42.4% 45%", faceZoom: 1.0 },
  { id: 55, firstName: "Cade", lastName: "Reeves", major: "Civil Engineering", housing: "Jester", hometown: "Austin, TX", photo: "assets/photos/cade-reeves.jpg", facePos: "48.5% 28.5%", faceZoom: 1.79 },
  { id: 56, firstName: "Crockett", lastName: "Berry", major: "Education", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/crockett-berry.jpg", facePos: "49.7% 43.9%", faceZoom: 2.6 },
  { id: 57, firstName: "Canyon", lastName: "Shaw", major: "Sport Management", housing: "Callaway House", hometown: "Austin, TX", photo: "assets/photos/canyon-shaw.jpg", facePos: "27.1% 45%", faceZoom: 2.18 },
  { id: 58, firstName: "Jackson", lastName: "Adams", major: "Business", housing: "Callaway House", hometown: "Texarkana, TX", photo: "assets/photos/jackson-adams.jpg", facePos: "49.3% 33.1%", faceZoom: 1.02 },
  { id: 59, firstName: "Dru", lastName: "Allen", major: "Business", housing: "Moontower", hometown: "Dallas, TX", photo: "assets/photos/dru-allen.jpg", facePos: "54.1% 31.1%", faceZoom: 2.18 },
  { id: 60, firstName: "Isaac", lastName: "Franco", major: "Business", housing: "Living at Home", hometown: "Buda, TX", photo: "assets/photos/isaac-franco.jpg", facePos: "50.4% 38.2%", faceZoom: 1.47 },
  { id: 61, firstName: "Cade", lastName: "Tingle", major: "International Relations", housing: "Torre", hometown: "Austin, TX", photo: "assets/photos/cade-tingle.jpg", facePos: "42.5% 29.9%", faceZoom: 2.25 },
  { id: 62, firstName: "Joseph", lastName: "Uribe", major: "Government", housing: "Jester East", hometown: "Rio Grande Valley, TX", photo: "assets/photos/joseph-uribe.jpg", facePos: "56.4% 20.1%", faceZoom: 2.6 },
  { id: 63, firstName: "Logan", lastName: "Lewis", major: "Human Dimensions of Organizations", housing: "Blanton", hometown: "San Antonio, TX", photo: "assets/photos/logan-lewis.jpg", facePos: "60.9% 16.5%", faceZoom: 1.91 },
  { id: 64, firstName: "Cesar", lastName: "Garcia", major: "Biology", housing: "Villas on 26th", hometown: "San Antonio, TX", photo: "assets/photos/cesar-garcia.jpg", facePos: "69.9% 14.1%", faceZoom: 1.02 },
  { id: 65, firstName: "Maxwell", lastName: "McKee", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/maxwell-mckee.jpg", facePos: "48.8% 22.3%", faceZoom: 1.0 },
  { id: 66, firstName: "Bear", lastName: "Griesemer", major: "Civic Honors", housing: "Callaway House", hometown: "Waco, TX", photo: "assets/photos/bear-griesemer.jpg", facePos: "50.2% 23.1%", faceZoom: 1.0 },
  { id: 67, firstName: "Kash", lastName: "Roberts", major: "CLD", housing: "Skyloft", hometown: "Dallas, TX", photo: "assets/photos/kash-roberts.jpg", facePos: "51.9% 22.0%", faceZoom: 1.63 },
  { id: 68, firstName: "Daly", lastName: "Ryder", major: "Electrical Engineering", housing: "The Standard", hometown: "Dallas, TX", photo: "assets/photos/daly-ryder.jpg", facePos: "57.1% 14.7%", faceZoom: 1.0 },
  { id: 69, firstName: "Amey", lastName: "Jha", major: "Communication and leadership", housing: "The Standard", hometown: "Scarsdale, NY", photo: "assets/photos/amey-jha.jpg", facePos: "36.2% 36.9%", faceZoom: 1.0 },
  { id: 70, firstName: "Walker", lastName: "Hanks", major: "Business Major", housing: "Callaway House", hometown: "Houston, TX", photo: "assets/photos/walker-hanks.jpg", facePos: "68.8% 28.2%", faceZoom: 2.6 },
  { id: 71, firstName: "Tito", lastName: "Siewczynski", major: "Economics (BA)", housing: "The Quarters", hometown: "Dallas, TX", photo: "assets/photos/tito-siewczynski.jpg", facePos: "48.6% 42.2%", faceZoom: 1.0 },
  { id: 72, firstName: "Seth", lastName: "Priebe", major: "Economics", housing: "The Castilian", hometown: "Austin, TX", photo: "assets/photos/seth-priebe.jpg", facePos: "36.1% 36.5%", faceZoom: 1.32 },
];
