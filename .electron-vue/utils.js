
const os = require("os");

function getLocalIPs() {
    let ips = [];
    for (let devName in os.networkInterfaces()) {
        let iface = os.networkInterfaces()[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                ips.push({
                    name: devName,
                    netmask: alias.netmask,
                    family: alias.family,
                    mac: alias.mac,
                    internal: alias.internal,
                    cidr: alias.cidr,
                    address: alias.address,
                });
            }
        }
    }
    return ips;
}

exports.getLocalIPs = getLocalIPs;