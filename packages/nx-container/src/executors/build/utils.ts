export function expandEnvVars(value: string): string {
  return value.replace(/\$(?:\{)?(\w+)(?:\})?/gu, (_, name) => {
    return process.env[name] ?? value;
  });
}
