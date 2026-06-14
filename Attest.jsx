import React, { useState } from "react";

/*
  ATTEST — AI meeting documentation for regulated industries.
  Working prototype. Formats meeting transcripts into industry-appropriate,
  compliance-aware documentation. I built it to format what's there and never 
  invent findings, diagnoses, or advice, because in these fields a tool that fabricates is worse than useless.

*/

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.attest * { box-sizing: border-box; }
.attest {
  --ink: #16202B;
  --ink-2: #1E2B38;
  --ink-soft: #33414F;
  --paper: #F3F1EA;
  --card: #FCFBF6;
  --oxblood: #6E2436;
  --oxblood-deep: #571B2A;
  --brass: #A9803F;
  --slate: #6B7A88;
  --slate-d: #8A98A4;
  --line: #D9D3C7;
  --line-dark: #2C3A48;
  font-family: 'Hanken Grotesk', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.attest button { font-family: inherit; cursor: pointer; }
.attest textarea, .attest select { font-family: inherit; }

/* ---- shell ---- */
.at-shell { max-width: 1180px; margin: 0 auto; padding: 0 20px 64px; }
.at-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 4px 20px; border-bottom: 1px solid var(--line);
  flex-wrap: wrap; gap: 12px;
}
.at-brand { display: flex; align-items: center; gap: 13px; }
.at-mark { width: 38px; height: 38px; flex: none; }
.at-word {
  font-family: 'Fraunces', serif; font-weight: 600; font-size: 25px;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink);
}
.at-tag {
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--slate); font-weight: 600; margin-top: 1px;
}
.at-status {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Space Mono', monospace; font-size: 11px;
  letter-spacing: 0.08em; color: var(--slate); text-transform: uppercase;
}
.at-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--oxblood); }

.at-grid {
  display: grid; grid-template-columns: 360px 1fr; gap: 22px; margin-top: 26px;
  align-items: start;
}
@media (max-width: 880px) { .at-grid { grid-template-columns: 1fr; } }

/* ---- console (left, dark) ---- */
.at-console {
  background: var(--ink); color: #E8EDF1; border-radius: 4px;
  padding: 24px 22px; position: sticky; top: 18px;
  box-shadow: 0 1px 0 var(--line-dark), 0 18px 40px -28px rgba(22,32,43,0.5);
}
@media (max-width: 880px) { .at-console { position: static; } }
.at-leg {
  font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--slate-d); margin: 0 0 11px;
}
.at-leg.mt { margin-top: 26px; }

