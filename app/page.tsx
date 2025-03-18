"use client";

import { useChat } from "@ai-sdk/react";
import { Weather } from "@/components/weather";
import { tools } from "@/ai/tools";
import { getTypedToolInvocations } from "@/lib/utils";
import { Stock } from "@/components/stock";

export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>
            {message.parts?.map((part) => {
              if (part.type === "text") {
                return <div>{part.text}</div>;
              }
              if (part.type === "tool-invocation") {
                const typedToolInvocation = getTypedToolInvocations(
                  tools,
                  part.toolInvocation
                );
                const { toolName, toolCallId, state } = typedToolInvocation;
                if (state === "result") {
                  if (toolName === "displayWeather") {
                    const { result } = typedToolInvocation;
                    return <Weather {...result} />;
                  } else if (toolName === "getStockPrice") {
                    const { result } = typedToolInvocation;
                    return <Stock key={toolCallId} {...result} />;
                  }
                } else {
                  return (
                    <div key={toolCallId}>
                      <div>Calling {toolName}...</div>
                    </div>
                  );
                }
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
