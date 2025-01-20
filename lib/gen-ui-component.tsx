/** eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ToolInvocation } from "ai";
import { getTypedToolInvocations, ToolResults } from "@/lib/utils";

type ComponentType<P = object> = React.ComponentType<P>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentsMap<TTools extends Record<string, { execute: (...args: any) => any }>> = Partial<{
  [K in keyof TTools]: ComponentType<ToolResults<TTools[K]>>;
}>;

export function GenUI<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TTools extends Record<string, { execute: (...args: any) => any }>,
>({
  tools,
  toolInvocations,
  components,
}: {
  toolInvocations?: ToolInvocation[];
  components: ComponentsMap<TTools>;
  tools: TTools;
// @ts-expect-error JSX not found
}): JSX.Element | null {
  if (!toolInvocations) {
    return null;
  }

  return (
    <div>
      {toolInvocations.map((toolInvocation) => {
        const typedToolInvocation =
          getTypedToolInvocations(tools, toolInvocation);

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
              ToolResults<TTools[typeof toolName]>
            >;

            return <TypedComponent key={toolCallId} {...result} />;
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
