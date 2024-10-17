"use client";

import { useChat } from "ai/react";
import { Weather } from "@/components/weather";
import { type tools } from "@/ai/tools";
import { Stock } from "@/components/stock";
import { GenUI } from "@/lib/gen-ui";

export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
          {GenUI<typeof tools>({
            toolInvocations: message.toolInvocations,
            components: {
              displayWeather: Weather,
              getStockPrice: Stock,
            },
            sendMessage: () => {},
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
