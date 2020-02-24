import { ProxyRequestRecord, ProxyStatRecord, MockRule } from "../model/DataModels"

export interface CommonState {
  navTest: NavTest,
  navBarConfig: NavBarConfig
}

export interface NavTest {
  title: string
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