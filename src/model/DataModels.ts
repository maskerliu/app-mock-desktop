
export enum CMDCode {
    REQUEST = 5001,
    REQUEST_START = 5002,
    REQUEST_END = 5004,
    STATISTICS = 5008,
    REGISTER_SUCCESS = 5005,
}

export enum BizCode {
    SUCCESS = 8000,
    FAIL = 8010,
    ERROR = 9000
}

export interface IP {
    address: string;
    netmask: string;
    family: string;
    mac: string;
    internal: boolean;
    cidr: string;
    name: string;
}

export class BizResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export class Paged<T> {
    data: Array<T>;
    page: any;
    totalPage: number;
    isEnd: boolean;
}

export class ProxyRequestRecord {
    type?: number;
    id?: string;
    method: string;
    url: string;
    statusCode: number;
    time: number;
    isMock: boolean;
    headers: any;
    requestData: any;
    responseHeaders?: any;
    responseData?: any;
}

export class ProxyStatRecord {
    type?: number;
    id: number;
    app_id: string;
    app_version: string;
    os: string;
    rule: string;
    pageId: string;
    elementId: string;
    event_id: string;
    arg1: string;
    arg2: string;
    arg3: string;
    args: string;
    desc: string;

}

export class MockRule {
    _id: string;
    name: string;
    desc: string;
    isMock?: boolean = false;
    requests: ProxyRequestRecord[];
}
