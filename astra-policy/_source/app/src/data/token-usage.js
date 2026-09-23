import roboDojoUsage from './evidence/robodojo-token-usage.json';
import navigationUpdate from './evidence/navigation-update-0923.json';
import supplementalUsage from './evidence/supplemental-token-usage.json';

// Means cover the same 50 selected trajectories per method as the headline
// success rates, including failures and incomplete records. Not per success.
export const roboDojoMeanTokens=Object.fromEntries(Object.entries(roboDojoUsage.methods)
 .map(([method,row])=>[method,row.total_tokens/row.runs]));
export const millionTokens=value=>(value/1e6).toFixed(2)+'M';
export const navigationMeanTokens=Object.fromEntries(navigationUpdate.token_usage
 .filter(row=>row.method==='astra').map(row=>[row.benchmark,row.mean_total_tokens_per_trajectory]));
export const roboCasaMeanTokens=Object.fromEntries(navigationUpdate.token_usage
 .filter(row=>row.benchmark==='robocasa').map(row=>[row.method,row.mean_total_tokens_per_trajectory]));
export const dexterousMeanTokens={direct:supplementalUsage.dexterous_manipulation.direct,hybrid:supplementalUsage.dexterous_manipulation.hybrid};
export const obstacle65DUsage=supplementalUsage.obstacle_65d;
export {roboDojoUsage};
