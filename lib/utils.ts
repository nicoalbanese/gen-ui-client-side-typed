/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToolInvocation, ToolSet } from "ai";

export const getTypedToolInvocations = <TTools extends ToolSet>(
  _: TTools,
  toolInvocation: ToolInvocation,
) => {
  type ExecuteArgs<T> = T extends {
    execute: (args: infer A, options?: any) => any;
  }
    ? A
    : never;
  type ExecuteReturn<T> = T extends { execute: (...args: any) => infer R }
    ? Awaited<R>
    : never;

  type TypedToolInvocation = {
    [T in keyof TTools]: Omit<
      ToolInvocation,
      "toolName" | "args" | "result"
    > & {
      toolName: T;
      args: ExecuteArgs<TTools[T]>;
      result: ExecuteReturn<TTools[T]>;
    };
  }[keyof TTools];

  const toolName = toolInvocation.toolName as keyof TTools;

  if (toolInvocation.state === "result") {
    const result = toolInvocation.result as ExecuteReturn<
      TTools[typeof toolName]
    >;
    return { ...toolInvocation, toolName, result } as TypedToolInvocation;
  }

  return { ...toolInvocation, toolName } as TypedToolInvocation;
};

export type ToolResults<TTool extends { execute: (...args: any) => any }> =
  Awaited<ReturnType<TTool["execute"]>>;
export type TypedToolInvocation = ReturnType<typeof getTypedToolInvocations>;