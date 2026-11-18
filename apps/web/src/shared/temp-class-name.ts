export function cn(inputs: Array<string>) {
  return inputs.filter(Boolean).join(' ');
}