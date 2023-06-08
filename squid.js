/** @param {NS} ns */
// This script has a similar effect to contagion, except it manages everything
// from home servers leaving more ram for hacking on the target servers.
export async function main(ns) {
  var host = ns.getServer();
  var client = ns.args[0];
  var servers = [];
  while (true) {
    get_servers(host, servers);
    start_hacks(client, host, servers);
    await ns.sleep(60000);
  }
}

// Returns a list of all servers you can reach
function get_servers(host, servers) {
  var neighbors = ns.scan(host.hostname);
  for (var n in neighbors) {
    if (!is_in(n, servers)) {
      servers.push(n);
      get_servers(n, servers);
  }
}

// utility for get_servers, returns if obj is in the given list
function is_in(obj, list) {
  for (var i in list) {
    if (obj == i)
      return true;
  }
  return false;
}

// Runs the provided script on as many servers as possible
function start_hacks(client, host, servers) {
  var client_ram = ns.getScriptRAM(client);
  for (var s in servers) {
    var access = ns.hasRootAccess(s.hostname);
    if (!access) {
      // ########################### //
      // #    Break ports here     # //
      // ########################### //
      //ns.brutessh(s.hostname);
      //ns.ftpcrack(s.hostname);
      //ns.relaysmtp(s.hostname);
      //ns.httpworm(s.hostname);
      //ns.sqlinject(s.hostname);

      if (s.numOpenPortsRequired <= s.openPortCount) {
        ns.nuke(s.hostname);
      }
    }
    // run script
    if (access && s.maxMoney > 0) {
      ns.scp(client, n.hostname, host.hostname);
      var threads = s.maxRAM / client_ram;
      if (threads > 0)
        ns.exec(client, n.hostname, threads);
  }
}
