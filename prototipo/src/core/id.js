export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
export const nonce = () => Math.random().toString(36).slice(2, 10).toUpperCase();
export const now = () => Date.now();
