import roboDojoUsage from './evidence/robodojo-token-usage.json';

// Means cover the same 50 selected trajectories per method as the headline
// success rates, including failures and incomplete records. Not per success.
export const roboDojoMeanTokens=Object.fromEntries(Object.entries(roboDojoUsage.methods)
 .map(([method,row])=>[method,row.total_tokens/row.runs]));
export const millionTokens=value=>(value/1e6).toFixed(2)+'M';
export {roboDojoUsage};
