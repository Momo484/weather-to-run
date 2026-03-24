import { useState } from "react";
import type { DayData } from "../App";

export function DayBar(dayData: DayData) {
  const [tooltip, setTooltip] = useState<{
    hour: number;
    rain: number;
    score: number;
    x: number;
  } | null>(null);

  const date: Date = new Date(dayData.time[0]);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const getColour = (score: number) => {
    if (score >= 80) return "#0000FF";
    if (score >= 65) return "#22c55e";
    if (score >= 40) return "#84cc16";
    if (score >= 25) return "#eab308";
    return "#ef4444";
  };

  const timestamps = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  const formatHour = (hour: number) => {
    if (hour == 0) return "12am";
    if (hour == 12) return "12pm";
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const hour = Math.floor(percent * 24);
    const clampedHour = Math.min(23, Math.max(0, hour));

    setTooltip({
      hour: clampedHour,
      score: Math.round(dayData.score[clampedHour]),
      rain: dayData.rains[clampedHour],
      x: x,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-semibold text-amber-900 text-lg">
            {dayName}
          </span>
          <span className="text-sm text-amber-700 ml-3">{dateStr}</span>
        </div>
      </div>
      <div className="relative">
        <div
          className="h-8 rounded-full overflow-hidden cursor-crosshair relative"
          style={{
            background: `linear-gradient(to right, ${dayData.score
              .map((score, i) => {
                const percent = (i / 23) * 100;
                return `${getColour(score)} ${percent}%`;
              })
              .join(", ")})`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {tooltip && (
          <div
            className="absolute -top-10 bg-amber-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-non shadow-lg"
            style={{
              left: `${tooltip.x}px`,
              transform: `translateX(-50%) translateY(-50%)`,
            }}
          >
            <p>
              {formatHour(tooltip.hour)}: {tooltip.score}%
            </p>
            <p>Rain: {tooltip.rain}mm</p>
          </div>
        )}
      </div>

      <div className="relative mt-2 h-4">
        {timestamps.map((hour) => (
          <div
            key={hour}
            className="absolute text-xs text-amber-600"
            style={{
              left: `${(hour / 24) * 100}%`,
              transform: `translateX(-50%)`,
            }}
          >
            {hour === 24
              ? ""
              : hour === 0
                ? "12a"
                : hour === 12
                  ? "12p"
                  : hour > 12
                    ? `${hour - 12}p`
                    : `${hour}a`}
          </div>
        ))}
      </div>
    </div>
  );
}
