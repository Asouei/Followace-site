import { useState, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────

const QUESTIONS = [
  { id: 1, category: "exhaustion", text: "How often do you feel emotionally drained by the end of a workday?", subtext: "Think about the past 2 weeks" },
  { id: 2, category: "exhaustion", text: "Do you wake up already tired, even after sleeping?", subtext: "Consider your typical morning" },
  { id: 3, category: "cynicism", text: "Have you lost enthusiasm for work that used to excite you?", subtext: "Compare to how you felt 6 months ago" },
  { id: 4, category: "cynicism", text: "Do you feel disconnected from the purpose of your work?", subtext: "Does it feel like you're just going through motions?" },
  { id: 5, category: "efficacy", text: "Do you doubt your ability to handle your responsibilities?", subtext: "Even tasks you used to find easy" },
  { id: 6, category: "efficacy", text: "How often do you feel like nothing you do makes a difference?", subtext: "At work or in personal life" },
  { id: 7, category: "physical", text: "Do you experience headaches, muscle tension, or stomach issues regularly?", subtext: "Physical symptoms with no clear medical cause" },
  { id: 8, category: "physical", text: "Have your eating or sleeping patterns changed significantly?", subtext: "Overeating, undereating, insomnia, oversleeping" },
  { id: 9, category: "isolation", text: "Do you avoid social interactions you once enjoyed?", subtext: "Friends, family, coworkers" },
  { id: 10, category: "isolation", text: "Do you feel alone in what you're going through?", subtext: "Like nobody truly understands" },
  { id: 11, category: "identity", text: "Have you forgotten what you actually want from life?", subtext: "Beyond just surviving day to day" },
  { id: 12, category: "identity", text: "Do you feel trapped — like there's no way out of your current situation?", subtext: "Financially, emotionally, or professionally" },
];

const ANSWERS = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

const CATEGORIES = {
  exhaustion: { name: "Exhaustion", icon: "🔥", color: "#FF6B35" },
  cynicism: { name: "Cynicism", icon: "🪨", color: "#8B8C89" },
  efficacy: { name: "Lost Efficacy", icon: "📉", color: "#7B68EE" },
  physical: { name: "Physical Toll", icon: "💔", color: "#E63946" },
  isolation: { name: "Isolation", icon: "🏝️", color: "#457B9D" },
  identity: { name: "Identity Crisis", icon: "🪞", color: "#E9C46A" },
};

function getScoreLevel(pct) {
  if (pct <= 25) return { level: "Low", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", message: "You're managing well. But don't ignore the early signs." };
  if (pct <= 50) return { level: "Moderate", color: "#FBBF24", bg: "rgba(251,191,36,0.1)", message: "Yellow flags are showing. Now is the time to act — before it gets worse." };
  if (pct <= 75) return { level: "High", color: "#F97316", bg: "rgba(249,115,22,0.1)", message: "You're deep in it. This isn't sustainable. Something has to change." };
  return { level: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.1)", message: "You're running on fumes. Your body and mind are screaming. Please — start your recovery today." };
}

// ─── CONCERN MESSAGES ───────────────────────────────────

const CONCERN_MESSAGES = {
  exhaustion: "Your energy reserves are critically depleted. Recovery starts with protecting your rest — even 15 minutes of real downtime matters.",
  cynicism: "You've disconnected from meaning. This is your mind's defense mechanism — but it's also a trap that deepens the spiral.",
  efficacy: "Self-doubt has taken hold. The truth is you're capable — burnout is lying to you about who you are.",
  physical: "Your body is keeping the score. These symptoms are real and they're telling you something needs to change.",
  isolation: "Withdrawal feels safe but it deepens the spiral. One honest conversation can change everything.",
  identity: "You've lost touch with who you are beyond work. Rebuilding identity is the deepest — and most rewarding — recovery work.",
};

// ─── SHARE HELPERS ──────────────────────────────────────

function getShareText(pct, level) {
  return `I just took the Burnout Recovery Score test and scored ${pct}% (${level}). If you're feeling exhausted, take 3 minutes to check yours:`;
}

function shareTwitter(pct, level, url) {
  const text = getShareText(pct, level);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
}

function shareLinkedIn(url) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
}

function copyLink(url) {
  navigator.clipboard.writeText(url).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}

// ─── STYLES ─────────────────────────────────────────────

const containerStyle = {
  minHeight: "100vh",
  background: "#0A0A0B",
  color: "#F5F5F0",
  fontFamily: "'DM Sans', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const noiseOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
  pointerEvents: "none",
  zIndex: 1,
};

// ─── COMPONENT ──────────────────────────────────────────

export default function BurnoutQuiz() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animating, setAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const progress = (currentQ / totalQuestions) * 100;

  const handleAnswer = (value) => {
    if (animating) return;
    setAnimating(true);
    setAnswers((prev) => ({ ...prev, [QUESTIONS[currentQ].id]: value }));

    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setPhase("results");
        setTimeout(() => setShowResults(true), 100);
      }
      setAnimating(false);
    }, 400);
  };

  const handleEmailSubmit = () => {
    if (!email.includes("@")) return;
    
    // ═══════════════════════════════════════════════════════
    // TODO: Connect to Kit (ConvertKit) API
    // 
    // Replace this block with:
    //
    // fetch("https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     api_key: "YOUR_PUBLIC_API_KEY",
    //     email: email,
    //     tags: ["burnout-quiz"],
    //     fields: {
    //       burnout_score: pct,
    //       top_concern: topConcern.name,
    //     }
    //   })
    // })
    // ═══════════════════════════════════════════════════════
    
    setEmailSubmitted(true);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = totalQuestions * 4;
  const pct = Math.round((totalScore / maxScore) * 100);
  const scoreInfo = getScoreLevel(pct);

  const categoryScores = Object.entries(CATEGORIES).map(([key, cat]) => {
    const qs = QUESTIONS.filter((q) => q.category === key);
    const catTotal = qs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const catMax = qs.length * 4;
    const catPct = Math.round((catTotal / catMax) * 100);
    return { ...cat, key, pct: catPct };
  });

  const sorted = [...categoryScores].sort((a, b) => b.pct - a.pct);
  const topConcern = sorted[0];
  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  const ambientOrb = (color, size, top, right, bottom, left, delay) => ({
    position: "fixed",
    width: size, height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color}, transparent 70%)`,
    top, right, bottom, left,
    animation: `breathe 8s ease-in-out infinite ${delay}`,
    pointerEvents: "none",
    zIndex: 0,
  });

  // ═══════════════════════ INTRO ═══════════════════════

  if (phase === "intro") {
    return (
      <div style={containerStyle}>
        <div style={noiseOverlay} />
        <div style={ambientOrb(
          phase === "results" ? `${scoreInfo.color}15` : "rgba(255,107,53,0.06)",
          "600px", "-200px", "-200px", "auto", "auto", "0s"
        )} />
        <div style={ambientOrb("rgba(123,104,238,0.05)", "400px", "auto", "auto", "-100px", "-100px", "2s")} />

        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "680px", margin: "0 auto",
          padding: "80px 24px",
          display: "flex", flexDirection: "column", alignItems: "center",
          minHeight: "100vh", justifyContent: "center",
        }}>
          <div style={{ animation: "fadeInUp 1s ease-out", textAlign: "center" }}>
            <div style={{
              fontSize: "11px", letterSpacing: "4px",
              textTransform: "uppercase", color: "#FF6B35",
              marginBottom: "32px", fontWeight: 500,
            }}>
              Free Assessment · 3 Minutes · Based on Clinical Research
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 400, lineHeight: 1.05,
              marginBottom: "24px", letterSpacing: "-1px",
            }}>
              Are you burning out
              <br />
              <span style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #FF6B35, #E63946)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                or already burned?
              </span>
            </h1>

            <p style={{
              fontSize: "17px", lineHeight: 1.7, color: "#A0A0A0",
              maxWidth: "480px", margin: "0 auto 48px", fontWeight: 300,
            }}>
              12 questions. Honest answers. Your personalized burnout score across 6 dimensions —
              inspired by the Copenhagen Burnout Inventory. Built by someone who needed it himself.
            </p>

            <button
              onClick={() => setPhase("quiz")}
              style={{
                background: "linear-gradient(135deg, #FF6B35, #E8530E)",
                color: "white", border: "none",
                padding: "18px 48px", fontSize: "16px",
                fontWeight: 500, borderRadius: "60px",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.5px", transition: "all 0.3s ease",
                boxShadow: "0 4px 24px rgba(255,107,53,0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 32px rgba(255,107,53,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 24px rgba(255,107,53,0.3)";
              }}
            >
              Take the Test →
            </button>

            <div style={{
              marginTop: "64px", padding: "24px",
              borderLeft: "2px solid #222", textAlign: "left",
              animation: "fadeIn 1.5s ease-out 0.5s both",
            }}>
              <p style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic", fontSize: "16px",
                color: "#888", lineHeight: 1.6,
              }}>
                "I built this because I needed it myself. 32 years old, 130kg, working two jobs,
                living in Vietnam. I know what burnout feels like from the inside."
              </p>
              <p style={{
                fontSize: "12px", color: "#555", marginTop: "12px",
                letterSpacing: "1px", textTransform: "uppercase",
              }}>
                — The Creator
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════ QUIZ ═══════════════════════

  if (phase === "quiz") {
    const q = QUESTIONS[currentQ];
    const cat = CATEGORIES[q.category];

    return (
      <div style={containerStyle}>
        <div style={noiseOverlay} />
        <div style={ambientOrb("rgba(255,107,53,0.06)", "600px", "-200px", "-200px", "auto", "auto", "0s")} />
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "640px", margin: "0 auto",
          padding: "40px 24px", minHeight: "100vh",
          display: "flex", flexDirection: "column",
        }}>
          {/* Progress */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "12px",
            }}>
              <span style={{
                fontSize: "11px", letterSpacing: "3px",
                textTransform: "uppercase", color: "#555",
              }}>
                {cat.icon} {cat.name}
              </span>
              <span style={{
                fontSize: "13px", color: "#555",
                fontVariantNumeric: "tabular-nums",
              }}>
                {currentQ + 1} / {totalQuestions}
              </span>
            </div>
            <div style={{
              height: "2px", background: "#1A1A1C",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #FF6B35, #E63946)",
                borderRadius: "2px",
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center",
            animation: animating ? "none" : "fadeInUp 0.5s ease-out",
            opacity: animating ? 0.3 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.3s, transform 0.3s",
          }}>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 400, lineHeight: 1.25,
              marginBottom: "12px", letterSpacing: "-0.5px",
            }}>
              {q.text}
            </h2>
            <p style={{
              fontSize: "14px", color: "#666",
              marginBottom: "48px", fontWeight: 300,
            }}>
              {q.subtext}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ANSWERS.map((a, i) => (
                <button
                  key={a.value}
                  onClick={() => handleAnswer(a.value)}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid #222", color: "#E0E0E0",
                    padding: "18px 24px", borderRadius: "12px",
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px", fontWeight: 400, textAlign: "left",
                    transition: "all 0.25s ease",
                    display: "flex", alignItems: "center", gap: "16px",
                    animation: `slideIn 0.4s ease-out ${i * 0.06}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,53,0.08)";
                    e.currentTarget.style.borderColor = "#FF6B35";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "#222";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: "1px solid #333",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: "#666", flexShrink: 0,
                    pointerEvents: "none",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ pointerEvents: "none" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════ RESULTS ═══════════════════════

  return (
    <div style={containerStyle}>
      <div style={noiseOverlay} />
      <div style={ambientOrb(`${scoreInfo.color}15`, "600px", "-200px", "-200px", "auto", "auto", "0s")} />
      <div style={ambientOrb("rgba(123,104,238,0.05)", "400px", "auto", "auto", "-100px", "-100px", "2s")} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: "680px", margin: "0 auto",
        padding: "60px 24px 100px",
      }}>
        {/* Score header */}
        <div style={{
          textAlign: "center",
          animation: "fadeInUp 0.8s ease-out",
          marginBottom: "56px",
        }}>
          <div style={{
            fontSize: "11px", letterSpacing: "4px",
            textTransform: "uppercase", color: "#555",
            marginBottom: "24px",
          }}>
            Your Burnout Score
          </div>

          <div style={{
            position: "relative",
            width: "180px", height: "180px",
            margin: "0 auto 32px",
          }}>
            <svg width="180" height="180" viewBox="0 0 180 180"
              style={{ animation: "countUp 1s ease-out" }}>
              <circle cx="90" cy="90" r="78" fill="none"
                stroke="#1A1A1C" strokeWidth="4" />
              <circle cx="90" cy="90" r="78" fill="none"
                stroke={scoreInfo.color} strokeWidth="4"
                strokeDasharray={`${pct * 4.9} 490`}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{
                  animation: "barGrow 1.5s ease-out",
                  filter: `drop-shadow(0 0 8px ${scoreInfo.color}40)`,
                }}
              />
            </svg>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "48px", fontWeight: 400,
                color: scoreInfo.color, lineHeight: 1,
              }}>
                {showResults ? pct : 0}
              </div>
              <div style={{
                fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase", color: "#666",
                marginTop: "4px",
              }}>
                out of 100
              </div>
            </div>
          </div>

          <div style={{
            display: "inline-block", padding: "8px 20px",
            borderRadius: "40px", background: scoreInfo.bg,
            border: `1px solid ${scoreInfo.color}30`,
            fontSize: "14px", fontWeight: 500, color: scoreInfo.color,
            marginBottom: "20px",
          }}>
            {scoreInfo.level} Burnout
          </div>

          <p style={{
            fontSize: "17px", lineHeight: 1.7,
            color: "#A0A0A0", fontWeight: 300,
            maxWidth: "500px", margin: "0 auto",
          }}>
            {scoreInfo.message}
          </p>
        </div>

        {/* Category breakdown */}
        <div style={{
          marginBottom: "56px",
          animation: "fadeInUp 0.8s ease-out 0.3s both",
        }}>
          <h3 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "24px", fontWeight: 400,
            marginBottom: "28px", letterSpacing: "-0.3px",
          }}>
            Your 6 dimensions
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {sorted.map((cat, i) => {
              const catLevel = getScoreLevel(cat.pct);
              return (
                <div key={cat.key} style={{
                  animation: `slideIn 0.5s ease-out ${0.4 + i * 0.1}s both`,
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "8px",
                  }}>
                    <span style={{
                      fontSize: "14px", color: "#CCC",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span style={{
                      fontSize: "14px", fontWeight: 500,
                      color: catLevel.color,
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {cat.pct}%
                    </span>
                  </div>
                  <div style={{
                    height: "6px", background: "#1A1A1C",
                    borderRadius: "3px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${cat.pct}%`,
                      background: `linear-gradient(90deg, ${cat.color}, ${catLevel.color})`,
                      borderRadius: "3px",
                      animation: `barGrow 1s ease-out ${0.5 + i * 0.1}s both`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top concern */}
        <div style={{
          padding: "28px", borderRadius: "16px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1A1A1C",
          marginBottom: "56px",
          animation: "fadeInUp 0.8s ease-out 0.8s both",
        }}>
          <div style={{
            fontSize: "11px", letterSpacing: "3px",
            textTransform: "uppercase", color: "#555",
            marginBottom: "12px",
          }}>
            ⚠ Your biggest concern
          </div>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "22px", fontWeight: 400, marginBottom: "8px",
          }}>
            {topConcern.icon} {topConcern.name} — {topConcern.pct}%
          </div>
          <p style={{
            fontSize: "14px", color: "#888",
            lineHeight: 1.6, fontWeight: 300,
          }}>
            {CONCERN_MESSAGES[topConcern.key]}
          </p>
        </div>

        {/* CTA — share focused (no email until lead magnet is ready) */}
        <div style={{
          padding: "32px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,107,53,0.06), rgba(230,57,70,0.04))",
          border: "1px solid rgba(255,107,53,0.15)",
          textAlign: "center",
          animation: "fadeInUp 0.8s ease-out 1s both",
        }}>
          <h3 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "24px", fontWeight: 400, marginBottom: "12px",
          }}>
            You took the first step.
          </h3>
          <p style={{
            fontSize: "14px", color: "#888", lineHeight: 1.6,
            marginBottom: "24px", fontWeight: 300,
          }}>
            Knowing your score is where recovery begins.
            Follow my journey — I'm rebuilding from the same place.
          </p>
          <div style={{
            display: "flex", gap: "10px",
            justifyContent: "center", flexWrap: "wrap",
          }}>
            <a
              href="https://instagram.com/YOUR_HANDLE"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #E8530E)",
                color: "white", border: "none",
                padding: "14px 28px", borderRadius: "10px",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Follow the rebuild →
            </a>
          </div>
        </div>

        {/* Share */}
        <div style={{
          textAlign: "center", marginTop: "48px",
          animation: "fadeInUp 0.8s ease-out 1.2s both",
        }}>
          <p style={{
            fontSize: "13px", color: "#555", marginBottom: "16px",
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            Share your score
          </p>
          <div style={{
            display: "flex", gap: "12px",
            justifyContent: "center", flexWrap: "wrap",
          }}>
            {[
              { label: "Twitter", action: () => shareTwitter(pct, scoreInfo.level, siteUrl) },
              { label: "LinkedIn", action: () => shareLinkedIn(siteUrl) },
              { label: copied ? "Copied ✓" : "Copy Link", action: () => { copyLink(siteUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  padding: "10px 20px", borderRadius: "8px",
                  border: "1px solid #222", background: "transparent",
                  color: copied && btn.label === "Copied ✓" ? "#4ADE80" : "#888",
                  fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#FF6B35";
                  e.target.style.color = "#FF6B35";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#222";
                  e.target.style.color = "#888";
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", marginTop: "64px",
          paddingTop: "32px", borderTop: "1px solid #151515",
          animation: "fadeInUp 0.8s ease-out 1.4s both",
        }}>
          <p style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic", fontSize: "15px",
            color: "#555", lineHeight: 1.6,
            maxWidth: "400px", margin: "0 auto",
          }}>
            You're not lazy. You're not broken.
            <br />
            You're burned out. And that can change.
          </p>
        </div>
      </div>
    </div>
  );
}
