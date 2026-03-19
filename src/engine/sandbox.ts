import { newQuickJSWASMModuleFromVariant, type QuickJSHandle, type QuickJSContext, type QuickJSWASMModule } from 'quickjs-emscripten-core';
import releaseVariant from '@jitl/quickjs-wasmfile-release-sync';

export interface SandboxConfig {
  /** Objects available to user code as globals (e.g. { powerSystem: {} }) */
  context: Record<string, unknown>;
  /** JS expression to evaluate after user code; must return true for success */
  validate: string;
  /** Timeout in milliseconds (default: 3000) */
  timeout?: number;
  /** Hint checks to evaluate if validation fails */
  hints?: { check: string }[];
}

export interface SandboxResult {
  success: boolean;
  /** true if validate expression returned true */
  passed: boolean;
  /** console.log output from user code */
  logs: string[];
  /** Error message if code threw */
  error?: string;
  /** Index of the first matched hint, if any */
  matchedHintIndex?: number;
}

/**
 * Marshals a JS value into the QuickJS context, returning a handle.
 * Supports primitives, arrays, and plain objects (recursive).
 */
function marshalValue(ctx: QuickJSContext, value: unknown): QuickJSHandle {
  if (value === null || value === undefined) {
    return ctx.undefined;
  }
  if (typeof value === 'string') {
    return ctx.newString(value);
  }
  if (typeof value === 'number') {
    return ctx.newNumber(value);
  }
  if (typeof value === 'boolean') {
    return value ? ctx.true : ctx.false;
  }
  if (Array.isArray(value)) {
    const arr = ctx.newArray();
    value.forEach((item, i) => {
      const handle = marshalValue(ctx, item);
      ctx.setProp(arr, i, handle);
      handle.dispose();
    });
    return arr;
  }
  if (typeof value === 'object') {
    const obj = ctx.newObject();
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const handle = marshalValue(ctx, val);
      ctx.setProp(obj, key, handle);
      handle.dispose();
    }
    return obj;
  }
  return ctx.undefined;
}

let quickJSPromise: Promise<QuickJSWASMModule> | null = null;

function loadQuickJS(): Promise<QuickJSWASMModule> {
  if (!quickJSPromise) {
    quickJSPromise = newQuickJSWASMModuleFromVariant(releaseVariant);
  }
  return quickJSPromise;
}

/** Pre-load QuickJS WASM so first execution is fast */
export function preloadQuickJS(): void {
  loadQuickJS();
}

/**
 * Execute user code in a QuickJS sandbox.
 *
 * 1. Creates isolated QuickJS context
 * 2. Injects context objects as globals
 * 3. Runs user code
 * 4. Evaluates validate expression
 * 5. Returns result
 */
export async function executeSandboxed(
  userCode: string,
  config: SandboxConfig,
): Promise<SandboxResult> {
  const logs: string[] = [];

  const QuickJS = await loadQuickJS();
  const runtime = QuickJS.newRuntime();
  runtime.setInterruptHandler(() => interruptCycles++ > 1024 * 1024);
  let interruptCycles = 0;

  const ctx = runtime.newContext();

  try {
    // Set up console.log
    const consoleObj = ctx.newObject();
    const logFn = ctx.newFunction('log', (...args: QuickJSHandle[]) => {
      const parts = args.map(a => {
        const dumped = ctx.dump(a);
        return typeof dumped === 'string' ? dumped : JSON.stringify(dumped);
      });
      logs.push(parts.join(' '));
    });
    ctx.setProp(consoleObj, 'log', logFn);
    ctx.setProp(ctx.global, 'console', consoleObj);
    logFn.dispose();
    consoleObj.dispose();

    // Inject context objects as globals
    for (const [name, value] of Object.entries(config.context)) {
      const handle = marshalValue(ctx, value);
      ctx.setProp(ctx.global, name, handle);
      handle.dispose();
    }

    // Inject __source (user code as string) for source-level checks
    const sourceHandle = ctx.newString(userCode);
    ctx.setProp(ctx.global, '__source', sourceHandle);
    sourceHandle.dispose();

    // Execute user code
    const codeResult = ctx.evalCode(userCode);
    if (codeResult.error) {
      const err = ctx.dump(codeResult.error);
      codeResult.error.dispose();
      return { success: true, passed: false, logs, error: String(err.message ?? err) };
    }
    codeResult.value.dispose();

    // Run validation expression
    const validateResult = ctx.evalCode(config.validate);
    if (validateResult.error) {
      const err = ctx.dump(validateResult.error);
      validateResult.error.dispose();
      return { success: true, passed: false, logs, error: `Validation error: ${err.message ?? err}` };
    }

    const passed = ctx.dump(validateResult.value) === true;
    validateResult.value.dispose();

    // If validation failed, check hints in the same context
    if (!passed && config.hints) {
      for (let i = 0; i < config.hints.length; i++) {
        const hintResult = ctx.evalCode(config.hints[i].check);
        if (hintResult.error) {
          hintResult.error.dispose();
          continue;
        }
        const matched = ctx.dump(hintResult.value) === true;
        hintResult.value.dispose();
        if (matched) {
          return { success: true, passed: false, logs, matchedHintIndex: i };
        }
      }
    }

    return { success: true, passed, logs };
  } catch (e) {
    return {
      success: false,
      passed: false,
      logs,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    ctx.dispose();
    runtime.dispose();
  }
}
