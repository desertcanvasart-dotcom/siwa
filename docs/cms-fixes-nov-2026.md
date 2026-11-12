# CMS fixes still needed (site audit, 10 Nov 2026)

The code fixes are on branch `fix/site-consistency-audit`. Everything below lives in the
CMS database (admin dashboard), so code can't fix it. Code already masks several of these
at render time (marked *masked*). Fix the source anyway so the admin data is clean.

Canonical facts now live in `client/src/lib/site-facts.ts`. Use them when writing copy.

## 1. Legal / trust — owner to supply
- [ ] **Entity name:** "Soléi Inc." is described as registered under Egyptian law, but "Inc." is not an Egyptian company form. Confirm the legal entity and update Terms and Privacy.
- [ ] **Ministry of Tourism licence:** no number appears anywhere. Add it to the footer, Terms and Privacy.
- [x] **Email:** fixed in code. **hello@darsolei.com** is the only address, defined in `shared/contact.ts`.
  - The site ignores the CMS `contact.email` key, and the API serves only that address. The key was set to a misspelled domain; you can clear it in the dashboard.
  - Server email refuses any `EMAIL_FROM` / `EMAIL_TO` that isn't on darsolei.com.
  - `npm run build` fails if any other address appears in the source (`npm run check:emails`).
  - Make sure darsolei.com is verified in Resend and that `EMAIL_FROM` / `EMAIL_TO` on Railway use it.
- [ ] **WhatsApp number:** it appears only in the Privacy Policy. Consider showing it on the concierge buttons.
- [ ] **Terms §19:** grants a perpetual, worldwide, royalty-free licence to guest images. Consider making it opt-in.
- [ ] **Cancellation terms:** the Terms now say the product page's terms win. That means each product's `details.cancellationPolicy` must be the intended policy, so review every product.

## 2. Site content keys
- [ ] `our_story.origin.label` = "Where this began**0**". Remove the 0. *(masked)*

## 3. Reviews: delete the rows (the site no longer renders reviews)
`hotels.details.reviews` on:
- [ ] address-marassi-golf-resort (2)
- [ ] rixos-premium-alamein (3)
- [ ] jaz-almaza-beach-resort (1)
- [ ] solei-old-town (2)
- [ ] vida-marina-resort-marassi (1)
- [ ] address-beach-resort-marassi (1)
- [ ] al-alamein-hotel (3)
- [ ] solei-desert-retreat (2)

## 4. Hotels
- [ ] **solei-royal**
  - `pricePerNight` is "€650 / night"; it should be "$650 / night" (USD only).
  - `details.priceLabel` repeats the amount *(masked)*.
  - "6-acre" vs "6 feddans": pick one.
- [ ] **solei-desert-retreat**
  - `amenities` holds a paragraph split at commas *(masked)*. Re-enter it as a real list.
  - `details.location[3]` is truncated: "Private transfers available on requ".
  - The "Desert Room" has an empty `beds`.
  - `pricePerNight` has a trailing space.
- [ ] **solei-salt-caves**
  - The room `occupancy` is "1 guests", but the page says "best for couples". Decide whether it holds 1 or 2.
  - The blurb says "ancient microclimates"; the page says "daily salt-cave session".
- [ ] **solei-old-town:** `pricePerNight` "$60" vs lowest room rate $70.
- [ ] **jaz-almaza-beach-resort:** "Paddle Court" and "Tennis, Paddle" should be "Padel" *(masked)*.
- [ ] **al-alamein-hotel:** make sure the blurb and location place it in Marassi, not "near the WWII museum". Its villa room shows "From $6900 / night · up to 15 guests"; confirm that's intended.
- [ ] **Missing prices:** address-marassi-golf-resort, address-beach-resort-marassi, rixos-premium-alamein and jaz-almaza-beach-resort have no `pricePerNight`, so they show "Price on request".
- [ ] **Unbuilt hotel records:** if Casa Cook, The G Hotel Seashell or any Siwa partner lodge exists as a hotel record, keep it unpublished until it has a real page.

