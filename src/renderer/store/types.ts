import { ProxyRequestRecord, ProxyStatRecord, MockRule } from "../model/DataModels"

export interface EnvState {
  env: string;
  appId: string;
  bundleId: string;
}

export interface CommonState {
  showQrCodeDialog: boolean,
  navBarConfig: NavBarConfig,
  registerUrl: string,
  localServerConfig: {
    ip: string,
    port: string,
  }
}

export interface NavBarConfig {
  leftItem: boolean,
  leftCallback: Function,
  rightItem: boolean,
  rightCallback: Function,
  title: string,
}

export interface ProxyRecordState {
  records: Array<ProxyRequestRecord | ProxyStatRecord>;
}

export class MockRuleArray extends Array<MockRule> {

}

export class MockRuleState {
  rules: MockRuleArray;
}