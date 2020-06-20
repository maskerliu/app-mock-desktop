<template>
  <div>
    <el-table
      ref="statsTable"
      :data="record.statistics.bps"
      style="width: 100%"
      lazy
      stripe
      :row-class-name="rowClassName"
      v-if="record != null"
      @expand-change="onExpandChagned"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row>
            <el-col :span="15">
              <el-form
                label-position="right"
                label-width="130px"
                class="table-expand"
              >
                <el-form-item
                  :label="`${key} :`"
                  v-for="(value, key) in props.row"
                  :key="key"
                >
                  <div class="preview">{{ value }}</div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col
              :span="9"
              v-if="statRule != null"
              style="overflow-y: scroll; padding: 15px;"
            >
              <pre class="preview">{{ statRule.desc }}</pre>
              <pre class="preview">{{ statRule.rule }}</pre>
              <pre class="preview">{{ statRule.ruleDesc }}</pre>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="app_name"
        label="应用"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="app_version"
        label="版本"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="event_id"
        label="类型"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="pageId"
        label="pageId"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="elementId"
        label="elementId"
        width="160"
      ></el-table-column>
      <el-table-column label="参数">
        <template slot-scope="scope">
          <div style="max-height: 60px;">{{ scope.row.args }}</div>
        </template>
      </el-table-column>
      <el-table-column label="检查" fixed="right" width="60">
        <template slot-scope="scope">
          <el-button
            icon="iconfont icon-check"
            size="small"
            circle
            slot="reference"
            @click="onClicked(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" src="./ProxyStatDetail.vue.ts"></script>

<style>
.el-table .normal-row {
  max-height: 60px;
  font-size: 0.7rem;
  user-select: text;
}
.el-table .warning-row {
  max-height: 60px;
  font-size: 0.7rem;
  user-select: text;
  background: #eccc6858;
}

.el-table .error-row {
  max-height: 60px;
  font-size: 0.7rem;
  user-select: text;
  background: #ff767558;
}

.el-table .success-row {
  max-height: 60px;
  font-size: 0.7rem;
  user-select: text;
  background: #55efc458;
}

.table-expand {
  width: 100%;
  font-size: 0.7rem;
  height: 400px;
  overflow-y: scroll;
}
.table-expand label {
  width: 100px;
  font-size: 0.7rem;
  color: #99a9bf;
}

.el-form-item {
  margin-bottom: 0;
}

.el-form-item__content {
  font-size: 0.7rem;
  color: grey;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 0;
}

.preview {
  font-size: 0.7rem;
  color: #2980b9;
  white-space: pre-wrap;
  word-wrap: break-word;
  user-select: text;
}
</style>
