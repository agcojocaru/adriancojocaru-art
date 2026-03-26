# adriancojocaru.art

Personal website source code — not intended for reuse.

---

## Repository structure

```
your-repository/
├── index.html        ← the entire website
├── build.js          ← reads diary/ and drawn/ folders, rebuilds the site
├── netlify.toml      ← tells Netlify to run build.js and sets security headers
├── favicon.svg       ← animated AC favicon
├── favicon.png       ← fallback favicon
├── works/            ← painting images used in Selected Works and Projects
├── images/           ← bio photo, news thumbnails, misc
├── news/             ← news item images
├── diary/            ← moodboard/diary photos (auto-injected by build.js)
├── drawn/            ← sketchbook drawings (auto-injected by build.js)
└── archive/          ← PDFs for press/articles linked from News
```

---

## Adding a diary entry

1. Resize image to max 1600px wide at [squoosh.app](https://squoosh.app) — JPG, 78% quality
2. Name it: `YYYY-MM-DD-description.jpg` e.g. `2025-03-22-bucharest-studio.jpg`
3. Go to your repository → click `diary/` → **Add file → Upload files**
4. Drag the image in → **Commit changes**
5. Netlify rebuilds in ~60 seconds — image appears at the top of the Diary page

**Optional caption:** upload a `.txt` file with the same base name alongside the image:
- `2025-03-22-bucharest-studio.txt`
- One line of text inside, e.g. `Morning light, studio Bucharest`

---

## Adding a drawn work

Drawings saved from the Sketchbook tool download as `YYYY-MM-DD-drawing01.jpg` automatically.

1. Go to repository → click `drawn/` → **Add file → Upload files**
2. Drag the file in → **Commit changes**
3. Appears at the top of Drawn Works within ~60 seconds

Same naming and caption rules as diary.

---

## Adding a new painting (works/)

1. Resize to max 2400px wide — JPG, 85% quality
2. Name it: `title-of-work-YYYY.jpg` e.g. `agency-of-a-liminal-space-2024.jpg`
3. Upload to the `works/` folder
4. Edit `index.html` → find the `WORKS` array → add an entry:

```js
{ title:'Work Title',
  img:'works/your-filename.jpg',
  year:'2025',
  medium:'Oil on linen',
  dims:'100 x 80 cm',
  status:'available',          // 'available', 'private', or omit
  exhibited: [
    'Gallery Name, City, Year',
    'Second Gallery, City, Year'
  ],
  desc:'Optional description.' }
```

---

## Adding multiple exhibitions to a work

`exhibited` is an array — one string per exhibition, separated by commas:

```js
exhibited: [
  'First exhibition, Gallery, City, Year',
  'Second exhibition, Gallery, City, Year',
  'Third exhibition, Gallery, City, Year'
]
```

Do NOT write `exhibited:` twice. One `exhibited:`, one `[`, all entries inside.

---

## Adding a news item

1. Upload a thumbnail image to `news/`
2. Edit `index.html` → find the `<!-- NEWS -->` section → copy an existing `.news-item` block and edit it
3. To link a PDF: add after the excerpt paragraph:
   ```html
   <a class="news-pdf-link" href="archive/your-file.pdf" target="_blank">Read article / PDF</a>
   ```
4. Upload the PDF to the `archive/` folder

---

## Adding an exhibition text to a project

Find the project in the `PROJECTS` array in `index.html` and add:

```js
exhibitionText: [
  'First paragraph of the exhibition text.',
  'Second paragraph.'
],
exhibitionTextAuthor: 'Author Name, Year',
```

The text appears at the bottom of the works grid as a collapsible block.
Omit both fields entirely if there is no exhibition text.

---

## Adding connections on the Research Map

Find the `mEdges` array in `index.html` and add pairs of node IDs:

```js
var mEdges = [
  ['n1', 'n3'],   // Urban coexistence → Bucharest
  ['n4', 'n9'],   // The Poetics of Space → Roland Barthes
];
```

Node IDs are `n1` through `n20` — labels are in the `mNodeData` array just above.

---

## Image naming convention

Always: `YYYY-MM-DD-description.jpg` for diary and drawn.
Always: `title-of-work-year.jpg` for works and news.
Lowercase, hyphens instead of spaces, no special characters.

---

## Editing content directly

Everything is in `index.html`. To edit on GitHub:

1. Click `index.html` in the repository
2. Click the pencil icon (Edit this file)
3. Use **Ctrl+F** / **Cmd+F** to search for what you want to change
4. Edit → **Commit changes**

Netlify rebuilds automatically within ~60 seconds.

---

## Contact form submissions

Submissions appear in: **Netlify dashboard → Forms → contact**

---

## Newsletter

The subscribe form currently shows a confirmation but does not collect emails.
To actually collect emails, sign up for one of these free services and follow their embed instructions:

- [Buttondown](https://buttondown.email) — free up to 100 subscribers
- [Mailchimp](https://mailchimp.com) — free up to 500 subscribers
- [Substack](https://substack.com) — free, also lets you publish posts
