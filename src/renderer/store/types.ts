import {
  MockRule,
  ProxyRequestRecord,
  ProxyStatRecord,
} from "../../model/DataModels";

export interface EnvState {
  env: string;
  appId: string;
  bundleId: string;
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
  mockRuleSyncServer: string;
  statRuleSyncServer: string;
  dataProxyServer: string;
  dataProxyStatus: boolean;
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
