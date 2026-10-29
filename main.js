/* BG PALETTE */
document.body.classList.add(['bg-0','bg-1','bg-2','bg-3','bg-4'][Math.floor(Math.random()*5)]);

/* ---- ROUTING ------------------------------------------------ */
var prev = 'home';

function showPage(id) {
  var cur = document.querySelector('.page.active');
  if (cur) { prev = cur.id.replace('page-',''); cur.classList.remove('active'); }
  document.querySelectorAll('.nav-link').forEach(function(l){ l.classList.remove('active'); });
  var p = document.getElementById('page-'+id);
  if (!p) return;
  p.classList.add('active');
  p.scrollTop = 0;
  var nl = document.getElementById('nl-'+id);
  if (nl) nl.classList.add('active');
  if (id === 'works')    { initWorks(); showWorksBar(); initWorksBar(); }
  if (id === 'projects') { projActive=null; document.querySelector('#projBar .page-label').textContent='Projects'; initProjects(); }
  if (id === 'sketch')   { initSketch(); }
  if (id === 'research') { initResearch(); populateFilters(); renderResList(); setResView('constellation'); var tf=document.getElementById('typeFilters'); if(tf) tf.style.display='flex'; }
  if (id === 'moodboard'){ updateMoodTimestamp(); initMoodMasonry(); }
  if (id === 'drawn')    { updateDrawnTimestamp(); }
  var footer = document.getElementById('siteFooter');
  if (footer) footer.style.display = id === 'home' ? 'none' : 'block';
  /* update URL hash so page is shareable as a direct link */
  var hash = id === 'home' ? '' : '#' + id;
  if (window.location.hash !== hash) {
    history.replaceState(null, '', '/' + hash);
  }
}

function go(id) { showPage(id); closeExplore(); }
function goBack() { showPage(prev || 'works'); }

/* ---- EXPLORE PANEL ------------------------------------------ */
function toggleExplore() {
  if (window.innerWidth <= 768) {
    var d = document.getElementById('mobNavDrawer');
    if (d) d.classList.toggle('open');
  } else {
    document.getElementById('explorePanel').classList.toggle('open');
  }
}
function closeExplore() {
  document.getElementById('explorePanel').classList.remove('open');
  var d = document.getElementById('mobNavDrawer');
  if (d) d.classList.remove('open');
}
function mobileGo(id) {
  var d = document.getElementById('mobNavDrawer');
  if (d) d.classList.remove('open');
  showPage(id);
}

document.querySelector('.nav-name').addEventListener('contextmenu', function(e) {
  e.preventDefault(); toggleExplore();
});
document.addEventListener('click', function(e) {
  var d = document.getElementById('mobNavDrawer');
  if (!d || !d.classList.contains('open')) return;
  if (!d.contains(e.target) && !e.target.closest('.nav-explore')) d.classList.remove('open');
});

/* ---- SECRET PAGES (type draw / map / diary) ----------------- */
var kb = '';
document.addEventListener('keypress', function(e) {
  kb = (kb + e.key.toLowerCase()).slice(-6);
  if (kb.includes('draw'))  showPage('sketch');
  if (kb.includes('map'))   showPage('research');
  if (kb.includes('diary')) showPage('moodboard');
});

