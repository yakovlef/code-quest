import { describe, it, expect } from 'vitest';
import { executeSandboxed } from './sandbox';

describe('executeSandboxed', () => {
  // --- Correct code ---

  it('passes when validate expression returns true', async () => {
    const result = await executeSandboxed('var x = 42;', {
      context: {},
      validate: 'x === 42',
    });
    expect(result.success).toBe(true);
    expect(result.passed).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('passes with context globals available', async () => {
    const result = await executeSandboxed('lockStatus = "open";', {
      context: { lockStatus: undefined },
      validate: 'lockStatus === "open"',
    });
    expect(result.passed).toBe(true);
  });

  it('passes with object context', async () => {
    const result = await executeSandboxed('powerSystem.active = true;', {
      context: { powerSystem: { active: false } },
      validate: 'powerSystem.active === true',
    });
    expect(result.passed).toBe(true);
  });

  it('passes with array context', async () => {
    const result = await executeSandboxed('var val = codes[2];', {
      context: { codes: [10, 20, 30] },
      validate: 'val === 30',
    });
    expect(result.passed).toBe(true);
  });

  // --- Wrong result (no error, just failed validation) ---

  it('fails when validate returns false', async () => {
    const result = await executeSandboxed('var x = 10;', {
      context: {},
      validate: 'x === 42',
    });
    expect(result.success).toBe(true);
    expect(result.passed).toBe(false);
    expect(result.error).toBeUndefined();
  });

  // --- Syntax errors ---

  it('returns error on syntax error', async () => {
    const result = await executeSandboxed('var x = ;', {
      context: {},
      validate: 'true',
    });
    expect(result.success).toBe(true);
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
  });

  // --- Runtime errors ---

  it('returns error on ReferenceError', async () => {
    const result = await executeSandboxed('x = undeclaredVar;', {
      context: {},
      validate: 'true',
    });
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('not defined');
  });

  it('returns error on TypeError', async () => {
    const result = await executeSandboxed('null.foo;', {
      context: {},
      validate: 'true',
    });
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
  });

  // --- Validate expression errors ---

  it('returns error when validate expression throws', async () => {
    const result = await executeSandboxed('var x = 1;', {
      context: {},
      validate: 'nonexistent.property',
    });
    expect(result.passed).toBe(false);
    expect(result.error).toContain('Validation error');
  });

  // --- Infinite loop protection ---

  it('handles infinite loop via interrupt', async () => {
    const result = await executeSandboxed('while(true) {}', {
      context: {},
      validate: 'true',
    });
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
  });

  // --- console.log capture ---

  it('captures single console.log', async () => {
    const result = await executeSandboxed('console.log("hello");', {
      context: {},
      validate: 'true',
    });
    expect(result.passed).toBe(true);
    expect(result.logs).toEqual(['hello']);
  });

  it('captures multiple console.log calls in order', async () => {
    const result = await executeSandboxed(
      'console.log("a"); console.log("b"); console.log("c");',
      { context: {}, validate: 'true' },
    );
    expect(result.logs).toEqual(['a', 'b', 'c']);
  });

  it('captures non-string values in console.log', async () => {
    const result = await executeSandboxed(
      'console.log(42); console.log(true); console.log(null);',
      { context: {}, validate: 'true' },
    );
    expect(result.logs).toEqual(['42', 'true', 'null']);
  });

  it('returns empty logs when no console.log', async () => {
    const result = await executeSandboxed('var x = 1;', {
      context: {},
      validate: 'true',
    });
    expect(result.logs).toEqual([]);
  });

  // --- Context isolation ---

  it('does not leak state between executions', async () => {
    await executeSandboxed('var leaked = 999;', {
      context: {},
      validate: 'true',
    });

    const result = await executeSandboxed('var x = typeof leaked;', {
      context: {},
      validate: 'x === "undefined"',
    });
    expect(result.passed).toBe(true);
  });

  // --- Complex validation ---

  it('validates complex expressions', async () => {
    const code = `
      var result = items.filter(function(x) { return x > 100; });
    `;
    const result = await executeSandboxed(code, {
      context: { items: [50, 150, 200, 30] },
      validate: 'JSON.stringify(result) === JSON.stringify([150, 200])',
    });
    expect(result.passed).toBe(true);
  });

  it('validates object mutation', async () => {
    const code = 'ship.fuel = ship.fuel - 10;';
    const result = await executeSandboxed(code, {
      context: { ship: { fuel: 100, name: 'Syntax-7' } },
      validate: 'ship.fuel === 90 && ship.name === "Syntax-7"',
    });
    expect(result.passed).toBe(true);
  });

  // --- __source injection ---

  it('injects __source with user code string', async () => {
    const result = await executeSandboxed('var x = 1;', {
      context: {},
      validate: '__source === "var x = 1;"',
    });
    expect(result.passed).toBe(true);
  });

  it('uses __source to detect === vs ==', async () => {
    const result = await executeSandboxed('var ok = (1 == 1);', {
      context: {},
      validate: 'ok === true && __source.includes("===")',
    });
    expect(result.passed).toBe(false);
  });

  it('__source passes when === is used', async () => {
    const result = await executeSandboxed('var ok = (1 === 1);', {
      context: {},
      validate: 'ok === true && __source.includes("===")',
    });
    expect(result.passed).toBe(true);
  });

  // --- Hints ---

  it('returns matchedHintIndex for first matching hint', async () => {
    const result = await executeSandboxed('var x = 10;', {
      context: {},
      validate: 'x === 42',
      hints: [
        { check: 'x === 5' },
        { check: 'x === 10' },
        { check: 'x === 20' },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.matchedHintIndex).toBe(1);
  });

  it('returns no matchedHintIndex when no hint matches', async () => {
    const result = await executeSandboxed('var x = 10;', {
      context: {},
      validate: 'x === 42',
      hints: [
        { check: 'x === 5' },
        { check: 'x === 99' },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.matchedHintIndex).toBeUndefined();
  });

  it('skips hints with errors in check expression', async () => {
    const result = await executeSandboxed('var x = 10;', {
      context: {},
      validate: 'x === 42',
      hints: [
        { check: 'nonexistent.prop' },
        { check: 'x === 10' },
      ],
    });
    expect(result.matchedHintIndex).toBe(1);
  });

  it('does not evaluate hints when validation passes', async () => {
    const result = await executeSandboxed('var x = 42;', {
      context: {},
      validate: 'x === 42',
      hints: [
        { check: 'true' },
      ],
    });
    expect(result.passed).toBe(true);
    expect(result.matchedHintIndex).toBeUndefined();
  });

  it('does not evaluate hints when code has error', async () => {
    const result = await executeSandboxed('var x = ;', {
      context: {},
      validate: 'true',
      hints: [
        { check: 'true' },
      ],
    });
    expect(result.error).toBeDefined();
    expect(result.matchedHintIndex).toBeUndefined();
  });

  it('hints can use __source for source checks', async () => {
    const result = await executeSandboxed('var ok = (1 == 1);', {
      context: {},
      validate: 'ok === true && __source.includes("===")',
      hints: [
        { check: '__source.includes("==") && !__source.includes("===")' },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.matchedHintIndex).toBe(0);
  });

  // --- Real challenge reproductions ---

  it('cryo_lock: lockStatus = "open" passes', async () => {
    const result = await executeSandboxed('lockStatus = "open";', {
      context: { lockStatus: undefined },
      validate: 'lockStatus === "open"',
      hints: [
        { check: 'typeof lockStatus === "string" && (lockStatus === "close" || lockStatus === "closed")' },
        { check: 'typeof lockStatus === "string" && (lockStatus === "Open" || lockStatus === "OPEN")' },
      ],
    });
    expect(result.passed).toBe(true);
    expect(result.matchedHintIndex).toBeUndefined();
  });

  it('cryo_lock: lockStatus = "Open" triggers hint', async () => {
    const result = await executeSandboxed('lockStatus = "Open";', {
      context: { lockStatus: undefined },
      validate: 'lockStatus === "open"',
      hints: [
        { check: 'typeof lockStatus === "string" && (lockStatus === "close" || lockStatus === "closed")' },
        { check: 'typeof lockStatus === "string" && (lockStatus === "Open" || lockStatus === "OPEN")' },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.matchedHintIndex).toBe(1);
  });

  it('cryo_lock: lockStatus = open triggers ReferenceError', async () => {
    const result = await executeSandboxed('lockStatus = open;', {
      context: { lockStatus: undefined },
      validate: 'lockStatus === "open"',
    });
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('not defined');
  });

  it('cabin_door: accessGranted = (userId === 1337) passes', async () => {
    const result = await executeSandboxed('accessGranted = (userId === 1337);', {
      context: { userId: 1337, accessGranted: undefined },
      validate: 'accessGranted === true && __source.includes("===")',
    });
    expect(result.passed).toBe(true);
  });

  it('cabin_door: == triggers hint', async () => {
    const result = await executeSandboxed('accessGranted = (userId == 1337);', {
      context: { userId: 1337, accessGranted: undefined },
      validate: 'accessGranted === true && __source.includes("===")',
      hints: [
        { check: 'accessGranted === true && __source.includes("==") && !__source.includes("===")' },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.matchedHintIndex).toBe(0);
  });

  it('corridor_power: result = circuitA + circuitB passes', async () => {
    const result = await executeSandboxed('result = circuitA + circuitB;', {
      context: { circuitA: 'Power', circuitB: 'On', result: undefined },
      validate: 'result === "PowerOn" && __source.includes("circuitA")',
    });
    expect(result.passed).toBe(true);
  });
});
