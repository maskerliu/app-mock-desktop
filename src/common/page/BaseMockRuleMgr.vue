<template>
    <div>
        <el-row :gutter="20">
            <el-col class="bg-border" style="width: 300px; margin-left: 15px;">
                <el-input
                    size="small"
                    placeholder="筛选关键字"
                    v-model="searchKeyword"
                    clearable
                    style="margin-top: 10px;"
                >
                    <i slot="prefix" class="el-input__icon iconfont icon-search" style="font-size: 1.0rem;"></i>
                    <el-button
                        slot="append"
                        size="small"
                        type="success"
                        icon="el-icon-plus"
                        @click="onAddMockRule"
                    ></el-button>
                </el-input>

                <virtual-list
                    class="rule-snap-panel"
                    :size="50"
                    :keeps="30"
                    :data-key="'_id'"
                    :data-sources="rules"
                    :data-component="mockRuleSnap"
                />
            </el-col>
            <el-col class="bg-border" style="width: calc(100vw - 400px);">
                <mock-rule-detail :rule-id="curRule._id" :is-mock="curRule.isMock" v-if="curRule != null" />
            </el-col>
        </el-row>

        <el-dialog
            title="警告"
            :visible="showDeleteMockRuleDialog"
            width="30%"
            @close="setShowDeleteMockRuleDialog(false)"
        >
            <span>确定删除[{{ curRule != null ? curRule.name : "" }}]这条Mock规则吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="setShowDeleteMockRuleDialog(false)">取 消</el-button>
                <el-button type="danger" size="small" @click="onDeleteMockRuleConfirmed()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="规则详情" :visible="showEditMockRuleDialog" @close="setShowEditMockRuleDialog(false)">
            <el-form ref="form" :model="wrapperRule" label-width="90px" v-if="wrapperRule != null">
                <el-form-item label="规则组名">
                    <el-input size="small" v-model="wrapperRule.name" placeholder="规则组名"></el-input>
                </el-form-item>
                <el-form-item label="规则组描述" style="margin-top: 15px;">
                    <el-input
                        size="small"
                        rows="4"
                        type="textarea"
                        v-model="wrapperRule.desc"
                        placeholder="规则组描述"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="setShowEditMockRuleDialog(false)">取 消</el-button>
                <el-button type="primary" size="small" @click="onSaveMockRule()">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts" src="./BaseMockRuleMgr.vue.ts"></script>

<style>
.rule-snap-panel {
    height: calc(100vh - 140px);
    margin-top: 15px;
    overflow-x: hidden;
    margin-bottom: 5px;
}
</style>