## 5. North Coast experiences (live catalogue = canonical)
- [ ] **private-yacht-sunset-ritual**
  - Bullets start with "* " and `faqs[0].a` starts with "." *(masked)*.
  - "Open bar (water, soft drinks, coffee)" is misleading. Rename it, e.g. "Soft drinks, water & coffee".
  - The slug doesn't match the title "Private Yacht Experience".
- [ ] **signature-dinner-experience**
  - Bullets start with "-" *(masked)*.
  - **State whether the meal is included** in the $150 pp.
- [ ] **beach-club-experience:** "atmosphere.." *(masked)*.
- [ ] **marassi-water-world-experience:** the summary starts with "." *(masked)*.
- [ ] **coastal-wellness-ritual:** the slug doesn't match the title "Luxury Spa Experience".
- [ ] **Detail-page copy:**
  - Remove "We confirm with the guide" from concierge-style products.
  - Replace "Every experience takes you outside the resort perimeter" if it appears.
  - Remove any "flamingo / El Alamein heritage / sunset sailing" footer text in hotel data.

## 6. Siwa experiences
- [ ] **desert-sunset-experience**
  - The itinerary says "8:00 PM Sunset Ritual". Sunset in Siwa is around 5 PM in winter and 7 PM in summer, so fix the timings.
  - Bullets start with "* " *(masked)*.
- [ ] **desert-stargazing:** `pricePerPerson` is 0, so the site shows "Price on request". Set a real price. Also, the summary says "two hours" but the duration is 3 hours.
- [ ] **wellness-and-sand-ritual:** the massage add-on is "€50"; make it USD.
- [ ] **"Bedouin camp / guide":** consider "Siwan desert camp" in solei-signature-siwa-journey, desert-night-experience and honeymoon-escape.
- [ ] **Salt-lake float:** the FAQ no longer says "sunset only", so the morning floats are fine. Keep products consistent with "floats run through the day".

## 7. Journeys
- [ ] **siwa-wellness-journey**
  - "two-hour heat session" should be "20–30 minutes".
  - The FAQ warning should read: "Not suitable for guests with heart conditions or uncontrolled high blood pressure."
  - Say the sand bath is traditionally a June–September activity.
- [ ] **solei-grand-escape, honeymoon-escape:** say when the sand bath runs (it's a summer practice).
- [ ] **siwa-desert-escape**
  - The FAQ says "overnight departure for a morning arrival"; change it to "leave Cairo between 5 and 6 am".
  - Max 10 guests vs vehicle sizes (SUV 4, minivan 8, 4×4 5): confirm.
- [ ] **from-the-sea-to-the-sands**
  - "full-day desert safari" vs Day 4 "full afternoon".
  - The FAQ says "end on the coast". Pick one order recommendation; the code FAQs are now order-neutral.
- [ ] **solei-elite-journey**
  - "Pay in EUR or USD" should be USD.
  - Confirm the 30% deposit and 30-day balance are the intended terms.
  - Verify the helicopter add-on.
  - Pricing: it's $3,000 pp but includes more than Grand Escape at $3,800.
  - Set `destination` to both destinations. The code groups it under "Across both destinations" via `MULTI_DESTINATION_SLUGS` in `journeys.tsx`; delete that override once the data is fixed.
- [ ] **solei-grand-escape:** same destination fix as Elite.
- [ ] **north-coast-signature-stay**
  - The FAQ says "eight curated North Coast partners"; there are 6.
  - "Cairo pickup included" vs transfers "if requested".
- [ ] **honeymoon-escape, north-coast-signature-stay:** max 2 guests but priced "per guest". Confirm.
- [ ] **Transfers:** Honeymoon, Wellness and Grand Escape don't list the Cairo transfer in their inclusions.

## 8. Journal
- [ ] **the-curse-of-king-tuts-tomb:** unpublish. The code already keeps it off the home page.
- [ ] **healing-waters-of-siwa-salt-lake-therapy:** `linkedExperience` should be `salt-and-spring-escape` *(masked)*.
- [ ] **stargazing-in-siwa-guide-to-desert-night-sky:** `linkedExperience` should be `desert-stargazing` *(masked)*.
- [ ] **AI concierge (/chat):** offline. Set `OPENAI_API_KEY` in production, or hide "Ask Soléi" from the nav.
