<template>
  <div style="height: calc(100vh - 98px)">
    <h4 style="font-size: 0.9rem; color: grey;">规则详情</h4>
    <el-table
      style="width: 100%; margin-bottom: 20px;"
      border
      stripe
      height="calc(100% - 40px)"
      :data="rule != null && rule.requests != null ? rule.requests : []"
    >
      <el-table-column prop="url" label="路径">
        <template slot-scope="scope">
          <span
            style="font-size: 0.7rem; color: #2980b9; font-style: italic; font-weight: bold;"
          >{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="耗时" width="100"></el-table-column>
      <el-table-column prop="statusCode" label="请求状态" width="100"></el-table-column>
      <el-table-column prop="responseData.code" label="业务状态" width="100"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click.native="onEditClicked(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click.native="onDeleteClicked(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详情" :visible.sync="showEditor" width="70%" top="70px">
      <v-json-editor
          ref="jsonEditor"
          :options="jeOption"
          v-model="curRecord"
          style="height: calc(100vh - 300px);"
        />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showEditor = false">取消</el-button>
        <el-button type="primary" size="small" @click="onSaveClicked()">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="警告" :visible.sync="showDeleteConfirm" width="30%">
      <span>确认要删除这条请求数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showDeleteConfirm = false">取消</el-button>
        <el-button type="danger" size="small" @click="onDeleteConfirm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./MockRuleDetail.vue.ts"></script>

<style>
</style>
