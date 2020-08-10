import { AxiosPromise } from "axios";
import { get, post } from "./BasicLocalAPI";
import { BizResponse, LocalServerConfig, MockRule, MsgPushClient } from "./DataModels";

export function setProxyDelay(delay: number, isOpen: boolean): AxiosPromise<BizResponse<string>> {
  return get("/appmock/setProxyDelay", process.env.SERVER_BASE_URL, { isOpen, delay });
}

export function searchMockRules(keyword: string): AxiosPromise<BizResponse<Array<MockRule>>> {
  return get("/appmock/searchMockRules", process.env.SERVER_BASE_URL, { keyword });
}

export function getMockRuleDetail(ruleId: string): AxiosPromise<BizResponse<MockRule>> {
  return get("/appmock/getMockRuleDetail", process.env.SERVER_BASE_URL, { ruleId });
}

export function saveMockRule(mockRule: MockRule, onlySnap: boolean): AxiosPromise<BizResponse<string>> {
  return post("/appmock/saveMockRule", process.env.SERVER_BASE_URL, { onlySnap }, mockRule);
}

export function deleteMockRule(ruleId: string): AxiosPromise<BizResponse<string>> {
  return post("/appmock/deleteMockRule", process.env.SERVER_BASE_URL, { ruleId });
}

export function getLocalServerConfig(): AxiosPromise<BizResponse<LocalServerConfig>> {
  return get("/appmock/getLocalServerConfig", process.env.SERVER_BASE_URL);
}

export function getAllPushClients(): AxiosPromise<BizResponse<Array<MsgPushClient>>> {
  return post("/appmock/getAllPushClients", process.env.SERVER_BASE_URL);
}