import React from "react";

export const LeaderboardRow = ({
  rank,
  name,
  value,
  onClick,
}: {
  rank: number;
  name: string;
  value: string;
  onClick?: () => void;
}) => {
  const bg = rank === 1 ? "#d4af37" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "rgba(255,255,255,0.10)";
  const color = rank <= 3 ? "#111" : "#ddd";
  return (
    <div className="selectable-row d-flex justify-content-between align-items-center" onClick={onClick}>
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-2 d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, background: bg, color }}
        >
          {rank}
        </div>
        <span className="fw-semibold text-light">{name}</span>
      </div>
      <span className="text-light">{value}</span>
    </div>
  );
};
