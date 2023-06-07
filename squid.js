/** @param {NS} ns */
// This script has a similar effect to contagion, except it manages everything
// from home servers leaving more ram for hacking on the target servers.
export async function main(ns) {
  var host = ns.getServer();
  var client = ns.args[0];
  while (true) {
    run(host, client);
    await ns.sleep(60000);
  }
}

function run(host, client) {
  //recursion exit
  if (ns.existsFile("crumb.txt", host.hostname)
      return;
  
  // get neighbors minus the RAMless losers
  var neighbors = ns.scan(host.hostname);
  
  // run client script on them
  var client_ram = ns.getScriptRam(client);
  for (var n in neighbors) {
    //place a crumb so we know we've visited
    ns.scp("crumb.txt", n.hostname);
    
    // ##### Client Setup ##### //
    // if max $ above 0 and ram enough for client
    var server_ram = ns.getServerMaxRAM(n.hostname) - ns.getServerUsedRAM(n.hostname);
    if (ns.getServerMaxMoney(n.hostname) > 0 && server_ram >= client_ram) {
      var access = ns.hasRootAccess(n.hostname);
      if (!access) {
        ns.print("##### Opening Ports")

        // ########################### //
        // #    Break ports here     # //
        // ########################### //
        //ns.brutessh(target.hostname);
        //ns.ftpcrack(target.hostname);
        //ns.relaysmtp(target.hostname);
        //ns.httpworm(target.hostname);
        //ns.sqlinject(target.hostname);

        // try to nuke
        if (target.numOpenPortsRequired <= n.openPortCount) {
          ns.print("##### Nuking " + n.hostname);
          ns.nuke(n.hostname);
        }
      }
      if (access) {
        ns.scp(client, n.hostname)
        // run client
        ns.exec(client, n.hostname, int(server_ram/client_ram));
      }
    }
    
    // Move on to the neighbor's neighbors
    run(n, client);
  }
}