/* ---- PROJECTS DATA ------------------------------------------ */
/*
  Each project:
    id, title, year, medium, cover (URL)
    desc      - short text shown in list view
    descFull  - expanded text on "Read more"
    exhibitionText       - string or array of strings (paragraphs) shown as
                           a collapsible "Exhibition text" block at the bottom
                           of the works grid. Omit if not needed.
    exhibitionTextAuthor - optional string, e.g. 'Maria Manaila'
    works[]   - array of individual works:
      title, img, year, medium, dims
      status: 'available' → shows Enquire button
              'private'   → shows Private collection label
              omit        → nothing shown
      exhibited: ['Gallery Name, City, Year'] → shown as "Exhibited at"
      installationView: true → labels the thumbnail as "Installation view" in grid
*/
var PROJECTS = [
  {
    id: 'acts',
    title: 'Acts of in-between',
    year: '2024',
    medium: 'Charcoal on canvas and oil on linen',
    cover: 'works/all-worked-as-a-team-so-im-safe-detail.jpg',
    desc: 'A story of food and art — and of the rituals and environments for their creation —, Adrian Cojocaru’s first exhibition at Gaep features six large-scale works that blend charcoal drawing on canvas with richly textural painting.',
    descFull: 'A story of food and art — and of the rituals and environments for their creation —, Adrian Cojocaru’s first exhibition at Gaep features six large-scale works that blend charcoal drawing on canvas with richly textural painting. Informed by the distinctly modern experience of fine dining, this new body of work arises from two main gestures. One is the analogy that the artist draws between the precise choreography of a professional kitchen, in which every second counts, and his own movements, similarly exact, in the studio. The other is an act of double reveal. Cojocaru takes us behind the scenes, both in a restaurant and in his studio, to look at what diners and viewers don’t usually see: the cluttered office next to the kitchen; the communal solitude of chefs who cleave tightly to their duties; the drawings that, at most times, precede painting in a painter’s practice.',
    exhibitionText: [
      'A story of food and art — and of the rituals and environments for their creation —, Adrian Cojocaru’s first exhibition at Gaep features six large-scale works that blend charcoal drawing on canvas with richly textural painting. Informed by the distinctly modern experience of fine dining, this new body of work arises from two main gestures. One is the analogy that the artist draws between the precise choreography of a professional kitchen, in which every second counts, and his own movements, similarly exact, in the studio. The other is an act of double reveal. Cojocaru takes us behind the scenes, both in a restaurant and in his studio, to look at what diners and viewers don’t usually see: the cluttered office next to the kitchen; the communal solitude of chefs who cleave tightly to their duties; the drawings that, at most times, precede painting in a painter’s practice.',
      'Adrian Cojocaru’s work begins outside the studio itself. Convinced that walking is a form of knowledge, he strolls through cities in a state that most dedicated urban walkers know: “an observer’s state, cool, withdrawn, with senses sharpened, a good state for anybody who needs to reflect or create.”[Rebecca Solnit, Wanderlust. A History of Walking, Granta Books, 2022]. Spontaneously, he photographs some of the places which he stumbles upon, particularly cafés, bakeries, ice cream shops, and restaurants. Such records of unpredictable encounters add to the planned photographs he takes inside professional kitchens (including the high-end kitchen in the US where he had a summer job as a student) and to the direct experience of dining at various restaurants that he researches beforehand. Compositions start to be derived by drawing from the images and observations thus collected. This M.O. allows him to clarify the emotionally resonant moments and to engage with the legacy of figurative painting, skillfully connecting historic references with contemporary representations.', 'Across the works on view in the exhibition is a preoccupation with ritualized patterns of behaviour — of those who make the food and of those who eat it. Instead of the popular focus on chefs turned superstars, Cojocaru is fascinated by the orchestrated sequence of actions and processes, by the work ethic that makes a dining experience memorable. The presentation in the gallery echoes the script of such an experience — from anticipating it (Agency of a liminal space) and starting to appreciate the expertise of its makers (The Italians were marvellous), to having a different disposition at the end of the meal (Going anywhere, we were vulnerable). With each work, Cojocaru highlights competing surface qualities as he overlays the drawn canvas with painted details; there is equal power, he suggests, in both forms of mark making. Acts of In-Between shows a young artist reflecting on the nature of his work while attuning us to the realities of another professional environment and inviting us to think about the value of respect and care — for ourselves and for the others.', '—', '“Gaep Presents” is a new programme of exhibitions that focuses on work by emerging artists and by established collaborators of the gallery other than the artists it represents. The programme builds upon the four iterations of ACCELERATOR, the mentoring projects for emerging artists in which Gaep has been a partner since 2022, and on diverse collaborations with artists in the gallery’s 10-year history. Adrian Cojocaru: Acts of In-Between is the first exhibition in this series.', '—', 'Adrian Cojocaru (b. 1993) works to celebrate the richness of contemporary human experience through the medium of painting. By integrating walking into his artistic practice and photographing his immediate surroundings, he has accumulated a large number of images that serve as source material alongside pop culture and art history. A sense of displacement and longing caused by his dual upbringing in Eastern and Western Europe is a silent undercurrent running through his paintings, which often feature activities, jobs, and experiences that tend to be overlooked. Cojocaru has been an Erasmus+ student at PXL-MAD School of Arts in Hasselt, Belgium, and has just completed an MA in Painting at the National University of Arts ‘George Enescu’ in Iași. In 2023, he was one of the ten participating artists in ACCELERATOR Brașov, a mentoring project organized by Asociația Culturală Eastwards Prospectus in partnership with Gaep and The Art Museum of Brașov.'
    ],
    exhibitionTextAuthor: 'Ioana Chira, 2024',
    works: [
      { title:'Agency of a liminal space',   img:'works/agency-of-a-liminal-space-gaep-2024.jpg', year:'2024', medium:'charcoal on canvas and oil on linen attached', dims:'140 x 90 cm and 45 x 60 cm'},
      { title:'The Italians were marvellous',  img:'works/the-italians-were-marvellous-2024.jpg', year:'2024', medium:'charcoal on canvas and oil on linen attached', dims:'132 x 198 cm and 60 x 45 cm', status:'available' },
      { title:'Do you know about the golden rule',   img:'works/do-you-know-about-te-golden-rule-2024.jpg', year:'2024', medium:'charcoal on canvas and oil on linen attached', dims:'140 x 100 cm and 40 x 30 cm', status:'available'},
      { title:'Many memories from, but this one is also fixed in a photograph',  img:'works/Many-memories-from-2024.jpg', year:'2024', medium:'charcoal on canvas and oil on canvas attached', dims:'124 x 200 cm and 40 x 30 cm', 	status:'private' },
      { title:'All worked as a team, so I’m safe',   img:'works/all-worked-as-a-team-so-im-safe-2024.jpg', year:'2024', medium:'charcoal on canvas and oil on linen attached', dims:'135 x 180 cm and 60 x 45 cm', 		status:'private' },
      { title:'Going anywhere, we were vulnerable',  img:'works/going-anywhere-we-were-vulnerable-2024.jpg', year:'2024', medium:'charcoal and oil on canvas and oil on linen attached', dims:'138 x 180 cm and 45 x 60 cm' },
      { title:'Exhibition view', img:'works/acts-of-in-between-installation-view-1-2024.jpg', year:'2024', medium:'Installation view', dims:'', exhibited:['Gaep Gallery, Bucharest, 19 July – 16 August 2024'], installationView:true },
      { title:'Exhibition view', img:'works/acts-of-in-between-installation-view-2-2024.jpg', year:'2024', medium:'Installation view', dims:'', exhibited:['Gaep Gallery, Bucharest, 19 July – 16 August 2024'], installationView:true },
      { title:'Installation view detail', img:'works/acts-of-in-between-installation-view-detail-2024.jpg', year:'2024', medium:'Installation view', dims:'', exhibited:['Gaep Gallery, Bucharest, 19 July – 16 August 2024'], installationView:true },
      { title:'It is literally a feeling',  img:'works/it-is-literally-a-feeling-2024.jpg', year:'2024', medium:'Oil on linen', dims:'30 x 30 cm', 	status:'private' },
      { title:'Signature boudoir',   img:'works/signature-boudoir-2024.jpg', year:'2024', medium:'Oil on linen', dims:'40 x 30 cm', 	status:'private' },
      { title:'Everybody knows about that spot',  img:'works/everybody-knows-about-that-spot-2024.jpg', year:'2024', medium:'Oil on linen', dims:'30 x 30 cm', 	status:'private' },
      { title:'Three times a day',   img:'works/three-times-a-day-2024.jpg', year:'2024', medium:'Oil on linen', dims:'30 x 30 cm', 	status:'private' },
      { title:'Second reason is even more important',  img:'works/second-reason-is-even-more-important-2024.jpg', year:'2024', medium:'Oil on canvas', dims:'30 x 30 cm', 	status:'private' },
      { title:'It just felt right', img:'works/it-just-felt-right-2024.jpg', year:'2024', medium:'Oil on linen', dims:'27 x 24 cm', 	status:'private' },
      { title:'Meal Variation - except spinach', img:'works/meal-variation-except-spinach-2024.jpg', year:'2024', medium:'Oil on canvas', dims:'40 x 30 cm',	status:'private' },
      { title:'Where everything popped off', img:'works/where-everything-popped-off-2024.jpg', year:'2024', medium:'Oil on linen', dims:'27 x 24 cm', 	status:'private' },
      { title:'Installation view', img:'works/acts-of-in-between-installation-view-5-2024.jpg', year:'2024', medium:'Installation view', dims:'', exhibited:['Gaep Gallery, Bucharest, 19 July – 16 August 2024'], installationView:true },
    ]
  },
  {
    id: 'pane',
    title: 'Il Pane è la Vita',
    year: '2022-2023',
    medium: 'Oil on linen',
    cover: 'works/forsi-d-2022.jpg',
    desc: 'As you glance at the warm tones and the saturated visual landscapes, it can be difficult to imagine the trip which is referenced in the paintings was taken in a cold December',
    descFull: 'As you glance at the warm tones and the saturated visual landscapes, it can be difficult to imagine the trip which is referenced in the paintings was taken in a cold December, with endless rain. Just as it’s suggested by the title of the show, the gastronomic experience also played a vital part in this vibrant and dynamic approach, in the position of a particular key to reading the city.',
    exhibitionText: [
      'Carved from stone in three-dimensional form during the first decade of the third century A.D., The Severan Marble Plan of Rome remains to this day one of the most enigmatic and intricate maps of an ancient city. Since the first fragments were rediscovered in the 16th century, the city plan has been keeping archaeologists, residents and tourists perpetually enthralled. At first glance, the celebrated sporadic discoveries of new pieces (only 10-15% are known to survive to present day) may point towards the fact that humans have a particular enthusiasm when it comes to solving a good jigsaw puzzle. On further thought, there is no running away from the realization that we have an intrinsic connection with the concept of maps, as markers of movement.',
      'Mental mapmaking was a quotidian necessity in our ancestors’ lives long before urban spaces were established. Nowadays we have the luxury of elaborate maps as we navigate a space for the first time, yet it is ultimately our own choice of motion through the extensive network of pathways that ingrains the experience into our core. We set our own landmarks and even proceed to label our surroundings based on the interactions we have with the inhabitants, creating our own cognitive maps in the process.', 'In the exhibition Il Pane è la Vita, Adrian Cojocaru thematizes this type of mental and affective mapping. The artist continues the personalized examination of urban identity and coexistence. This time, it’s about the visit in the Italian capital. By employing walking as part of his artistic practice, the paintings generated simultaneously capture the social realm and the complex circuitry of connections between the historical dimensions and the contemporary infrastructure of Rome.', 'Rome brings a discernible shift in focus from the artist’s earlier works depicting the urban space of contemporary Romania. The flâneur spirit is ubiquitous, yet elements such as lacunae in the pavement or deteriorated facades of buildings become secondary in this body of work. It can be regarded as the interwoven result of the fondness the artist carries towards Italy, having lived his formative years in the country and the compelling aspect of reading a city from a tourist’s perspective. As you glance at the warm tones and the saturated visual landscapes, it can be difficult to imagine the trip which is referenced in the paintings was taken in a cold December, with endless rain. Just as it’s suggested by the title of the show, the gastronomic experience also played a vital part in this vibrant and dynamic approach, in the position of a particular key to reading the city.', 'The manner in which Adrian Cojocaru meticulously constructs landscapes and interiors echoes the deep appreciation he has for architectural spaces. In La Rosticceria Piccola Cina, there is a reverence towards buildings as markers of sociality. The artist references Manet’s A Bar at the Folies-Bergère as he recollects the experience of finding a restaurant in the middle of a storm. Just as Manet chose to include particular symbols of the Parisian contemporary scene, such as the trapeze artist’s pair of feet, there is no escaping the presence of the ubiquitous gadget of this century, the smartphone, and the acknowledgment it birthed the mirror selfie phenomenon. The self-portrait of the artist on the left highlights his preoccupation as he encounters new spaces, always conducting a brief investigation into how surroundings can be comprehended.', 'The same inquisitory spirit characterizes the woman glancing over the cityscape of Rome. Qui, dal Rinascimento emphasizes the idea of the metropolis seen as a palimpsestic entity, employing loose brushwork in the background as a manner of representation of the ongoing metamorphosis of the urban space. The artist revers the buildings as complex structures which can only be created by cooperation and collective action.', 'Conversations take place between the works, as historic sights are placed in relation to urban transformations and the diaristic narrative reveals scenes of everyday human activity, of both residents and tourists inhabiting the public spaces. Il Pane è la Vita encompasses both our fascination on how inhabitants manage to make cities, constantly enhancing them and prompting new lines of inquiry and how there are significant moments in our lives when the cities make us.'
    ],
    exhibitionTextAuthor: 'Maria Mănăilă, 2022',
    works: [
      { title:'Ciao, Ciro!',  img:'works/ciao-ciro-2022.jpg', year:'2022', medium:'Oil on linen', dims:'60 x 45 cm', status: 'available'},
      { title:'Qui, dal rinascimento',  img:'works/qui-dal-rinascimento-2022.jpg', year:'2022', medium:'Oil on linen', dims:'200 x 150 cm', status: 'available'},
      { title:'Mantengo sempre il mio couture',  img:'works/mantengo-sempre-il-mio-couture-2022.jpg', year:'2022', medium:'Oil on linen', dims:'60 x 45 cm', status:'private' },
      { title:'T.V.B.',  img:'works/tvb-2022.jpg', year:'2022', medium:'Oil on linen', dims:'140 x 90 cm', status: 'private' },
      { title:'La rosticceria Piccola Cina',  img:'works/la-rosticceria-piccola-cina-2022.jpg', year:'2022', medium:'Oil on canvas', dims:'100 x 130 cm', status: 'private'},
      { title:'Crema e cioccolato',  img:'works/crema-e-cioccolato-2022.jpg', year:'2022', medium:'Oil on canvas', dims:'60 x 45 cm', status: 'private' },
      { title:'Forsi',  img:'works/forsi-2022.jpg', year:'2022', medium:'Oil on linen', dims:'200 x 150 cm', status: 'private' },
      { title:'Installation view',  img:'works/il-pane-e-la-vita-installation-1.jpg', year:'2022-2023', medium:'installation view', dims:'', exhibited:['Aparte Gallery, Iasi, 15 December 2022 – 6 January 2023'], installationView:true },
      { title:'Installation view',  img:'works/il-pane-e-la-vita-installation-view-2.jpg', year:'2022-2023', medium:'installation view', dims:'', exhibited:['Aparte Gallery, Iasi, 15 December 2022 – 6 January 2023'], installationView:true },
      { title:'Installation view',  img:'works/il-pane-e-la-vita-installation-view-3.jpg', year:'2022-2023', medium:'installation view', dims:'', exhibited:['Aparte Gallery, Iasi, 15 December 2022 – 6 January 2023'], installationView:true },
      { title:'Installation view',  img:'works/il-pane-e-la-vita-installation-view-4.jpg', year:'2022-2023', medium:'installation view', dims:'', exhibited:['Aparte Gallery, Iasi, 15 December 2022 – 6 January 2023'], installationView:true  },
      { title:'Installation view',  img:'works/il-pane-e-la-vita-installation-view-5.jpg', year:'2022-2023', medium:'installation view', dims:'', exhibited:['Aparte Gallery, Iasi, 15 December 2022 – 6 January 2023'], installationView:true  },
    ]
  },
  {
    id: 'riding',
    title: 'Riding Through The City',
    year: '2021 - 2022',
    medium: 'Oil on linen',
    cover: 'works/like-an-undiscovered-illness-detail-2022.jpg',
    desc: 'The Riding Through the City series represents imaginary scenes generated by his urban wanderings.',
    descFull: 'The Riding Through the City series represents imaginary scenes generated by his urban wanderings. By employing walking as an artistic practice and studying the works of Henri Lefebvre and Roland Barthes the artist found a key to reading the cities - a conceptual triad composed of architecture, public space and the life of the city. The process of artistic research of the urban experience assumes in this case the logic of post-production of personal photos through digital manipulation, cutting, juxtaposition, chromatic alterations painted into rendered canvases.',
    exhibitionText: [
      'Having lived his formative years in Italy, Adrian Cojocaru had a peculiar time trying to readjust to Romanian cities. The architecture he remembered from his childhood was now amalgamated with elements of disorganized urban development such as tumultuous improvisations on the buildings abusively made by their residents, piles of electrical cables lying on the ground, potholes, roads constantly in a pending state of construction, aggressive advertising on every corner of the street, erased or bended street signs. The artist became fascinated with representing the obstacles he constantly encountered throughout the cities he spent his most time in, Iași and Bucharest. The Riding Through the City series represents imaginary scenes generated by his urban wanderings.',
      'By employing walking as an artistic practice and studying the works of Henri Lefebvre and Roland Barthes the artist found a key to reading the cities - a conceptual triad composed of architecture, public space and the life of the city. The process of artistic research of the urban experience assumes in this case the logic of post-production of personal photos through digital manipulation, cutting, juxtaposition, chromatic alterations painted into rendered canvases.', 'The observations of the artist on contemporary society are not portrayed in a sullen atmosphere. Rather than dwelling on unfortunate elements of the local aesthetic, he takes a witty approach by including textual elements in his native language that are usually word plays and by portraying outlandish situations. …like an undiscovered illness is a work of social commentary, signaling chaotic urbanization and the impact it has on the city’s inhabitants.', 'The painting is inspired by a real life situation when the artist became the main attraction of the neighborhood for wearing socks and sandals in the middle of October, after undergoing toe surgery. The citizens are so accustomed to their faulty surroundings they are completely anesthetized when it comes to advocating for change, yet a fashion choice by one of their peers suddenly becomes a sensational story.'
    ],
    exhibitionTextAuthor: 'Maria Mănăilă, 2022',
    works: [
      { title:'The Capital',  img:'works/the-capital-2022.jpg', year:'2022', medium:'Oil on linen', dims:'200 x 150 cm', status:'private', exhibited: ['Aparte Gallery, Iasi, 2022', 'Borderline Artspace, Iasi, 2022', 'Diploma Show, Bucharest, 2022'] },
      { title:'like an undiscovered illness...',  img:'works/like-an-undiscovered-illness-2022.jpg', year:'2022', medium:'Oil on linen, oil bar, tape', dims:'200 x 150 cm', status:'private', exhibited: ['Aparte Gallery, Iasi, 2022', 'Borderline Artspace, Iasi, 2022', 'Diploma Show, Bucharest, 2022'] },
      { title:'Sunday service',  img:'works/sunday-service-2022.jpg', year:'2022', medium:'Acrylic and oil pastel on canvas', dims:'40 x 30 cm', status:'available' },
      { title:'The situation is critical',  img:'works/the-situation-is-critical-2021.jpg', year:'2021', medium:'Acrylic and oil pastel on canvas', dims:'65 x 40 cm' },
      { title:'Cheia marilor succese',  img:'works/cheia-marilor-succese-2022.jpg', year:'2022', medium:'Acrylic, oil, carbon paper ink, oil pastel, nails, tape', dims:'101 x 203 cm', status:'available', exhibited: ['Aparte Gallery, Iasi, 2022', 'Borderline Artspace, Iasi, 2022', 'MARe - Museum of Recent Art, Bucharest, 2024'] },
    ]
  }
];

