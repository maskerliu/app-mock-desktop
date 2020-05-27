<template>
  <div>
    <el-table
      :data="record.statistics.bps"
      style="width: 100%"
      row-key="id"
      lazy
      stripe
      :row-class-name="rowClassName"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-if="record != null"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="right"
            label-width="130px"
            class="table-expand"
          >
            <el-form-item
              :label="`${key} :`"
              style="width: 50%"
              v-for="(value, key) in props.row"
              :key="key"
            >
              <div style="width: 100%; word-wrap:break-word; word-break:break-all;user-select: text;">{{ value }}</div>
            </el-form-item>
          </el-form>
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
        width="150"
      ></el-table-column>
      <el-table-column label="参数">
        <template slot-scope="scope">
          <div style="max-height: 100px;">{{ scope.row.args }}</div>
        </template>
      </el-table-column>
      <el-table-column label="检查" fixed="right" width="60">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            :title="statRule == null ? '' : statRule.desc"
            width="380"
            trigger="manual"
            v-model="visible"
          >
            <el-button type="primary" size="small" @click="visible = false" style="position: absolute; top: 5px; right: 35px;">关闭</el-button>
            <div
              style="max-height: 400px; overflow-y: scroll;"
              v-if="statRule != null"
            >
              <pre style="color:#2c3e50">{{ statRule.rule }}</pre>
              <br />
              <pre
                style="color: #2980b9; width: 100%;white-space: pre-wrap;word-wrap: break-word;"
                >{{ statRule.ruleDesc }}</pre
              >
            </div>
            <el-button
              icon="iconfont icon-check"
              size="small"
              circle
              slot="reference"
              @click="onClicked(scope.row)"
            ></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" src="./ProxyStatDetail.vue.ts"></script>

<style>
.el-table .normal-row {
  max-height: 100px;
  font-size: 0.7rem;
  user-select: text;
}

.el-table .warning-row {
  max-height: 100px;
  font-size: 0.7rem;
  user-select: text;
  background: #ff767558;
}

.el-table .success-row {
  max-height: 100px;
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
.el-popover {
  margin-top: 80px;
}
</style>
