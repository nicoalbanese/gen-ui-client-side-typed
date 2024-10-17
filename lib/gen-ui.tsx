/** eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ToolInvocation } from "ai";
import { getTypedToolInvocations, ToolResults } from "@/lib/utils";

type ComponentType<P = {}> = React.ComponentType<P>;

type ComponentsMap<TTools> = Partial<{
  [K in keyof TTools]: ComponentType<
    ToolResults<TTools[K]> & { sendMessage: (message: string) => void }
  >;
}>;

export function GenUI<
  TTools extends Record<string, { execute: (...args: any) => any }>,
>({
  toolInvocations,
  components,
  sendMessage,
}: {
  toolInvocations?: ToolInvocation[];
  components: ComponentsMap<TTools>;
  sendMessage: (message: string) => void;
}): JSX.Element | null {
  if (!toolInvocations) {
    return null;
  }

  return (
    <div>
      {toolInvocations.map((toolInvocation) => {
        const typedToolInvocation =
          getTypedToolInvocations<TTools>(toolInvocation);

        const { toolName, toolCallId, state } = typedToolInvocation;

        const Component = components[toolName];

        if (state === "call") {
          return <div key={toolCallId}>Calling tool: {toolName as string}</div>;
        }

        if (state === "result") {
          if (Component) {
            // Type assertion to help TypeScript understand the props
            const result = typedToolInvocation.result as ToolResults<
              TTools[typeof toolName]
            >;

            // Type assertion for Component to ensure it matches the expected props
            const TypedComponent = Component as React.ComponentType<
              ToolResults<TTools[typeof toolName]> & {
                sendMessage: (message: string) => void;
              }
            >;

            return (
              <TypedComponent
                key={toolCallId}
                {...result}
                sendMessage={sendMessage}
              />
            );
          } else {
            return (
              <div key={toolCallId}>
                No component defined for tool: {toolName as string}
              </div>
            );
          }
        }

        return null;
      })}
    </div>
  );
}
