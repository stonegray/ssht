import network from 'network';
import { promisify } from 'util';


// Async network bindings:
export async function getPublicIp() {
    return await promisify(network.get_public_ip)();
}

export async function getPrivateIp() {
    return await promisify(network.get_private_ip)();
}

export async function getGatewayIp() {
    return await promisify(network.get_gateway_ip)();
}

export async function getActiveInterface() {
    return await promisify(network.get_active_interface)();
}

export async function getInterfaces() {
    return await promisify(network.get_interfaces_list)();
}