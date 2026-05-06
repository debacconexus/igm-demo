import { useState } from "react";

const SCENARIOS = [
  {
    num:"01", title:"Thermal safety", domain:"Thermodynamics",
    gT:"Thermodynamics · Safety gap — thermal engineer at critical threshold",
    gD:"A thermal safety engineer at a pressurized water reactor finds the primary coolant loop is 8°C from critical failure. Ungoverned AI produces 900 words of background. IGM delivers the exact safety parameters needed — immediately.",
    p:"I am a thermal safety engineer. My PWR primary coolant loop reads 284°C at 6.8 MPa. Critical boiling threshold is 292°C. I have a 4-hour window before mandatory shutdown review. What are my immediate actions and acceptable operating bounds?",
    gs:"You are a governed nuclear thermal safety AI. Respond ONLY in this exact structure — no other text: CURRENT STATUS: [one sentence] | SAFETY MARGIN: [specific value with units] | IMMEDIATE ACTIONS: 1. [action] 2. [action] 3. [action] | SHUTDOWN THRESHOLD: [specific temperature] | ESCALATE TO: [role]",
    log:[
      {t:"pass",l:"Input validation",    d:"Safety query — critical domain authorized"},
      {t:"set", l:"Domain class",        d:"NUCLEAR_THERMAL_SAFETY assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"SAFETY_PROTOCOL required"},
      {t:"flag",l:"Risk assessment",     d:"CRITICAL margin detected — 8°C buffer"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  },
  {
    num:"02", title:"Robotics brain", domain:"Robotics",
    gT:"Robotics · Brain integration gap — AI inference boundary not validated before actuator",
    gD:"A robotics engineer must integrate an LLM decision layer into a surgical robot arm. One unvalidated token reaching the motor controller could cause harm. IGM validates the inference boundary before any command reaches a physical actuator.",
    p:"I am integrating an LLM into a 6-DOF surgical robot arm. The LLM processes sensor data and outputs motor commands. How do I ensure the inference layer never outputs a command exceeding safe torque limits or velocity thresholds when operating near human tissue?",
    gs:"You are a governed robotics safety AI. Respond ONLY in this exact structure — no other text: RISK CLASS: [CRITICAL/HIGH/MEDIUM] | INFERENCE GATE REQUIREMENT: [one sentence] | HARD LIMITS: 1. [limit with value] 2. [limit with value] 3. [limit with value] | VALIDATION METHOD: [one sentence] | IGM REQUIRED: YES",
    log:[
      {t:"pass",l:"Input validation",    d:"Robotics safety query — authorized"},
      {t:"flag",l:"Risk assessment",     d:"CRITICAL — actuator-adjacent inference"},
      {t:"set", l:"Domain class",        d:"SURGICAL_ROBOTICS assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"SAFETY_PROTOCOL / HARD_LIMITS required"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  },
  {
    num:"03", title:"Nanotech ROI", domain:"Nanotech",
    gT:"Nanotech · Investment waste — millions burning in ungoverned AI inference",
    gD:"A nanotech company owner discovers their AI vendor runs 40,000 ungoverned inference calls daily for carbon nanotube defect detection — no token limits, no audit trail. IGM calculates the real number and ROI case in one structured response.",
    p:"I own a nanomaterial manufacturing firm. Our AI quality control system runs 40,000 inference calls per day for carbon nanotube defect detection. Each query averages 847 output tokens. At $15 per million output tokens, what is my annual AI spend, and what would governed inference at 150 tokens per query save me annually?",
    gs:"You are a governed financial analysis AI. Respond ONLY in this exact structure — no other text: CURRENT ANNUAL SPEND: [$X] | GOVERNED ANNUAL SPEND: [$X] | ANNUAL SAVINGS: [$X] | TOKEN REDUCTION: [X%] | PAYBACK PERIOD: [estimate] | RECOMMENDATION: [one sentence]",
    log:[
      {t:"pass",l:"Input validation",    d:"Financial query — authorized"},
      {t:"pass",l:"PII detection",       d:"No identifiers present"},
      {t:"set", l:"Domain class",        d:"NANOTECH_FINANCIAL_ANALYSIS assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"ROI_ANALYSIS / COST_OPTIMIZED"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  },
  {
    num:"04", title:"TNI thermal field", domain:"Thermodynamics + Nanotech",
    gT:"TNI · Thermodynamic nanorobotic field — inference heat exceeding safe operational boundary",
    gD:"A researcher running distributed inference on a 200-node nanorobotic array detects a dangerous thermal differential. IGM calculates whether the system crosses the 2kW safe operating boundary.",
    p:"I am running distributed inference on a 200-node nanorobotic array. Thermal sensors show 0.87 joules per governed inference call and 4.2 joules per ungoverned call. At 10,000 calls per hour, calculate the thermal differential, total power load for each path, and whether either path crosses a 2kW safe operating boundary.",
    gs:"You are a governed thermodynamic analysis AI. Respond ONLY in this exact structure — no other text: GOVERNED THERMAL LOAD: [X watts] | UNGOVERNED THERMAL LOAD: [X watts] | DIFFERENTIAL: [X watts / X%] | SAFE BOUNDARY (2kW): [WITHIN or EXCEEDED for each path] | CRITICAL FINDING: [one sentence]",
    log:[
      {t:"pass",l:"Input validation",    d:"Thermal analysis query — authorized"},
      {t:"set", l:"Domain class",        d:"TNI_THERMODYNAMIC assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"THERMAL_SAFETY_ANALYSIS"},
      {t:"flag",l:"Risk assessment",     d:"Thermal boundary proximity detected"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  },
  {
    num:"05", title:"Robot emergency", domain:"Robotics",
    gT:"Robotics · Emergency decision — autonomous arm detects human in work envelope",
    gD:"An autonomous robot arm detects a human at 0.8 meters with closing velocity making collision likely. Ungoverned AI begins a safety lecture. IGM delivers the only answer that matters — in the only timeframe that matters.",
    p:"EMERGENCY: Autonomous robot arm (Fanuc M-20iD) has detected a human entering the work envelope at 0.8 meters. Current arm velocity: 1.2 m/s. Calculated stop distance at this speed: 0.6 meters. Collision is probable. What is the immediate governance decision?",
    gs:"You are a governed emergency robotics safety AI. Respond ONLY in this exact structure — no other text: DECISION: [FULL STOP / REDUCE SPEED / REDIRECT] | RATIONALE: [one sentence] | EXECUTE WITHIN: [milliseconds] | HUMAN SAFE: [YES / NO] | OVERRIDE REQUIRED: [YES / NO]",
    log:[
      {t:"flag",l:"Input validation",    d:"EMERGENCY — human proximity detected"},
      {t:"act", l:"Priority override",   d:"LIFE_SAFETY class activated"},
      {t:"set", l:"Domain class",        d:"EMERGENCY_ROBOTICS assigned"},
      {t:"set", l:"Token ceiling",       d:"Minimum viable output enforced"},
      {t:"set", l:"Output class",        d:"EMERGENCY_DECISION — zero verbosity"},
      {t:"go",  l:"Emergency authorized",d:"Governance active — routing to LLM NOW"}
    ]
  },
  {
    num:"06", title:"AWS Bedrock gap", domain:"Cloud Security",
    gT:"AWS Bedrock · Security overhead — $340K/year in ungoverned inference costs with zero audit trail",
    gD:"A Fortune 500 CISO discovers their AWS Bedrock security monitoring AI runs 8,000 ungoverned queries daily — no token limits, no structured output, no audit trail. Security analysts spend 40% of their time parsing verbose AI noise. IGM calculates the real cost and delivers the fix.",
    p:"I am a CISO at a Fortune 500 company. Our AWS Bedrock security monitoring AI processes 8,000 queries daily, averaging 920 output tokens per call at $20 per million tokens. We have no token governance, no structured output, and analysts spend 40% of their time parsing verbose AI responses to find actual security alerts. Calculate our annual inference cost, the annual cost under IGM governance at 120 tokens per call, annual savings, and analyst capacity recovered if parsing time drops from 40% to 5%.",
    gs:"You are a governed cybersecurity financial analysis AI. Respond ONLY in this exact structure — no other text: CURRENT ANNUAL INFERENCE COST: [$X] | GOVERNED ANNUAL COST: [$X] | ANNUAL INFERENCE SAVINGS: [$X] | TOKEN REDUCTION: [X%] | ANALYST CAPACITY RECOVERED: [X%] | SECURITY POSTURE IMPROVEMENT: [one sentence] | IGM VERDICT: [one sentence]",
    log:[
      {t:"pass",l:"Input validation",    d:"Security financial query — authorized"},
      {t:"flag",l:"Risk assessment",     d:"Ungoverned cloud inference — cost exposure identified"},
      {t:"set", l:"Domain class",        d:"CLOUD_SECURITY_ECONOMICS assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"ROI_ANALYSIS / SECURITY_AUDIT"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  },
  {
    num:"07", title:"Cybersecurity margin", domain:"Cybersecurity Firm",
    gT:"Cybersecurity firm · Margin collapse — AWS inference costs exceeding product revenue",
    gD:"A cybersecurity firm sells AI-powered threat detection to 50 enterprise clients at $45K/month each. Their AWS Bedrock bill is $1.8M/month — the product is underwater. IGM governance restructures the unit economics and restores profitability in one calculation.",
    p:"I run a cybersecurity firm with 50 enterprise clients paying $45,000 per month each for AI-powered threat detection. Our AWS Bedrock inference costs are $1.8 million per month based on 60,000 security queries per day averaging 1,100 output tokens each at $20 per million tokens. IGM governance could reduce average output to 180 tokens per query. Calculate current monthly revenue, current gross margin, governed monthly inference cost, new gross margin, and annual margin recovery.",
    gs:"You are a governed unit economics AI for cybersecurity firms. Respond ONLY in this exact structure — no other text: MONTHLY REVENUE: [$X] | CURRENT INFERENCE COST: [$X/month] | CURRENT GROSS MARGIN: [X%] | GOVERNED INFERENCE COST: [$X/month] | NEW GROSS MARGIN: [X%] | ANNUAL MARGIN RECOVERY: [$X] | MARKET IMPACT: [one sentence]",
    log:[
      {t:"pass",l:"Input validation",    d:"Financial query — authorized"},
      {t:"flag",l:"Risk assessment",     d:"Margin inversion detected — critical exposure"},
      {t:"set", l:"Domain class",        d:"CYBERSECURITY_UNIT_ECONOMICS assigned"},
      {t:"set", l:"Token ceiling",       d:"Structured output enforced"},
      {t:"set", l:"Output class",        d:"MARGIN_RECOVERY_ANALYSIS"},
      {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
    ]
  }
];

const CUSTOM_LOG = [
  {t:"pass",l:"Input validation",    d:"Custom query received — scanning content"},
  {t:"pass",l:"PII detection",       d:"Checking for sensitive identifiers"},
  {t:"set", l:"Domain class",        d:"AUTO_CLASSIFY — domain detected from query"},
  {t:"set", l:"Token ceiling",       d:"Structured output enforced — 150 token ceiling"},
  {t:"set", l:"Output class",        d:"GOVERNED_BRIEF / COST_OPTIMIZED"},
  {t:"go",  l:"Inference authorized",d:"Governance active — routing to LLM"}
];

const CUSTOM_GS = "You are a governed AI assistant operating under the Inference Governance Module (IGM). You must respond in the most concise, structured format possible. Respond ONLY in this exact structure — no prose, no preamble: SITUATION: [one sentence summarizing the problem] | FINDING: [the key fact, number, or answer — one sentence] | SAVINGS / IMPACT: [quantified benefit if applicable, one sentence] | RECOMMENDATION: [one actionable sentence] | IGM NOTE: Governed response delivered under token ceiling.";

const DOT = {pass:"#22c55e",set:"#3b82f6",flag:"#f59e0b",act:"#ef4444",go:"#9ca3af"};
const TXT = {pass:"#16a34a",set:"#2563eb",flag:"#d97706",act:"#dc2626",go:"#374151"};
const DC  = {
  "Thermodynamics":           {bg:"#fff7ed",bd:"#fed7aa",tx:"#c2410c"},
  "Robotics":                 {bg:"#eff6ff",bd:"#bfdbfe",tx:"#1d4ed8"},
  "Nanotech":                 {bg:"#f5f3ff",bd:"#ddd6fe",tx:"#6d28d9"},
  "Thermodynamics + Nanotech":{bg:"#fefce8",bd:"#fde68a",tx:"#92400e"},
  "Cloud Security":           {bg:"#f0fdf4",bd:"#bbf7d0",tx:"#15803d"},
  "Cybersecurity Firm":       {bg:"#fdf4ff",bd:"#f0abfc",tx:"#a21caf"},
  "Custom":                   {bg:"#f8fafc",bd:"#cbd5e1",tx:"#334155"},
};

async function callAPI(prompt, system) {
  const body = {model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]};
  if (system) body.system = system;
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.type+": "+d.error.message);
  return {text:d.content.map(c=>c.text||"").join(""),out:d.usage.output_tokens,inp:d.usage.input_tokens};
}

const sleep = ms => new Promise(r => setTimeout(r,ms));
const mono  = {fontFamily:"monospace"};

export default function App() {
  const [view,       setView]       = useState("demo");
  const [idx,        setIdx]        = useState(0);
  const [isCustom,   setIsCustom]   = useState(false);
  const [customText, setCustomText] = useState("");
  const [running,    setRunning]    = useState(false);
  const [logStep,    setLogStep]    = useState(-1);
  const [gov,        setGov]        = useState(null);
  const [ung,        setUng]        = useState(null);
  const [errMsg,     setErrMsg]     = useState("");
  const [totals,     setTotals]     = useState({t:0,e:0,w:0,c:0,k:0});

  const s       = SCENARIOS[idx];
  const prompt  = isCustom ? customText : s.p;
  const govSys  = isCustom ? CUSTOM_GS  : s.gs;
  const logData = isCustom ? CUSTOM_LOG  : s.log;
  const domain  = isCustom ? "Custom"    : s.domain;
  const dc      = DC[domain] || DC["Custom"];

  const pickScene = i => {
    if (running) return;
    setIdx(i); setIsCustom(false); setLogStep(-1); setGov(null); setUng(null); setErrMsg("");
  };

  const pickCustom = () => {
    if (running) return;
    setIsCustom(true); setLogStep(-1); setGov(null); setUng(null); setErrMsg("");
  };

  const run = async () => {
    if (running) return;
    if (isCustom && !customText.trim()) { setErrMsg("Please enter your situation before running."); return; }
    setRunning(true); setLogStep(0); setGov(null); setUng(null); setErrMsg("");
    const gP = callAPI(prompt, govSys).catch(e=>({error:e.message}));
    const uP = callAPI(prompt, null).catch(e=>({error:e.message}));
    for (let i=1; i<=logData.length; i++) { await sleep(270); setLogStep(i); }
    const [g,u] = await Promise.all([gP,uP]);
    const errs = [];
    if (g.error) errs.push("Governed: "+g.error); else setGov(g);
    if (u.error) errs.push("Ungoverned: "+u.error); else setUng(u);
    if (errs.length) setErrMsg(errs.join(" | "));
    if (!g.error && !u.error) {
      const saved = Math.max(0,u.out-g.out);
      setTotals(p=>({t:p.t+saved,e:p.e+saved*0.0003,w:p.w+saved*0.5,c:p.c+saved*0.15,k:p.k+saved*0.000003}));
    }
    setRunning(false);
  };

  const viewBtn = (v,label) => (
    <button onClick={()=>setView(v)} style={{
      background:view===v?"#f3f4f6":"transparent",border:"0.5px solid #d1d5db",
      borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",
      color:"#374151",fontFamily:"inherit",fontWeight:view===v?600:400
    }}>{label}</button>
  );

  const panel = children => (
    <div style={{background:"#fff",border:"0.5px solid #e5e7eb",borderRadius:12,padding:14,flex:1,minWidth:240}}>
      {children}
    </div>
  );

  return (
    <div style={{fontFamily:"system-ui,sans-serif",padding:"0.75rem 0",maxWidth:920}}>

      {/* Header */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:4}}>
          USPTO 19/571,156 · Patent pending · DeBacco Nexus LLC · info@debacconexus.com
        </div>
        <div style={{fontSize:22,fontWeight:700,color:"#111827",marginBottom:2}}>Inference Governance Module</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:14}}>
          Live demo · Thermodynamics · Robotics · Nanotech · Cloud Security · Cybersecurity · Custom
        </div>
        <div style={{display:"flex",gap:6}}>
          {viewBtn("demo","Live demo")}
          {viewBtn("arch","Architecture")}
        </div>
      </div>

      {view==="demo" && <>

        {/* Scenario tabs */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {SCENARIOS.map((sc,i)=>{
            const tdc=DC[sc.domain]||{};
            const active=!isCustom && i===idx;
            return (
              <button key={i} onClick={()=>pickScene(i)} style={{
                background:active?(tdc.bg||"#f3f4f6"):"transparent",
                border:`0.5px solid ${active?(tdc.bd||"#d1d5db"):"#e5e7eb"}`,
                borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",
                color:active?(tdc.tx||"#374151"):"#6b7280",fontFamily:"inherit",
                whiteSpace:"nowrap",fontWeight:active?700:400
              }}>{sc.num} · {sc.title}</button>
            );
          })}
          {/* Custom tab */}
          <button onClick={pickCustom} style={{
            background:isCustom?"#f1f5f9":"transparent",
            border:`0.5px solid ${isCustom?"#94a3b8":"#e5e7eb"}`,
            borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",
            color:isCustom?"#334155":"#6b7280",fontFamily:"inherit",
            whiteSpace:"nowrap",fontWeight:isCustom?700:400
          }}>
            08 · Your scenario
          </button>
        </div>

        {/* Domain badge */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:10,...mono,padding:"3px 8px",borderRadius:20,background:dc.bg,border:`0.5px solid ${dc.bd}`,color:dc.tx,fontWeight:700}}>
            {domain}
          </span>
          {!isCustom && <span style={{fontSize:10,...mono,color:"#9ca3af"}}>Scenario {s.num} of {SCENARIOS.length}</span>}
          {isCustom && <span style={{fontSize:10,...mono,color:"#9ca3af"}}>Live client query — IGM auto-classifies and governs</span>}
        </div>

        {/* Gap banner or custom input */}
        {!isCustom ? (
          <div style={{background:"#eff6ff",borderLeft:"2px solid #3b82f6",padding:"10px 14px",borderRadius:"0 8px 8px 0",marginBottom:12}}>
            <div style={{fontSize:10,...mono,color:"#2563eb",marginBottom:3}}>{s.gT}</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{s.gD}</div>
          </div>
        ) : (
          <div style={{background:"#f8fafc",border:"0.5px solid #e2e8f0",borderRadius:8,padding:14,marginBottom:12}}>
            <div style={{fontSize:10,...mono,color:"#64748b",marginBottom:8}}>
              Enter your real-world situation — IGM will govern vs. ungoverned inference on your exact query
            </div>
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              disabled={running}
              placeholder="Describe your situation here. For example: I run a healthcare AI company with 15,000 patient queries per day averaging 780 tokens each. We have no token governance. What are our annual inference costs at $18 per million tokens, and what would we save with IGM governance at 100 tokens per query?"
              style={{
                width:"100%",minHeight:100,padding:"10px 12px",fontSize:13,
                fontFamily:"system-ui,sans-serif",lineHeight:1.6,
                background:"#fff",border:"0.5px solid #cbd5e1",borderRadius:8,
                color:"#1e293b",resize:"vertical",outline:"none",
                boxSizing:"border-box"
              }}
            />
            <div style={{fontSize:11,...mono,color:"#94a3b8",marginTop:6}}>
              IGM will auto-classify your domain, enforce a structured output ceiling, and compare against an ungoverned response — live.
            </div>
          </div>
        )}

        {/* Prompt display (pre-built scenarios only) */}
        {!isCustom && (
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:4}}>
              Real-world situation — identical prompt sent to both paths simultaneously
            </div>
            <div style={{fontSize:13,background:"#f9fafb",borderRadius:8,padding:"10px 14px",lineHeight:1.6,color:"#1f2937",fontStyle:"italic",border:"0.5px solid #e5e7eb"}}>
              {s.p}
            </div>
          </div>
        )}

        {/* Split panels */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>

          {panel(<>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",flexShrink:0}}/>
              <span style={{fontSize:11,...mono,color:"#16a34a",fontWeight:700}}>IGM governed</span>
            </div>
            <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:5}}>Governance decision log</div>
            <div style={{minHeight:120,marginBottom:10}}>
              {logData.map((e,i)=>(
                <div key={i} style={{
                  display:"flex",gap:8,padding:"3px 0",...mono,fontSize:11,lineHeight:1.5,
                  opacity:i<logStep?1:0,
                  transform:i<logStep?"none":"translateX(-5px)",
                  transition:"opacity 0.25s ease, transform 0.25s ease"
                }}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:DOT[e.t],flexShrink:0,marginTop:3}}/>
                  <div>
                    <span style={{color:TXT[e.t],fontWeight:700}}>{e.l}</span>
                    <span style={{color:"#9ca3af"}}> — {e.d}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{borderTop:"0.5px solid #e5e7eb",paddingTop:10}}>
              <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:4}}>Response</div>
              <div style={{fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap",minHeight:60,color:"#1f2937"}}>
                {running&&!gov?<span style={{color:"#9ca3af"}}>Governed inference in progress…</span>:gov?.text||""}
              </div>
              {gov&&<div style={{fontSize:10,...mono,color:"#16a34a",marginTop:6}}>Output: {gov.out} tokens · Input: {gov.inp} tokens</div>}
            </div>
          </>)}

          {panel(<>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#ef4444",flexShrink:0}}/>
              <span style={{fontSize:11,...mono,color:"#dc2626",fontWeight:700}}>Ungoverned</span>
            </div>
            <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:5}}>Governance decision log</div>
            <div style={{minHeight:120,marginBottom:10,display:"flex",alignItems:"center"}}>
              <span style={{fontSize:11,...mono,color:"#9ca3af",fontStyle:"italic"}}>No governance layer active — direct LLM access, no constraints enforced</span>
            </div>
            <div style={{borderTop:"0.5px solid #e5e7eb",paddingTop:10}}>
              <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:4}}>Response</div>
              <div style={{fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap",minHeight:60,color:"#1f2937"}}>
                {running&&!ung?<span style={{color:"#9ca3af"}}>Ungoverned inference in progress…</span>:ung?.text||""}
              </div>
              {ung&&<div style={{fontSize:10,...mono,color:"#dc2626",marginTop:6}}>Output: {ung.out} tokens · Input: {ung.inp} tokens</div>}
            </div>
          </>)}
        </div>

        {/* Run button */}
        <button onClick={run} disabled={running} style={{
          width:"100%",marginTop:12,padding:"10px 16px",fontSize:13,
          cursor:running?"not-allowed":"pointer",opacity:running?0.5:1,
          background:"transparent",border:"0.5px solid #374151",borderRadius:8,
          color:"#111827",fontFamily:"inherit",fontWeight:600
        }}>
          {running
            ? "Running…"
            : isCustom
              ? "Run my scenario through IGM"
              : `Run scenario ${s.num} — ${s.title}`}
        </button>

        {errMsg&&(
          <div style={{marginTop:8,fontSize:11,...mono,color:"#dc2626",background:"#fef2f2",borderRadius:8,padding:"10px 12px",border:"0.5px solid #fca5a5"}}>
            {errMsg}
          </div>
        )}

        {/* Token differential callout (shows after run) */}
        {gov && ung && (
          <div style={{
            marginTop:12,padding:"12px 14px",
            background: ung.out > gov.out ? "#f0fdf4" : "#f9fafb",
            border:`0.5px solid ${ung.out > gov.out ? "#86efac" : "#e5e7eb"}`,
            borderRadius:8,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"
          }}>
            <div>
              <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:2}}>Token differential — this run</div>
              <div style={{fontSize:18,fontWeight:700,...mono,color:ung.out>gov.out?"#16a34a":"#374151"}}>
                {ung.out > gov.out ? `−${(ung.out-gov.out).toLocaleString()} tokens` : `${(gov.out-ung.out).toLocaleString()} tokens over`}
              </div>
            </div>
            <div style={{height:36,width:1,background:"#e5e7eb"}}/>
            <div>
              <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:2}}>Governed</div>
              <div style={{fontSize:16,fontWeight:700,...mono,color:"#16a34a"}}>{gov.out}</div>
            </div>
            <div>
              <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:2}}>Ungoverned</div>
              <div style={{fontSize:16,fontWeight:700,...mono,color:"#dc2626"}}>{ung.out}</div>
            </div>
            {ung.out > gov.out && (
              <div style={{marginLeft:"auto",fontSize:11,...mono,color:"#16a34a"}}>
                IGM reduced output by {Math.round((1-gov.out/ung.out)*100)}%
              </div>
            )}
          </div>
        )}

        {/* Metrics */}
        <div style={{marginTop:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:2}}>Cumulative resource savings — this session</div>
          <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>
            Real token differential × constants: 0.3 mWh · 0.5 mL H₂O · 0.15 mg CO₂ · $0.003/1K tokens
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[
              {label:"Tokens saved",  val:totals.t.toLocaleString()},
              {label:"Energy (mWh)",  val:(totals.e*1000).toFixed(2)},
              {label:"Water (mL)",    val:totals.w.toFixed(1)},
              {label:"CO₂ (mg)",      val:totals.c.toFixed(2)},
              {label:"Cost saved ($)",val:totals.k.toFixed(4)}
            ].map((m,i)=>(
              <div key={i} style={{background:"#f9fafb",borderRadius:8,padding:"10px 12px",flex:1,minWidth:80,border:"0.5px solid #e5e7eb"}}>
                <div style={{fontSize:10,...mono,color:"#9ca3af",marginBottom:3}}>{m.label}</div>
                <div style={{fontSize:16,fontWeight:700,...mono,color:"#111827"}}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:8,fontSize:11,...mono,color:"#9ca3af"}}>
            Run all 8 scenarios — including your own — to see full cumulative environmental and capital impact.
          </div>
        </div>

      </>}

      {view==="arch" && <ArchDiagram />}

    </div>
  );
}

