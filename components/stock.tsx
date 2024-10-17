import { ToolResults } from "@/lib/utils";
import { type stockTool } from "@/ai/tools";

export const Stock = ({ price, symbol }: ToolResults<typeof stockTool>) => {
  return (
    <div>
      <h2>Stock Information</h2>
      <p>Symbol: {symbol}</p>
      <p>Price: ${price}</p>
    </div>
  );
};
