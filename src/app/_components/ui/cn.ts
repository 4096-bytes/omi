export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean>;

function toClassName(value: ClassValue): string {
  if (!value) return "";

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(" ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => enabled)
      .map(([className]) => className)
      .join(" ");
  }

  return String(value);
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toClassName).filter(Boolean).join(" ");
}