.at-practice { display: grid; gap: 8px; }
.at-opt {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  border: 1px solid var(--line-dark); border-radius: 3px; background: var(--ink-2);
  color: #D5DDE3; text-align: left; transition: border-color .15s, background .15s;
  width: 100%;
}
.at-opt:hover { border-color: #4A5A69; }
.at-opt.sel { border-color: var(--brass); background: #232f3c; }
.at-opt .ring {
  width: 16px; height: 16px; border-radius: 50%; flex: none;
  border: 1.5px solid #56636f; position: relative;
}
.at-opt.sel .ring { border-color: var(--brass); }
.at-opt.sel .ring::after {
  content: ''; position: absolute; inset: 3px; border-radius: 50%; background: var(--brass);
}
.at-opt .o-name { font-weight: 600; font-size: 14px; }
.at-opt .o-sub { font-size: 11.5px; color: var(--slate-d); margin-top: 1px; }

.at-field { margin-top: 6px; }
.at-select {
  width: 100%; background: var(--ink-2); color: #E8EDF1;
  border: 1px solid var(--line-dark); border-radius: 3px; padding: 11px 12px;
  font-size: 13.5px; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238A98A4' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
}
.at-area {
  width: 100%; min-height: 132px; resize: vertical; background: var(--ink-2);
  color: #E8EDF1; border: 1px solid var(--line-dark); border-radius: 3px;
  padding: 12px 13px; font-size: 13px; line-height: 1.55;
}
.at-area::placeholder { color: #5b6772; }
.at-area:focus-visible, .at-select:focus-visible, .at-opt:focus-visible,
.at-toggle:focus-visible, .at-gen:focus-visible, .at-mini:focus-visible {
  outline: 2px solid var(--brass); outline-offset: 2px;
}
.at-sample {
  background: none; border: none; color: var(--brass); font-size: 12px;
  font-weight: 600; padding: 8px 0 0; letter-spacing: 0.02em;
}
.at-sample:hover { text-decoration: underline; }

.at-toggle {
  display: flex; align-items: flex-start; gap: 11px; width: 100%; text-align: left;
  background: none; border: none; color: #D5DDE3; padding: 9px 0;
}
.at-check {
  width: 17px; height: 17px; border-radius: 3px; border: 1.5px solid #56636f;
  flex: none; margin-top: 1px; display: grid; place-items: center; transition: .15s;
}
.at-toggle.on .at-check { background: var(--brass); border-color: var(--brass); }
.at-toggle .t-txt { font-size: 12.5px; line-height: 1.45; }
.at-toggle .t-txt b { color: #fff; font-weight: 600; }

.at-gen {
  width: 100%; margin-top: 18px; padding: 14px; border: none; border-radius: 3px;
  background: var(--oxblood); color: #F6EDE9; font-weight: 700; font-size: 14px;
  letter-spacing: 0.04em; text-transform: uppercase; transition: background .15s;
  display: flex; align-items: center; justify-content: center; gap: 9px;
}
.at-gen:hover:not(:disabled) { background: var(--oxblood-deep); }
.at-gen:disabled { opacity: 0.5; cursor: not-allowed; }
.at-note { font-size: 11px; color: var(--slate-d); margin-top: 12px; line-height: 1.5; }

/* ---- document (right, paper) ---- */
.at-doc {
  background: var(--card); border: 1px solid var(--line); border-radius: 4px;
  min-height: 560px; box-shadow: 0 18px 50px -34px rgba(22,32,43,0.45);
  position: relative; overflow: hidden;
}
.at-doc-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 26px; border-bottom: 1px solid var(--line); flex-wrap: wrap; gap: 10px;
}
.at-doc-head .lbl {
  font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--slate);
}
.at-actions { display: flex; gap: 8px; }
.at-mini {
  border: 1px solid var(--line); background: #fff; color: var(--ink-soft);
  font-size: 12px; font-weight: 600; padding: 7px 13px; border-radius: 3px;
  letter-spacing: 0.02em; transition: .15s;
}
.at-mini:hover:not(:disabled) { border-color: var(--slate); }
.at-mini:disabled { opacity: 0.4; cursor: not-allowed; }

.at-body { padding: 34px 44px 40px; }
@media (max-width: 560px) { .at-body { padding: 26px 22px 32px; } }

.at-record {
  font-family: 'Newsreader', 'Fraunces', Georgia, serif; font-size: 15px;
  line-height: 1.62; color: var(--ink); white-space: pre-wrap; word-wrap: break-word;
}

/* empty + loading */
.at-empty { display: grid; place-items: center; text-align: center; padding: 90px 30px; }
.at-empty .e-seal { opacity: 0.16; margin-bottom: 22px; }
.at-empty h3 {
  font-family: 'Fraunces', serif; font-weight: 500; font-size: 21px; margin: 0 0 8px;
  color: var(--ink-soft);
}
.at-empty p { color: var(--slate); font-size: 13.5px; max-width: 320px; margin: 0; }

.at-load { display: grid; place-items: center; padding: 110px 30px; text-align: center; }
.at-spin {
  width: 30px; height: 30px; border: 2.5px solid var(--line); border-top-color: var(--oxblood);
  border-radius: 50%; animation: at-rot 0.8s linear infinite; margin-bottom: 18px;
}
@keyframes at-rot { to { transform: rotate(360deg); } }
.at-load p {
  font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--slate);
}

.at-err {
  margin: 26px 44px; padding: 14px 16px; border: 1px solid #C9A0A0;
  background: #F8EFEF; border-radius: 3px; color: #6E2436; font-size: 13px;
}

/* certified footer w/ seal */
.at-cert {
  display: flex; align-items: center; gap: 18px; margin-top: 30px;
  padding-top: 22px; border-top: 1px solid var(--line);
}
.at-cert .meta { font-family: 'Space Mono', monospace; font-size: 10.5px; line-height: 1.85; color: var(--slate); }
.at-cert .meta b { color: var(--ink-soft); }

@media (prefers-reduced-motion: reduce) {
  .at-spin { animation: none; }
  .attest * { transition: none !important; }
}
`;

// ---- seal (signature element) ----
function Seal({ size = 88, faded = false }) {
  const id = faded ? "sf" : "s1";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="e-seal-svg" aria-hidden="true">
      <defs>
        <path id={`ring-${id}`} d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--brass)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--oxblood)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="var(--oxblood)" strokeWidth="1" opacity="0.5" />
      <text fontFamily="Space Mono, monospace" fontSize="7.3" letterSpacing="2.1" fill="var(--oxblood)" fontWeight="700">
        <textPath href={`#ring-${id}`} startOffset="2%">
          · ATTEST · CERTIFIED RECORD · CONFIDENTIAL ·
        </textPath>
      </text>
      <text x="50" y="58" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="30" fontWeight="600" fill="var(--oxblood)">A</text>
      <line x1="33" y1="65" x2="67" y2="65" stroke="var(--brass)" strokeWidth="0.8" />
    </svg>
  );
}

