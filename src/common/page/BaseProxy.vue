<template>
    <el-row ref="container" :gutter="20" style="margin: 0; height: 100%;">
        <el-col ref="leftDom" class="bg-border" style="margin: 5px; width: 300px; height: calc(100% - 60px);">
            <el-checkbox-group
                size="mini"
                v-model="filterTypes"
                style="width: 100%; padding: 5px 5px; boder: 1px solid grey;"
            >
                <i class="iconfont icon-filter" style="font-weight: blod; color: grey;" />
                <el-tooltip effect="dark" content="请求" placement="bottom">
                    <el-checkbox label="5010" style="padding: 5px 10px;">
                        <i class="iconfont icon-api" style="font-weight: blod;" />
                    </el-checkbox>
                </el-tooltip>

                <el-tooltip effect="dark" content="埋点" placement="bottom">
                    <el-checkbox label="5020" style="padding: 5px 10px;">
                        <i class="iconfont icon-maidian" style="font-weight: blod;" />
                    </el-checkbox>
                </el-tooltip>
                <el-tooltip effect="dark" content="长连通道" placement="bottom">
                    <el-checkbox label="5030" style="padding: 5px 10px;">
                        <i class="iconfont icon-shuiguan" style="font-weight: blod;" />
                    </el-checkbox>
                </el-tooltip>
            </el-checkbox-group>

            <el-input size="small" placeholder="延时时长" v-model="proxyDelay">
                <i slot="prefix" class="el-input__icon iconfont icon-delay"></i>
                <span slot="append" style="padding-right: 10px;">ms</span>
                <el-checkbox slot="append" size="mini" v-model="isDelay" @change="onSetDelayChanged"></el-checkbox>
            </el-input>

            <el-input size="small" placeholder="筛选关键字" v-model="filterInput" clearable style="margin-top: 10px;">
                <i slot="prefix" class="el-input__icon iconfont icon-search"></i>
                <el-button slot="append" icon="iconfont icon-clear" @click="clearProxyRecrods()"></el-button>
            </el-input>

            <virtual-list
                class="record-snap-panel"
                :size="50"
                :keeps="20"
                :data-key="'_idx'"
                :data-sources="filtedRecords"
                :data-component="proxyRecordSnap"
            />
        </el-col>
        <el-col ref="resizeBar" class="resize-bar" style="padding: 0;">
            <div
                style="width: 3px; height: 100%; position: absolute; left: 3px; z-index: 0; border-left: 3px dotted #d6d6d6;"
            ></div>
            <i
                class="iconfont icon-division"
                style="font-size: 0.7rem; font-weight: bold; color: grey; position: relative; top: 50%; transform: translateY(-50%);"
            ></i>
        </el-col>
        <el-col ref="rightDom" style="padding: 0; width: calc(100% - 320px); height: 100vh;">
            <proxy-request-detail :record="curRecord" v-if="curRecord != null && curRecord.type != 5020" />
            <proxy-stat-detail :record="curRecord" v-if="curRecord != null && curRecord.type == 5020" />
        </el-col>
    </el-row>
</template>

<script lang="ts" src="./BaseProxy.vue.ts"></script>

<style scoped>
.bg-border {
    border: 1px solid #f1f1f1;
    border-radius: 8px;
    box-shadow: 1px 1px 1px rgba(120, 120, 120, 0.5);
}

.resize-bar {
    position: relative;
    width: 10px;
    height: 100vh;
    text-align: center;
}

.record-snap-panel {
    height: calc(100% - 140px);
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 15px 0 10px;
}

.resize-bar:hover {
    cursor: col-resize;
}
</style>
