import "reflect-metadata"

import { Expose, Type } from "class-transformer"

export enum CMDCode {
    REQUEST = 5001,
    REQUEST_START = 5002,
    REQUEST_END = 5004,
    REGISTER_SUCCESS = 5005,
    STATISTICS = 5008
}

export class BizReponse<T> {
    code: number;
    msg: string;
    data: T;
}

export class ProxyRequestRecord {
    @Expose()
    type?: number;
    @Expose()
    id: string;
    @Expose()
    method: string;
    @Expose()
    url: string;
    @Expose()
    statusCode: number;
    @Expose()
    time: number;
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
    id: string;
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
    id: string;
    @Expose()
    name: string;
    @Expose()
    desc: string;
    @Type(() => ProxyRequestRecord)
    requests: ProxyRequestRecord[];

}
