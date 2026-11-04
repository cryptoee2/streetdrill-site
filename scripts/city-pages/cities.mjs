/*
 * The cities that get a landing page at /cities/<slug>/ (build.mjs makes them). Researched November 2026.
 *
 * Every local fact here was checked against the source in the comment above it: the department's or city's
 * own pages first, then news and Wikipedia. Firefighters from these cities will read their page, so a fact we
 * couldn't confirm is left out rather than guessed: Canton's and Durant's station counts, and the address
 * grid of any city that doesn't publish one. Recheck a city's sources before changing its facts.
 *
 * Fields (HTML is allowed in the text, written by us):
 *   slug, city, state        slug matches packs/<slug>.json
 *   county                   for "address points ... where they cover <county>"
 *   dept                     the department's name; theDept for in-sentence use when "the <dept>" reads wrong
 *   notCity                  who else the page isn't affiliated with, when "the City of <city>" doesn't fit
 *   possessive               when "<city>'s" isn't right
 *   description              <meta> description, about 155 characters
 *   lede, deptLine           hero paragraph; the department paragraph under "<city> in StreetDrill"
 *   stationsFaq              the station fact in "Are <city>'s fire stations in it?" (optional)
 *   drillHeading, drillLede, drill[]   the "What you'll drill" cards: icon, title, body, games (the app's names)
 *   hospitalRun              the "Hospital and target hazard runs" line under Response Run
 *   faq[]                    extra city questions, after the stations question
 *   neighborsLine            in "Can I study another city too?"
 */

const firstDue = dept => ({
  icon: 'firstdue',
  title: 'First due',
  body: `Whose area is it? First Due drills every station's area, estimated by drive time until we have ${dept}'s own map.`,
  games: ['First Due', 'Response Run'],
});

