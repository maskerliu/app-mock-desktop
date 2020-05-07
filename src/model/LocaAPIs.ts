import { AxiosPromise } from "axios"

import { get, post, BASE_UPLOAD_URL } from "./BasicLocalAPI"

import { BizResponse, Paged, MockRule } from "./DataModels"
import { fchown } from "fs";


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

export function uploadMockRule(rule: MockRule): AxiosPromise<BizResponse<string>> {
    return post("/appmock/uploadMockRule", BASE_UPLOAD_URL, { rule });
}