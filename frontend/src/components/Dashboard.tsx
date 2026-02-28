import type { DayData } from "../App";
import { DayBar } from "./DayBar";

interface DashboardProps {
  data: DayData[];
}

export default function Dashboard({ data }: DashboardProps) {
  return (
    <div className="px-6">
      <div className="mb-10 flex items-center gap-6 text-sm flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
          <span className="text-amber-800 font-medium">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-500"></div>
          <span className="text-amber-800 font-medium">Great</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-lime-500"></div>
          <span className="text-amber-800 font-medium">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
          <span className="text-amber-800 font-medium">Fair</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
          <span className="text-amber-800 font-medium">Poor</span>
        </div>
      </div>

      {data.map((day, index) => (
        <DayBar key={index} {...day} />
      ))}
    </div>
  );
}
