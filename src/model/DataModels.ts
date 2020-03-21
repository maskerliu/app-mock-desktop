import "reflect-metadata"

import { Expose, Type } from "class-transformer"

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
    @Expose()
    type?: number;
    @Expose()
    id?: string;
    @Expose()
    method: string;
    @Expose()
    url: string;
    @Expose()
    statusCode: number;
    @Expose()
    time: number;
    @Expose()
    isMock: boolean;
    @Expose()
    headers: any;
    @Expose()
    requestData: any;
    @Expose()
    responseHeaders?: any;
    @Expose()
    responseData?: any;
}

export class ProxyStatRecord {
    @Expose()
    type?: number;
    @Expose()
    id: number;
    @Expose()
    app_id: string;
    @Expose()
    app_version: string;
    @Expose()
    os: string;
    @Expose()
    rule: string;
    @Expose()
    pageId: string;
    @Expose()
    elementId: string;
    @Expose()
    event_id: string;
    @Expose()
    arg1: string;
    @Expose()
    arg2: string;
    @Expose()
    arg3: string;
    @Expose()
    args: string;
    @Expose()
    desc: string;

}

export class MockRule {
    @Expose()
    _id: string;
    @Expose()
    name: string;
    @Expose()
    desc: string;
    isMock?: boolean = false;
    @Type(() => ProxyRequestRecord)
    requests: ProxyRequestRecord[];

}
