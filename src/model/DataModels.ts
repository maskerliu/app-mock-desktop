export interface AppInfo {
  env: string;
  version: string;
  bundleId: string;
}

export enum BizCode {
  SUCCESS = 8000,
  FAIL = 8010,
  ERROR = 9000,
}

export class BizResponse<T> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
}

export class Paged<T> {
  data: Array<T>;
  page: any;
  totalPage: number;
  isEnd: boolean;
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

export interface LocalServerConfig {
  serverIP?: string;
  proxyHttpPort?: number;
  proxySocketPort?: number;
  ips?: Array<IP>;
  apiDefineServer?: string; // API定义服务地址
  statRuleServer?: string; // 埋点定义服务地址
  dataProxyServer?: string; // 流量代理服务地址
  dataProxyStatus?: boolean; // 流量代理服务是否开启
  versionCheckServer?: string; // 应用版本更新检查服务
}

export interface StatisticRecord {
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

export class ProxyRequestRecord {
  type?: number;
  id?: number;
  _idx?: string; // 列表索引
  method?: string;
  url?: string;
  statusCode?: number; // 请求状态
  timestamp?: number; // 请求发起时间
  timelineColor?: string;
  time?: number; // 请求耗时
  isMock?: boolean; // 是否为Mock数据
  headers?: any; // 请求头
  requestData?: any; // 请求参数
  responseHeaders?: any; // 响应头
  responseData?: any; // 响应数据
}

export class ProxyStatRecord {
  type?: number;
  id: number;
  _idx?: string;
  timestamp?: number; // 请求发起时间
  statistics: {
    bps: StatisticRecord[];
  }
}

export class MockRule {
  _id: string;
  name: string;
  desc: string;
  isMock?: boolean = false;
  requests: ProxyRequestRecord[];
}

export interface MsgPushClient {
  key: string;
  uid: string;
  ip: string; // client ip
  port: string; // client port
}

export enum PushMsgType {
  TXT = 0,
  CMD = 1,
}

export enum CMDType {
  REGISTER = 0,
  KICKDOWN = 1,
  RECONNECT = 2,
  BROADCAST = 3
}

export enum BizType {
  IM = 0,
  Proxy = 1,
  ClientInfos = 2,
}

export interface PushMsg<T> {
  type: PushMsgType;
  from?: string;
  to?: string;
  payload?: PushMsgPayload<T>;
}

export interface PushMsgPayload<T> {
  type: BizType | CMDType;
  content: T
}

export enum PorxyType {
  REQUEST = 5010,
  REQUEST_START = 5011,
  REQUEST_END = 5012,
  STATISTICS = 5020,
  SOCKET = 5030,
}

export interface ClientInfo {
  key: string;
  uid: string;
  ip: string;
  port: string;
}