import React from "react";

export default function Legend({ habits, getColor }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 30,
        background: "rgba(255,255,255,0.85)",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.13)",
        color: "#2F4F4F",
        zIndex: 10,
        minWidth: 180,
        border: "2px solid #006400",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>
        Habit Legend
      </div>
      {habits.map((habit, idx) => (
        <div
          key={habit._id || idx}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 6,
            fontSize: 14,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: getColor(idx),
              marginRight: 10,
              border: "2px solid #006400",
              boxShadow: "0 0 4px " + getColor(idx),
            }}
          />
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {habit.name}
          </span>
        </div>
      ))}
      <div style={{ fontSize: 12, marginTop: 8, color: "#228B22" }}>
        <span style={{ fontWeight: 700 }}>Glow</span> = 10+ day streak!
      </div>
    </div>
  );
}
