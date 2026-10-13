// change this one constant if the shop sells in another currency
const CURRENCY = "USD";

const money = new Intl.NumberFormat(undefined, { style: "currency", currency: CURRENCY });
const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export const formatPrice = (value) => money.format(Number(value));
export const formatDate = (value) => date.format(new Date(value));

// "8", "9", "10" in shoe-size order rather than text order ("10" before "8")
export const sortSizes = (sizes) => [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