/* ---- PROJECTS VIEW ------------------------------------------ */
var projView = 'grid';
var projActive = null;
var projDetailIdx = 0;

function initProjects() {
  renderProjList();
  document.getElementById('projList').style.display = 'block';
  document.getElementById('projGrid').style.display = 'none';
  document.getElementById('projDetail').style.display = 'none';
  document.getElementById('projBackBtn').style.display = 'none';
  document.getElementById('projBarLabel').textContent = 'Projects';
}

function renderProjOverviewGrid() {
  var grid = document.getElementById('projGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PROJECTS.forEach(function(p) {
    var cell = document.createElement('div');
    cell.className = 'wg-cell';
    cell.innerHTML =
      '<div class="wg-thumb-wrap"><img class="wg-thumb" src="'+p.cover+'" alt="Adrian Cojocaru, pictor — '+p.title+'" loading="lazy"></div>'+
      '<div class="wg-meta"><p class="wg-title">'+p.title+'</p><p class="wg-year">'+p.year+'</p></div>';
    cell.onclick = function() { openProject(p.id); };
    grid.appendChild(cell);
  });
}

function renderProjList() {
  var list = document.getElementById('projList');
  if (!list) return;
  list.innerHTML = '';
  PROJECTS.forEach(function(p) {
    var row = document.createElement('div');
    var isMob = window.innerWidth <= 768;
    row.style.cssText = isMob
      ? 'padding:1.2rem 0;border-bottom:1px solid var(--faint)'
      : 'display:grid;grid-template-columns:320px 1fr;gap:3rem;padding:2.5rem 0;border-bottom:1px solid var(--faint)';
    var coverHtml = isMob
      ? '<div style="overflow:hidden;background:var(--faint);cursor:pointer;margin-bottom:0.8rem" onclick="openProject(\''+p.id+'\')" ><img src="'+p.cover+'" style="width:100%;height:auto;display:block" alt="Adrian Cojocaru, pictor — '+p.title+'"></div>'
      : '<div style="overflow:hidden;background:var(--faint);cursor:pointer" onclick="openProject(\''+p.id+'\')"><img src="'+p.cover+'" style="width:100%;height:auto;display:block" alt="Adrian Cojocaru, pictor — '+p.title+'"></div>';
    row.innerHTML = coverHtml +
      '<div>'+
        '<h2 style="font-family:var(--serif);font-size:1.4rem;font-style:italic;font-weight:300;margin-bottom:0.5rem">'+p.title+'</h2>'+
        '<p style="font-size:0.6rem;letter-spacing:0.14em;color:var(--mid);margin-bottom:1rem">'+p.medium+' - '+p.year+'</p>'+
        '<p class="proj-short-'+p.id+'" style="font-size:0.72rem;line-height:1.85;color:var(--mid)">'+p.desc+'</p>'+
        '<div class="proj-full-'+p.id+'" style="display:none;font-size:0.72rem;line-height:1.85;color:var(--mid);margin-top:0.5rem">'+p.descFull+'</div>'+
        '<span onclick="toggleProjDesc(\''+p.id+'\')" style="display:inline-block;margin-top:0.8rem;font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;border-bottom:1px solid var(--faint);padding-bottom:2px;color:var(--mid)" id="readmore-'+p.id+'">Read more</span>'+
        '<br><span onclick="openProject(\''+p.id+'\')" style="display:inline-block;margin-top:1rem;font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;border-bottom:1px solid var(--faint);padding-bottom:2px;color:var(--mid);cursor:pointer">View works</span>'+
      '</div>';
    list.appendChild(row);
  });
}

function toggleProjDesc(id) {
  var s = document.querySelector('.proj-short-'+id);
  var f = document.querySelector('.proj-full-'+id);
  var btn = document.getElementById('readmore-'+id);
  if (!s || !f || !btn) return;
  if (f.style.display === 'none') {
    f.style.display = 'block'; s.style.display = 'none'; btn.textContent = 'Read less';
  } else {
    f.style.display = 'none'; s.style.display = 'block'; btn.textContent = 'Read more';
  }
}

function setProjView(v) {
  projView = v;
  if (projActive) return;
  document.getElementById('projGrid').style.display = v === 'grid' ? 'grid' : 'none';
  document.getElementById('projList').style.display = v === 'list' ? 'block' : 'none';
  document.getElementById('pvt-grid').classList.toggle('on', v === 'grid');
  document.getElementById('pvt-list').classList.toggle('on', v === 'list');
}

function openProject(id) {
  var p = null;
  for (var i = 0; i < PROJECTS.length; i++) { if (PROJECTS[i].id === id) { p = PROJECTS[i]; break; } }
  if (!p) return;
  projActive = p;
  projDetailIdx = 0;
  var grid = document.getElementById('projGrid');
  grid.style.display = 'grid';
  grid.innerHTML = '';
  document.getElementById('projList').style.display = 'none';
  document.getElementById('projDetail').style.display = 'none';
  document.getElementById('projBackBtn').style.display = 'inline';
  document.getElementById('projBarLabel').textContent = p.title;
  p.works.forEach(function(w, i) {
    var cell = document.createElement('div');
    cell.className = 'wg-cell';
    cell.innerHTML =
      '<div class="wg-thumb-wrap"><img class="wg-thumb" src="'+w.img+'" alt="Adrian Cojocaru, pictor — '+w.title+', '+w.medium+', '+w.year+'" loading="lazy"></div>'+
      '<div class="wg-meta"><p class="wg-title">'+w.title+'</p><p class="wg-year">'+w.year+'</p></div>';
    (function(idx){ cell.onclick = function() { openProjWork(idx); }; })(i);
    grid.appendChild(cell);
  });

  /* exhibition text block — appended after the grid cells, spans full width */
  var existingText = document.getElementById('proj-extext');
  if (existingText) existingText.remove();
  if (p.exhibitionText) {
    var wrap = document.createElement('div');
    wrap.id = 'proj-extext';
    wrap.style.cssText = 'grid-column:1/-1'; /* span all grid columns */
    var paragraphs = (Array.isArray(p.exhibitionText) ? p.exhibitionText : [p.exhibitionText])
      .map(function(t){ return '<p>'+t+'</p>'; }).join('');
    var author = p.exhibitionTextAuthor
      ? '<span class="proj-extext-author">— '+p.exhibitionTextAuthor+'</span>' : '';
    wrap.innerHTML =
      '<div class="proj-extext-wrap">'+
        '<span class="proj-extext-toggle" id="proj-extext-btn" onclick="toggleExText()">Exhibition text</span>'+
        '<div class="proj-extext-body" id="proj-extext-body">'+paragraphs+author+'</div>'+
      '</div>';
    grid.appendChild(wrap);
  }

  document.getElementById('pvt-grid').classList.add('on');
  document.getElementById('pvt-list').classList.remove('on');
}

function toggleExText() {
  var btn  = document.getElementById('proj-extext-btn');
  var body = document.getElementById('proj-extext-body');
  if (!btn || !body) return;
  var open = body.classList.toggle('open');
  btn.classList.toggle('open', open);
}

function openProjWork(i) {
  if (!projActive) return;
  projDetailIdx = i;
  var w = projActive.works[i];
  document.getElementById('pd-img').src = w.img;
  document.getElementById('pd-img').alt = 'Adrian Cojocaru, pictor — ' + w.title + ', ' + w.medium + ', ' + w.year;
  document.getElementById('pd-title').textContent = w.title;
  document.getElementById('pd-details').innerHTML = '<span>'+w.medium+'</span>'+(w.dims?'<span>'+w.dims+'</span>':'')+'<span>'+w.year+'</span>';
  document.getElementById('pd-desc').textContent = w.desc || '';
  document.getElementById('pd-counter').textContent = (i+1) + ' — ' + projActive.works.length;
  document.getElementById('pd-prev').classList.toggle('disabled', i === 0);
  document.getElementById('pd-next').classList.toggle('disabled', i === projActive.works.length - 1);

  /* status */
  var statusEl = document.getElementById('pd-status');
  var enquireEl = document.getElementById('pd-enquire');
  if (w.status === 'private') {
    statusEl.textContent = 'Private collection';
    statusEl.style.display = 'block';
    enquireEl.style.display = 'none';
  } else if (w.status === 'available') {
    statusEl.style.display = 'none';
    enquireEl.style.display = 'block';
  } else {
    statusEl.style.display = 'none';
    enquireEl.style.display = 'none';
  }

  /* exhibited / installation view */
  var exEl = document.getElementById('pd-exhibited');
  if (w.exhibited && w.exhibited.length) {
    exEl.style.display = 'block';
    exEl.innerHTML = '<span class="wsv-exhibited-label">Exhibited at</span>' +
      w.exhibited.map(function(e){ return '<span style="display:block">'+e+'</span>'; }).join('');
  } else {
    exEl.style.display = 'none';
  }

  document.getElementById('projGrid').style.display = 'none';
  document.getElementById('projDetail').style.display = 'block';
}

function projDetailStep(d) {
  if (!projActive) return;
  var next = projDetailIdx + d;
  if (next >= 0 && next < projActive.works.length) openProjWork(next);
}

function closeProjDetail() {
  document.getElementById('projDetail').style.display = 'none';
  document.getElementById('projGrid').style.display = 'grid';
  document.getElementById('projBarLabel').textContent = projActive ? projActive.title : 'Projects';
}
function closeProjGrid() {
  projActive = null;
  document.getElementById('projGrid').style.display = 'none';
  document.getElementById('projDetail').style.display = 'none';
  document.getElementById('projList').style.display = 'block';
  document.getElementById('projBackBtn').style.display = 'none';
  document.getElementById('projBarLabel').textContent = 'Projects';
}

/* ---- SELECTED WORKS DATA ------------------------------------ */
/*
  status: 'available' shows Enquire button
          'private'   shows Private collection label
          omit        nothing shown
	description: 'Description of the work' - adds a description
  exhibited: ['Gallery Name, City, Year'] → shown as "Exhibited at", multiple lines with 'Exhbition' followed by a comma
*/

