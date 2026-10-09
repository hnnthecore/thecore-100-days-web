# Day 029 · Cybersecurity company landing page: “Ironveil”

A managed-security provider for UK businesses (fictional). The brief to myself: **feel like a security operations centre**, not a stock-photo hacker in a hoodie. It uses near-black with signal green, and red and amber kept for alerts, in **Archivo** for headlines and **JetBrains Mono** for anything a machine would say. The page teaches as it sells: every section is something you can do.

**Open it:** `phase-2-landing-pages/site/day-029-cybersecurity/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + threat radar** | An SVG radar sweeps while attack attempts appear from country codes. Most are blocked (green), a few aren't (red). A counter shows “attacks blocked today” |
| 2 | **Capabilities** | Six services in a hairline grid with an accent line that draws on hover: MDR, pen testing, incident response, compliance, training, virtual CISO |
| 3 | **Attack simulator** | One phishing-to-ransomware attack in five stages. With protection **ON** it's detected and isolated at stage 2 (T+00:09); with it **OFF** all five stages land, with 48,213 files encrypted, £184,000 and 11 days of downtime |
| 4 | **Spot the phish** | Five realistic emails. Vote phishing or legitimate, then see the exact red flags (look-alike domains, urgency, secrecy, shortened links) or why a real message is safe. A score and a replay at the end |
| 5 | **Inside our SOC** | A live event feed with severity filters (critical, high, medium, low), counters and a pause button |
| 6 | **Domain scan & hotline** | Enter a domain and six checks (SPF, DKIM, DMARC, TLS, open ports, breach exposure) run one by one into an A–F grade, then a report form. A red incident-hotline card gives three “do this now” steps |

## Honest by design

- The scan is **simulated**. Results are generated in the browser from the domain name, so the same domain always gets the same grade, and **no request is ever made to the domain you type**. The page says so next to the form.
- Nothing asks for a password or other secret. The quiz uses made-up emails.
- The hero numbers, clients and hotline are demo content.

## Accessibility

- The radar is decorative (`aria-hidden`) with the “blocked today” count in text. The live feed is not announced, so a screen reader isn't flooded, and it has a pause control. It starts **paused** when “reduce motion” is on.
- The protection switch is a real checkbox. The attack stages are an ordered list, and states are shown in text (CLICKED, DETECTED, PREVENTED), not by colour alone.
- Quiz verdicts and scan results are live regions. Focus moves to “Next email” after each answer.
- “Reduce motion” stops the radar sweep, the pulse and the staged animations: the attack and the scan show their results at once.

## Notes

Ironveil is a fictional company. Figures, clients and the phone number are demo content, and nothing is sent.

## Photography

The photo band above the live SOC feed uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-029/` and converted to WebP at build time. I skipped a server-rack photo that showed visible equipment brand names. The threat radar, attack simulator and phishing quiz stay as interface.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Server room with rows of cabinets | https://unsplash.com/photos/aWslrFhs1w4 |
| Band, small | Technician working on server equipment | https://unsplash.com/photos/ufT32_VFS-I |

### Layout redesign

The hero is now a three-panel security-operations dashboard: the brief, a live radar and a column of metrics.

### Navigation redesign

The header is now a boxed bar with a heavy rule and squared tabs, and the sections follow a different order from the other days.
