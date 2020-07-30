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
  
  export interface CommonState {
    showQrCodeDialog: boolean;
    registerUrl: string;
    localServerConfig: {
      serverIP: string;
      proxyHttpPort: number;
      proxySocketPort: number;
      pushSocketPort: number;
    };
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
  