export const CITIES = [
  // Chicago. CFD: chicago.gov/city/en/depts/cfd/provdrs/ops.html says 98 firehouses, Wikipedia 96, so "nearly 100".
  // Grid: State and Madison are zero, 800 to the mile; south of Madison, Roosevelt 1200 S, Cermak 2200 S, 31st 3100 S,
  // then 800 to the mile again (en.wikipedia.org/wiki/Roads_and_expressways_in_Chicago; chicagorailfan.com/streetno.html).
  // Hospitals: Northwestern Memorial, Stroger (Cook County), UChicago Medicine (Level I adult trauma since 2018,
  // news.uchicago.edu/article/2018/04/09/uchicago-medicine-gets-approval-be-level-1-adult-trauma-center).
  {
    slug: 'chicago-il', city: 'Chicago', state: 'IL', county: 'Cook County',
    dept: 'Chicago Fire Department',
    description: 'Chicago street study for firefighters: the State and Madison grid, the expressways, river bridges and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Chicago the way a real run does: an address comes in, and you call every turn out of quarters. Hundred blocks on the State and Madison grid, the expressways, the river bridges and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Chicago Fire Department</strong> works out of nearly 100 firehouses, each known by the engine and truck companies it quarters.',
    stationsFaq: 'The Chicago Fire Department works out of nearly 100 firehouses.',
    drillHeading: 'The grid, the river and the expressways',
    drillLede: "Chicago's grid makes any address findable, once the numbers are second nature. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'State and Madison are zero', body: 'Eight blocks to the mile, 800 numbers each: Halsted is 800 W, Ashland 1600 W, Western 2400 W, and North Avenue 1600 N. Hundred Blocks turns any address into a place on the map.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'Mile streets and diagonals', body: 'Western, Cicero and the other mile streets, and the diagonals like Milwaukee, Ogden and Archer that cut across them. Line Up drills the cross streets in order along every corridor.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'The expressways', body: "The Kennedy, the Dan Ryan, the Eisenhower and the Stevenson, and DuSable Lake Shore Drive along the lake. Routes follow the ramps and one-ways the way you'd really drive them.", games: ['Response Run', 'Route Sketch'] },
      { icon: 'cross', title: 'River bridges', body: "The main stem and the North and South Branches of the Chicago River split downtown and the near sides. Learn which streets cross before you're on the wrong bank.", games: ['Response Run', 'What Street Is This?'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The high-rises, schools, senior living and big complexes in your first due, and venues like McCormick Place, the United Center, Soldier Field and Wrigley Field.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: "Northwestern Memorial, Stroger, UChicago Medicine and the rest of the city's hospitals: practice the run from quarters before you need it.", games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Northwestern Memorial, Stroger or UChicago Medicine.',
    faq: [
      { q: 'How do hundred blocks work in Chicago?', a: '<p>State Street is zero east and west, and Madison Street is zero north and south. Every mile is 800 numbers, eight blocks: Chicago Avenue is 800 N, North Avenue 1600 N, Halsted 800 W and Western 2400 W. Just south of Madison the mile streets run off that pattern (Roosevelt is 1200 S, Cermak 2200 S and 31st Street 3100 S) before 800 to the mile picks up again. Hundred Blocks and Flashcards drill it until you read an address as a place.</p>' },
    ],
    neighborsLine: "Type in Evanston, Oak Park, Cicero or any other city next door, and it's built the same way.",
  },

  // Kingsport. KFD: 8 stations, 8 engines and 2 ladders (kingsporttn.gov/accreditation/; 2024 and 2025 annual reports).
  // I-26 ends at US 11W (Stone Drive); North and South Forks of the Holston meet here; city reaches into Hawkins County
  // (en.wikipedia.org/wiki/Kingsport,_Tennessee). Eastman's main plant: 550+ buildings, its own roads and rail
  // (bicmagazine.com). Holston Army Ammunition Plant Area A is in the city (globalsecurity.org); Domtar Kingsport Mill.
  // Hospitals: Holston Valley Medical Center, Indian Path Community Hospital (balladhealth.org). No published grid.
  {
    slug: 'kingsport-tn', city: 'Kingsport', state: 'TN', county: 'Sullivan and Hawkins counties',
    dept: 'Kingsport Fire Department',
    description: 'Kingsport street study for firefighters: Stone Drive, Fort Henry Drive, I-26, the Holston and target hazards like Eastman. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Kingsport the way a real run does: an address comes in, and you call every turn out of quarters. Stone Drive, Fort Henry Drive, the Holston, the plants and the hospitals, in seventeen short games.',
    deptLine: 'The <strong>Kingsport Fire Department</strong> runs eight engine companies and two ladder companies from eight stations, in a city that reaches from Sullivan County into Hawkins County.',
    stationsFaq: 'The Kingsport Fire Department runs eight stations.',
    drillHeading: 'The Model City, block by block',
    drillLede: "Kingsport's streets follow the river and the ridges. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on each street, and which block is where, from Center Street out to the edges of the city. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Stone Drive, Fort Henry Drive, Memorial Boulevard and John B. Dennis Highway, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'cross', title: 'I-26 and the Holston', body: 'I-26 ends at Stone Drive, the North and South Forks of the Holston meet in town, and Bays Mountain rises to the south. Know the way around before the call.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: "Eastman's main plant, with hundreds of buildings and its own roads and rail, Holston Army Ammunition Plant and the Domtar mill, plus the schools, senior living and big complexes in your first due.", games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Holston Valley Medical Center and Indian Path Community Hospital: practice the run from quarters to both.', games: ['Response Run', 'Dispatch Drill'] },
      firstDue('the Kingsport Fire Department'),
    ],
    hospitalRun: 'Practice the trip from quarters to Holston Valley or Indian Path.',
    faq: [],
    neighborsLine: "Type in Mount Carmel, Church Hill or any other town nearby, and it's built the same way.",
  },

  // Saint Paul. SPFD: 3 districts (stpaul.gov/departments/fire-emergency-medical-services/fire-operations); 16 stations
  // since Station 3 on West Seventh reopened Dec 9, 2025 (firehouse.com/stations/news/55337477; stpaul.gov Station 3 page).
  // No single grid: numbers count out from lines through downtown (streets.mn/2015/01/09/ive-got-your-number/).
  // Hospitals: Regions (Level I, healthpartners.com), United Hospital, 333 Smith Ave N (Allina).
  {
    slug: 'saint-paul-mn', city: 'Saint Paul', state: 'MN', county: 'Ramsey County',
    dept: 'Saint Paul Fire Department',
    description: 'Saint Paul street study for firefighters: hundred blocks, I-94 and I-35E, the Mississippi bridges and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Saint Paul the way a real run does: an address comes in, and you call every turn out of quarters. Hundred blocks, the river bridges, the bluffs and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Saint Paul Fire Department</strong> runs 16 stations in three districts, with Station 3 on West Seventh back in service since December 2025.',
    stationsFaq: 'The Saint Paul Fire Department runs 16 stations in three districts.',
    drillHeading: 'A river city, block by block',
    drillLede: "Saint Paul doesn't run on one clean grid, which is exactly why its streets take drilling. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Numbers that count from downtown', body: 'House numbers count out from lines through downtown, and the river bends the streets around them. Hundred Blocks drills which block is where, street by street.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'University, Snelling, West Seventh and Shepard Road, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'cross', title: 'Bridges and bluffs', body: 'The Mississippi winds between steep bluffs, so a few bridges (Wabasha, Robert, the High Bridge on Smith Avenue, Lafayette) decide how you reach the West Side. Know them cold.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'run', title: 'I-94 and I-35E', body: "The two interstates meet downtown. Response Run routes you on and off them the way you'd really drive, ramps and one-ways included.", games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The State Capitol, Xcel Energy Center, Allianz Field, the downtown airport and the University of St. Thomas, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: "Regions, United and the rest of the city's hospitals: practice the run from quarters, bridges and all.", games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Regions or United.',
    faq: [
      { q: "Why do Saint Paul's hundred blocks take practice?", a: "<p>Because there's no single grid. House numbers count out from lines through downtown, and where the Mississippi bends, the streets bend with it. Hundred Blocks drills the numbering one street at a time, and Flashcards brings back the blocks you miss.</p>" },
    ],
    neighborsLine: "Type in Minneapolis, Roseville, Maplewood, West St. Paul or any other city next door, and it's built the same way.",
  },

  // San Marino. SMFD: one station, Station 91, at City Hall, 2200 Huntington Dr (cityofsanmarino.org/144/Fire-Department;
  // 2024 annual report). Area C automatic aid with Pasadena, South Pasadena, San Gabriel, Alhambra and others
  // (alhambraca.gov/200/Operations-Division). Huntington Drive is the spine; The Huntington at 1151 Oxford Rd,
  // San Marino High School at 2701 Huntington Dr, Lacy Park at 1485 Virginia Rd. No hospital in the city.
  {
    slug: 'san-marino-ca', city: 'San Marino', state: 'CA', county: 'Los Angeles County',
    dept: 'San Marino Fire Department',
    description: 'San Marino street study for firefighters: every street from Station 91, Huntington Drive and the automatic-aid cities next door. Offline, iPhone and Android.',
    lede: 'StreetDrill drills you on San Marino the way a real run does: an address comes in, and you call every turn out of quarters. With one station, your first due is the whole city, so every street counts.',
    deptLine: 'The <strong>San Marino Fire Department</strong> runs one station, Station 91, at City Hall on Huntington Drive, and shares automatic aid with Pasadena, South Pasadena, Alhambra, San Gabriel and other cities nearby.',
    stationsFaq: 'The San Marino Fire Department runs one station, Station 91, so your first due is the whole city.',
    drillHeading: 'One station, every street',
    drillLede: "San Marino is small enough to learn completely, and automatic aid means knowing the streets next door too. Here's what you'll drill.",
    drill: [
      { icon: 'driver', title: 'Every street, no names', body: 'A street lights up on a blank map and you name it. In a city this size, you can get every one.', games: ['What Street Is This?', 'Fill the Map'] },
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on every street in the city, and which block is where, until an address reads as a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'Huntington Drive', body: "The city's spine, plus Sierra Madre Boulevard, San Gabriel Boulevard and Lorain Road. Line Up drills every cross street along them, in order.", games: ['Line Up', 'Cross Streets'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The Huntington Library, Art Museum and Botanical Gardens, San Marino High School and Lacy Park, plus the other schools and senior living in town.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'firstdue', title: 'All of it is first due', body: "With one station there's no district line to learn inside the city. Set your study area to the whole city and drill every street from Station 91.", games: ['Response Run', 'Shift Drill'] },
      { icon: 'trades', title: 'Automatic aid', body: 'The closest unit goes, whatever city it\'s from. Switch to Pasadena, South Pasadena, Alhambra or San Gabriel and drill their streets too.', games: ['Response Run', 'Street Finder'] },
    ],
    hospitalRun: 'San Marino has no hospital of its own, so drill the runs that stay in town: The Huntington, the schools and Lacy Park.',
    faq: [
      { q: 'What about automatic aid?', a: "<p>San Marino is part of the Area C automatic-aid agreement, so the closest unit goes, whatever city it's from. StreetDrill builds each city on its own: switch to Pasadena, South Pasadena, Alhambra or San Gabriel in <strong>Profile</strong> under <strong>City</strong> to drill their streets, and switch back to San Marino any time.</p>" },
    ],
    neighborsLine: "Type in Pasadena, South Pasadena, Alhambra, San Gabriel or any other city nearby, and it's built the same way.",
  },

  // Idaho Falls. IFFD: 7 stations (idahofallsidaho.gov/2106/Stations; Station 6 opened Jan 2026, CivicAlerts AID=2891).
  // Fire for the city and Bonneville County Fire Protection District #1 (idahofallsidaho.gov/1017/Operations);
  // EMS for all of Bonneville County and parts of Jefferson and Bingham (idahofallsidaho.gov/1015/EMS).
  // Addresses like 1954 N Yellowstone Hwy, 1465 W Broadway, 370 E 65th S. Snake River crossings: Broadway, Pancheri.
  // Hospitals: EIRMC, 3100 Channing Way; Idaho Falls Community Hospital, 2327 Coronado St.
  {
    slug: 'idaho-falls-id', city: 'Idaho Falls', state: 'ID', county: 'Bonneville County',
    dept: 'Idaho Falls Fire Department',
    description: 'Idaho Falls street study for firefighters: Broadway, 17th Street, the Snake River crossings, I-15 and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Idaho Falls the way a real run does: an address comes in, and you call every turn out of quarters. Broadway, 17th Street, the Snake River crossings and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Idaho Falls Fire Department</strong> runs seven stations, fights fire for the city and Bonneville County Fire Protection District #1, and runs ambulances across all of Bonneville County.',
    stationsFaq: 'The Idaho Falls Fire Department runs seven stations.',
    drillHeading: 'Both sides of the Snake',
    drillLede: "The Snake River splits Idaho Falls, and a handful of crossings decide every route. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'N, S, E and W', body: 'Idaho Falls addresses carry a direction, like N Yellowstone Highway or W Broadway, and toward the county the roads are numbered, like 65th South. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Broadway, Yellowstone Highway, 17th Street, Sunnyside Road, Woodruff Avenue and Hitt Road, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'cross', title: 'River crossings', body: 'The Snake runs north and south through town, between the west side and downtown. Know whether Broadway or Pancheri gets you across first.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'run', title: 'I-15 and US 20', body: 'I-15 runs along the west side and US 20 heads northeast. Drill the ramps and the routes out of quarters.', games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'hazards', title: 'Target hazards', body: "Idaho National Laboratory's campus in town, Mountain America Center, University Place and the regional airport, plus the schools, senior living and big complexes in your first due.", games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Eastern Idaho Regional Medical Center and Idaho Falls Community Hospital: practice the run from quarters to both.', games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to EIRMC or Idaho Falls Community Hospital.',
    faq: [],
    neighborsLine: "Type in Ammon, Iona, Ucon or any other city nearby, and it's built the same way.",
  },

  // Kenner. KFD: 6 stations, HQ 2226 Williams Blvd (kenner.la.us/185 and /536). Numbered streets run parallel to the
  // river, 3rd St to 44th St (en.wikipedia.org/wiki/Louisiana_Highway_49); a fire "in the 3200 block of Williams"
  // closed Williams at 32nd St (audacy.com/wwl). Ochsner Medical Center - Kenner, 180 W Esplanade Ave.
  // MSY is almost all in Kenner; Pontchartrain Center 4545 Williams; Treasure Chest; Esplanade Mall.
  {
    slug: 'kenner-la', city: 'Kenner', state: 'LA', county: 'Jefferson Parish',
    dept: 'Kenner Fire Department',
    description: 'Kenner street study for firefighters: numbered streets from river to lake, Williams, Airline, the airport and target hazards. Offline, iPhone and Android.',
    lede: 'StreetDrill drills you on Kenner the way a real run does: an address comes in, and you call every turn out of quarters. From the river levee to the lakefront, Williams Boulevard, Airline Drive and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Kenner Fire Department</strong> runs six stations between the levee and the lake, with headquarters on Williams Boulevard.',
    stationsFaq: 'The Kenner Fire Department runs six stations.',
    drillHeading: 'From the river to the lake',
    drillLede: "Kenner runs from the Mississippi levee to Lake Pontchartrain, with the airport filling much of the west side. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Numbered streets', body: 'The numbered streets run parallel to the river, from 3rd Street up to 44th near the lake, and on Williams Boulevard the hundred block follows them: the 3200 block is at 32nd Street.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Williams Boulevard, Airline Drive, Veterans, West Esplanade and Loyola Drive, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'River to lake', body: 'I-10 and Airline Drive cross the city east to west, and the airport fills a big block of the west side. Know your way around it before the call.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: 'Louis Armstrong New Orleans International Airport, the Pontchartrain Center, Treasure Chest Casino and Esplanade Mall, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Ochsner Medical Center &ndash; Kenner on West Esplanade: practice the run from quarters.', games: ['Response Run', 'Dispatch Drill'] },
      firstDue('the Kenner Fire Department'),
    ],
    hospitalRun: 'Practice the trip from quarters to Ochsner Medical Center &ndash; Kenner.',
    faq: [],
    neighborsLine: "Type in any other city in Jefferson Parish, and it's built the same way.",
  },

  // Marietta. MFD: 6 stations, 51-56, HQ Station 51 at 112 Haynes St by City Hall (mariettaga.gov/182/Fire-Stations;
  // 2024 annual report). Cobb County's grid starts at the Marietta Square, with NE/NW/SE/SW
  // (gis.cobbcounty.org/StreetChecker/ordinance.aspx). Wellstar Kennestone Regional Medical Center, Level I since
  // May 2024 (wellstar.org). Many Marietta mailing addresses are outside city limits (mariettaga.gov DocumentCenter 1256);
  // Dobbins ARB and Lockheed are in unincorporated Cobb, so they're not listed.
  {
    slug: 'marietta-ga', city: 'Marietta', state: 'GA', county: 'Cobb County',
    dept: 'Marietta Fire Department',
    description: 'Marietta street study for firefighters: hundred blocks off the Square, the Loop, I-75, Cobb Parkway and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Marietta the way a real run does: an address comes in, and you call every turn out of quarters. Hundred blocks off the Square, the Loop, I-75 and Cobb Parkway, and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Marietta Fire Department</strong> runs six stations, 51 through 56, with headquarters at Station 51 by City Hall.',
    stationsFaq: 'The Marietta Fire Department runs six stations, 51 through 56.',
    drillHeading: 'Off the Square, block by block',
    drillLede: "Marietta's addresses start at the Square, and its city limits don't follow its mailing addresses. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'The Square is zero', body: "Cobb County's grid starts at the Marietta Square: streets carry NE, NW, SE or SW, and the numbers climb as you move away. Hundred Blocks turns any address into a place.", games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The Loop and the corridors', body: 'North and South Marietta Parkway, Roswell Street, Whitlock Avenue and Powder Springs Street, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'I-75 and Cobb Parkway', body: 'Both run north and south through the east side of the city, with the main I-75 exits at North and South Marietta Parkway. Drill the ramps out of quarters.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: "The Square and Glover Park, Kennesaw State's Marietta Campus and Life University, plus the schools, senior living and big complexes in your first due.", games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Wellstar Kennestone Regional Medical Center, a Level I trauma center since 2024: practice the run from quarters.', games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'firstdue', title: 'Inside the city line', body: 'StreetDrill builds Marietta to its city limits, and First Due drills each station\'s area inside them, estimated by drive time until we have the department\'s own map.', games: ['First Due', 'Response Run'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Wellstar Kennestone.',
    faq: [
      { q: 'Is every Marietta address in the city?', a: '<p>No. Many Marietta mailing addresses are in unincorporated Cobb County, outside the city limits. StreetDrill builds Marietta to the city limits, so you drill the streets inside them.</p>' },
    ],
    neighborsLine: "Type in Kennesaw, Smyrna or any other city nearby, and it's built the same way.",
  },

  // Burlington. BFD: 6 stations; a 2025 consultant study recommends 3 more and relocating 1
  // (alamancenews.com/consultant-says-burlington-needs-three-more-fire-stations...; elonnewsnetwork.com 2025/10).
  // I-40/85 run together through Burlington, exits 141 Huffman Mill Rd and 145 Maple Ave; Church St is US 70;
  // NC 62 is Alamance Rd (aaroads.com/guides/i-040-085-west-nc). Cone Health Alamance Regional, 1240 Huffman Mill Rd,
  // 24-hour ED (conehealth.com). Labcorp HQ downtown (labcorp.com); Alamance Crossing; Holly Hill Mall.
  {
    slug: 'burlington-nc', city: 'Burlington', state: 'NC', county: 'Alamance County',
    dept: 'Burlington Fire Department',
    description: 'Burlington street study for firefighters: Church Street, Huffman Mill Road, I-40/85, downtown and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Burlington the way a real run does: an address comes in, and you call every turn out of quarters. Church Street, Huffman Mill Road, the interstate exits and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Burlington Fire Department</strong> runs six stations, and a 2025 study called for three more as the city grows.',
    stationsFaq: 'The Burlington Fire Department runs six stations.',
    drillHeading: 'From downtown to the interstate',
    drillLede: "Burlington grew out from the railroad downtown to the interstate and past it. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on each street, and which block is where, from downtown out to the newest neighborhoods. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Church Street, Huffman Mill Road, Maple Avenue and Alamance Road, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'I-40/85', body: 'The two interstates run together through Burlington, with exits at Huffman Mill Road and Maple Avenue. Drill the ramps and the routes out of quarters.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: "Labcorp's headquarters downtown, Alamance Crossing and Holly Hill Mall, plus the schools, senior living and big complexes in your first due.", games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Cone Health Alamance Regional on Huffman Mill Road: practice the run from quarters.', games: ['Response Run', 'Dispatch Drill'] },
      firstDue('the Burlington Fire Department'),
    ],
    hospitalRun: 'Practice the trip from quarters to Alamance Regional.',
    faq: [],
    neighborsLine: "Type in Graham, Elon or any other town nearby, and it's built the same way.",
  },

  // Missoula. MFD: 5 city stations (mt-missoula3.civicplus.com/831/Operations); Missoula Rural Fire District covers
  // the area around the city, with mutual and automatic aid (mrfdfire.specialdistrict.org). Clark Fork bridges at
  // Reserve, Russell, Orange, Higgins and Madison; Hellgate Canyon. Providence St. Patrick Hospital, 500 W Broadway;
  // Community Medical Center, 2827 Fort Missoula Rd. Missoula Montana Airport (renamed 2021, annexed 2018).
  {
    slug: 'missoula-mt', city: 'Missoula', state: 'MT', county: 'Missoula County',
    dept: 'Missoula Fire Department',
    description: 'Missoula street study for firefighters: Reserve, Brooks, Broadway, the Clark Fork bridges and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Missoula the way a real run does: an address comes in, and you call every turn out of quarters. Reserve, Brooks and Broadway, the Clark Fork bridges and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Missoula Fire Department</strong> runs five stations inside the city, and Missoula Rural Fire District covers the area around it, with automatic and mutual aid between them.',
    stationsFaq: 'The Missoula Fire Department runs five stations inside the city.',
    drillHeading: 'Both banks of the Clark Fork',
    drillLede: "The Clark Fork splits Missoula, and the mountains close in on either side. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Downtown, Higgins Avenue splits east from west, so St. Patrick Hospital is at 500 W Broadway. Hundred Blocks drills which block is where on every street.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Reserve, Brooks, Russell, Broadway and Higgins, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'cross', title: 'The bridges', body: 'The Clark Fork separates downtown and the Northside from the University District and the south side. Reserve, Russell, Orange, Higgins or Madison: know which bridge first.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'run', title: 'Canyon and interstate', body: 'The river comes through Hellgate Canyon between Mount Sentinel and Mount Jumbo, and I-90 runs along the north side. Drill the routes out of quarters.', games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The University of Montana, with Washington-Grizzly Stadium and the Adams Center, and Missoula Montana Airport, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Providence St. Patrick Hospital and Community Medical Center: practice the run from quarters to both.', games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to St. Patrick or Community Medical Center.',
    faq: [],
    neighborsLine: "Type in any other US city, and it's built the same way.",
  },

  // Oxford. OFD: 4 stations (oxfordms.net/departments/fire-department; NERIS). Covers the Ole Miss campus under a
  // city-university contract and does extrication for Lafayette County (olemiss.edu news; hottytoddy.com).
  // North and South Lamar either side of the Square; East and West Jackson. Hwy 6 freeway on the south side, Hwy 7
  // bypass on the east. Baptist Memorial Hospital-North Mississippi, 1100 Belk Blvd since Nov 2017 (baptistonline.org).
  {
    slug: 'oxford-ms', city: 'Oxford', state: 'MS', county: 'Lafayette County',
    dept: 'Oxford Fire Department',
    description: 'Oxford street study for firefighters: the Square, Lamar and Jackson, Highway 6 and 7, and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Oxford the way a real run does: an address comes in, and you call every turn out of quarters. The Square, Lamar and Jackson, the highway bypasses and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Oxford Fire Department</strong> runs four stations, covers the University of Mississippi campus under its contract with the university, and handles extrication across Lafayette County.',
    stationsFaq: 'The Oxford Fire Department runs four stations.',
    drillHeading: 'The Square and out',
    drillLede: "Oxford's streets run out from the Square to the bypasses. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'North and South Lamar', body: 'Lamar Boulevard is North Lamar on one side of the Square and South Lamar on the other, and Jackson Avenue runs East and West. Hundred Blocks drills which block is where on every street.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Lamar, Jackson, University Avenue and Highway 30, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'The bypasses', body: 'Highway 6 runs as a freeway along the south side, past campus, and Highway 7 bypasses the east side. Drill the interchanges out of quarters.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The Square and the Lafayette County Courthouse, plus the schools, senior living and apartment complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Baptist Memorial Hospital-North Mississippi, on Belk Boulevard since 2017: practice the run from quarters.', games: ['Response Run', 'Dispatch Drill'] },
      firstDue('the Oxford Fire Department'),
    ],
    hospitalRun: 'Practice the trip from quarters to Baptist Memorial Hospital-North Mississippi.',
    faq: [],
    neighborsLine: "Type in Abbeville, Taylor or any other town nearby, and it's built the same way.",
  },

  // Eau Claire. Eau Claire Fire Rescue: 6 stations, 2, 5, 6, 8, 9 and 10 (eauclairewi.gov ... suppression-and-ems-operations).
  // Chippewa and Eau Claire rivers meet downtown; UP main line crosses both; I-94 south edge, US 53 east.
  // Mayo Clinic Health System, 1221 Whipple St; Marshfield Medical Center-Eau Claire, 2310 Craig Rd;
  // HSHS Sacred Heart closed March 22, 2024 (weau.com). Sonnentag Event Center (2024); Pablo Center at the Confluence.
  {
    slug: 'eau-claire-wi', city: 'Eau Claire', state: 'WI', county: 'Eau Claire County',
    dept: 'Eau Claire Fire Rescue', theDept: 'Eau Claire Fire Rescue',
    description: 'Eau Claire street study for firefighters: Clairemont, Hastings Way, the river bridges, I-94 and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Eau Claire the way a real run does: an address comes in, and you call every turn out of quarters. Clairemont, Hastings Way, the river bridges and the target hazards, in seventeen short games.',
    deptLine: '<strong>Eau Claire Fire Rescue</strong> runs six stations: 2, 5, 6, 8, 9 and 10.',
    stationsFaq: 'Eau Claire Fire Rescue runs six stations.',
    drillHeading: 'Where the rivers meet',
    drillLede: "The Chippewa and the Eau Claire meet downtown, and the bridges decide your route. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on each street, North or South Barstow, East or West Grand, and which block is where. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Clairemont Avenue, Hastings Way, Golf Road and North Crossing, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'cross', title: 'The Confluence', body: 'The Eau Claire River joins the Chippewa downtown, and the rail line crosses both. Know which bridge gets you there first.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'run', title: 'I-94 and US 53', body: 'I-94 runs along the south edge of the city and the US 53 freeway along the east. Drill the ramps and the routes out of quarters.', games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'hazards', title: 'Target hazards', body: 'UW&ndash;Eau Claire, the Sonnentag Event Center and the Pablo Center at the Confluence, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Mayo Clinic Health System on Whipple Street and Marshfield Medical Center on Craig Road. Sacred Heart closed in 2024, so drill the runs as they are now.', games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Mayo Clinic Health System or Marshfield Medical Center.',
    faq: [],
    neighborsLine: "Type in Altoona, Chippewa Falls or any other city nearby, and it's built the same way.",
  },

  // Canton. CFD HQ: Station 1, 110 7th St SW (cantonohio.gov/292/Fire). Station count is 8 or 9 depending on the
  // source, so the page doesn't give one. Canton Township and Plain Township run their own departments
  // (cantontwp-oh.gov). Market Ave divides east/west, Tuscarawas St north/south (en.wikipedia.org/wiki/Canton,_Ohio;
  // city addresses). Aultman Hospital, 2600 6th St SW; Mercy Medical Center joined Cleveland Clinic Feb 1, 2021 as
  // Cleveland Clinic Mercy Hospital (beckershospitalreview.com). I-77/US 30 interchange near downtown; Nimishillen Creek.
  {
    slug: 'canton-oh', city: 'Canton', state: 'OH', county: 'Stark County',
    dept: 'Canton Fire Department',
    description: 'Canton street study for firefighters: NE, NW, SE and SW off Market and Tuscarawas, I-77, US 30 and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Canton the way a real run does: an address comes in, and you call every turn out of quarters. The quadrants off Market and Tuscarawas, I-77 and US 30, and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Canton Fire Department</strong> has its headquarters at Station 1 on 7th Street SW. Canton Township and Plain Township run their own departments, even where the mailing address says Canton.',
    stationsFaq: '',
    drillHeading: 'Four quadrants, one city',
    drillLede: "Canton's addresses tell you which quadrant you're in, once you know where the lines are. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Market and Tuscarawas', body: 'Market Avenue splits east from west and Tuscarawas Street splits north from south, so every address carries NE, NW, SE or SW. The numbered streets count out from Tuscarawas.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'Market, Tuscarawas, Cleveland Avenue and Mahoning Road, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'I-77 and US 30', body: 'They meet near downtown, and I-77 crosses Nimishillen Creek more than once on its way through. Drill the ramps and the routes out of quarters.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The Pro Football Hall of Fame and Tom Benson Hall of Fame Stadium, and Canton Memorial Civic Center, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'Aultman Hospital and Mercy Hospital, part of Cleveland Clinic since 2021: practice the run from quarters to both.', games: ['Response Run', 'Dispatch Drill'] },
      { icon: 'firstdue', title: 'Inside the city line', body: "A Canton mailing address can be Canton Township or Plain Township. StreetDrill builds Canton to the city limits, and First Due drills each station's area inside them.", games: ['First Due', 'Response Run'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Aultman or Mercy.',
    faq: [
      { q: 'How do Canton addresses work?', a: '<p>Market Avenue divides east from west, and Tuscarawas Street divides north from south, so every address has a quadrant: NE, NW, SE or SW. The numbered streets run east and west and count out from Tuscarawas, like 7th Street SW, and the named avenues run north and south. Hundred Blocks and Flashcards drill it until an address reads as a place.</p>' },
    ],
    neighborsLine: "Type in North Canton, Massillon or any other city nearby, and it's built the same way.",
  },

  // Durant. Durant Fire Department, a career city department (kxii.com 2021/02/27; durantdemocrat.com). No official
  // station count found (only an aggregator's "6"), so the page doesn't give one. AllianceHealth Durant, 1800 University
  // Blvd, 27,000+ ER visits in 2025 (alliancehealthdurant.com). Southeastern Oklahoma State University; Choctaw Casino &
  // Resort; Choctaw Nation headquarters; Bryan County seat; Lake Texoma 15 to 20 minutes away (durantchamber.org).
  {
    slug: 'durant-ok', city: 'Durant', state: 'OK', county: 'Bryan County',
    dept: 'Durant Fire Department',
    description: 'Durant street study for firefighters: US 69/75, US 70, University Boulevard, Southeastern and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Durant the way a real run does: an address comes in, and you call every turn out of quarters. US 69/75, US 70, University Boulevard and the target hazards, in seventeen short games.',
    deptLine: "The <strong>Durant Fire Department</strong> covers the Bryan County seat with career crews, from downtown to the casino and the Choctaw Nation's headquarters.",
    stationsFaq: '',
    drillHeading: 'The heart of Texoma',
    drillLede: "Durant sits where US 69/75 meets US 70, with Lake Texoma just to the southwest. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on each street, and which block is where, from downtown out to the edges of the city. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The corridors', body: 'US 69/75, US 70 and University Boulevard, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'The highways', body: 'US 69/75 runs north and south and US 70 east and west. Drill the routes out of quarters until they\'re automatic.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: "Southeastern Oklahoma State University, Choctaw Casino &amp; Resort and the Choctaw Nation's headquarters, plus the schools, senior living and big complexes in your first due.", games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: 'AllianceHealth Durant on University Boulevard: practice the run from quarters.', games: ['Response Run', 'Dispatch Drill'] },
      firstDue('the Durant Fire Department'),
    ],
    hospitalRun: 'Practice the trip from quarters to AllianceHealth Durant.',
    faq: [],
    neighborsLine: "Type in Calera or any other town nearby, and it's built the same way.",
  },

  // Denver. DFD: 39 stations, including 5 at DEN and contract stations in Sheridan and Englewood (2024 Dept. of Public
  // Safety annual report; 2021 DFD annual report; 5280fire.com). Station 40 broke ground Sept 2025, not yet reported open.
  // Grid: Broadway and Ellsworth are zero; avenue number = hundred block north of Ellsworth; Colfax where 15th would be;
  // downtown on its own diagonal grid (en.wikipedia.org/wiki/Street_system_of_Denver). Colorado Blvd 4000 E, Federal 3000 W.
  // Hospitals: Denver Health, 777 Bannock St; Intermountain Health Saint Joseph Hospital; AdventHealth Porter (renamed 2023).
  {
    slug: 'denver-co', city: 'Denver', state: 'CO', county: 'Denver',
    dept: 'Denver Fire Department',
    notCity: 'the City and County of Denver',
    description: 'Denver street study for firefighters: hundred blocks from Broadway and Ellsworth, I-25, Colfax, the Platte and target hazards. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Denver the way a real run does: an address comes in, and you call every turn out of quarters. Hundred blocks from Broadway and Ellsworth, the downtown diagonal, the freeways and the target hazards, in seventeen short games.',
    deptLine: 'The <strong>Denver Fire Department</strong> runs 39 stations, including five at Denver International Airport and the contract stations it staffs in Englewood and Sheridan.',
    stationsFaq: 'The Denver Fire Department runs 39 stations, five of them at Denver International Airport.',
    drillHeading: 'From Broadway and Ellsworth to DEN',
    drillLede: "Denver's grid is easy to read once you know where it starts, and downtown breaks it on purpose. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Broadway and Ellsworth are zero', body: 'Broadway splits east from west and Ellsworth Avenue splits north from south. North of Ellsworth the avenue is the hundred block, so 17th Avenue is 1700 N, and Colfax sits where 15th would be.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'The boulevards', body: 'Colfax, Colorado, Federal and Speer, and every street that crosses them. Line Up drills the cross streets in order along each.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: "Downtown's diagonal", body: "Downtown's numbered streets run on their own grid, turned against the rest of the city, with one-ways to match. Drill the turns out of quarters until they're automatic.", games: ['Response Run', 'Route Sketch'] },
      { icon: 'cross', title: 'The Platte and Cherry Creek', body: 'The South Platte and Cherry Creek cut through the city, I-25 runs up the Platte valley, and I-70 meets it at the Mousetrap. Know your crossings before the call.', games: ['Response Run', 'What Street Is This?'] },
      { icon: 'hazards', title: 'Target hazards', body: 'The State Capitol, Ball Arena, Coors Field, Empower Field at Mile High and the Auraria Campus, plus the schools, senior living and big complexes in your first due.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'ambulance', title: 'Hospital runs', body: "Denver Health, Intermountain Health Saint Joseph Hospital, AdventHealth Porter and the rest of the city's hospitals: practice the run from quarters.", games: ['Response Run', 'Dispatch Drill'] },
    ],
    hospitalRun: 'Practice the trip from quarters to Denver Health, Saint Joseph or AdventHealth Porter.',
    faq: [
      { q: 'How do hundred blocks work in Denver?', a: '<p>Broadway is zero east and west, and Ellsworth Avenue is zero north and south. North of Ellsworth the numbered avenues give you the hundred block (17th Avenue is 1700 N, and Colfax is where 15th Avenue would be), and across town Colorado Boulevard is 4000 E and Federal Boulevard 3000 W. Downtown\'s numbered streets run on their own diagonal grid. Hundred Blocks and Flashcards drill it until an address reads as a place.</p>' },
    ],
    neighborsLine: "Type in Aurora, Lakewood, Englewood or any other city next door, and it's built the same way.",
  },

  // Burtonsville. Unincorporated; a Census-designated place in Montgomery County (census.gov QuickFacts). Served by
  // Montgomery County Fire and Rescue Service from Station 15, 13900 Old Columbia Pike, home of the Burtonsville
  // Volunteer Fire Department (montgomerycountymd.gov ... station-15-burtonsville; bvfd.com). Old Columbia Pike numbers
  // climb north: 13700 block, then 13900 at the station (bvfd.com). MD 198 is Spencerville Road to the west and Sandy
  // Spring Road to the east (en.wikipedia.org/wiki/Maryland_Route_198). Paint Branch High School, 14121 Old Columbia
  // Pike; Burtonsville's three public schools are all on Old Columbia Pike. Rocky Gorge Reservoir on the Patuxent,
  // between Laurel and Burtonsville (en.wikipedia.org/wiki/Rocky_Gorge_Reservoir).
  {
    slug: 'burtonsville-md', city: 'Burtonsville', state: 'MD', county: 'Montgomery County',
    dept: 'Montgomery County Fire and Rescue Service', theDept: 'Montgomery County Fire and Rescue Service',
    hubDept: 'Montgomery County Fire and Rescue Service, Station 15',
    notCity: 'the Burtonsville Volunteer Fire Department, Montgomery County',
    description: 'Burtonsville street study for firefighters: Route 29, Route 198, Old Columbia Pike and the streets around Station 15. Offline, on iPhone and Android.',
    lede: 'StreetDrill drills you on Burtonsville the way a real run does: an address comes in, and you call every turn out of quarters. Route 29, Route 198, Old Columbia Pike and the neighborhoods between, in seventeen short games.',
    deptLine: 'Burtonsville is served by <strong>Montgomery County Fire and Rescue Service</strong> from Station 15 on Old Columbia Pike, home of the Burtonsville Volunteer Fire Department.',
    stationsFaq: 'Burtonsville is served by Montgomery County Fire and Rescue Service from Station 15, home of the Burtonsville Volunteer Fire Department.',
    drillHeading: 'Route 29, Route 198 and everything between',
    drillLede: "Burtonsville is a community, not a city, built around Route 29 and Route 198 in Montgomery County. Here's what you'll drill.",
    drill: [
      { icon: 'blocks', title: 'Hundred blocks', body: 'Which way the numbers run on each street, and which block is where: Old Columbia Pike climbs from the 13700 block to Station 15 at 13900. Hundred Blocks turns any address into a place.', games: ['Hundred Blocks', 'Flashcards'] },
      { icon: 'lineup', title: 'Route 29 and Route 198', body: 'Columbia Pike, Spencerville Road and Sandy Spring Road, Old Columbia Pike and Briggs Chaney Road, and the cross streets along each, in order.', games: ['Line Up', 'Cross Streets'] },
      { icon: 'run', title: 'A divided highway', body: 'Route 29 is a divided highway through the middle of Burtonsville. Drill where you can cross it and which ramps get you on, out of Station 15.', games: ['Response Run', 'Route Sketch'] },
      { icon: 'hazards', title: 'Target hazards', body: 'Paint Branch High School and the other schools on Old Columbia Pike, and the shopping center at Route 29 and Route 198, plus senior living and big complexes.', games: ['Target Hazards', 'Flashcards'] },
      { icon: 'firstdue', title: 'Station 15', body: "Set Station 15 as your home base and drill its first-due area, estimated by drive time until we have MCFRS's own map.", games: ['First Due', 'Response Run'] },
      { icon: 'trades', title: 'Across the county line', body: 'The Patuxent and Rocky Gorge Reservoir are just to the north, with Howard and Prince George\'s counties close by. Switch to Laurel or any city nearby to drill its streets too.', games: ['Response Run', 'Street Finder'] },
    ],
    hospitalRun: 'Practice the trips you can\'t afford to hunt for, from Station 15 to the schools and the shopping center.',
    faq: [],
    neighborsLine: "Type in Laurel or any other city nearby, and it's built the same way.",
  },
];
