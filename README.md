# Gatepost Partners: website

A static one-page site with a local dev server. No frameworks, no build step,
and nothing to install. The server uses only what already ships with Node.

## Running it

From this folder:

```bash
npm start
```

Then open **http://localhost:4321**.

Save any file while it's running and the page reloads by itself. Press `Ctrl+C`
in the terminal to stop it.

(If port 4321 is busy the server moves to 4322, 4323, and so on. The terminal
prints whichever one it landed on.)

## Which file do I edit?

| I want to change | Open |
|---|---|
| Headlines, paragraphs, the phase write-ups | `index.html` |
| Email, phone, booking link, EBITDA range, states | `assets/site-data.js` |
| Brand colors, fonts | `assets/theme.js` |
| Button, label, and form-field styling | `assets/components.css` |
| The downloadable factsheet | replace `assets/docs/Gatepost-Partners-Factsheet.pdf` |
| Menu, carousel, booking, form behavior | `assets/site.js` |

`index.html` is divided by banner comments (`HERO`, `INVESTMENT CRITERIA`,
`THE PROCESS`, `ABOUT`) matching the sections you see on the page, so you can
scroll to the part you're looking at and edit the words in place.

## Page structure

The site now covers the Southeast pest control platform. The septic version
is preserved under the git tag `septic-final` (`git checkout septic-final`).

1. Hero: headline and an At a Glance panel of the criteria
2. Credibility strip: 4 facts (majority, partnership rollover, 5 days, 1 platform)
3. The Thesis: why pest control, the Southeast, and partnership, kept general (no third-party company figures)
4. Partnership: "Row together", the 3 platform stages, what the platform brings vs what stays yours
5. Investment Criteria: 4 blocks (founding and partner company size), then A Good Fit vs Out of Scope
6. Target Services: residential, commercial, termite and specialty
7. About: photo carousel, contact details, and the bio
8. How This Works: 5 commitments, including aligned interests through rollover
9. The Process: 6 steps, ending with Row together after closing
10. Factsheet: a download card linking to the PDF
11. Book a Meeting: the scheduler embed
12. Contact: the form
13. Footer

Keep returns, leverage, and the LP structure off this site. Those belong in the
investor-facing thesis PDF, not a public page for owners and brokers.

## Common edits

**Change the email or phone number.** Edit `assets/site-data.js` only. Those
values are used in the About card, the contact block, and the footer, so
there is no stale copy left anywhere.

**Add or remove a state.** Edit the `states` list in `assets/site-data.js`. The
sentence in the Investment Criteria section follows it, and the "and" before the
last state is added for you.

**Change the brand colors.** Edit the hex values in `assets/theme.js`. The scale
runs 50 (lightest) to 950 (darkest). `ink` is the charcoal used for text and the
footer, `teal` is the one accent color, `paper` is the section backgrounds.

**Swap the headshot.** The photo is `assets/images/chris-kern.jpg` (800px wide,
174 KB, pulled from your one-pager). Drop a replacement in that folder and
change the `src` in the ABOUT section of `index.html`.

## Receiving real messages

The contact form validates input and shows a thank-you dialog, but doesn't send
anything. A site running on your own machine has nowhere to send it. To hook it
up, sign up with a form service (Formspree, Basin, Getform, and Netlify Forms
all work the same way), then open `assets/site.js` and set the endpoint they give
you near the top of the file:

```js
const FORM_ENDPOINT = 'https://formspree.io/f/yourFormId';
```

The form will then POST to that service and email you each submission.

There is no file upload anywhere on the site, by design. Brokers and owners send
teasers, CIMs, and financials by email.

## Putting it online later

Everything here is static, so any host will take it as-is. Drag this folder onto
[netlify.com/drop](https://app.netlify.com/drop), or point Cloudflare Pages,
GitHub Pages, or Vercel at it. `server.mjs` and `package.json` are only for local
development. Hosts ignore them and serve `index.html` directly.

One thing worth knowing before launch: the site loads Tailwind from a CDN, which
compiles styles in the browser. That's ideal for editing, because you change a
class and see it instantly, but it adds a moment of load time for visitors. If
you want the site as fast as possible on a real domain, that's the one piece
worth swapping for a pre-built stylesheet. Nothing else about the site changes.

## The factsheet PDF

The download button links straight to
`assets/docs/Gatepost-Partners-Factsheet.pdf`. The pest control factsheet is
built from `Pest Control/Marketing/Fact Sheet/gatepost-factsheet.html`: edit that
page, print it to PDF (Letter, no margins, background graphics on), and
overwrite this file, keeping the same filename. Nothing in the HTML needs to change.

## Connecting the Book a Meeting section

The scheduler is embedded from whatever link you put in `assets/site-data.js`
under `bookingUrl`. Leave it as an empty string and the section falls back to
your email and phone, so the page is never broken while you set it up.

**Microsoft Bookings** is included with your Microsoft 365 account and reads
your Outlook calendar directly:

1. Go to outlook.office.com/bookings and create a booking page
2. Add one service, "Intro call", 30 minutes
3. Under Booking page, set it to public and copy the URL
4. Paste it into `bookingUrl`

**Calendly** works the same way and connects to Outlook under Account Settings,
Calendar connections. Its URLs are shorter and easier to say out loud.

Either way the embed reads your real availability, so a time someone picks is a
time you actually have free.
