export default function parseJson(json: string, defaultValue: string) {
  return JSON.parse(json || defaultValue);
}
