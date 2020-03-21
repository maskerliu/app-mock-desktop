import { ProxyRequestRecord, ProxyStatRecord, MockRule } from "../../model/DataModels"

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
    serverPort: number;
    websocketPort: number;
    ips: Array<IP>;
  }
}

export interface NavBarConfig {
  leftItem: boolean;
  leftCallback: Function;
  rightItem: boolean;
  rightCallback: Function;
  title: string;
}

export interface ProxyRecordState {
  records: Array<ProxyRequestRecord | ProxyStatRecord>;
}

export class MockRuleState {
  pagedRules: Array<MockRule>;
  searchResults: Array<MockRule>;
  rules: Array<MockRule>;
}