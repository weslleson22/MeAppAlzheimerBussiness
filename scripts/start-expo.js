#!/usr/bin/env node
const os = require('os');
require('./ensure-vector-icons');

function detectPhysicalLanIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    const isVirtual = /virtualbox|vmware|vmnet|vethernet|wsl|hyper-v|docker|loopback|pseudo|vpn|tun|tap/i.test(name);
    const isPreferred = /wi-?fi|wireless|wlan|ethernet|conexão local/i.test(name);

    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal && addr.address !== '127.0.0.1') {
        const isVBoxSubnet = addr.address.startsWith('192.168.56.');
        candidates.push({
          name,
          address: addr.address,
          netmask: addr.netmask,
          mac: addr.mac,
          cidr: addr.cidr,
          score: (isPreferred ? 10 : 0) - (isVirtual || isVBoxSubnet ? 20 : 0),
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.length > 0 ? candidates[0] : null;
}

if (!process.env.EXPO_NO_REDIRECT_PAGE) {
  process.env.EXPO_NO_REDIRECT_PAGE = '1';
}

if (!process.env.EXPO_NO_METRO_WORKSPACE_ROOT) {
  process.env.EXPO_NO_METRO_WORKSPACE_ROOT = '1';
}

const lanCandidate = detectPhysicalLanIp();
if (lanCandidate) {
  if (!process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME = lanCandidate.address;
    console.log(`🌐 Usando IP da rede local (Wi-Fi/LAN): ${lanCandidate.address}`);
  }
  try {
    const lanNetwork = require('lan-network');
    lanNetwork.lanNetworkSync = () => ({
      iname: lanCandidate.name,
      address: lanCandidate.address,
      netmask: lanCandidate.netmask,
      family: 'IPv4',
      mac: lanCandidate.mac,
      internal: false,
      cidr: lanCandidate.cidr,
      gateway: null,
    });
  } catch {
    // ignore
  }
}

require('../node_modules/expo/bin/cli');