var WORKS = [
  { title:'Fucking Martin',  img:'works/fucking-martin-2026.jpg', year:'2026', medium:'Oil on linen',         dims:'60 x 50 cm'},
  { title:'Got My P Pass',  img:'works/Got-My-P-Pass-2026.jpg', year:'2026', medium:'Oil on linen',         dims:'200 x 150 cm'},
  { title:'A living map of variable time',  img:'works/a-living-map-of-variable-time-2025.jpg', year:'2025', medium:'Oil on linen',         dims:'138 x 180 cm', status:'available' },
  { title:'Everybody knows about that spot', img:'works/everybody-knows-about-that-spot-2024.jpg', year:'2024', medium:'Oil on linen',         dims:'30 x 30 cm', status:'private', exhibited:['Gaep Presents: ADRIAN COJOCARU | Acts of in-between, Gaep Gallery, Bucharest, RO']},
  { title:'Tasted forbidden fruit and everything that followed', img:'works/tasted-forbidden-fruit-and-everything-that-followed-2025.jpg', year:'2025', medium:'Oil on linen',    dims:'135 x 180 cm',  status:'available'},  
  { title:'Where everything popped off',  img:'works/where-everything-popped-off-2024.jpg', year:'2024', medium:'Oil on linen',        dims:'27 x 24 cm', status:'private',   exhibited:['Gaep Presents: ADRIAN COJOCARU | Acts of In-Between, Gaep Gallery, Bucharest, 2024'] },
  { title:'The Milkmaid',   img:'works/the-milkmaid-2025.jpg',   year:'2025', medium:'Oil on linen',         dims:'70 x 50 cm', status:'available' },
  { title:'À la fois apparence et partie de la réalité',  img:'works/a-la-fois-apparence-et-partie-de-la-realite-2025.jpg', year:'2025', medium:'oil on linen', dims:'40 x 40 cm',   status:'available' },
  { title:'All worked as a team, so I’m safe',  img:'works/all-worked-as-a-team-so-im-safe-2024.jpg', year:'2024', medium:'Charcoal on canvas and oil on linen attached',        dims:'135 x 180 cm and 60 x 45 cm', status:'private',   exhibited:['Gaep Presents: ADRIAN COJOCARU | Acts of In-Between, Gaep Gallery, Bucharest, 2024'] },
  { title:'Meal Variation - except spinach',  img:'works/meal-variation-except-spinach-2024.jpg', year:'2024', medium:'Oil on canvas',        dims:'40 x 30 cm', status:'private',   exhibited:['Gaep Presents: ADRIAN COJOCARU | Acts of In-Between, Gaep Gallery, Bucharest, 2024'] },
  { title:'And it’s really not her fault',  img:'works/and-its-really-not-her-fault-2023.jpg', year:'2023', medium:'Oil on linen',        dims:'132 x 198 cm', status:'private',   exhibited:['Fabulating About a Gelato Machine, The Art Museum of Brasov, RO, 2023-2024'] },
  { title:'Crema e cioccolato',  img:'works/crema-e-cioccolato-2022.jpg', year:'2022', medium:'Oil on canvas',        dims:'60 x 45 cm', status:'private',   exhibited:['Il Pane è la Vita, Aparte Gallery, Iasi, RO, 2022-2023'] },
  { title:'Agency of a liminal space',   img:'works/agency-of-a-liminal-space-2024.jpg', year:'2024', medium:'Charcoal on canvas and oil on linen attached, grey curtains',         dims:'500 x 700 cm', exhibited:['On the Threshold of Dreams, MAD-Gallery, Hasselt, BE, 2024', 'Gaep Presents: ADRIAN COJOCARU | Acts of In-Between, Gaep Gallery, Bucharest, 2024']},
  { title:'Forsi',  img:'works/forsi-2022.jpg', year:'2022', medium:'Oil on linen',        dims:'200 x 150 cm', status:'private',   exhibited:['Il Pane è la Vita, Aparte Gallery, Iasi, RO, 2022-2023']},


];

/* ---- WORKS VIEW STATE --------------------------------------- */
var worksIdx = 0;
var worksView = 'single';

function initWorks() {
  renderWorksGrid();
  showWorkAt(0);
}

function showWorkAt(i) {
  var w = WORKS[i];
  if (!w) return;
  worksIdx = i;
  var img = document.getElementById('wsv-img');
  img.classList.add('fading');
  setTimeout(function() {
    img.src = w.img;
    img.alt = 'Adrian Cojocaru, pictor — ' + w.title + ', ' + w.medium + ', ' + w.year;
    img.classList.remove('fading');
  }, 320);
  document.getElementById('wsv-title').textContent = w.title;
  document.getElementById('wsv-counter').textContent = (i+1) + ' - ' + WORKS.length;
  document.getElementById('wsv-details').innerHTML =
    '<span>'+w.medium+'</span><span>'+w.dims+'</span><span>'+w.year+'</span>';
  document.getElementById('wsv-desc').textContent = w.desc || '';

  /* status */
  var eq = document.querySelector('.wsv-enquire');
  var statusEl = document.getElementById('wsv-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.id = 'wsv-status';
    eq.parentNode.insertBefore(statusEl, eq);
  }
  if (w.status === 'available') {
    statusEl.textContent = '';
    eq.style.display = 'block';
  } else if (w.status === 'private') {
    statusEl.className = 'wsv-status-private';
    statusEl.textContent = 'Private collection';
    eq.style.display = 'none';
  } else {
    statusEl.textContent = '';
    eq.style.display = 'none';
  }

  /* exhibited */
  var exEl = document.getElementById('wsv-exhibited');
  if (!exEl) {
    exEl = document.createElement('div');
    exEl.id = 'wsv-exhibited';
    exEl.className = 'wsv-exhibited';
    eq.parentNode.insertBefore(exEl, eq);
  }
  if (w.exhibited && w.exhibited.length) {
    exEl.style.display = 'block';
    exEl.innerHTML = '<span class="wsv-exhibited-label">Exhibited at</span>' +
      w.exhibited.map(function(e){ return '<span style="display:block">'+e+'</span>'; }).join('');
  } else {
    exEl.style.display = 'none';
  }

  document.getElementById('wsv-prev').classList.toggle('disabled', i === 0);
  document.getElementById('wsv-next').classList.toggle('disabled', i === WORKS.length-1);
}

function worksStep(d) {
  var next = worksIdx + d;
  if (next >= 0 && next < WORKS.length) showWorkAt(next);
}

document.addEventListener('keydown', function(e) {
  if (!document.getElementById('page-works').classList.contains('active')) return;
  if (worksView !== 'single') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') worksStep(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   worksStep(-1);
});

document.addEventListener('keydown', function(e) {
  if (!document.getElementById('page-projects').classList.contains('active')) return;
  if (!projActive || document.getElementById('projDetail').style.display === 'none') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') projDetailStep(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   projDetailStep(-1);
});

/* tap image = next; swipe left = next, right = prev */
(function() {
  var imgCol = document.querySelector('.wsv-img-col');
  if (!imgCol) return;
  imgCol.addEventListener('click', function() {
    if (worksView === 'single') worksStep(1);
  });
  var tx = 0;
  imgCol.addEventListener('touchstart', function(e) { tx = e.touches[0].clientX; }, { passive:true });
  imgCol.addEventListener('touchend',   function(e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) worksStep(dx < 0 ? 1 : -1);
  }, { passive:true });
})();

function renderWorksGrid() {
  var grid = document.getElementById('worksGrid');
  if (!grid) return;
  grid.innerHTML = '';
  WORKS.forEach(function(w, i) {
    var cell = document.createElement('div');
    cell.className = 'wg-cell';
    cell.innerHTML =
      '<div class="wg-thumb-wrap"><img class="wg-thumb" src="'+w.img+'" alt="Adrian Cojocaru, pictor — '+w.title+', '+w.medium+', '+w.year+'" loading="lazy"></div>'+
      '<div class="wg-meta"><p class="wg-title">'+w.title+'</p><p class="wg-year">'+w.year+'</p></div>';
    (function(idx){ cell.onclick = function() { setWorksView('single'); showWorkAt(idx); }; })(i);
    grid.appendChild(cell);
  });
}

function setWorksView(v) {
  worksView = v;
  document.getElementById('worksSingle').style.display = v === 'single' ? 'grid' : 'none';
  document.getElementById('worksGrid').classList.toggle('on', v === 'grid');
  document.getElementById('wvt-single').classList.toggle('on', v === 'single');
  document.getElementById('wvt-grid').classList.toggle('on', v === 'grid');
  showWorksBar();
  if (v === 'single') scheduleHideBar(2400);
}

/* ---- WORKS BAR HIDE/SHOW ------------------------------------ */
var worksBarReady = false;
var _wbTimer = null;
var _wbLastY = 0;

function hideWorksBar() {
  var b = document.querySelector('.works-bar');
  if (b) { b.style.transform = 'translateY(-100%)'; b.style.opacity = '0'; b.style.pointerEvents = 'none'; }
}
function showWorksBar() {
  clearTimeout(_wbTimer);
  var b = document.querySelector('.works-bar');
  if (b) { b.style.transform = ''; b.style.opacity = ''; b.style.pointerEvents = ''; }
}
function scheduleHideBar(ms) {
  clearTimeout(_wbTimer);
  _wbTimer = setTimeout(hideWorksBar, ms || 200);
}

function initWorksBar() {
  if (worksBarReady) return; worksBarReady = true;
  var page = document.getElementById('page-works');
  if (!page) return;
  _wbLastY = 0;
  page.onscroll = function() {
    var y = page.scrollTop;
    if (y > _wbLastY && y > 60) { scheduleHideBar(200); }
    else if (y < _wbLastY) { showWorksBar(); }
    _wbLastY = y;
  };
  document.addEventListener('mousemove', function(e) {
    if (!document.getElementById('page-works').classList.contains('active')) return;
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 48;
    if (e.clientY < navH + 80) showWorksBar();
  });
  scheduleHideBar(2000);
}

/* ---- FORMS -------------------------------------------------- */
function handleSubmit(e) { /* form submits natively to Netlify */ }

