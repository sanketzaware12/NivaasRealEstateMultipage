# Nivaas Property Advisors - multi-page real estate template

Pages: index.html (Home), about.html, services.html, projects.html, contact.html
Stack: HTML + Tailwind CSS (Play CDN) + custom CSS (css/style.css) + vanilla JS (js/script.js)

## Change these first
1. WhatsApp number: top of js/script.js -> CONFIG.whatsappNumber (digits only, with country code, e.g. 919812345678).
   Until it is set, the WhatsApp buttons link to the contact page.
2. Phone, email, address: search for "+91 00000 00000" and "hello@example.com" in the .html files.
3. Brand name: search for "Nivaas" in the .html files.
4. Colours and fonts: js/tailwind-config.js (and the :root variables at the top of css/style.css).
5. Photos: replace files in assets/ (same names) or edit the img src paths. Listings on projects.html are samples.
6. Social links: footer of each page.

## Notes
- Open index.html directly in a browser; internet is needed for Tailwind CDN, fonts and icons.
- For production, build Tailwind with its CLI instead of the CDN script.
- Header and footer are repeated in each page. Edit all five when changing the menu.
