/** @param {NS} ns */
// This is the workhorse for contagion, the functions that actually make money are in here.
// Contagion will run this script with as many threads as possible, and will account for edits.
export async function main(ns) {
  var host = ns.args[0];
  var min_sec = ns.getServerMinSecurityLevel(host);
  var max_mon = ns.getServerMaxMoney(host);
  
  while (true) {
    // Beat em up
    while (min_sec != ns.getServerMinSecurityLevel(host)) {
      await ns.weaken(host);
    }
    // Give them lunch money?
    while (max_mon != ns.getServerMaxMoney(host)) {
      await ns.grow(host);
    }
    // ???

    // Profit
    await ns.hack(host);
  }
}
