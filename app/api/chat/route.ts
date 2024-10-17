import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { tools } from "@/ai/tools";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: "you are a friendly assistant!",
    messages: convertToCoreMessages(messages),
    tools,
  });

  return result.toDataStreamResponse();
}
