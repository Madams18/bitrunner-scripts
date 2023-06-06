/** @param {NS} ns */
export async function main(ns) {
  ns.tail()

  var host = ns.getServer();

  // fill extra ram with hack
  var ram = host.maxRam
  var contagion_ram = ns.getScriptRam("contagion.js");
  var hack_ram = ns.getScriptRam("happy-times.js");
  var threads = Math.floor((ram - contagion_ram) / hack_ram);
  if (threads > 0 && host.moneyMax > 0)
    ns.run("happy-times.js", threads, host.hostname);  // contagious part
  
  while (true) {
    ns.print("\n###############");
    ns.print("  Host: " + host.hostname);
    ns.print("###############\n");

    // get connections
    var neighbors = ns.scan();    
    for (var ip of neighbors) {
      ns.print("@@@@@ Trying " + ip);
      // check if valid target (not already infected, 8GB+ RAM)
      if ((ns.getServerMaxRam(ip)-ns.getServerUsedRam(ip)) >= contagion_ram 
           && !ns.isRunning("contagion.js", ip)) {
        
        var target = ns.getServer(ip);
        // get root access
        var access = ns.hasRootAccess(ip);
        if (!access) {
          ns.print("##### Opening Ports")

          // ########################### //
          // #    Break ports here     # //
          // ########################### //
          ns.brutessh(target.hostname);
          //ns.ftpcrack(target.hostname);          
          
          // try to nuke
          if (target.numOpenPortsRequired <= target.openPortCount) {
            ns.print("##### Nuking " + target.hostname);
            ns.nuke(ip);
          }
        }
        // spread virus 
        if (access) {
          ns.print("##### Infecting " + target.hostname);
          var files = ["happy-times.js", "contagion.js"];
          ns.scp(files, ip, host.hostname);
          ns.exec("contagion.js", ip);
        }
      }
    }
    // wait a bit and try again
    await ns.sleep(60000);
  }
}