/* ---- DRAWN WORKS TIMESTAMP ---------------------------------- */
function updateDrawnTimestamp() {
  var first = document.querySelector('#page-drawn .drawn-item');
  var el = document.getElementById('drawnUpdated');
  if (!el) return;
  if (!first || !first.dataset.date) { el.textContent = ''; return; }
  var d = new Date(first.dataset.date + 'T12:00:00');
  if (isNaN(d)) { el.textContent = ''; return; }
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  el.textContent = 'last updated - ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

/* ---- MOODBOARD TIMESTAMP ------------------------------------ */
function updateMoodTimestamp() {
  var first = document.querySelector('#page-moodboard .mood-item');
  var el = document.getElementById('moodUpdated');
  if (!el) return;
  if (!first || !first.dataset.date) { el.textContent = ''; return; }
  var d = new Date(first.dataset.date + 'T12:00:00');
  if (isNaN(d)) { el.textContent = ''; return; }
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  el.textContent = 'last updated - ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

/* ---- SKETCHBOOK --------------------------------------------- */
var skReady = false, ctx, canvas, painting = false;
var tool = 'pencil', color = '#1a1916', size = 3;
var lx = 0, ly = 0;

var toolState = {
  pencil:   { grade:'HB',      size:3  },
  ink:      { nib:'0.1',       size:1  },
  charcoal: { type:'willow',   size:8  },
  brush:    { brushType:'round',size:6 },
  eraser:   {                  size:12 }
};

var pencilGrades = {
  HB:  { alpha:0.20, wMul:0.8 },
  '2B':{ alpha:0.35, wMul:0.9 },
  '4B':{ alpha:0.70, wMul:1.0 },
  '6B':{ alpha:1.00, wMul:1.1 }
};

var linerNibs = { '0.1':0.8, '0.3':1.6, '0.5':2.6, '0.8':4.0, '1.0':5.2 };

var charcoalTypes = {
  willow:     { wMul:5, alpha:0.07, blur:3 },
  compressed: { wMul:3, alpha:0.12, blur:1 },
  powdered:   { wMul:8, alpha:0.04, blur:6 },
  conte:      { wMul:2, alpha:0.22, blur:0 }
};

var brushTypes = {
  round: { wMul:2.5, alpha:0.35, blur:1.2 },
  flat:  { wMul:4.0, alpha:0.30, blur:0.5 },
  dry:   { wMul:3.0, alpha:0.18, blur:2.5 },
  wash:  { wMul:6.0, alpha:0.12, blur:4.0 }
};

var sizeSets = {
  pencil:   [2,4,6,9],
  charcoal: [6,10,16,24],
  brush:    [4,8,14,22],
  eraser:   [8,16,28,44]
};

function initSketch() {
  if (skReady) return; skReady = true;
  canvas = document.getElementById('sketchCanvas');
  function resize() {
    var col = document.querySelector('.sketch-canvas-col');
    var paper = document.getElementById('sketchPaper');
    var availW = col.offsetWidth - 24;
    var availH = col.offsetHeight - 24;
    var W, H;
    if (availW / availH > 1 / 1.294) {
      H = availH; W = Math.round(H / 1.294);
    } else {
      W = availW; H = Math.round(W * 1.294);
    }
    canvas.width = W; canvas.height = H;
    paper.style.width = W+'px'; paper.style.height = H+'px';
  }
  resize();
  window.addEventListener('resize', function() {
    if (document.getElementById('page-sketch').classList.contains('active')) resize();
  });
  ctx = canvas.getContext('2d');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  buildSizeDots();

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    var s = e.touches ? e.touches[0] : e;
    return { x:(s.clientX-r.left)*(canvas.width/r.width), y:(s.clientY-r.top)*(canvas.height/r.height) };
  }
  function startDraw(e) { painting=true; var p=pos(e); lx=p.x; ly=p.y; dot(p); }
  function moveDraw(e) { if (!painting) return; e.preventDefault(); var p=pos(e); drawStroke(p); lx=p.x; ly=p.y; }
  function stopDraw() { painting = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', startDraw, { passive:false });
  canvas.addEventListener('touchmove',  moveDraw,  { passive:false });
  canvas.addEventListener('touchend',   stopDraw);
}

function buildSizeDots() {
  var sets = Object.keys(sizeSets);
  sets.forEach(function(toolName) {
    var wrap = document.getElementById(toolName+'-sizes');
    if (!wrap) return;
    wrap.innerHTML = '';
    sizeSets[toolName].forEach(function(s, i) {
      var dotEl = document.createElement('div');
      dotEl.className = 'sub-size-dot' + (i === 0 ? ' active' : '');
      dotEl.style.width  = Math.round(4 + s*0.9)+'px';
      dotEl.style.height = Math.round(4 + s*0.9)+'px';
      dotEl.title = s+'px';
      (function(sz, tn, d){ dotEl.onclick = function() {
        toolState[tn].size = sz; size = sz;
        wrap.querySelectorAll('.sub-size-dot').forEach(function(x){ x.classList.remove('active'); });
        d.classList.add('active');
      }; })(s, toolName, dotEl);
      wrap.appendChild(dotEl);
    });
  });
}

function applyStyle() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  if (tool === 'pencil') {
    var g = pencilGrades[toolState.pencil.grade] || pencilGrades.HB;
    ctx.lineWidth = size * g.wMul; ctx.strokeStyle = color; ctx.globalAlpha = g.alpha;
  } else if (tool === 'ink') {
    ctx.lineWidth = linerNibs[toolState.ink.nib] || 1; ctx.strokeStyle = color; ctx.globalAlpha = 0.97;
  } else if (tool === 'charcoal') {
    var c = charcoalTypes[toolState.charcoal.type] || charcoalTypes.willow;
    ctx.lineWidth = size*c.wMul; ctx.strokeStyle = '#1a1916'; ctx.globalAlpha = c.alpha;
    ctx.shadowBlur = size*c.blur; ctx.shadowColor = '#1a1916';
  } else if (tool === 'brush') {
    var b = brushTypes[toolState.brush.brushType] || brushTypes.round;
    ctx.lineWidth = size*b.wMul; ctx.strokeStyle = color; ctx.globalAlpha = b.alpha;
    ctx.shadowBlur = size*b.blur; ctx.shadowColor = color;
  } else if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = (toolState.eraser && toolState.eraser.size ? toolState.eraser.size : size) * 2;
    ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.globalAlpha = 1;
  }
}

function dot(p) {
  if (!ctx) return;
  ctx.save(); applyStyle();
  ctx.beginPath();
  var r = tool==='eraser'?size*4 : tool==='charcoal'?size*3 : tool==='brush'?size*1.8 : size*0.5;
  ctx.arc(p.x, p.y, r, 0, Math.PI*2);
  if (tool === 'eraser') { ctx.globalCompositeOperation='destination-out'; ctx.fillStyle='rgba(0,0,0,1)'; }
  else if (tool === 'charcoal') ctx.fillStyle = '#1a1916';
  else ctx.fillStyle = color;
  ctx.fill(); ctx.restore();
}

function drawStroke(p) {
  if (!ctx) return;
  if (tool === 'brush' && toolState.brush.brushType === 'dry') {
    for (var i = 0; i < 3; i++) {
      ctx.save(); applyStyle();
      var jx = (Math.random()-0.5)*size*0.8;
      var jy = (Math.random()-0.5)*size*0.8;
      ctx.beginPath(); ctx.moveTo(lx+jx,ly+jy); ctx.lineTo(p.x+jx,p.y+jy); ctx.stroke(); ctx.restore();
    }
  } else {
    ctx.save(); applyStyle();
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore();
  }
}

function setTool(t) {
  tool = t;
  if (toolState[t] && toolState[t].size) size = toolState[t].size;
  if (t === 'charcoal') color = '#1a1916';
  document.querySelectorAll('.tool-btn').forEach(function(b){ b.classList.remove('active'); });
  var b = document.getElementById('tool-'+t); if (b) b.classList.add('active');
  document.querySelectorAll('.sketch-subtoolbar').forEach(function(s){ s.classList.remove('open'); });
  var sub = document.getElementById('sub-'+t); if (sub) sub.classList.add('open');
}

function setPencilGrade(g) {
  toolState.pencil.grade = g;
  /* grade only changes opacity, NOT size — use size dots for size */
  document.querySelectorAll('[id^="pg-"]').forEach(function(b){ b.classList.remove('active'); });
  var el = document.getElementById('pg-'+g); if (el) el.classList.add('active');
}

function setLinerNib(n) {
  toolState.ink.nib = n;
  document.querySelectorAll('[id^="ln-"]').forEach(function(b){ b.classList.remove('active'); });
  var id = 'ln-' + n.replace('.','');
  var el = document.getElementById(id); if (el) el.classList.add('active');
}

function setCharcoalType(t) {
  toolState.charcoal.type = t;
  var sMap = { willow:8, compressed:6, powdered:14, conte:4 };
  size = sMap[t] || 8; toolState.charcoal.size = size;
  document.querySelectorAll('[id^="ct-"]').forEach(function(b){ b.classList.remove('active'); });
  var el = document.getElementById('ct-'+t); if (el) el.classList.add('active');
}

function setBrushType(t) {
  toolState.brush.brushType = t;
  document.querySelectorAll('[id^="bt-"]').forEach(function(b){ b.classList.remove('active'); });
  var el = document.getElementById('bt-'+t); if (el) el.classList.add('active');
}

function setColor(c) {
  color = c;
  if (tool === 'charcoal') return;
  if (tool === 'eraser') setTool('brush');
  document.querySelectorAll('.cswatch').forEach(function(s){ s.classList.toggle('active', s.dataset.c === c); });
}

function clearCanvas() { if (ctx && canvas) ctx.clearRect(0,0,canvas.width,canvas.height); }

function downloadCanvas() {
  if (!canvas) return;
  /* flatten onto white background then save as JPG */
  var flat = document.createElement('canvas');
  flat.width = canvas.width; flat.height = canvas.height;
  var fc = flat.getContext('2d');
  fc.fillStyle = '#fdfbf7'; /* paper colour */
  fc.fillRect(0, 0, flat.width, flat.height);
  fc.drawImage(canvas, 0, 0);
  var link = document.createElement('a');
  var today = new Date().toISOString().slice(0,10);
  /* increment counter for this session date */
  var key = 'sketchCount_' + today;
  var count = parseInt(sessionStorage.getItem(key) || '0', 10) + 1;
  sessionStorage.setItem(key, count);
  var num = String(count).padStart(2,'0');
  link.download = today + '-drawing' + num + '.jpg';
  link.href = flat.toDataURL('image/jpeg', 0.92);
  link.click();
}


/* ---- DRAGGABLE TOOLBAR (desktop only) ---- */
(function(){
  function initDragToolbar(){
    var wrap = document.querySelector('.sketch-toolbar-wrap');
    if(!wrap || window.innerWidth<=768) return;
    var dragging=false, startX, startY, origLeft, origTop;

    function toAbsolute(){
      var col=document.querySelector('.sketch-canvas-col');
      if(!col)return;
      var wr=wrap.getBoundingClientRect(), cr=col.getBoundingClientRect();
      wrap.style.transform='none';
      wrap.style.left=(wr.left-cr.left)+'px';
      wrap.style.top=(wr.top-cr.top)+'px';
      wrap.style.bottom='auto';
    }

    wrap.addEventListener('mousedown',function(e){
      var tag=e.target.tagName;
      if(tag==='BUTTON'||tag==='INPUT'||tag==='SELECT') return;
      if(!dragging && wrap.style.transform!=='none') toAbsolute();
      dragging=true;
      startX=e.clientX; startY=e.clientY;
      origLeft=parseFloat(wrap.style.left)||0;
      origTop=parseFloat(wrap.style.top)||0;
      e.preventDefault();
    });
    document.addEventListener('mousemove',function(e){
      if(!dragging)return;
      wrap.style.left=(origLeft+e.clientX-startX)+'px';
      wrap.style.top=(origTop+e.clientY-startY)+'px';
    });
    document.addEventListener('mouseup',function(){ dragging=false; });
  }

  var _orig=window.initSketch;
  window.initSketch=function(){
    if(_orig)_orig();
    setTimeout(initDragToolbar,150);
  };
})();

/* ---- RESEARCH MAP ------------------------------------------- */
var resReady = false;
var mc, mx;
var mNodes = [], mScale = 1, mOx = 0, mOy = 0;
var mDragging = false, mDragNode = null, mLastX = 0, mLastY = 0;
var mHighlight = null;
var mPanning = false, mPanStartX = 0, mPanStartY = 0, mPanOrigX = 0, mPanOrigY = 0;

var tColors = {
  concept:  '#c07830',
  artist:   '#2a6a2a',
  place:    '#1a4a8a',
  book:     '#7a2a6a',
  material: '#a03020',
  film:     '#1a6a6a',
  essay:    '#4a2a9a'
};

/* all types active by default */
var activeTypes = {};
Object.keys(tColors).forEach(function(t){ activeTypes[t] = true; });

function populateFilters() {
  var wrap = document.getElementById('typeFilters');
  if (!wrap || wrap.children.length > 0) return; /* only build once */
  Object.keys(tColors).forEach(function(type) {
    var btn = document.createElement('button');
    btn.className = 'map-btn map-type-btn active-type';
    btn.style.borderLeftColor = tColors[type];
    btn.style.borderLeftWidth = '3px';
    btn.innerHTML =
      '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:'+tColors[type]+';margin-right:0.4rem;vertical-align:middle"></span>'+
      type;
    btn.onclick = function() {
      activeTypes[type] = !activeTypes[type];
      btn.classList.toggle('active-type', activeTypes[type]);
      btn.style.opacity = activeTypes[type] ? '1' : '0.35';
      drawMap();
    };
    wrap.appendChild(btn);
  });
}