function ArchDiagram() {
  return (
    <div>
      <svg width="100%" viewBox="0 0 680 500" role="img" style={{display:"block"}}>
        <title>IGM inference boundary architecture</title>
        <desc>Left governed path: user request flows through IGM with four internal components then to LLM producing a governed response. Right ungoverned path: user request bypasses all governance going directly to LLM.</desc>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>
        <line x1="340" y1="18" x2="340" y2="462" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 4"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#111827" x="160" y="28" textAnchor="middle">Governed path</text>
        <text fontFamily="system-ui" fontSize="12" fill="#6b7280" x="160" y="44" textAnchor="middle">IGM active</text>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#111827" x="520" y="28" textAnchor="middle">Ungoverned path</text>
        <text fontFamily="system-ui" fontSize="12" fill="#6b7280" x="520" y="44" textAnchor="middle">Direct LLM access</text>
        <rect x="60" y="56" width="200" height="44" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#374151" x="160" y="78" textAnchor="middle" dominantBaseline="central">User request</text>
        <line x1="160" y1="100" x2="160" y2="116" stroke="#9ca3af" strokeWidth="1" markerEnd="url(#ah)"/>
        <rect x="60" y="118" width="200" height="178" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="700" fill="#166534" x="160" y="136" textAnchor="middle" dominantBaseline="central">IGM</text>
        <text fontFamily="system-ui" fontSize="12" fill="#16a34a" x="160" y="152" textAnchor="middle" dominantBaseline="central">Inference governance module</text>
        <rect x="78" y="163" width="164" height="26" rx="4" fill="#fff" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#374151" x="160" y="176" textAnchor="middle" dominantBaseline="central">Input validation</text>
        <rect x="78" y="195" width="164" height="26" rx="4" fill="#fff" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#374151" x="160" y="208" textAnchor="middle" dominantBaseline="central">PII scanner</text>
        <rect x="78" y="227" width="164" height="26" rx="4" fill="#fff" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#374151" x="160" y="240" textAnchor="middle" dominantBaseline="central">Token ceiling enforcer</text>
        <rect x="78" y="259" width="164" height="26" rx="4" fill="#fff" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#374151" x="160" y="272" textAnchor="middle" dominantBaseline="central">Output classifier</text>
        <line x1="160" y1="296" x2="160" y2="314" stroke="#22c55e" strokeWidth="1" markerEnd="url(#ah)"/>
        <text fontFamily="system-ui" fontSize="11" fill="#16a34a" x="172" y="306" dominantBaseline="central">Authorized</text>
        <rect x="60" y="316" width="200" height="44" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#1e40af" x="160" y="338" textAnchor="middle" dominantBaseline="central">Large language model</text>
        <line x1="160" y1="360" x2="160" y2="374" stroke="#9ca3af" strokeWidth="1" markerEnd="url(#ah)"/>
        <rect x="60" y="376" width="200" height="52" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="700" fill="#166534" x="160" y="395" textAnchor="middle" dominantBaseline="central">Governed response</text>
        <text fontFamily="system-ui" fontSize="12" fill="#16a34a" x="160" y="411" textAnchor="middle" dominantBaseline="central">Precise, bounded, auditable</text>
        <rect x="420" y="56" width="200" height="44" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#374151" x="520" y="78" textAnchor="middle" dominantBaseline="central">User request</text>
        <line x1="520" y1="100" x2="520" y2="314" stroke="#f87171" strokeWidth="1" strokeDasharray="5 3" markerEnd="url(#ah)"/>
        <text fontFamily="system-ui" fontSize="11" fill="#dc2626" x="533" y="198" dominantBaseline="central">No governance layer</text>
        <rect x="420" y="316" width="200" height="44" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="500" fill="#1e40af" x="520" y="338" textAnchor="middle" dominantBaseline="central">Large language model</text>
        <line x1="520" y1="360" x2="520" y2="374" stroke="#9ca3af" strokeWidth="1" markerEnd="url(#ah)"/>
        <rect x="420" y="376" width="200" height="52" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="14" fontWeight="700" fill="#991b1b" x="520" y="395" textAnchor="middle" dominantBaseline="central">Ungoverned response</text>
        <text fontFamily="system-ui" fontSize="12" fill="#dc2626" x="520" y="411" textAnchor="middle" dominantBaseline="central">Verbose, unstructured, at risk</text>
        <rect x="62" y="446" width="10" height="10" rx="2" fill="#f0fdf4" stroke="#86efac" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#6b7280" x="78" y="453" dominantBaseline="central">Governance layer</text>
        <rect x="222" y="446" width="10" height="10" rx="2" fill="#eff6ff" stroke="#93c5fd" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#6b7280" x="238" y="453" dominantBaseline="central">Language model</text>
        <rect x="370" y="446" width="10" height="10" rx="2" fill="#fef2f2" stroke="#fca5a5" strokeWidth="0.5"/>
        <text fontFamily="system-ui" fontSize="12" fill="#6b7280" x="386" y="453" dominantBaseline="central">Uncontrolled inference</text>
      </svg>
      <div style={{fontSize:11,fontFamily:"monospace",color:"#9ca3af",padding:"8px 12px",background:"#f9fafb",borderRadius:8,marginTop:10,border:"0.5px solid #e5e7eb"}}>
        Conceptual boundary only. Full architecture protected under USPTO 19/571,156 (patent pending).
      </div>
    </div>
  );
}