// ---- industry configurations ----
const INDUSTRIES = {
  legal: {
    name: "Legal",
    sub: "Attorney–client matters",
    retention: ["6 years", "7 years", "10 years", "Life of matter + 7 yrs", "Permanent"],
    defaultRetention: "7 years",
    sample:
      "Attorney: Thanks for coming in. So this is about the lease on your Tempe storefront?\n" +
      "Client: Right. Landlord's trying to charge us for HVAC replacement — almost forty thousand. Our lease says repairs are their responsibility.\n" +
      "Attorney: Do you have the executed lease and any written notices they've sent?\n" +
      "Client: I have the lease. The notice was just an email last Tuesday demanding payment within thirty days.\n" +
      "Attorney: Okay. We'll want to review the maintenance and capital-improvements clauses closely — replacement may be treated differently from repair. Don't pay anything or sign acknowledgments yet. I'll send an engagement letter today and a hold on responding to their email.\n" +
      "Client: Should I respond to them at all?\n" +
      "Attorney: Not directly. Forward anything they send to me. I'll draft a response by Friday.",
  },
  medical: {
    name: "Medical",
    sub: "Clinical encounters · PHI",
    retention: ["6 years", "7 years", "10 years (state-dependent)", "Until age 21 (minors)"],
    defaultRetention: "7 years",
    sample:
      "Clinician: Good to see you back. How have the headaches been since we adjusted things?\n" +
      "Patient: Better most days. Still get a bad one maybe twice a week, usually late afternoon.\n" +
      "Clinician: Any nausea or light sensitivity with those?\n" +
      "Patient: Light bothers me with the bad ones. No nausea.\n" +
      "Clinician: Are you taking the medication as we discussed, every morning?\n" +
      "Patient: Mostly. I missed a couple days when I traveled last week.\n" +
      "Clinician: That can set things off. Let's keep the current dose, stay consistent, and track triggers for two weeks. Keep hydration up and watch screen time late in the day. If the bad ones go above three a week, call us.\n" +
      "Patient: Okay. Same follow-up?\n" +
      "Clinician: Let's do four weeks.",
  },
  financial: {
    name: "Financial",
    sub: "Advisory · suitability",
    retention: ["6 years (SEC 17a-4)", "7 years", "Permanent"],
    defaultRetention: "6 years (SEC 17a-4)",
    sample:
      "Advisor: Let's review where the portfolio sits after the first half. We're up about six percent, roughly in line with your benchmark.\n" +
      "Client: Good. I've been thinking I want to take a bit less risk — retirement's closer than it feels.\n" +
      "Advisor: Understood. You're currently around seventy-thirty equities to fixed income. We could move toward sixty-forty over the next couple quarters.\n" +
      "Client: That sounds right. Nothing drastic.\n" +
      "Advisor: Agreed, we'll phase it. I also want to flag your cash position is a little high for an emergency reserve — we could put some to work in short-term treasuries.\n" +
      "Client: Let's do that.\n" +
      "Advisor: I'll prepare the reallocation proposal and the updated risk profile for your signature. Nothing changes until you approve it.",
  },
};

