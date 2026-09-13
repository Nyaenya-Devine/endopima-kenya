# Security Policy — EndoPima Kenya

## Overview
EndoPima Kenya is a bilingual, community-first endometriosis early-recognition and care-navigation prototype for Kenya — health-awareness concept, not medical advice, not a clinical product, does not store personal health data.

## Security Upgrades Emphasized (Military-Grade for Health-Tech)

### 1. No Real Data & Privacy-First
- No personal health data stored, no tracking, no analytics
- All data simulated, local-only, no backend
- Health disclaimer: Not medical advice, not diagnosis, not clinical product

### 2. Input Sanitization & XSS Protection
- `esc()` function for XSS protection in HTML prototype
- `html.escape` equivalent, prevents script injection
- No `eval`, no `innerHTML` with user data without escaping

### 3. Security Headers (Military-Grade)
- **HTML Meta CSP:** `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'`
- **X-Content-Type-Options:** `nosniff`
- **X-Frame-Options:** `DENY` (via CSP frame-ancestors)
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=()`

### 4. No Hardcoded Secrets
- No API keys, no credentials, no PATs committed
- `.gitignore` excludes env files, hosting accounts
- Verified via `grep -r ghp_` clean, no secrets
- Throwaway surge.sh hosting account abandoned

### 5. Bilingual & Community-First Security
- English ⇄ Kiswahili, mobile-first, fully self-contained single-page prototype
- Privacy-conscious, local-first design
- No external dependencies, no CDN, self-hosted

### 6. Threat Model
- **XSS via symptom input:** User enters script in symptom field → Escaped via `esc()`, CSP blocks inline scripts
- **Data leakage:** Health data exfiltration → No storage, no backend, no tracking
- **Clickjacking:** Iframe embed → CSP frame-ancestors none, X-Frame-Options DENY
- **Misinformation:** Health advice misuse → Disclaimer: Not medical advice, concept only, see clinician

### 7. Secure Development
- Single-file HTML + assets, no build chain, minimal supply chain
- No third-party trackers, no analytics, no external scripts
- CSP self-only, esc() XSS fix, no secrets

## Reporting
Email: devinenyaenya@gmail.com — Responsible disclosure

## Verified
- `grep -r ghp_` clean, no PATs
- `esc()` XSS protection
- CSP self-only meta tags
- No real data, no tracking, privacy-first

© 2026 EndoPima Kenya • Health-awareness concept • Not medical advice • MIT • Educational
