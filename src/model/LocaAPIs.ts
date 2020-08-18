import { AxiosPromise } from "axios";
import { get, post } from "./BasicLocalAPI";
import { BizResponse, LocalServerConfig, MockRule, MsgPushClient } from "./DataModels";

export function setProxyDelay(delay: number, isOpen: boolean): AxiosPromise<BizResponse<string>> {
  return get("/appmock/setProxyDelay", null, { isOpen, delay });
}

export function searchMockRules(keyword: string): AxiosPromise<BizResponse<Array<MockRule>>> {
  return get("/appmock/searchMockRules", null, { keyword });
}

export function getMockRuleDetail(ruleId: string): AxiosPromise<BizResponse<MockRule>> {
  return get("/appmock/getMockRuleDetail", null, { ruleId });
}

export function saveMockRule(mockRule: MockRule, onlySnap: boolean): AxiosPromise<BizResponse<string>> {
  return post("/appmock/saveMockRule", null, { onlySnap }, mockRule);
}

export function deleteMockRule(ruleId: string): AxiosPromise<BizResponse<string>> {
  return post("/appmock/deleteMockRule", null, { ruleId });
}

export function getLocalServerConfig(): AxiosPromise<BizResponse<LocalServerConfig>> {
  return get("/appmock/getLocalServerConfig");
}

export function getAllPushClients(): AxiosPromise<BizResponse<Array<MsgPushClient>>> {
  return post("/appmock/getAllPushClients");
}