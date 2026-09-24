# EndoPima — Kupima Mapema

A bilingual, mobile-first prototype that helps people in Kenya recognise concerning endometriosis symptoms, organise their history and prepare for an appropriate care conversation.

**Live prototype:** https://nyaenya-devine.github.io/endopima-kenya/

## Clinical boundary

EndoPima is an awareness and care-navigation prototype. It is not a diagnostic tool, medical device, emergency service or substitute for a clinician. Its decision-support logic has not been clinically validated, directory entries are demonstrations, and no treatment outcome is promised.

The prototype keeps user-entered information on the device. Do not enter identifiable health information on a shared device.

## Product principles

- English and Kiswahili throughout the main journey
- Low-bandwidth, offline-capable application shell
- Plain-language symptom reflection without diagnosis claims
- Urgent warning signs separated from the symptom-priority flow
- Appointment preparation and locally relevant care-navigation prompts
- Demonstration data labelled at the point of use
- Reduced-motion, keyboard and screen-reader considerations

## Run and verify

Open `endopima/index.html` directly, or serve the repository locally:

```bash
python3 -m http.server 8080
python3 scripts/validate_prototype.py
```

The validation script checks document structure, duplicate IDs, safety language, demonstration-data labels and inline JavaScript syntax.

## Review before real-world use

Clinical, safeguarding, privacy, Kiswahili-language and usability review with Kenyan patients, clinicians and community health teams is required before any pilot. Any future data collection must use explicit consent, data minimisation, retention controls and an independently reviewed protocol.

## Security

See [SECURITY.md](SECURITY.md) for private vulnerability reporting.