var mNodeData = [
  /* ── PRACTICE — CORE CONCEPTS ─────────────────────────────── */
  { id:'n1',  label:'Urban coexistence',    type:'concept',  x:0,    y:-80,  desc:'The central question of the practice — how bodies share space in the city.' },
  { id:'n8',  label:'Underpaint',           type:'concept',  x:30,   y:160,  desc:'The foundational layer. Always present even when invisible. "I like to paint over the underpaint."' },
  { id:'n19', label:'Threshold',            type:'concept',  x:-280, y:60,   desc:'The in-between space. Doorways, windows, margins, pause points.' },
  { id:'n14', label:'Bread',                type:'concept',  x:240,  y:20,   desc:'Central symbol in Il Pane è la Vita. Labour, daily life, shared nourishment.' },

  /* ── PRACTICE — MATERIALS ──────────────────────────────────── */
  { id:'n5',  label:'Linen',                type:'material', x:-60,  y:-120, desc:'The primary support. Its texture becomes part of the underpaint.' },
  { id:'n6',  label:'Bicycle',              type:'material', x:160,  y:60,   desc:'The mode of navigation that generated the Riding series.' },
  { id:'n12', label:'Oil stick',            type:'material', x:100,  y:140,  desc:'Used for gestural marks directly on canvas.' },
  { id:'n18', label:'Charcoal',             type:'material', x:280,  y:-60,  desc:'Used for the drawn works. Immediate, erasable, gestural.' },

  /* ── ARTISTS ───────────────────────────────────────────────── */
  { id:'n2',  label:'Bonnard',              type:'artist',   x:120,  y:-40,  desc:'Pierre Bonnard. Colour, intimacy, the domestic interior as charged space.' },
  { id:'n10', label:'Hopper',               type:'artist',   x:200,  y:-100, desc:'Edward Hopper. Light as psychological weight. The figure in urban space.' },
  { id:'n13', label:'Balthus',              type:'artist',   x:-100, y:-140, desc:'Stillness. Ambiguity. The charged quality of stopped time.' },
  { id:'n17', label:'Velazquez',            type:'artist',   x:-140, y:160,  desc:'The body in space. How paint holds a presence.' },
  { id:'n20', label:'Cezanne',              type:'artist',   x:0,    y:-200, desc:'The structure beneath appearances. Multiple viewpoints in one plane.' },

  /* ── PLACES ────────────────────────────────────────────────── */
  { id:'n3',  label:'Bucharest',            type:'place',    x:-120, y:20,   desc:'The city as primary subject and studio.' },
  { id:'n11', label:'Istanbul',             type:'place',    x:-200, y:100,  desc:'A recurring reference for dense urban coexistence.' },
  { id:'n16', label:'Naples',               type:'place',    x:140,  y:-160, desc:'Density, colour, lives lived in public.' },

  /* ── BOOKS & ESSAYS — EXISTING ─────────────────────────────── */
  { id:'n4',  label:'The Poetics of Space', type:'book',     x:60,   y:80,   desc:'Gaston Bachelard, 1958. On how we inhabit and imagine space — the house as the first world, the corner as refuge.' },
  { id:'n9',  label:'Roland Barthes',       type:'essay',    x:-80,  y:120,  desc:'Camera Lucida (1980). The punctum. What a mark does to a viewer. Also: Sémiologie et Urbanisme (1967) — the city as sign system.' },
  { id:'n15', label:'Walter Benjamin',      type:'essay',    x:-240, y:-20,  desc:'The Arcades Project. The city as text to be read. Also: Unpacking My Library (1931) — collecting as a mode of attention.' },
  { id:'n7',  label:'Chantal Akerman',      type:'film',     x:-160, y:-60,  desc:'Jeanne Dielman (1975). Duration, repetition, the labour of daily life made visible through the camera\'s patience.' },

  /* ── WALKING & THE CITY ─────────────────────────────────────── */
  { id:'n21', label:'Walking as method',    type:'concept',  x:-320, y:-200, desc:'Baudelaire → Benjamin → Debord. The city entered on foot, without destination. Key text: Guy Debord, Theory of the Dérive (1956).' },
  { id:'n22', label:'Françoise Choay',      type:'book',     x:-420, y:-140, desc:'L\'Urbanisme: Utopies et Réalités (1965). Urbanism as ideology — the progressive vs culturalist models. Pre-urbanism to applied planning.' },
  { id:'n23', label:'Heidegger / dwelling', type:'essay',    x:-360, y:-300, desc:'Building Dwelling Thinking (1951). To build is to let dwell. Architecture as the fundamental form of human existence on earth.' },

  /* ── SPACE & THE CITY — LEFEBVRE'S TRIAD ───────────────────── */
  { id:'n24', label:'Perceived space',      type:'concept',  x:-160, y:240,  desc:'Lefebvre, La Production de l\'Espace (1974). Spatial practice — how each person moves through and reads the city via empirical, embodied experience.' },
  { id:'n25', label:'Conceived space',      type:'concept',  x:-60,  y:300,  desc:'Lefebvre + Barthes. The city\'s language produced by specialists — geographers, planners, sociologists. Barthes: Sémiologie et Urbanisme (1967).' },
  { id:'n26', label:'Lived space',          type:'concept',  x:-260, y:300,  desc:'Lefebvre, La Production de l\'Espace (1974). The symbolic life of the city — inhabited by artists, writers, philosophers who transform it from within.' },

  /* ── POSTMODERNITY & THE URBAN ──────────────────────────────── */
  { id:'n27', label:'David Lyon',           type:'book',     x:320,  y:200,  desc:'Postmodernity (1994). The social condition of the 21st century — new technologies and consumerism undermining modern certainties without replacing them.' },
  { id:'n28', label:'Cities & surveillance',type:'concept',  x:420,  y:140,  desc:'David Lyon, Surveillance Society (2001). The city as intercultural hub — and as machine for social sorting through data. Who moves freely, who is tracked.' },
  { id:'n29', label:'David Harvey',         type:'book',     x:360,  y:300,  desc:'The Condition of Postmodernity (1989). Time-space compression — capitalism annihilates space through time. Postmodern culture as product of flexible accumulation.' },

  /* ── WHAT IS ART? ───────────────────────────────────────────── */
  { id:'n30', label:'Danto — artworld',     type:'essay',    x:200,  y:-240, desc:'The Artworld (1964); The Transfiguration of the Commonplace (1981). Art requires a theoretical atmosphere. Warhol\'s Brillo Box: indiscernible objects, different status.' },
  { id:'n31', label:'Dickie — institution', type:'essay',    x:320,  y:-180, desc:'Art and the Aesthetic: An Institutional Analysis (1974). Art is an artifact conferred candidate status by persons acting on behalf of the artworld institution.' },
  { id:'n32', label:'Adorno — truth',       type:'essay',    x:260,  y:-320, desc:'Aesthetic Theory (1970, posth.). Art is autonomous and heteronomous. Truth content (Wahrheitsgehalt) lives in art\'s refusal of harmony and reconciliation.' },

  /* ── REINTERPRETATION, ARCHIVE & ACCUMULATION ──────────────── */
  { id:'n33', label:'Reinterpretation',     type:'concept',  x:-40,  y:-280, desc:'Eliot (1919) → Bloom (1973) → Bourriaud (2001). From surrender to tradition, to anxious misreading, to free use of existing cultural forms.' },
  { id:'n34', label:'Archive',              type:'concept',  x:80,   y:-320, desc:'Jacques Derrida, Archive Fever (1995). The archive points to the future, not the past. Power decides what is included. Rooted in the Greek arkheion.' },
  { id:'n35', label:'Accumulation',         type:'concept',  x:-80,  y:-320, desc:'Walter Benjamin, Unpacking My Library (1931). Collecting as a mode of attention — every object a portal to memory. Ownership as the deepest relation to things.' },
  { id:'n36', label:'Relational Aesthetics',type:'book',     x:160,  y:240,  desc:'Nicolas Bourriaud, Esthétique relationnelle (1998). Art\'s substrate is intersubjectivity — being-together, the encounter, the collective elaboration of meaning.' },
  { id:'n37', label:'Postproduction',       type:'book',     x:260,  y:180,  desc:'Nicolas Bourriaud, Postproduction (2001). Not "what can I make?" but "what can I do with what already exists?" The artist as semionaut, programmer of forms.' },

  /* ── LABOR, REPETITION & ALIENATION ────────────────────────── */
  { id:'n38', label:'Labor / Repetition',   type:'concept',  x:0,    y:280,  desc:'Hannah Arendt, The Human Condition (1958). Labor leaves nothing behind. Work builds the world. Action discloses who we are. Which one is painting?' },
  { id:'n39', label:'Alienation',           type:'concept',  x:100,  y:320,  desc:'Karl Marx, Economic and Philosophic Manuscripts of 1844 (pub. 1932). The worker puts his life into the object — the object grows alien and hostile. Four forms.' },
  { id:'n40', label:'Wit',                  type:'concept',  x:-100, y:-200, desc:'Lord Shaftesbury, Characteristics (1711). Wit as a mode of truth-telling — a way past social and intellectual defenses. Not decoration: vehicle for the unsayable.' },

  /* ── SPACE, IDENTITY & DISPLACEMENT ────────────────────────── */
  { id:'n41', label:'Displacement',         type:'concept',  x:100,  y:-180, desc:'Homi K. Bhabha, The Location of Culture (1994). The third space — where cultures collide and new identities form that belong fully to neither origin.' },
  { id:'n42', label:'Liminal space',        type:'concept',  x:-200, y:-200, desc:'Van Gennep (1909) → Victor Turner (1967). The threshold between — betwixt and between. Not transitional: productively unresolved. The in-between as position.' },
  { id:'n43', label:'Allegory',             type:'concept',  x:-300, y:-140, desc:'Walter Benjamin, The Origin of German Tragic Drama (1928). Allegory as the constitutive trope of modernity. Authority of power and the power of authority.' },
];

/* ─── CONNECTIONS ──────────────────────────────────────────────
   Add pairs of node IDs to draw a line between them.
   Use the id values from mNodeData above (n1 … n20).
   Example:  ['n1','n3']  draws a line from Urban coexistence → Bucharest
─────────────────────────────────────────────────────────────── */
var mEdges = [
	['n1', 'n9'],
  /* ['n1', 'n3'], */  /* uncomment and edit to add connections */
];

function initResearch() {
  if (resReady) return; resReady = true;
  mc = document.getElementById('researchCanvas');
  if (!mc) return;
  mx = mc.getContext('2d');
  mNodes = mNodeData.map(function(n) { return Object.assign({}, n); });
  populateFilters();

  function rsz() {
    var barH = document.querySelector('.research-bar') ? document.querySelector('.research-bar').offsetHeight : 44;
    var topOff = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 48;
    var dpr = window.devicePixelRatio || 1;
    var cssW = window.innerWidth;
    var cssH = window.innerHeight - (topOff + barH);
    mc.width  = Math.round(cssW * dpr);
    mc.height = Math.round(cssH * dpr);
    mc.style.width  = cssW + 'px';
    mc.style.height = cssH + 'px';
    mOx = cssW / 2; mOy = cssH / 2;
    drawMap();
  }
  rsz(); window.addEventListener('resize', rsz);

  /* mouse events */
  mc.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    var p = evPos(e);
    var hit = hitNode(p);
    if (hit) { mDragging=true; mDragNode=hit; mLastX=p.x; mLastY=p.y; mc.style.cursor='grabbing'; }
    else { mPanning=true; mPanStartX=p.x; mPanStartY=p.y; mPanOrigX=mOx; mPanOrigY=mOy; mc.style.cursor='grabbing'; }
  });
  mc.addEventListener('mousemove', function(e) {
    var p = evPos(e);
    if (mDragging && mDragNode) {
      mDragNode.x += (p.x - mLastX) / mScale;
      mDragNode.y += (p.y - mLastY) / mScale;
      mLastX=p.x; mLastY=p.y; drawMap();
    } else if (mPanning) {
      mOx = mPanOrigX + (p.x - mPanStartX);
      mOy = mPanOrigY + (p.y - mPanStartY);
      drawMap();
    } else {
      var hl = hitNode(p);
      if (hl !== mHighlight) { mHighlight=hl; drawMap(); showTooltip(hl, e); }
    }
  });
  mc.addEventListener('mouseup',    function() { mDragging=false; mDragNode=null; mPanning=false; mc.style.cursor='grab'; });
  mc.addEventListener('mouseleave', function() { mDragging=false; mPanning=false; mHighlight=null; hideTooltip(); drawMap(); });
  mc.addEventListener('wheel', function(e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.1 : 0.91;
    mScale = Math.max(0.3, Math.min(3, mScale * factor));
    drawMap();
  }, { passive:false });

  /* touch */
  var tDist = 0;
  mc.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      var p = evPos(e.touches[0]);
      var hit = hitNode(p);
      if (hit) { mDragging=true; mDragNode=hit; mLastX=p.x; mLastY=p.y; }
      else { mPanning=true; mPanStartX=p.x; mPanStartY=p.y; mPanOrigX=mOx; mPanOrigY=mOy; }
    } else if (e.touches.length === 2) {
      tDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    }
  }, { passive:true });
  mc.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      var p = evPos(e.touches[0]);
      if (mDragging && mDragNode) { mDragNode.x+=(p.x-mLastX)/mScale; mDragNode.y+=(p.y-mLastY)/mScale; mLastX=p.x; mLastY=p.y; }
      else if (mPanning) { mOx=mPanOrigX+(p.x-mPanStartX); mOy=mPanOrigY+(p.y-mPanStartY); }
      drawMap();
    } else if (e.touches.length === 2) {
      var d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      mScale = Math.max(0.3, Math.min(3, mScale * (d/tDist))); tDist=d; drawMap();
    }
  }, { passive:false });
  mc.addEventListener('touchend', function(e) {
    mDragging=false; mPanning=false;
    /* on tap (no pan) show tooltip */
    if (e.changedTouches.length === 1) {
      var t = e.changedTouches[0];
      var p = evPos(t);
      var hit = hitNode(p);
      if (hit) showTooltipTouch(hit, t.clientX, t.clientY);
      else hideTooltip();
    }
  });

  drawMap();
}

