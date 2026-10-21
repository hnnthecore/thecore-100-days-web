/** Day 044 · Fathom · plan data shared by the comparison matrix, the feature tabs and the plan quiz. */
export const PLAN_LIST = [
  { id: 'starter', name: 'Starter', price: 29 },
  { id: 'growth', name: 'Growth', price: 79 },
  { id: 'scale', name: 'Scale', price: 199 },
] as const;

/** For each feature: what a spreadsheet does, then what Starter, Growth and Scale give you. false = not included. */
export const MATRIX: Record<string, { sheet: string; plans: (string | false)[] }> = {
  forecast: { sheet: 'Built by hand', plans: ['13 weeks, daily refresh', '13 weeks, daily refresh', '13 weeks, daily refresh'] },
  scenarios: { sheet: 'Copied tabs', plans: [false, 'Unlimited, shareable', 'Unlimited, shareable'] },
  invoices: { sheet: 'None', plans: [false, 'Automatic reminders', 'Automatic reminders'] },
  alerts: { sheet: 'None', plans: ['Email', 'Email and Slack', 'Email and Slack'] },
  reports: { sheet: 'Built by hand', plans: ['Standard reports', 'Standard reports', 'Investor-ready packs'] },
  teams: { sheet: 'Emailed files', plans: ['1 user', '5 users and accountant access', 'Unlimited, SSO and audit log'] },
};
