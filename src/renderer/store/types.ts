import {
  MockRule,
  ProxyRequestRecord,
  ProxyStatRecord,
  IP
} from "../../model/DataModels";

export interface EnvState {
  env: string;
  appId: string;
  bundleId: string;
}

export interface CommonState {
  showQrCodeDialog: boolean;
  navBarConfig: NavBarConfig;
  registerUrl: string;
  localServerConfig: {
    serverIP: string;
    proxyHttpPort: number;
    proxySocketPort: number;
    pushSocketPort: number;
    ips: Array<IP>;
    pbFiles: Array<{ name: string; value: string }>;
  };
  apiDefineServer: string;
  mockRuleServer: string;
  statRuleServer: string;
  dataProxyServer: string;
  dataProxyStatus: boolean;
  versionCheckServer: string;
}

export interface NavBarConfig {
  leftItem: boolean;
  leftCallback: Function;
  rightItem: boolean;
  rightCallback: Function;
  title: string;
}

export interface ProxyRecordState {
  proxyTypes: string[];
  records: Array<ProxyRequestRecord | ProxyStatRecord>;
  curRecord: ProxyRequestRecord;
}

export interface MockRuleState {
  showEditMockRuleDialog: boolean;
  showDeleteMockRuleDialog: boolean;
  curRule: MockRule;
}
