<template>
  <div>
    <el-table
      ref="statsTable"
      :data="record.statistics.bps"
      style="width: 100%"
      lazy
      stripe
      :row-class-name="tableRowClassName"
      v-if="record != null"
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
              v-if="rows[props.$index] != null && rows[props.$index].statRule != null"
              style="height: 400px; overflow-y: scroll; padding: 15px;"
            >
              <pre class="preview">{{ rows[props.$index].statRule.desc }}</pre>
              <pre class="preview">{{ rows[props.$index].statRule.rule }}</pre>
              <pre class="preview">{{ rows[props.$index].statRule.ruleDesc }}</pre>
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
      <el-table-column label="pageId" width="140">
        <template slot-scope="scope">
          <div style="max-height: 50px;">{{ scope.row.pageId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="elementId" width="160">
        <template slot-scope="scope">
          <div style="max-height: 50px;">{{ scope.row.elementId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="参数">
        <template slot-scope="scope">
          <div style="max-height: 50px;">{{ scope.row.args }}</div>
        </template>
      </el-table-column>
      <el-table-column label="检查" width="60">
        <template slot-scope="scope">
          <el-button
            icon="iconfont icon-check"
            size="small"
            circle
            slot="reference"
            @click="onClicked(scope.row, scope.$index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" src="./ProxyStatDetail.vue.ts"></script>

<style>
.el-table .normal-row {
  height: 70px;
  max-height: 70px;
  font-size: 0.7rem;
  user-select: text;
}
.el-table .warning-row {
  height: 70px;
  max-height: 70px;
  font-size: 0.7rem;
  user-select: text;
  background: #eccc6858;
}

.el-table .error-row {
  height: 70px;
  max-height: 70px;
  font-size: 0.7rem;
  user-select: text;
  background: #ff767558;
}

.el-table .success-row {
  height: 70px;
  max-height: 70px;
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
