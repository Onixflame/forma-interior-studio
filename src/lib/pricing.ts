export const PRICING_VERSION = 'usd-2026-01';
export const pricing = { Essential: [600,800], Complete: [900,1200], Signature: [1400,1800] } as const;
export type Package = keyof typeof pricing;
export type EstimateInput = { area: number; property: 'apartment'|'house'; condition: 'shell'|'updating'|'extensive'; package: Package; start: 'exploring'|'soon'|'later'|'future' };
export const defaults: EstimateInput = { area: 70, property: 'apartment', condition: 'shell', package: 'Complete', start: 'exploring' };
export function calculate(input: EstimateInput): { low: number; high: number } | null {
  if (!Number.isFinite(input.area) || input.area < 30 || input.area > 150 || !Object.hasOwn(pricing,input.package) || !['apartment','house'].includes(input.property) || !['shell','updating','extensive'].includes(input.condition)) return null;
  const factor = { shell:1, updating:1.1, extensive:1.25 }[input.condition] * (input.property === 'house' ? 1.1 : 1);
  const [low,high] = pricing[input.package];
  return { low: Math.round(input.area*low*factor/100)*100, high:Math.round(input.area*high*factor/100)*100 };
}
export function normalizeInput(raw: Partial<Record<keyof EstimateInput, unknown>>): EstimateInput {
  const area = Number(raw.area);
  return { area: raw.area !== undefined && raw.area !== '' && Number.isFinite(area) ? area : defaults.area, property: raw.property === 'house' ? 'house':'apartment', condition: raw.condition === 'updating' || raw.condition === 'extensive' ? raw.condition:'shell', package: raw.package === 'Essential' || raw.package === 'Signature' ? raw.package:'Complete', start: raw.start === 'soon' || raw.start === 'later' || raw.start === 'future' ? raw.start:'exploring' };
}
export const money = (value:number,locale:string) => new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : locale === 'ru' ? 'ru-RU':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
