# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Report them privately to **pomoc@examax.app** with "Security" in the subject. Include what you found, where (URL or file), and the steps to reproduce it. We will confirm receipt within 3 working days and keep you informed until it is fixed.

## Scope

- The website at https://examax.app and this repository.
- Out of scope: findings that need a compromised device or browser, social engineering, and denial-of-service through sheer request volume.

## What the site does to stay safe

- A strict Content Security Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy and a locked-down Permissions-Policy on every response.
- No third-party scripts, trackers or runtime calls to external services.
- No API routes or server-side secrets; every page is static apart from the RSS feed.
- Dependencies are audited in CI (`pnpm audit --prod`) and kept current by Dependabot.
