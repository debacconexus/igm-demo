# Inference Governance Module (IGM)
### Live Demonstration · DeBacco Nexus LLC

[![Live Demo](https://img.shields.io/badge/Live%20Demo-igm--demo--production.up.railway.app-00a86b?style=for-the-badge)](https://igm-demo-production.up.railway.app)
[![Patent Pending](https://img.shields.io/badge/Patent%20Pending-USPTO%2019%2F571%2C156-1a56db?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Proprietary-c0392b?style=for-the-badge)]()

---

## What Is the IGM?

The **Inference Governance Module (IGM)** is a constraint-first AI governance architecture that sits at the inference boundary — between the user request and the large language model — enforcing hard token output ceilings, input validation, PII detection, and structured output classification at the API layer.

The IGM does not ask the model to behave. It mechanically enforces governance before inference occurs.

> *"Everyone's writing AI policies. Few are building governance that survives the first deployment."*

The IGM is the architecture that survives the first deployment.

---

## The Core Problem

Current AI governance operates at the prompt layer — system instructions that request compliant behavior from a language model. This is **performative governance**: the model is asked to comply, but nothing mechanically enforces it.

This creates four compounding failures:

| Failure | Impact |
|---|---|
| **The Translucent Guardrail Problem** | Prompt-level governance is a request, not a constraint. Models can and do exceed it. |
| **The Knowability Gap** | Without an inference boundary, output cannot be known or bounded before it is produced. |
| **Token waste at scale** | Ungoverned inference produces verbose output by default, burning tokens, energy, water, and capital with every call. |
| **Token ceiling inequity** | Users on paid subscriptions hit monthly limits not because they needed those tokens — but because ungoverned inference wasted them. |

---

## The IGM Solution

The IGM enforces governance **mechanically** at the infrastructure layer — not performatively at the prompt layer.

```
User Request
     │
     ▼
┌─────────────────────────────┐
│   INFERENCE GOVERNANCE      │
│         MODULE              │
│                             │
│  ① Input validation         │
│  ② PII scanner              │
│  ③ Token ceiling enforcer   │
│  ④ Output classifier        │
└─────────────┬───────────────┘
              │ Authorized
              ▼
     Large Language Model
              │
              ▼
     Governed Response
     (Precise · Bounded · Auditable)
```

Without IGM, the request goes directly to the LLM with no constraints enforced — producing verbose, unstructured, unauditable output.

---

## Live Demonstration

**[https://igm-demo-production.up.railway.app](https://igm-demo-production.up.railway.app)**

The demonstration runs real-time API calls — governed vs. ungoverned — independently, across ten real-world California public service scenarios. Run each path separately. Watch the governance decision log populate line by line before the LLM responds. See real token counts, real differential, real cumulative environmental and capital savings.

> **Every time you hit that button, it's a live inference call. The response changes because it's real. What doesn't change is the governance — the ceiling holds, the structure holds, the savings are real every single time.**

### California Public Service Scenarios

| # | Agency / Domain | Situation |
|---|---|---|
| 01 | Emergency Response | Malibu Wildfire — 911 call center and fire/ambulance dispatch overwhelmed |
| 02 | Veterans Services | Veteran reentry — OTH discharge, post-jail, suicidal, requesting benefits |
| 03 | Law Enforcement | LAPD Mental Evaluation Unit — person in crisis, weapons present, 5150 assessment |
| 04 | Child Welfare | LA County DCFS — high-risk neglect/abuse report, domestic violence history |
| 05 | Housing Services | LA County Homeless Services / The Midnight Mission — reentry intake |
| 06 | Veterans Treatment Court | VTC participant — missed substance abuse, mental health, anger management, DV sessions |
| 07 | Social Services | DSS / Department of Rehabilitation — complex benefits determination, reentry veteran |
| 08 | Healthcare | Hospital / insurance claims triage — veterans and low-income patients, fraud detection |
| 09 | Infrastructure | Caltrans emergency traffic coordination — wildfire, emergency corridor routing |
| 10 | Election Security | County elections office — voter fraud reports, misinformation, disenfranchisement risk |
| 11 | Custom | Enter any California public service scenario — IGM governs it live |

---

## CalCompute · California's Governed AI Infrastructure

> *"California is moving toward governed AI. The missing governance layer is not missing anymore."*
> — James DeBacco, Veterans Treatment Court Liaison, LA County DMVA

### The Scale Problem California Already Has

Governor Newsom's April 2025 executive order deploying first-in-the-nation GenAI technologies across state government marked a turning point. California is no longer piloting AI — it is scaling it. A medium-to-large California agency in 2026 generates an estimated **10,000 to 50,000+ AI inference calls per day**. High-volume automated systems exceed **100,000 calls per day**.

| Agency Scale | Daily Calls | Ungoverned Tokens | Governed Tokens | Daily Savings |
|---|---|---|---|---|
| Small / Pilot | 1,000 | 400,000 | 152,000 | **−248,000 tokens** |
| Mid-Size Agency | 10,000 | 4,000,000 | 1,520,000 | **−2,480,000 tokens** |
| Large Agency | 50,000 | 20,000,000 | 7,600,000 | **−12,400,000 tokens** |
| High-Volume System | 100,000 | 40,000,000 | 15,200,000 | **−24,800,000 tokens** |

At /bin/sh.003 per 1,000 output tokens, a large agency running 50,000 calls per day saves approximately **7,200 per day** — over **3.5 million annually** — from governance enforcement alone.

---

### What I See From the Veterans Treatment Court

I am a Veterans Treatment Court Liaison and Veterans Services Officer at the Los Angeles County Department of Military and Veterans Affairs. Every week I work with veterans completing 18 months of Veterans Treatment Court — many carrying dual diagnoses, many with other-than-honorable discharges, many recently incarcerated, many whose instability is creating risk for their families and communities.

My job requires coordinating across six agencies simultaneously — LAPD/LASO, Deputy Probation Officers, the DA's Office, the Public Defender, the Department of Mental Health, and wrap-around service providers — all making AI-assisted decisions about the same veteran on the same day.

**None of those systems produce an audit trail. None of them have a token ceiling. None of them can prove they complied with the veteran's privacy rights or the court's confidentiality requirements.**

The IGM changes that. Every inference catalogued. Every decision auditable. Every agency in the VTC ecosystem gets a governed, bounded, court-admissible response.

---

### SB 53 Compliance

SB 53, signed by Governor Newsom in September 2025, requires covered AI systems to implement safety protocols and maintain documentation. AB 1018 extends accountability requirements to automated decision systems in public services.

| SB 53 / AB 1018 Requirement | IGM Implementation |
|---|---|
| Safety and security protocols | 8-module pipeline with hard enforcement at each stage |
| Documentation of AI capabilities | Cryptographic audit trail — every inference catalogued |
| Risk assessment and incident reporting | PASS/FAIL governance status per inference — real time |
| Transparency in automated decision systems | Admin dashboard — governance calendar and audit log |
| Language access for diverse populations | 22-language DHCS-aligned governance matrix |
| Environmental impact accountability | Per-inference energy measurement — joules recorded |

---


---

## The DeBacco Rule

Governed AI inference produces responses within approximately **1 joule** regardless of language, modality, or model architecture.

This is the first thermodynamic constant applied to AI inference governance. It provides a unit of measurement that no existing AI policy framework has — making IGM the only governance architecture with a measurable, falsifiable, energy-based boundary condition.

---

## Key Research Findings

**The Translucent Guardrail Problem**
Empirical testing across six AI platforms demonstrated that prompt-level JSON governance is performative rather than mechanical. Infrastructure-level constraints enforced via API parameters work mechanically. This distinction is the foundation of the IGM.

**The Principle of Tiers**
A structured framework for scaling governance:
- **Tier 1** — Token reduction (English, Arabic, 23 DHCS languages)
- **Tier 2** — Modality governance
- **Tier 3** — Environmental impact projection
- **Tier 4** — AI-to-AI separation architecture

**Non-Deterministic Governed Inference**
IGM does not produce cached or rehearsed responses. Every inference call is live. The governed response changes with each run — because real-world conditions change. What does not change is the governance: the ceiling holds, the structure holds, the audit trail is created, and the savings are real every single time. This is the distinction between a demo and a governance system.

---

## Real-World Applications

- **Veterans Services** — OTH discharge navigation, benefits eligibility, crisis triage for justice-involved veterans
- **Criminal Justice** — Veterans Treatment Court risk assessment, probation review, reentry benefits coordination
- **Emergency Response** — 911 dispatch prioritization, wildfire triage, Caltrans corridor routing
- **Child Welfare** — DCFS hotline risk assessment, case assignment, mandated reporter support
- **Mental Health** — LAPD MEU crisis response, 5150 determination, mental health crisis line
- **Housing** — Homeless services intake, rapid rehousing eligibility, wraparound services coordination
- **Election Integrity** — Voter fraud triage, misinformation detection, disenfranchisement risk assessment
- **Healthcare** — Claims triage, fraud detection, care gap prevention
- **Enterprise AI** — Token budget governance restoring profitability on inference-heavy products
- **Access Equity** — Preserving monthly token budgets for individuals and small businesses

---

## Patent

**USPTO Application 19/571,156** — Patent pending
Inference Governance Module (IGM)
DeBacco Nexus LLC

The full IGM architecture is protected under this application. This repository demonstrates the governance boundary concept only. The implementation architecture is not disclosed.

---

## Ambient Ungoverned Inference Drain (AUID)

**AUID** is the hidden CPU load draining battery, energy, and tokens without consent.

**Definition:** The continuous execution of AI inference on user devices through browser-embedded or application-embedded engines, operating without token ceilings, energy measurement, user consent, or audit trails — resulting in measurable CPU load, battery drain, and thermal impact on users who never authorized it.

*Introduced by DeBacco, J. (2026). Submitted to Springer Nature AI and Ethics. USPTO 19/571,156.*

---

### AUID Does Not Wait for You

The most significant finding: **AUID starts the moment your device wakes up — before you open a single application.**

A live Activity Monitor capture taken immediately upon device wake on May 1, 2026 showed:

| Process | CPU % | Classification |
|---|---|---|
| spotlight | 48.1% | Apple ML indexing — fires on wake |
| duetexpertd | 29.4% | Apple Intelligence coordinator |
| suggestd | 19.0% | Apple suggestion inference daemon |
| Google Chrome | 10.5% | Chrome AI features activating |
| Microsoft | 8.6% | Microsoft AI activating on wake |
| corespeechd | 4.0% | CoreSpeech inference daemon |
| Grammarly | 2.2% | Continuous ML inference |

**Combined CPU at wake: 20.61% — before any user action.**

---

### Seven Documented AUID Examples

**1 — Mozilla Firefox 141 (August 2025)**
Background "Inference" process for AI tab grouping ran by default. CPU spikes to 130%. Battery drain. Fans at maximum. Killing the process crashed the browser. Mozilla reversed the rollout only after user complaints — post-hoc governance, not governance by design.

**2 — Google Chrome: Gemini Nano**
Chrome automatically downloads and runs Gemini Nano locally during updates. Executes inference for summarization, writing assistance, and smart replies. No token ceiling. No energy measurement. No consent required.

**3 — Microsoft Copilot + Edge WebView2**
Runs in background on Windows 11, consuming 250–500MB of memory while idle, causing CPU spikes when not in use. Disabling Copilot immediately reclaims approximately 200MB of system memory.

**4 — Microsoft Windows Recall + Phi Silica**
Continuously analyzes all user activity using a local AI model on the device NPU — default-on. Made opt-in only after user backlash.

**5 — Browser Extensions with Persistent Background Inference**
Extensions using Transformers.js and WebLLM load multi-gigabyte AI models as persistent service workers across all tabs — by design, because reloading them repeatedly is impractical.

**6 — Grammarly Desktop**
Runs continuous local ML inference across every application on your device — word processors, email, browsers — without any user-initiated request. No token ceiling. No energy record.

**7 — Apple Intelligence: generativeexperiencesd, textunderstandingd, siriinferenced**
Three persistent Apple Intelligence daemons run continuously on macOS and iOS. All execute background inference without token ceilings, energy measurement, or per-session consent. Visible in Activity Monitor across multiple captures.

---

### What Every AUID Example Has in Common

- **No token ceiling** — no limit on computational resources per inference event
- **No energy measurement** — no record of joules consumed on your device
- **No consent** — default-on, requiring users to actively disable
- **No audit trail** — no verifiable record of what ran, when, or what it consumed

This is not a single vendor problem. It is a systemic absence of governance at the browser and device inference boundary — across every major browser, on every major operating system, on hundreds of millions of devices simultaneously.

---

### The IGM Addresses All Four AUID Failures

| AUID Failure | IGM Module |
|---|---|
| No consent boundary | Input Processing — authenticated authorization required |
| No token ceiling | GATE — hard ceiling enforced before inference |
| No energy measurement | TTP Monitor — joule measurement per inference |
| No clean termination | Pipeline architecture — discrete modules, clean boundaries |

**The DeBacco Rule** — governed inference within ~1 joule — provides the reference energy boundary that AUID currently has no equivalent of.

*DeBacco, J. (2026). Ambient Ungoverned Inference Drain (AUID): Naming and Addressing the Hidden CPU Load on User Devices and the Case for Constraint-First Architecture. Submitted to AI and Ethics, Springer Nature. USPTO Provisional Application 19/571,156.*

---

## About

**James DeBacco, MSW, DSW(c)**
Founder & CEO, DeBacco Nexus LLC
Member, CalCompute Consortium
Veterans Treatment Court Liaison, Los Angeles County Department of Military and Veterans Affairs
Executive Director, Bridges2Freedom 501(c)(3)
DSW Candidate, USC Suzanne Dworak-Peck School of Social Work

The IGM originated from the Transformational Accountability and Ethics (TAE) methodology developed over 15+ years working with justice-involved and veteran populations — and the recognition that the same governance principles that protect human behavior in high-stakes institutional settings apply directly to AI inference at the infrastructure layer.

The California public service scenarios in this demonstration are not hypothetical. They reflect real cases, real agencies, and real decisions made every day across Los Angeles County — many of which James encounters directly in his work as a Veterans Treatment Court Liaison.

---

## Contact

**DeBacco Nexus LLC**
info@debacconexus.com
[https://igm-demo-production.up.railway.app](https://igm-demo-production.up.railway.app)

---

*This demonstration is built on the Claude API by Anthropic. The IGM architecture, governance boundary concept, DeBacco Rule, Principle of Tiers, Translucent Guardrail Problem, and Ambient Ungoverned Inference Drain (AUID) are original works of James DeBacco / DeBacco Nexus LLC, protected under USPTO 19/571,156.*
