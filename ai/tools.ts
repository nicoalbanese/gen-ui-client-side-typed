import { tool as createTool } from "ai";
import { z } from "zod";

export const weatherTool = createTool({
  description: "Display the weather for a location",
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async function ({ latitude, longitude }) {
    console.log({ latitude, longitude });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { weather: "Sunny", temperature: 75 };
  },
});

export const stockTool = createTool({
  description: "Get price for a stock",
  parameters: z.object({
    symbol: z.string(),
  }),
  execute: async function ({ symbol }) {
    console.log(symbol);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});

export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};
