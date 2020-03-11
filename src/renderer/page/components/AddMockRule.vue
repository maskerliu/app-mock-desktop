<template>
  <el-row style="width: 100%; height: calc(100vh - 185px);">
    <el-row style="padding: 10px; margin:-30px 0 10px 0; box-shadow: 2px 4px 6px #00000080;">
      <el-col :span="12">
        <el-input
          v-model="keyword"
          size="mini"
          style="width: 100%;"
          placeholder="请输入内容"
          clearable
        >
          <el-button slot="append" icon="el-icon-search" @click="querySearchAsync()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-tag
          closable
          type="primary"
          size="small"
          style="margin: 0 15px"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{curRule.name}}</el-tag>
        <el-button
          type="primary"
          style="position: absolute; right: 5px;"
          size="mini"
          :loading="isSaving"
        >保存</el-button>
      </el-col>
    </el-row>

    <el-row style="width: 100%; height: calc(100% - 20px); display: flex;">
      <el-col style="flex:1; height: 100%; box-shadow: 2px 4px 6px #00000080;">
        <v-json-editor
          ref="respJsonEditor"
          :options="jeOption"
          v-model="wrapperRecord"
          style="height: 100%;"
        />
      </el-col>
      <el-col :span="1" style="padding: 10px;">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-arrow-right"
          circle
          @click.native="addRule()"
        ></el-button>
      </el-col>
      <el-col style="width: 471px; height: 100%; box-shadow: 2px 4px 6px #00000080;">
        <el-table
          style="margin-bottom: 20px;"
          border
          stripe
          :data="curRule != null && curRule.requests != null ? curRule.requests : []"
        >
          <el-table-column label="路径" width="240">
            <template slot-scope="scope">
              <span
                style="font-size: 0.7rem; color: #2980b9; font-style: italic; font-weight: bold;"
              >{{scope.row.url}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusCode" label="请求状态" width="85"></el-table-column>
          <el-table-column prop="responseData.code" label="业务状态" width="85"></el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
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
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts" src="./AddMockRule.vue.ts"></script>

<style>

</style>
