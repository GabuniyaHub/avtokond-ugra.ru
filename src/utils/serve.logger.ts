import http from 'node:http';

interface LogData {
    timestamp: string;
    method: string | undefined;
    url: string | unknown;
    httpVersion: string;
    userAgent: string;
    referer: string;
    prefix?: string;
}
export function logRequest(request: http.IncomingMessage , prefix: string = ''): void {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = request.url;
    const httpVersion = request.httpVersion;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const referer = request.headers['referer'] || 'direct';

    const logData: LogData = { 
        timestamp,
        method,
        url,
        httpVersion,
        userAgent,
        referer,
        prefix,
    };
    
    console.log(logData);
}