'use client'

const links = [
  {
    title: "Free Burnout Score Test",
    sub: "3 min · Based on clinical research · Get your score",
    href: "/burnouttest",
    emoji: "🔥",
    bg: "rgba(255,107,53,0.12)",
    primary: true,
  },
  {
    title: "YouTube",
    sub: "Full videos · Vlogs · Deep dives",
    href: "https://youtube.com/@watchaceyt",
    emoji: "▶",
    bg: "rgba(239,68,68,0.08)",
  },
  {
    title: "TikTok",
    sub: "Daily clips · Raw moments",
    href: "https://tiktok.com/@watchace",
    emoji: "♪",
    bg: "rgba(0,242,234,0.06)",
  },
  {
    title: "Instagram",
    sub: "Reels · Stories · Behind the scenes",
    href: "https://instagram.com/watch.ace",
    emoji: "📷",
    bg: "rgba(225,48,108,0.08)",
  },
]

export default function LinksPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      position: "relative",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "fixed", width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)",
        top: "-150px", right: "-150px",
        animation: "breathe 8s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", width: "350px", height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(123,104,238,0.04), transparent 70%)",
        bottom: "-100px", left: "-100px",
        animation: "breathe 10s ease-in-out infinite 3s",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "420px", width: "100%",
        padding: "48px 24px 64px",
        position: "relative", zIndex: 1,
      }}>
        {/* Avatar */}
        {/* TODO: Замени на свою фотку — залей в /public/avatar.jpg */}
        <div style={{
          width: "88px", height: "88px",
          borderRadius: "50%",
          border: "2px solid #1E1E22",
          margin: "0 auto 20px",
          background: "#1A1A1C",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px",
          animation: "fadeInUp 0.6s ease-out",
        }}>
          A
        </div>

        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "28px", fontWeight: 400,
          textAlign: "center", marginBottom: "6px",
          animation: "fadeInUp 0.6s ease-out 0.05s both",
        }}>
          Ace
        </h1>

        <p style={{
          textAlign: "center", fontSize: "14px",
          color: "#888", lineHeight: 1.6,
          fontWeight: 300, marginBottom: "8px",
          animation: "fadeInUp 0.6s ease-out 0.1s both",
        }}>
          Burned out developer rebuilding everything at 32.<br />
          130kg · 2 jobs · Starting over.
        </p>

        <div style={{
          display: "flex", justifyContent: "center",
          gap: "16px", marginBottom: "32px",
          animation: "fadeInUp 0.6s ease-out 0.15s both",
        }}>
          <span style={{
            fontSize: "11px", letterSpacing: "1.5px",
            textTransform: "uppercase", color: "#555",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#FF6B35", display: "inline-block",
            }} />
            Day 1 of rebuild
          </span>
          <span style={{
            fontSize: "11px", letterSpacing: "1.5px",
            textTransform: "uppercase", color: "#555",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#FF6B35", display: "inline-block",
            }} />
            Documenting it all
          </span>
        </div>

        {/* Links */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: "12px", marginBottom: "36px",
        }}>
          {links.map((link, i) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "16px 20px", borderRadius: "12px",
                border: link.primary ? "1px solid #FF6B3540" : "1px solid #1E1E22",
                background: link.primary ? "rgba(255,107,53,0.06)" : "rgba(255,255,255,0.02)",
                color: "#E0E0E0", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px", transition: "all 0.25s ease",
                animation: `fadeInUp 0.5s ease-out ${0.2 + i * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FF6B35"
                e.currentTarget.style.background = "rgba(255,107,53,0.06)"
                e.currentTarget.style.transform = "translateX(4px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = link.primary ? "#FF6B3540" : "#1E1E22"
                e.currentTarget.style.background = link.primary ? "rgba(255,107,53,0.06)" : "rgba(255,255,255,0.02)"
                e.currentTarget.style.transform = "translateX(0)"
              }}
            >
              <span style={{
                width: "36px", height: "36px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", flexShrink: 0, background: link.bg,
              }}>
                {link.emoji}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, display: "block", marginBottom: "2px" }}>
                  {link.title}
                </span>
                <span style={{ fontSize: "12px", color: "#666", fontWeight: 300 }}>
                  {link.sub}
                </span>
              </span>
              <span style={{ color: "#444", fontSize: "14px" }}>→</span>
            </a>
          ))}
        </div>

        {/* Quote */}
        <div style={{
          padding: "20px", borderLeft: "2px solid #222",
          marginBottom: "36px",
          animation: "fadeInUp 0.6s ease-out 0.5s both",
        }}>
          <p style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic", fontSize: "15px",
            color: "#777", lineHeight: 1.6,
          }}>
            "You're not lazy. You're not broken.<br />
            You're burned out. And that can change."
          </p>
        </div>

        {/* Email */}
        <div style={{
          display: "flex", justifyContent: "center",
          animation: "fadeInUp 0.6s ease-out 0.6s both",
        }}>
          <a
            href="mailto:watchaceblog@gmail.com"
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              border: "1px solid #1A1A1C",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#666", textDecoration: "none", fontSize: "16px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF6B35"
              e.currentTarget.style.color = "#FF6B35"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1A1A1C"
              e.currentTarget.style.color = "#666"
            }}
          >
            ✉
          </a>
        </div>
      </div>
    </div>
  )
}