function buildPrompt(key, transcript, retention, redact) {
  const i = INDUSTRIES[key];
  const formats = {
    legal:
      "Produce an attorney meeting memorandum. Begin with a header line exactly: 'PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT'. " +
      "Then sections (CAPS headers): MATTER SUMMARY, ATTENDEES, KEY DISCUSSION POINTS, ADVICE GIVEN, ACTION ITEMS (with owner), FOLLOW-UP / DEADLINES.",
    medical:
      "Produce a clinical encounter note for the record (documentation aid only). " +
      "Sections (CAPS headers): SUBJECTIVE, OBJECTIVE, ASSESSMENT, PLAN, FOLLOW-UP. " +
      "Document only what the clinician/patient stated. Do NOT add diagnoses, vitals, or findings not in the transcript.",
    financial:
      "Produce a client meeting summary for the advisory record. " +
      "Sections (CAPS headers): MEETING SUMMARY, CLIENT OBJECTIVES, RECOMMENDATIONS DISCUSSED, SUITABILITY NOTES, ACTION ITEMS, REQUIRED APPROVALS.",
  };
  return (
    "You are a professional documentation formatter for the " + i.name.toLowerCase() +
    " field. You are NOT an attorney, clinician, or financial adviser, and you do not give advice. " +
    "Your job is to organize the meeting transcript below into a clean, accurate record.\n\n" +
    "Rules:\n" +
    "- Use ONLY information explicitly present in the transcript. Never invent facts, findings, diagnoses, legal conclusions, or investment recommendations.\n" +
    "- Where important information appears missing, write '[Needs confirmation]' rather than guessing.\n" +
    (redact
      ? "- Replace obvious personal identifiers (full names, exact addresses, account numbers, DOB) with bracketed placeholders like [CLIENT], [ADDRESS], [ACCT].\n"
      : "") +
    "- Output PLAIN TEXT only. No markdown symbols (no #, *, -). Use CAPS for section headers and blank lines between sections.\n" +
    "- Be concise; this is a one-page record.\n" +
    "- End with one line: 'Documentation aid generated from a recorded meeting; not a substitute for professional judgment or the official record.'\n\n" +
    formats[key] + "\n\n" +
    "Retention designation for this record: " + retention + ".\n\n" +
    "TRANSCRIPT:\n" + transcript
  );
}

const rid = () =>
  "ATT-" +
  new Date().toISOString().slice(0, 10).replace(/-/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6).toUpperCase();
const hash = () =>
  Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 6)).join(":");

