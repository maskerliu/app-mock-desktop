import { AxiosPromise } from "axios"

import { get, post } from './BasicLocalAPI'

import { BizResponse, Paged, MockRule } from "./DataModels"

export function getPagedMockRules(pageNo: string): AxiosPromise<BizResponse<Paged<MockRule>>> {
    return get('/appmock/getPagedMockRules', null, { pageNo });
}

export function searchMockRules(keyword: string): AxiosPromise<BizResponse<Array<MockRule>>> {
    return get('/appmock/searchMockRules', null, { keyword });
}

export function getMockRuleDetail(ruleId: string): AxiosPromise<BizResponse<MockRule>> {
    return get('/appmock/getMockRuleDetail', null, { ruleId });
}

export function saveMockRule(mockRule: MockRule): AxiosPromise<BizResponse<string>> {
    return post('/appmock/saveMockRule', null, mockRule);
}

export function deleteMockRule(ruleId: string): AxiosPromise<BizResponse<string>> {
    return post('/appmock/deleteMockRule', null, { ruleId });
}