// @/utils/ip.js

export function getIpAddress() {
    const interfaces = window.navigator.networkInterfaces;
    for (const key in interfaces) {
        const addresses = interfaces[key];
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return null;
}
