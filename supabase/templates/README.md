# Auth e-mail templates

The e-mails Supabase Auth sends, in Examax's style (Dub's transactional
layout: a hairline card, the logo, a black button, the link spelled out, a
grey footer). Supabase does not read these files — paste each one into the
dashboard: **Authentication → Emails → Templates**, one template per tab,
**Body → Source**.

| Template tab | File | Subject |
| --- | --- | --- |
| Confirm sign up | `confirmation.html` | Potwierdź swój adres e-mail |
| Magic link | `magic_link.html` | Twój link do logowania w Examax |
| Reset password | `recovery.html` | Ustaw hasło w Examax |
| Change email address | `email_change.html` | Potwierdź zmianę adresu e-mail |

## How the links work

The button points at `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=…`
rather than Supabase's `{{ .ConfirmationURL }}`. `{{ .RedirectTo }}` is the
address the app asked Supabase to return to (`lib/auth/client.ts`,
`emailRedirect`): `/auth/confirm?next=…` on whichever site the visitor
started from, so the same templates work on `localhost:3000` and on
`examax.app`. It always carries a query string, which is why the template
continues with `&`.

- **Any device.** A `token_hash` link works wherever it is opened. The
  default link carries a PKCE code that only the browser that asked for the
  e-mail can redeem.
- **Mail scanners.** `/auth/confirm` spends the token only when the button
  on the page is pressed. School Outlook accounts open every link to scan it
  (Safe Links), which would use up a link that confirmed on arrival.
- **Allowed origins only.** Supabase uses `RedirectTo` only for addresses on
  Authentication → URL Configuration → Redirect URLs
  (`http://localhost:3000/**` and `https://examax.app/**` are listed). For
  anything else it substitutes the Site URL, and the link breaks — add a
  host there before sending e-mails from it (a Vercel preview, say).
- **Left at the default?** If a template still uses `{{ .ConfirmationURL }}`,
  its link still works in the same browser: `/auth/confirm` hands the code
  to `/auth/callback`.

There is deliberately no "copy this link" line: the raw link is long and
ugly, and the button is the only way in.

The logo is served from Supabase Storage — the public `email` bucket,
`examax-logo.png` (a copy of `public/brand/email-logo.png`):
`https://eijggddzbwjtmpifoalj.supabase.co/storage/v1/object/public/email/examax-logo.png`.
Being on the project's own domain, it shows in the dashboard's template
preview too, and in every inbox without waiting for a deploy. The bucket
takes PNGs up to 1 MB, can be read by URL but not listed, and only the
secret key can write to it. To replace the logo, upload over the same path.

The markup is built for e-mail clients, not browsers: tables, inline
styles, a fixed-width frame for Outlook on Windows (`<!--[if mso]>`), a
button Outlook can pad, and a logo on solid white so dark-mode inboxes
cannot hide it. Edit with that in mind.
