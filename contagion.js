/** @param {NS} ns */
// This file will attempt to install and run itself on any server with a connection.
// It will attempt to get admin, but you will need to uncomment the noted functions
// to open ports when they are available to you. 
// When first ran it will attempt to run happy-times.js with as many threads as posssible,
// and will sleep until hacking is high enough. Note that this means the program will not 
// spread from a server you are unable to hack until you have the skill needed. 
export async function main(ns) {
  ns.tail()
  var client_script = ns.args[0];

  var host = ns.getServer();

  // fill extra ram with hack
  var ram = host.maxRam;
  var contagion_ram = ns.getScriptRam("contagion.js");
  var hack_ram = ns.getScriptRam(client_script);
  var threads = Math.floor((ram - contagion_ram) / hack_ram);
  if (threads > 0 && host.moneyMax > 0) {
    // wait for hack level to be high enough before continuing
    while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host.hostname)) {
      ns.print("&&&&& Lacking hacking level, postponing.")
      await ns.sleep(60000);
    }
    ns.run(client_script, threads, host.hostname);  
  }
    
  // contagious part
  while (true) {
    ns.print("\n###############");
    ns.print("  Host: " + host.hostname);
    ns.print("###############\n");

    // get connections
    var neighbors = ns.scan();
    for (var ip of neighbors) {
      ns.print("@@@@@ Trying " + ip);
      // check if valid target (not already infected, 8GB+ RAM)
      if ((ns.getServerMaxRam(ip) - ns.getServerUsedRam(ip)) >= contagion_ram
        && !ns.isRunning("contagion.js", ip)) {

        var target = ns.getServer(ip);
        // get root access
        var access = ns.hasRootAccess(ip);
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
          if (target.numOpenPortsRequired <= target.openPortCount) {
            ns.print("##### Nuking " + target.hostname);
            ns.nuke(ip);
          }
        }
        // spread virus 
        if (access) {
          ns.print("##### Infecting " + target.hostname);
          var files = [client_script, "contagion.js"];
          ns.scp(files, ip, host.hostname);
          ns.exec("contagion.js", ip);
        }
      }
    }
    // wait a bit and try again (1 min)
    await ns.sleep(60000);
  }
}