export default function App() {
  const [industry, setIndustry] = useState("legal");
  const [transcript, setTranscript] = useState("");
  const [retention, setRetention] = useState(INDUSTRIES.legal.defaultRetention);
  const [consent, setConsent] = useState(false);
  const [redact, setRedact] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState(null);
  const [copied, setCopied] = useState(false);

  const cfg = INDUSTRIES[industry];

  const pickIndustry = (k) => {
    setIndustry(k);
    setRetention(INDUSTRIES[k].defaultRetention);
  };

  const loadSample = () => {
    setTranscript(cfg.sample);
    setError("");
  };

  const generate = async () => {
    if (!consent || !transcript.trim() || loading) return;
    setLoading(true);
    setError("");
    setRecord(null);
    setCopied(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            { role: "user", content: buildPrompt(industry, transcript.trim(), retention, redact) },
          ],
        }),
      });
      if (!res.ok) throw new Error("status " + res.status);
      const data = await res.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (!text) throw new Error("empty");
      setRecord({
        text,
        id: rid(),
        at: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        retention,
        redact,
        integrity: hash(),
        practice: cfg.name,
      });
    } catch (e) {
      setError("The record couldn't be generated. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!record) return;
    navigator.clipboard?.writeText(record.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="attest">
      <style>{CSS}</style>
      <div className="at-shell">
        <header className="at-top">
          <div className="at-brand">
            <div className="at-mark"><Seal size={38} /></div>
            <div>
              <div className="at-word">Attest</div>
              <div className="at-tag">Records that hold up</div>
            </div>
          </div>
          <div className="at-status">
            <span className="at-dot" />
            Confidential · Demo workspace
          </div>
        </header>

        <div className="at-grid">
          {/* ---------- console ---------- */}
          <aside className="at-console">
            <p className="at-leg">Practice area</p>
            <div className="at-practice">
              {Object.entries(INDUSTRIES).map(([k, v]) => (
                <button
                  key={k}
                  className={"at-opt" + (industry === k ? " sel" : "")}
                  onClick={() => pickIndustry(k)}
                  aria-pressed={industry === k}
                >
                  <span className="ring" />
                  <span>
                    <span className="o-name">{v.name}</span>
                    <span className="o-sub">{v.sub}</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="at-leg mt">Retention designation</p>
            <div className="at-field">
              <select
                className="at-select"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                aria-label="Retention period"
              >
                {cfg.retention.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <p className="at-leg mt">Meeting transcript</p>
            <textarea
              className="at-area"
              placeholder="Paste a meeting transcript here. In production this is captured live with consent-gated recording and speech-to-text."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <button className="at-sample" onClick={loadSample}>
              Load a sample {cfg.name.toLowerCase()} transcript
            </button>

            <button
              className={"at-toggle" + (redact ? " on" : "")}
              onClick={() => setRedact(!redact)}
              aria-pressed={redact}
              style={{ marginTop: 14 }}
            >
              <span className="at-check">
                {redact && (
                  <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3" stroke="#16202B" strokeWidth="2" fill="none" /></svg>
                )}
              </span>
              <span className="t-txt"><b>Auto-redact identifiers</b><br />Flag and bracket names, addresses, and account numbers.</span>
            </button>

            <button
              className={"at-toggle" + (consent ? " on" : "")}
              onClick={() => setConsent(!consent)}
              aria-pressed={consent}
            >
              <span className="at-check">
                {consent && (
                  <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3" stroke="#16202B" strokeWidth="2" fill="none" /></svg>
                )}
              </span>
              <span className="t-txt"><b>Recording consent on file</b><br />All parties consented to this meeting being recorded and documented.</span>
            </button>

            <button className="at-gen" onClick={generate} disabled={!consent || !transcript.trim() || loading}>
              {loading ? "Generating…" : "Generate record"}
            </button>
            <p className="at-note">
              Demo only — transcripts are sent to the model to format and are not stored here. Do not paste real
              patient, client, or privileged information into this prototype.
            </p>
          </aside>

          {/* ---------- document ---------- */}
          <section className="at-doc">
            <div className="at-doc-head">
              <span className="lbl">The Record</span>
              <div className="at-actions">
                <button className="at-mini" onClick={copy} disabled={!record}>
                  {copied ? "Copied" : "Copy"}
                </button>
                <button className="at-mini" onClick={() => window.print()} disabled={!record}>
                  Export
                </button>
              </div>
            </div>

            {error && <div className="at-err">{error}</div>}

            {loading && (
              <div className="at-load">
                <div className="at-spin" />
                <p>Formatting · {cfg.name} record</p>
              </div>
            )}

            {!loading && !record && !error && (
              <div className="at-empty">
                <div className="e-seal"><Seal size={96} faded /></div>
                <h3>No record yet</h3>
                <p>Choose a practice area, add a transcript, confirm consent, and generate a certified record.</p>
              </div>
            )}

            {!loading && record && (
              <div className="at-body">
                <div className="at-record">{record.text}</div>
                <div className="at-cert">
                  <Seal size={78} />
                  <div className="meta">
                    <div><b>Record</b> {record.id}</div>
                    <div><b>Practice</b> {record.practice} &nbsp; <b>Certified</b> {record.at}</div>
                    <div><b>Retention</b> {record.retention} &nbsp; <b>Redaction</b> {record.redact ? "applied" : "off"}</div>
                    <div><b>Integrity</b> {record.integrity} <span style={{ opacity: 0.6 }}>(demo)</span></div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
