export function isPrivateIP(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return false;

    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 169.254.0.0/16 (Link-local metadata)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;

    return false;
}

export async function validateEndpointUrl(endpointUrl: string): Promise<boolean> {
    let parsed: URL;
    try {
        parsed = new URL(endpointUrl);
    } catch (e) {
        throw new Error("Invalid URL format provided for custom API endpoint.");
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error("Invalid protocol. Only HTTP and HTTPS are supported.");
    }

    const hostname = parsed.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
        throw new Error("Localhost and internal domain access is blocked for security reasons.");
    }

    if (isPrivateIP(hostname)) {
        throw new Error("Private IP access is blocked for security reasons (SSRF Protection).");
    }

    return true;
}
