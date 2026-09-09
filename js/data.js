/**
 * BYX Pledge Class 2026 roster.
 *
 * Source: BYX_Pledge_Class_2026.pdf. Photos live in assets/photos/.
 * If a photo is missing or fails to load, the app automatically falls
 * back to a plain initials avatar — see js/utils.js.
 *
 * Entry shape:
 *   { id, firstName, lastName, major, housing, hometown, photo, facePos }
 *
 * `facePos` is a CSS object-position value ("X% Y%") biasing the
 * cover-crop toward the person's face — auto-detected (OpenCV Haar
 * cascade) since these are casual, uncropped photos. It's a best
 * effort, not perfect: if a specific photo still crops oddly, just
 * nudge or remove its facePos by eye (removing it falls back to a
 * sensible default in js/utils.js).
 */

const PEOPLE = [
  { id: 1, firstName: "Sanders", lastName: "Wiggins", major: "Business", housing: "Callaway House", hometown: "Texarkana, Texas", photo: "assets/photos/sanders-wiggins.jpg", facePos: "50% 38%" },
  { id: 2, firstName: "Maddox", lastName: "Montgomery", major: "Business", housing: "Villas on Rio", hometown: "Austin, Texas", photo: "assets/photos/maddox-montgomery.jpg", facePos: "49.8% 45.6%" },
  { id: 3, firstName: "Henry", lastName: "Lanier", major: "Business", housing: "Villas on Rio", hometown: "Houston, Texas", photo: "assets/photos/henry-lanier.jpg", facePos: "75.0% 65%" },
  { id: 4, firstName: "Kyle", lastName: "Kreuz", major: "Neuroscience", housing: "Callaway House", hometown: "Austin, Texas", photo: "assets/photos/kyle-kreuz.jpg", facePos: "50.8% 29.2%" },
  { id: 5, firstName: "Crawford", lastName: "Heininger", major: "Environmental Science", housing: "The Castilian", hometown: "Austin, Texas", photo: "assets/photos/crawford-heininger.jpg", facePos: "50% 38%" },
  { id: 6, firstName: "Taylor", lastName: "Mackey", major: "Mechanical Engineering", housing: "Moontower", hometown: "Dallas, Texas", photo: "assets/photos/taylor-mackey.jpg", facePos: "41.4% 30.8%" },
  { id: 7, firstName: "Simon", lastName: "Pate", major: "Economics (BS)", housing: "The Callaway House", hometown: "Fort Worth, Texas", photo: "assets/photos/simon-pate.jpg", facePos: "78.8% 46.2%" },
  { id: 8, firstName: "Bobby", lastName: "Frazer", major: "Journalism", housing: "Castillian", hometown: "Austin, Texas", photo: "assets/photos/bobby-frazer.jpg", facePos: "51.3% 30.7%" },
  { id: 9, firstName: "William", lastName: "Marrs", major: "Biology", housing: "Duren", hometown: "Houston, Texas", photo: "assets/photos/william-marrs.jpg", facePos: "45.3% 42.2%" },
  { id: 10, firstName: "Caleb", lastName: "Karr", major: "Computer Science", housing: "Jester East", hometown: "Austin, Texas", photo: "assets/photos/caleb-karr.jpg", facePos: "51.9% 20.6%" },
  { id: 11, firstName: "Joshua", lastName: "Karr", major: "Computer Science", housing: "Jester East", hometown: "Austin, Texas", photo: "assets/photos/joshua-karr.jpg", facePos: "32.2% 26.6%" },
  { id: 12, firstName: "Stephen", lastName: "Pipkin", major: "Business", housing: "Jester West", hometown: "Houston, Texas", photo: "assets/photos/stephen-pipkin.jpg", facePos: "50% 38%" },
  { id: 13, firstName: "Mark", lastName: "Meloy", major: "Petroleum Engineer", housing: "Callaway House", hometown: "Houston, Texas", photo: "assets/photos/mark-meloy.jpg", facePos: "50.1% 52.4%" },
  { id: 14, firstName: "Jackson", lastName: "Winton", major: "Business", housing: "Moore-Hill", hometown: "Dallas, TX", photo: "assets/photos/jackson-winton.jpg", facePos: "51.9% 26.8%" },
  { id: 15, firstName: "Harrison", lastName: "Hayes", major: "Communications", housing: "Callaway House", hometown: "Fort Worth", photo: "assets/photos/harrison-hayes.jpg", facePos: "48.1% 65%" },
  { id: 16, firstName: "Rodrigo", lastName: "Arista", major: "Advertising", housing: "Waterloo", hometown: "Mexico City", photo: "assets/photos/rodrigo-arista.jpg", facePos: "20% 35.9%" },
  { id: 17, firstName: "Ty", lastName: "Bergeson", major: "Business", housing: "Castilian", hometown: "Georgetown (Austin)", photo: "assets/photos/ty-bergeson.jpg", facePos: "46.5% 22.2%" },
  { id: 18, firstName: "Matthew", lastName: "Holloway", major: "Business", housing: "Callaway", hometown: "Dallas", photo: "assets/photos/matthew-holloway.jpg", facePos: "48.2% 23.3%" },
  { id: 19, firstName: "Lawson", lastName: "Young", major: "Public Affairs", housing: "Callaway House", hometown: "Tuscaloosa, Alabama", photo: "assets/photos/lawson-young.jpg", facePos: "62.9% 65%" },
  { id: 20, firstName: "Dylan", lastName: "Jones", major: "Kinesiology", housing: "Jester East", hometown: "Fort Worth, TX", photo: "assets/photos/dylan-jones.jpg", facePos: "56.1% 55.6%" },
  { id: 21, firstName: "Landon", lastName: "Meyer", major: "Petroleum Engineering", housing: "Duren", hometown: "Austin,Texas", photo: "assets/photos/landon-meyer.jpg", facePos: "55.5% 35.4%" },
  { id: 22, firstName: "Richard", lastName: "Geng", major: "Petroleum Engineering", housing: "Union on 24th", hometown: "Austin, TX", photo: "assets/photos/richard-geng.jpg", facePos: "47.4% 16.8%" },
  { id: 23, firstName: "Jacob", lastName: "Gunn", major: "Public Affairs", housing: "San Jac", hometown: "Houston Texas", photo: "assets/photos/jacob-gunn.jpg", facePos: "50% 38%" },
  { id: 24, firstName: "Ben", lastName: "Harp", major: "CAP Program", housing: "Villas on Rio", hometown: "Houston, Texas", photo: "assets/photos/ben-harp.jpg", facePos: "50% 38%" },
  { id: 25, firstName: "Levi", lastName: "Smith", major: "Art", housing: "Moore hill", hometown: "San Antonio, TX", photo: "assets/photos/levi-smith.jpg", facePos: "50% 38%" },
  { id: 26, firstName: "Ben", lastName: "Soto", major: "Business", housing: "San Jacinto Hall", hometown: "Houston, TX", photo: "assets/photos/ben-soto.jpg", facePos: "54.6% 22.1%" },
  { id: 27, firstName: "Finn", lastName: "Dooley", major: "Business", housing: "Castilian", hometown: "Dallas", photo: "assets/photos/finn-dooley.jpg", facePos: "50.3% 36.7%" },
  { id: 28, firstName: "Rhett", lastName: "Brindley", major: "Business", housing: "Villas on Rio", hometown: "Houston, Texas", photo: "assets/photos/rhett-brindley.jpg", facePos: "44.9% 23.6%" },
  { id: 29, firstName: "Stuart", lastName: "Haney", major: "Business", housing: "Living at home", hometown: "Buda, Tx", photo: "assets/photos/stuart-haney.jpg", facePos: "44.5% 24.6%" },
  { id: 30, firstName: "Ryder", lastName: "Toothman", major: "Biology", housing: "San Jacinto", hometown: "Dallas", photo: "assets/photos/ryder-toothman.jpg", facePos: "47.3% 23.1%" },
  { id: 31, firstName: "Alex", lastName: "Parsons", major: "Radio-Film-TV", housing: "Castilian", hometown: "Fort Worth", photo: "assets/photos/alex-parsons.jpg", facePos: "49.0% 44.7%" },
  { id: 32, firstName: "Jake", lastName: "Williams", major: "Business", housing: "Villas on Rio", hometown: "Houston", photo: "assets/photos/jake-williams.jpg", facePos: "43.9% 27.1%" },
  { id: 33, firstName: "Griffin", lastName: "Donnelly", major: "Business", housing: "Callaway", hometown: "Austin", photo: "assets/photos/griffin-donnelly.jpg", facePos: "50.8% 30.1%" },
  { id: 34, firstName: "Luke", lastName: "Srubar", major: "Chemical Engineering", housing: "Montgomery House", hometown: "Houston", photo: "assets/photos/luke-srubar.jpg", facePos: "53.4% 45.6%" },
  { id: 35, firstName: "Vail", lastName: "Kleinpeter", major: "Advertising", housing: "Blanton", hometown: "Boerne", photo: "assets/photos/vail-kleinpeter.jpg", facePos: "45.0% 23.7%" },
  { id: 36, firstName: "Whitefield", lastName: "Powell", major: "Classics", housing: "Union on 24th", hometown: "Austin", photo: "assets/photos/whitefield-powell.jpg", facePos: "50% 38%" },
  { id: 37, firstName: "Felipe", lastName: "Hernandez", major: "Economics", housing: "Skyloft", hometown: "Houston, TX", photo: "assets/photos/felipe-hernandez.jpg", facePos: "49.0% 46.4%" },
  { id: 38, firstName: "Thorsten", lastName: "Pfeiffer", major: "Advertising", housing: "Waterloo", hometown: "Princeton, NJ", photo: "assets/photos/thorsten-pfeiffer.jpg", facePos: "45.8% 33.4%" },
  { id: 39, firstName: "Ephrem", lastName: "Ryan", major: "Communications", housing: "Callaway", hometown: "Austin, Tx", photo: "assets/photos/ephrem-ryan.jpg", facePos: "38.6% 60.5%" },
  { id: 40, firstName: "Mitchell", lastName: "Lunsford", major: "Civics", housing: "San Jacinto", hometown: "Dallas TX", photo: "assets/photos/mitchell-lunsford.jpg", facePos: "65.8% 31.0%" },
  { id: 41, firstName: "Luke", lastName: "Brindley", major: "Business", housing: "Villas on Rio", hometown: "Houston, TX", photo: "assets/photos/luke-brindley.jpg", facePos: "51.2% 23.6%" },
  { id: 42, firstName: "Lincoln", lastName: "Leeser", major: "Civics", housing: "Castilian", hometown: "Houston TX", photo: "assets/photos/lincoln-leeser.jpg", facePos: "51.3% 42.0%" },
  { id: 43, firstName: "Caden", lastName: "Hutchison", major: "Business", housing: "Duren", hometown: "San Antonio, TX", photo: "assets/photos/caden-hutchison.jpg", facePos: "70.3% 27.1%" },
  { id: 44, firstName: "Reid", lastName: "Leipsner", major: "Human Dimensions of Organizations", housing: "Callaway", hometown: "Austin, TX", photo: "assets/photos/reid-leipsner.jpg", facePos: "51.1% 26.6%" },
  { id: 45, firstName: "Jackson", lastName: "Lueders", major: "Business", housing: "Callaway", hometown: "Austin TX", photo: "assets/photos/jackson-lueders.jpg", facePos: "44.5% 34.3%" },
  { id: 46, firstName: "Slaton", lastName: "Boothe", major: "Civics", housing: "Callaway", hometown: "Austin TX", photo: "assets/photos/slaton-boothe.jpg", facePos: "44.3% 32.9%" },
  { id: 47, firstName: "Preston", lastName: "Burks", major: "Health and society", housing: "The rise", hometown: "Dallas", photo: "assets/photos/preston-burks.jpg", facePos: "54.0% 44.1%" },
  { id: 48, firstName: "Ray", lastName: "Ugalde", major: "Geography", housing: "Block 25th E", hometown: "Houston, Tx", photo: "assets/photos/ray-ugalde.jpg", facePos: "36.4% 27.3%" },
  { id: 49, firstName: "George", lastName: "Eastland", major: "Civil Engineering", housing: "Brackenridge hall", hometown: "Kerrville, TX", photo: "assets/photos/george-eastland.jpg", facePos: "50% 38%" },
  { id: 50, firstName: "Nathan", lastName: "Griffin", major: "Psychology", housing: "Moorehill hall", hometown: "Houston tx", photo: "assets/photos/nathan-griffin.jpg", facePos: "50.1% 40.4%" },
  { id: 51, firstName: "Micah", lastName: "Hinson", major: "Petroleum Engineering", housing: "Brackenridge Hall", hometown: "Dallas, Texas", photo: "assets/photos/micah-hinson.jpg", facePos: "46.7% 37.3%" },
  { id: 52, firstName: "Colby", lastName: "Wilks", major: "Mechanical Engineer", housing: "San Jacinto", hometown: "Dallas, Texas", photo: "assets/photos/colby-wilks.jpg", facePos: "50.0% 27.2%" },
  { id: 53, firstName: "Harrison", lastName: "Penn", major: "Business", housing: "Villas on Rio", hometown: "Jacksonville, Tx", photo: "assets/photos/harrison-penn.jpg", facePos: "30.9% 44.2%" },
  { id: 54, firstName: "Carter", lastName: "Shelton", major: "Biology", housing: "Montgomery House", hometown: "Houston, Tx", photo: "assets/photos/carter-shelton.jpg", facePos: "40.3% 49.5%" },
  { id: 55, firstName: "Cade", lastName: "Reeves", major: "Civil Engineering", housing: "Jester", hometown: "Austin, TX", photo: "assets/photos/cade-reeves.jpg", facePos: "47.5% 29.8%" },
  { id: 56, firstName: "Crockett", lastName: "Berry", major: "Education", housing: "Villas on Rio", hometown: "Houston", photo: "assets/photos/crockett-berry.jpg", facePos: "50% 38%" },
  { id: 57, firstName: "Canyon", lastName: "Shaw", major: "Sport Management", housing: "Callaway House", hometown: "Austin", photo: "assets/photos/canyon-shaw.jpg", facePos: "28.2% 52.4%" },
  { id: 58, firstName: "Jackson", lastName: "Adams", major: "Business", housing: "Callaway", hometown: "Texarkana", photo: "assets/photos/jackson-adams.jpg", facePos: "49.2% 34.8%" },
  { id: 59, firstName: "Dru", lastName: "Allen", major: "Business", housing: "MoonTower", hometown: "Dallas Texas", photo: "assets/photos/dru-allen.jpg", facePos: "53.9% 33.4%" },
  { id: 60, firstName: "Isaac", lastName: "Franco", major: "Business", housing: "Home", hometown: "Buda TX", photo: "assets/photos/isaac-franco.jpg", facePos: "49.4% 40.2%" },
  { id: 61, firstName: "Cade", lastName: "Tingle", major: "International Relations", housing: "Torre", hometown: "Austin, Tx", photo: "assets/photos/cade-tingle.jpg", facePos: "50% 38%" },
  { id: 62, firstName: "Joseph", lastName: "Uribe", major: "Government", housing: "Jester East", hometown: "Rio Grande Valley (RGV)", photo: "assets/photos/joseph-uribe.jpg", facePos: "56.1% 21.1%" },
  { id: 63, firstName: "Logan", lastName: "Lewis", major: "Human Dimensions of Organizations", housing: "Blanton", hometown: "San Antonio", photo: "assets/photos/logan-lewis.jpg", facePos: "61.0% 18.2%" },
  { id: 64, firstName: "Cesar", lastName: "Garcia", major: "Biology", housing: "Villas on 26th", hometown: "San Antonio", photo: "assets/photos/cesar-garcia.jpg", facePos: "70.2% 16.1%" },
  { id: 65, firstName: "Maxwell", lastName: "McKee", major: "Business", housing: "Villas on Rio", hometown: "Houston", photo: "assets/photos/maxwell-mckee.jpg", facePos: "49.7% 24.1%" },
  { id: 66, firstName: "Bear", lastName: "Griesemer", major: "Civic Honors", housing: "Callaway", hometown: "Waco, TX", photo: "assets/photos/bear-griesemer.jpg", facePos: "47.4% 24.8%" },
  { id: 67, firstName: "Kash", lastName: "Roberts", major: "CLD", housing: "Skyloft", hometown: "Dallas", photo: "assets/photos/kash-roberts.jpg", facePos: "51.8% 22.7%" },
  { id: 68, firstName: "Daly", lastName: "Ryder", major: "Electrical Engineering", housing: "The Standard", hometown: "Dallas", photo: "assets/photos/daly-ryder.jpg", facePos: "58.2% 17.2%" },
  { id: 69, firstName: "Amey", lastName: "Jha", major: "Communication and leadership", housing: "The Standard", hometown: "Scarsdale, New York", photo: "assets/photos/amey-jha.jpg", facePos: "34.9% 38.7%" },
  { id: 70, firstName: "Walker", lastName: "Hanks", major: "Business Major", housing: "Callaway House", hometown: "Houston, Texas", photo: "assets/photos/walker-hanks.jpg", facePos: "31.6% 43.6%" },
  { id: 71, firstName: "Tito", lastName: "Siewczynski", major: "Economics (BA)", housing: "The Quarters", hometown: "Dallas, TX", photo: "assets/photos/tito-siewczynski.jpg", facePos: "50.1% 45.1%" },
  { id: 72, firstName: "Seth", lastName: "Priebe", major: "Economics", housing: "Castilian", hometown: "Austin, TX", photo: "assets/photos/seth-priebe.jpg", facePos: "36.0% 38.9%" },
];
