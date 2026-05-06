import express from "express";

const app = express();
app.use(express.json());

// ----- Simulated LLM output (same "model") -----
function fakeLLM(prompt) {
  return `
Based on the provided parameters, the robotic system should evaluate
human proximity, confirm deceleration capability, check emergency stop
latency, review OSHA safety thresholds, and coordinate a controlled
pause while logging the interaction for audit and compliance review.
Immediate steps include notifying operators, recalibrating sensors,
and executing a safety protocol review.
`;
}

// ----- IGM governance boundary -----
const MAX_TOKENS = 25;

function govern(output) {
  return output.split(/\s+/).slice(0, MAX_TOKENS).join(" ");
}

// ----- IGM inference gateway -----
app.post("/infer", (req, res) => {
  const { prompt, mode } = req.body;

  const raw = fakeLLM(prompt);

  if (mode === "governed") {
    const bounded = govern(raw);
    return res.json({
      output: bounded,
      governed: true,
      original_tokens: raw.split(/\s+/).length,
      governed_tokens: bounded.split(/\s+/).length
    });
  }

  return res.json({
    output: raw,
    governed: false,
    original_tokens: raw.split(/\s+/).length
  });
});

app.listen(3333, () =>
  console.log("✅ IGM DEMO SERVER RUNNING (OFFLINE, DETERMINISTIC)")
);
``