function evPos(e) { var r=mc.getBoundingClientRect(); return { x:e.clientX-r.left, y:e.clientY-r.top }; }

function worldToScreen(x, y) {
  return { x: mOx + x*mScale, y: mOy + y*mScale };
}

function hitNode(p) {
  for (var i = mNodes.length-1; i >= 0; i--) {
    if (activeTypes[mNodes[i].type] === false) continue;
    var s = worldToScreen(mNodes[i].x, mNodes[i].y);
    var r = Math.max(14, 20*mScale);
    if (Math.hypot(p.x-s.x, p.y-s.y) < r) return mNodes[i];
  }
  return null;
}

function drawMap() {
  if (!mc || !mx) return;
  var dpr = window.devicePixelRatio || 1;
  var cssW = mc.width / dpr, cssH = mc.height / dpr;
  mx.save();
  mx.setTransform(dpr, 0, 0, dpr, 0, 0);
  mx.clearRect(0, 0, cssW, cssH);

  /* edges - proximity-based automatic */
  for (var i = 0; i < mNodes.length; i++) {
    var visI = activeTypes[mNodes[i].type] !== false;
    if (!visI) continue;
    for (var j = i+1; j < mNodes.length; j++) {
      var visJ = activeTypes[mNodes[j].type] !== false;
      if (!visJ) continue;
      var dist = Math.hypot(mNodes[i].x - mNodes[j].x, mNodes[i].y - mNodes[j].y);
      if (dist < 220) {
        var a = worldToScreen(mNodes[i].x, mNodes[i].y);
        var b2 = worldToScreen(mNodes[j].x, mNodes[j].y);
        var alpha = Math.max(0, (1 - dist/220) * 0.55);
        mx.beginPath(); mx.moveTo(a.x, a.y); mx.lineTo(b2.x, b2.y);
        mx.strokeStyle = 'rgba(160,154,144,' + alpha + ')';
        mx.lineWidth = 0.8; mx.stroke();
      }
    }
  }

  /* manual edges — defined in mEdges array above */
  mEdges.forEach(function(ed) {
    var na = mNodes.find(function(n){ return n.id===ed[0]; });
    var nb = mNodes.find(function(n){ return n.id===ed[1]; });
    if (!na||!nb) return;
    if (activeTypes[na.type]===false||activeTypes[nb.type]===false) return;
    var a = worldToScreen(na.x,na.y), b2 = worldToScreen(nb.x,nb.y);
    mx.beginPath(); mx.moveTo(a.x,a.y); mx.lineTo(b2.x,b2.y);
    mx.strokeStyle = 'rgba(160,154,144,0.55)';
    mx.lineWidth = 0.8; mx.stroke(); 
  });

  /* nodes - respect activeTypes filter */
  mNodes.forEach(function(n) {
    if (activeTypes[n.type] === false) return;
    var s = worldToScreen(n.x, n.y);
    var col = tColors[n.type] || '#888';
    var isHl = n === mHighlight;
    var r = Math.max(6, (isHl ? 10 : 7) * mScale);

    /* outer ring */
    mx.beginPath(); mx.arc(s.x, s.y, r, 0, Math.PI*2);
    mx.strokeStyle = col; mx.lineWidth = isHl ? 2 : 1.5; mx.globalAlpha = isHl ? 1 : 0.9;
    mx.stroke();
    /* transparent fill */
    mx.beginPath(); mx.arc(s.x, s.y, r, 0, Math.PI*2);
    mx.fillStyle = col; mx.globalAlpha = isHl ? 0.25 : 0.12; mx.fill();
    mx.globalAlpha = 1;

    var fontSize = Math.round(Math.max(9, (isHl ? 12 : 10) * mScale));
    mx.font = (isHl ? 'italic ' : '') + fontSize + 'px Cormorant Garamond,Georgia,serif';
    mx.fillStyle = isHl ? '#1a1916' : '#6a6560';
    mx.textAlign = 'center';
    mx.fillText(n.label, s.x, s.y - r - 4);
  });

  mx.restore();
}

function showTooltip(n, e) {
  var tt = document.getElementById('mapTooltip');
  if (!tt) return;
  if (!n) { tt.classList.remove('visible'); return; }
  document.getElementById('tt-label').textContent = n.label;
  document.getElementById('tt-type').textContent  = n.type;
  document.getElementById('tt-desc').textContent  = n.desc || '';
  var lnk = document.getElementById('tt-link');
  if (n.url) { lnk.href=n.url; lnk.classList.add('has-url'); }
  else { lnk.classList.remove('has-url'); }
  /* position tooltip — ensure fully visible on screen */
  tt.style.visibility = 'hidden';
  tt.classList.add('visible');
  var ttW = tt.offsetWidth || 220;
  var ttH = tt.offsetHeight || 80;
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var cx = e.clientX, cy = e.clientY;
  var tx = cx + 16;
  if (tx + ttW > vw - 8) tx = cx - ttW - 16;
  if (tx < 8) tx = 8;
  var ty = cy - 10;
  if (ty + ttH > vh - 8) ty = cy - ttH - 10;
  if (ty < 8) ty = 8;
  tt.style.left = tx + 'px';
  tt.style.top  = ty + 'px';
  tt.style.visibility = '';
}
/* mobile tap: show tooltip on touchend */
function showTooltipTouch(n, cx, cy) {
  var tt = document.getElementById('mapTooltip');
  if (!tt) return;
  if (!n) { tt.classList.remove('visible'); return; }
  document.getElementById('tt-label').textContent = n.label;
  document.getElementById('tt-type').textContent  = n.type;
  document.getElementById('tt-desc').textContent  = n.desc || '';
  var lnk = document.getElementById('tt-link');
  if (n.url) { lnk.href=n.url; lnk.classList.add('has-url'); } else { lnk.classList.remove('has-url'); }
  tt.style.visibility = 'hidden';
  tt.classList.add('visible');
  var ttW = tt.offsetWidth || 220;
  var ttH = tt.offsetHeight || 80;
  var vw = window.innerWidth, vh = window.innerHeight;
  var tx = Math.min(cx + 16, vw - ttW - 8);
  if (tx < 8) tx = 8;
  var ty = Math.min(cy - ttH - 16, vh - ttH - 8);
  if (ty < 8) ty = cy + 16;
  tt.style.left = tx + 'px';
  tt.style.top  = ty + 'px';
  tt.style.visibility = '';
}
function hideTooltip() {
  var tt = document.getElementById('mapTooltip');
  if (tt) tt.classList.remove('visible');
}

/* view toggle for research */
function renderResList() {
  var alphaNav  = document.getElementById('resAlphaNav');
  var listItems = document.getElementById('resListItems');
  if (!listItems) return;

  var sorted = mNodes.slice().sort(function(a,b){ return a.label.localeCompare(b.label); });

  var letters = {};
  sorted.forEach(function(n){
    var l = n.label[0].toUpperCase();
    if (!letters[l]) letters[l] = [];
    letters[l].push(n);
  });

  var allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /* build sticky alphabet nav with all 26 letters */
  if (alphaNav) {
    alphaNav.innerHTML = '';
    allLetters.forEach(function(l) {
      var btn = document.createElement('button');
      btn.className = 'alpha-nav-btn' + (letters[l] ? ' has-entries' : '');
      btn.textContent = l;
      if (letters[l]) {
        btn.onclick = function() {
          var section = document.getElementById('alpha-section-'+l);
          if (!section) return;
          /* open if closed */
          if (section.classList.contains('closed')) {
            section.classList.remove('closed');
            var items = section.querySelector('.alpha-items');
            if (items) { items.style.maxHeight = items.scrollHeight+'px'; setTimeout(function(){ items.style.maxHeight='none'; },360); }
          }
          /* scroll page-research — now overflow-y:auto in list view */
          var pageEl = document.getElementById('page-research');
          if (!pageEl) return;
          var alphaH = alphaNav ? alphaNav.offsetHeight : 48;
          var sectionRect = section.getBoundingClientRect();
          var pageRect   = pageEl.getBoundingClientRect();
          var target = pageEl.scrollTop + (sectionRect.top - pageRect.top) - alphaH - 8;
          pageEl.scrollTo({ top: target, behavior: 'smooth' });
        };
      } else {
        btn.style.opacity = '0.3';
        btn.style.cursor = 'default';
      }
      alphaNav.appendChild(btn);
    });
  }

  /* build collapsible letter sections */
  listItems.innerHTML = '';
  Object.keys(letters).sort().forEach(function(l) {
    var section = document.createElement('div');
    section.className = 'alpha-section';
    section.id = 'alpha-section-'+l;

    var heading = document.createElement('div');
    heading.className = 'alpha-heading';
    heading.innerHTML =
      '<span class="alpha-letter">'+l+'</span>'+
      '<span style="display:flex;align-items:center;gap:1.2rem">'+
        '<span class="alpha-count">'+letters[l].length+' '+(letters[l].length===1?'entry':'entries')+'</span>'+
        '<span class="alpha-toggle">&#9660;</span>'+
      '</span>';
    heading.onclick = function() {
      section.classList.toggle('closed');
      var items = section.querySelector('.alpha-items');
      if (section.classList.contains('closed')) {
        items.style.maxHeight = items.scrollHeight+'px';
        requestAnimationFrame(function(){ items.style.maxHeight='0'; });
      } else {
        items.style.maxHeight = items.scrollHeight+'px';
        setTimeout(function(){ items.style.maxHeight='none'; },360);
      }
    };
    section.appendChild(heading);

    var itemsWrap = document.createElement('div');
    itemsWrap.className = 'alpha-items';
    itemsWrap.style.maxHeight = 'none';

    letters[l].forEach(function(n) {
      var col = tColors[n.type] || '#888';
      var row = document.createElement('div');
      row.className = 'list-entry';
      row.innerHTML =
        '<span class="list-entry-name">'+n.label+'</span>'+
        '<span class="list-entry-desc">'+(n.desc||'')+'</span>'+
        '<span class="list-entry-type">'+
          '<span class="list-entry-type-dot" style="background:'+col+'"></span>'+n.type+
        '</span>';
      row.onclick = function() { flyToNode(n.id); };
      itemsWrap.appendChild(row);
    });

    section.appendChild(itemsWrap);
    listItems.appendChild(section);
  });
}

