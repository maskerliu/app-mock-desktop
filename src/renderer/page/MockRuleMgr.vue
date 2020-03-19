<template>
  <div>
    <el-row :gutter="20">
      <el-col class="border-panel" style="width: 300px; margin-left: 15px;">
        <el-input
          size="small"
          placeholder="筛选关键字"
          v-model="searchKeyword"
          clearable
          style="margin-top: 10px;"
        >
          <i slot="prefix" class="el-input__icon iconfont icon-search" style="font-size: 1.0rem;"></i>
        </el-input>

        <el-divider content-position="right">
          <el-button size="mini" type="success" icon="el-icon-plus" @click="onEditMockRule(null)"></el-button>
        </el-divider>

        <div class="rule-snap-panel" ref="wrapper">
          <mock-rule-snap
            v-for="(item, idx) in rules"
            :key="idx"
            :rule="item"
            :isSelected="curRule!== null && item._id === curRule._id"
            @click.native="onRuleClicked(item)"
            v-on:edit="onEditMockRule(item)"
            v-on:delete="onDeleteMockRule(item)"
            v-on:open-mock="onMockSwitchChanged(item)"
          />
        </div>
        <el-pagination small layout="prev, pager, next" :total="1000"></el-pagination>
      </el-col>
      <el-col class="border-panel" style="width: calc(100vw - 400px);">
        <mock-rule-detail :rule-id="curRule._id" v-if="curRule != null" />
      </el-col>
    </el-row>

    <el-dialog title="Waring" :visible.sync="showDeleteMockRuleDialog" width="30%">
      <span>确定删除[{{curRule != null ? curRule.name : ""}}]这条Mock规则吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteMockRuleDialog = false">取 消</el-button>
        <el-button type="danger" @click="onDeleteMockRuleConfirmed()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Mock规则详情" :visible.sync="showEditMockRuleDialog" width="50%">
      <el-form ref="form" :model="curRule" label-width="90px" v-if="curRule != null">
        <el-form-item label="规则组名">
          <el-input v-model="curRule.name" placeholder="规则组名"></el-input>
        </el-form-item>
        <el-form-item label="规则组描述">
          <el-input v-model="curRule.desc" placeholder="规则组描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditMockRuleDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSaveMockRule()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./MockRuleMgr.vue.ts"></script>

<style>
.border-panel {
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  margin: 5px;
  padding: 5px;
}

.rule-snap-panel {
  height: calc(100vh - 200px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 5px;
}

.rule-snap-panel::-webkit-scrollbar {
  display: none;
}
</style>
