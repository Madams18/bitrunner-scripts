/** @param {NS} ns */
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
