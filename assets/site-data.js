/* ===========================================================================
   SITE DETAILS: edit these once, they update everywhere
   ---------------------------------------------------------------------------
   These values appear in several places at once (the nav, the About section,
   the contact block, the footer). Changing them here changes all of them, so
   there is never a stale phone number left somewhere on the page.

   Longer writing (headlines, paragraphs, the phase descriptions) lives in
   index.html, where you can see it in context.
   =========================================================================== */

window.SITE = {
  /* --- identity --------------------------------------------------------- */
  firmName: 'Gatepost Partners',
  founderName: 'Chris Kern',
  founderTitle: 'Founder',

  /* --- how people reach you --------------------------------------------- */
  email: 'chris@gatepostpartners.com',
  phone: '(813) 597-5980',
  phoneLink: '+18135975980',          // digits only, for click-to-call on phones
  linkedin: 'linkedin.com/in/chrishkern',

  /* --- booking ----------------------------------------------------------- *
     The public scheduling page, embedded in the Book a Meeting section.

     This is a Google Calendar appointment schedule. The share link
     (calendar.app.google/...) redirects here; the "?gv=true" on the end is
     what makes Google serve the compact grid built for embedding, so keep it.

     To swap schedulers, paste any embeddable booking URL. Leave it as an empty
     string and the section falls back to email and phone instead. */
  bookingUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3HmBb4snJJfk2VpCgiWtUUAPl5tCIKzvPuE3LLNzbUYQk_UJCwCD4F5P03aWL6IMWZ2_VWk-CQ?gv=true',

  /* Shown as a plain link under the embed, for anyone whose browser blocks
     third-party frames. */
  bookingShortUrl: 'https://calendar.app.google/Zqq49Yo81E5StoxTA',

  /* --- contact form ------------------------------------------------------ *
     Where the contact form delivers. Get a key at web3forms.com: enter the
     inbox you want submissions sent to and they email the key straight back.
     No account, no password. Paste it between the quotes.

     This key is designed to sit in public page source. It only permits
     delivery to the address you registered, so it is safe to publish. */
  formAccessKey: '',

  /* --- the acquisition mandate ------------------------------------------ */
  ebitdaRange: '$500,000 to $2,000,000',
  revenueRange: '$2 million to $12 million',
  industry: 'Septic and wastewater services',
  geography: 'Mid-Atlantic and Southeast',

  /* States listed in the Investment Criteria section. */
  states: [
    'Virginia',
    'North Carolina',
    'South Carolina',
    'Georgia',
    'Maryland',
    'Delaware',
    'Tennessee',
    'Florida',
    'Alabama'
  ]
};
