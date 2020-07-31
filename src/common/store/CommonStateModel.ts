import {
    MockRule,
    ProxyRequestRecord,
    ProxyStatRecord,
  } from "../../model/DataModels";

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