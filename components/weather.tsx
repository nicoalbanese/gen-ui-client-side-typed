import { ToolResults } from "@/lib/utils";
import { type weatherTool } from "@/ai/tools";

export const Weather = ({
  temperature,
  weather,
}: ToolResults<typeof weatherTool>) => {
  return (
    <div>
      <h2>Current Weather</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};
