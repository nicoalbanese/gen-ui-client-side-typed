"use client";

import { useChat } from "ai/react";
import { Weather } from "@/components/weather";
import { type tools } from "@/ai/tools";
import { getTypeSafeTools } from "@/lib/utils";
import { Stock } from "@/components/stock";

export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>

          <div>
            {message.toolInvocations?.map((toolInvocation) => {
              const typedToolInvocation =
                getTypeSafeTools<typeof tools>(toolInvocation);
              const { toolName, toolCallId, state } = typedToolInvocation;

              if (state === "result") {
                if (toolName === "displayWeather") {
                  const { result } = typedToolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                } else if (toolName === "getStockPrice") {
                  const { result } = typedToolInvocation;
                  return <Stock key={toolCallId} {...result} />;
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                );
              }
            })}
          </div>
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
