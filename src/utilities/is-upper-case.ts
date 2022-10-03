export default function isUpperCase(value: string) {
  return value === value.toUpperCase() && value !== value.toLowerCase();
}
