<template>
    <el-row :gutter="24" style="margin: 0;">
        <el-col :span="16" class="bg-border" style=" height: calc(100vh - 60px);">
            <el-form label-width="200px" size="small" style="margin: 15px;">
                <el-form-item label="网卡选择">
                    <el-select v-model="wrapperConfig.serverIP" placeholder="请选择" size="small" style="width: 100%;">
                        <el-option
                            v-for="(item, idx) in wrapperConfig.ips"
                            :key="idx"
                            :label="item.address"
                            :value="item.address"
                        >
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="item.tooltip" v-for="(item, idx) in perferences" :key="idx">
                    <el-input v-model="wrapperConfig[item.key]" size="small">
                        <el-button
                            slot="append"
                            icon="iconfont icon-cloud-sync"
                            @click="onSave()"
                            v-if="!item.hasStatus"
                        ></el-button>
                        <el-switch
                            v-model="wrapperConfig[item.statusKey]"
                            slot="append"
                            active-color="#13ce66"
                            @change="onDataProxySwitchChanged"
                            v-if="item.hasStatus"
                        >
                        </el-switch>
                    </el-input>
                </el-form-item>
                <el-form-item label="数据序列化插件" :inline="true">
                    <el-radio-group v-model="serialPlugin">
                        <el-radio :label="3" style="height: 30px; margin-top: 10px;">JSON</el-radio>
                        <br />
                        <el-radio :label="6" style="height: 34px; margin-top: 10px;"
                            >Protobuf
                            <el-select
                                v-model="pbFiles"
                                v-show="serialPlugin == 6"
                                multiple
                                placeholder="选择Protobuf数据模型定义文件"
                                style="width: 500px; margin: -11px 5px;"
                            >
                                <el-option v-for="item in pbFiles" :key="item.name" :label="item.name" :value="item">
                                </el-option>
                            </el-select>
                            <el-button
                                size="mini"
                                v-show="serialPlugin == 6"
                                type="success"
                                icon="iconfont icon-folder-open"
                                @click="onOpenFileDialog()"
                            ></el-button>
                        </el-radio>
                        <br />
                        <el-radio :label="10" style="height: 34px; margin-top: 15px;"
                            >自定义
                            <el-input
                                v-model="mrsUrl"
                                size="small"
                                placeholder="选择自定义序列化协议的JS实现插件"
                                v-show="serialPlugin == 10"
                                style="width: 500px; margin: -10px 5px;"
                            >
                                <el-button
                                    slot="append"
                                    size="mini"
                                    type="success"
                                    icon="iconfont icon-folder-open"
                                    @click="onOpenFileDialog()"
                                ></el-button>
                            </el-input>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="onSave">更新</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-col :span="7" class="bg-border" style="padding: 5px;">
            <el-row style="padding: 10px 0;">
                <h5 style="color: grey;">在线Client</h5>
                <el-input placeholder="请输入内容" v-model="broadcastMsg" size="small">
                    <template slot="prepend"><i class="iconfont icon-broadcast"></i></template>
                    <el-button slot="append" icon="iconfont icon-send" @click="sendBroadcastMsg"></el-button>
                </el-input>
            </el-row>
            <el-row style="text-align: center; overflow-y: auto; height: calc(100% - 120px);">
                <el-col :span="6" v-for="item in clientInfos" :key="item.key" style="margin: 10px 0;">
                    <el-popover placement="bottom" trigger="manual">
                        <el-tooltip
                            slot="reference"
                            effect="dark"
                            placement="bottom"
                            :content="item.ip + ':' + item.port"
                        >
                            <el-button
                                type="success"
                                icon="iconfont icon-network-data"
                                plain
                                circle
                                @click="showOpMenu(item)"
                            ></el-button>
                        </el-tooltip>
                    </el-popover>
                </el-col>
            </el-row>
        </el-col>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" v-if="selectClient != null">
            <el-form label-width="100px">
                <el-form-item label="client id">
                    <span>{{ selectClient.uid }}</span>
                </el-form-item>
                <el-form-item label="client key">
                    <span>{{ selectClient.key }}</span>
                </el-form-item>
                <el-form-item label="client ip">
                    <span>{{ selectClient.ip }}:{{ selectClient.port }}</span>
                </el-form-item>

                <el-input placeholder="请输入内容" v-model="imMsg" size="small">
                    <template slot="prepend"><i class="iconfont icon-msg-read"></i></template>
                    <el-button slot="append" icon="iconfont icon-send" @click="sendMsg"></el-button>
                </el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="kickDown">踢下线</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>

<script lang="ts" src="./Settings.vue.ts"></script>

<style></style>