function setResView(v) {
  var con  = document.getElementById('res-constellation');
  var lst  = document.getElementById('res-list');
  var tf   = document.getElementById('typeFilters');
  var page = document.getElementById('page-research');
  if (con) con.style.display = v==='constellation' ? 'block' : 'none';
  if (lst) lst.style.display = v==='list'          ? 'block' : 'none';
  if (tf)  tf.style.display  = v==='constellation' ? 'flex'  : 'none';
  /* toggle page overflow so list can scroll */
  if (page) page.style.overflowY = v==='list' ? 'auto' : 'hidden';
  var bc = document.getElementById('btn-constellation');
  var bl = document.getElementById('btn-list');
  if (bc) bc.classList.toggle('active-view', v==='constellation');
  if (bl) bl.classList.toggle('active-view', v==='list');
  if (v==='constellation' && resReady) setTimeout(drawMap, 50);
  if (v==='list') {
    var li = document.getElementById('resListItems');
    if (li) li.innerHTML = '';
    renderResList();
  }
}

/* fly to node when clicking list entry */
function flyToNode(id) {
  var n = mNodes.find(function(x){ return x.id===id; });
  if (!n) return;
  setResView('constellation');
  mHighlight = n;
  mOx = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||0) / 2;
  mOy = mc.height / (window.devicePixelRatio||1) / 2;
  mOx = mc.width  / (window.devicePixelRatio||1) / 2 - n.x * mScale;
  mOy = mc.height / (window.devicePixelRatio||1) / 2 - n.y * mScale;
  drawMap();
}

/* copy positions helper */
function copyPositions() {
  var out = mNodes.map(function(n){ return '{id:"'+n.id+'",x:'+Math.round(n.x)+',y:'+Math.round(n.y)+'}'; }).join(',\n');
  navigator.clipboard.writeText(out).then(function(){ alert('Positions copied to clipboard'); });
}

/* ---- HOME SIGNATURE ----------------------------------------- */
(function() {
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('homeSig');
  if (!svg) return;
  var strokes = [
    {d:'M 12,108 C 16,85 24,54 35,18',w:2.6},{d:'M 35,18 C 46,55 53,82 58,110',w:2.5},{d:'M 20,73 C 27,70 43,69 52,72',w:1.9},
    {d:'M 74,100 C 73,79 73,57 74,28',w:2.4},{d:'M 74,28 C 88,24 102,36 102,57 C 102,77 96,98 78,102 C 76,102 74,102 74,102',w:2.2},
    {d:'M 118,27 C 117,53 117,79 116,108',w:2.4},{d:'M 116,27 C 131,23 141,33 140,51 C 139,63 130,70 116,71',w:2.2},{d:'M 124,70 C 131,82 139,95 147,109',w:2.1},
    {d:'M 161,43 C 167,41 173,42 176,43',w:1.9},{d:'M 168,42 C 167,59 166,79 165,100',w:2.3},{d:'M 158,100 C 163,99 168,101 173,100',w:1.9},
    {d:'M 186,108 C 190,87 197,62 207,34',w:2.5},{d:'M 207,34 C 217,63 222,86 224,110',w:2.4},{d:'M 194,77 C 200,74 212,74 220,77',w:1.9},
    {d:'M 238,22 C 238,50 237,78 236,110',w:2.4},{d:'M 237,23 C 246,54 256,81 264,110',w:2.2},{d:'M 263,33 C 263,58 262,82 261,110',w:2.4},
    {d:'M 54,148 C 46,136 33,132 22,141 C 10,153 9,175 13,197 C 17,215 28,228 41,226 C 50,224 57,215 59,204',w:2.4},
    {d:'M 78,158 C 72,158 64,166 63,180 C 62,196 68,218 80,224 C 92,230 104,222 107,208 C 110,194 106,174 98,164 C 92,158 84,156 78,158',w:2.3},
    {d:'M 136,158 C 142,156 148,156 151,158',w:1.9},{d:'M 144,157 C 143,178 142,204 141,220 C 140,232 132,239 123,234 C 118,231 116,224 118,218',w:2.2},
    {d:'M 174,160 C 168,160 160,168 159,182 C 158,198 164,220 176,226 C 188,232 200,224 203,210 C 206,196 202,174 194,164 C 188,158 180,158 174,160',w:2.3},
    {d:'M 264,162 C 256,150 243,148 233,157 C 222,168 221,190 225,209 C 229,222 238,232 248,229 C 256,227 262,218 264,207',w:2.4},
    {d:'M 278,238 C 282,213 291,180 302,150',w:2.5},{d:'M 302,150 C 313,181 319,211 322,240',w:2.4},{d:'M 286,198 C 292,195 307,194 317,197',w:1.9},
    {d:'M 336,152 C 335,177 334,204 333,238',w:2.4},{d:'M 333,152 C 348,148 357,159 356,175 C 355,186 346,193 333,194',w:2.2},{d:'M 340,193 C 347,208 355,221 362,238',w:2.1},
    {d:'M 376,152 C 375,178 374,205 375,218 C 377,233 387,240 396,237 C 405,234 410,223 410,210 C 410,196 410,174 410,152',w:2.3}
  ];
  var built = [];
  strokes.forEach(function(s) {
    var p = document.createElementNS(NS,'path');
    p.setAttribute('d',s.d); p.setAttribute('fill','none');
    p.setAttribute('stroke','#1a1916'); p.setAttribute('stroke-linecap','round');
    p.setAttribute('stroke-linejoin','round'); p.setAttribute('stroke-width',s.w);
    svg.appendChild(p);
    var len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    built.push({p:p, len:len});
  });
  function animateSig() {
    built.forEach(function(b){ b.p.style.transition='none'; b.p.style.strokeDashoffset=b.len; });
    var t = 500;
    built.forEach(function(b, i) {
      if (i === 17) t += 420;
      var dur = Math.max(130, Math.min(520, b.len*2.8));
      var jitter = Math.round((Math.random()-0.5)*28);
      var gap = 20 + Math.round(Math.random()*14);
      (function(el,d,delay){
        setTimeout(function(){ el.style.transition='stroke-dashoffset '+d+'ms cubic-bezier(0.2,0,0.45,1)'; el.style.strokeDashoffset=0; }, delay);
      })(b.p, dur+jitter, t);
      t += Math.round((dur+jitter)*0.74) + gap;
    });
  }
  setTimeout(animateSig, 300);
  svg.addEventListener('click', function(){ setTimeout(animateSig,40); });
})();

/* ---- COPYRIGHT YEAR ----------------------------------------- */
var cyrEl = document.getElementById('copyrightYear');
if (cyrEl) cyrEl.textContent = new Date().getFullYear();

/* ---- SEO: structured data ----------------------------------- */
(function(){
  var sd = document.createElement('script');
  sd.type = 'application/ld+json';
  sd.textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"Person",
    "name":"Adrian Cojocaru",
    "jobTitle":["Visual Artist", "Pictor"],
    "url":"https://adriancojocaru.art",
    "image":"https://adriancojocaru.art/images/bio.jpg",
    "sameAs":[
      "https://www.instagram.com/adriancojocaruu"
    ],
    "address":{
      "@type":"PostalAddress",
      "addressLocality":"Iași",
      "addressCountry":"RO"
    },
    "description":"Adrian Cojocaru paints what he needs to see. A painter working from a personal image archive built through years of walking — between art history, daily life, and the unexpected corners of cities.",
    "knowsAbout":["Painting","Drawing","Installation art","Printmaking","Contemporary art","Pictură","Desen","Artă contemporană","Gravură"],
    "hasOccupation":{
      "@type":"Occupation",
      "name":"Visual Artist",
      "occupationLocation":{"@type":"Country","name":"Romania"}
    },
    "alumniOf":[
      {"@type":"EducationalOrganization","name":"National University of Arts George Enescu","address":{"@type":"PostalAddress","addressLocality":"Iasi","addressCountry":"RO"}},
      {"@type":"EducationalOrganization","name":"PXL-MAD School of Arts","address":{"@type":"PostalAddress","addressLocality":"Hasselt","addressCountry":"BE"}}
    ],
    "workExample":[
      {"@type":"VisualArtwork","name":"Acts of in-between","artMedium":"Charcoal on canvas and oil on linen","dateCreated":"2024"},
      {"@type":"VisualArtwork","name":"Il Pane è la Vita","artMedium":"Oil on canvas","dateCreated":"2022"}
    ]
  });
  document.head.appendChild(sd);
})();

/* ---- iOS scroll-to-top (tap status bar) -------------------- */
/* The pages are position:fixed so window never scrolls.
   iOS fires a touchstart with a single touch near y=0 when the
   user taps the status bar. We detect that and scroll the active
   page div to the top.                                          */
document.addEventListener('touchstart', function(e) {
  if (e.touches.length === 1 && e.touches[0].clientY < 20) {
    var active = document.querySelector('.page.active');
    if (active) active.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, { passive: true });

/* ---- DIARY MASONRY (left-to-right order) -------------------- */
var moodItemsCache = null;

function layoutMasonry() {
  var wrap = document.querySelector('.moodboard-wrap');
  if (!wrap || !moodItemsCache || !moodItemsCache.length) return;

  var vw = window.innerWidth;
  var cols = vw < 480 ? 2 : vw < 768 ? 3 : 5;

  wrap.innerHTML = '';
  var columns = [];
  for (var i = 0; i < cols; i++) {
    var col = document.createElement('div');
    col.className = 'moodboard-col';
    wrap.appendChild(col);
    columns.push({ el: col, h: 0 });
  }

  var colW = wrap.offsetWidth > 0 ? wrap.offsetWidth / cols : (vw / cols);

  moodItemsCache.forEach(function(item) {
    var shortest = columns.reduce(function(a, b) { return a.h <= b.h ? a : b; });
    shortest.el.appendChild(item);
    var img = item.querySelector('img');
    var isVideo = item.classList.contains('mood-item--video');
    var isNote  = item.classList.contains('mood-item--note');
    var imgH = isVideo ? colW * 0.5625 + 40
             : isNote  ? 160
             : (img && img.naturalHeight && img.naturalWidth)
               ? (img.naturalHeight / img.naturalWidth) * colW
               : 200;
    shortest.h += imgH + 40;
  });
}

function initMoodMasonry() {
  var wrap = document.querySelector('.moodboard-wrap');
  if (!wrap) return;

  /* collect items fresh from DOM */
  moodItemsCache = Array.from(wrap.querySelectorAll('.mood-item'));
  if (!moodItemsCache.length) return;

  /* run immediately — images already cached load instantly,
     others use 200px estimate and reflow naturally as they arrive */
  layoutMasonry();
}

/* debounced resize */
var _masonryTimer = null;
window.addEventListener('resize', function() {
  if (!document.getElementById('page-moodboard').classList.contains('active')) return;
  clearTimeout(_masonryTimer);
  _masonryTimer = setTimeout(function() { layoutMasonry(); }, 150);
});
/* read hash on load so direct links work e.g. adriancojocaru.art/#contact */
(function() {
  var validPages = ['home','works','projects','about','news','contact','moodboard','drawn','sketch','research'];
  var hash = window.location.hash.replace('#','');
  var startPage = (hash && validPages.indexOf(hash) !== -1) ? hash : 'home';
  showPage(startPage);
})();


