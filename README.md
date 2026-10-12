# Avinash M — Personal Portfolio

A responsive, dark-themed portfolio built with HTML, CSS, and vanilla JavaScript.
No build step, package installation, or third-party services are required.

## Preview

Open `index.html` in a modern browser, or serve the directory locally:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000`. Deploy these static files to any static web host.

## Content and contact setup

- Update `index.html` with verified employment history, project case studies,
  certifications, and contact information when available. Project cards are
  explicitly labeled as concepts, not completed work.
- Set `contact.email` and `contact.whatsapp` in `script.js` to enable direct
  contact. Use an international WhatsApp number containing digits only, without
  a leading `+`. Until then, the WhatsApp button explains that the number is
  unavailable, and the contact form prepares a copyable draft without sending it.
- The email form opens the visitor's email application; it has no backend and
  never claims to send messages. Form and chat data stay in the current page
  and are not persisted.
- `resume.txt` is a downloadable profile summary, not a complete employment
  resume. Replace it with a verified resume and update both download links in
  `index.html` when ready.
- “Ask Avinash AI” is an optional, local rule-based profile guide. It uses only
  information published on the page, not a language model or external API.

## Validation

There is no existing test runner or build infrastructure. Check JavaScript syntax
with `node --check script.js`, then verify navigation, form validation, message
copying, assistant responses, WhatsApp behavior, and the profile download in a
browser. Check desktop and mobile layouts, keyboard navigation, and reduced
motion. The content and anchor navigation remain available without JavaScript.