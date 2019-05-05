<template>
    <div id="tab_little_tool" style="height: 100%; overflow-y: auto;">
        <mu-data-table border stripe :columns="columns" :data="record.bps" height="670">
            <template slot="expand" slot-scope="prop">
                <div style="padding: 15px; font-size: 0.9rem;">
                    <span v-for="(value, key, index) in prop.row" v-if="exclude.indexOf(key) === -1">
                        <strong style="color: #7f8c8d; font-size: 0.8rem;">{{key}}:</strong>
                        <span style="color: #27ae60; font-size: 0.8rem">{{value}}</span>
                        <br/>
                    </span>
                </div>
            </template>
            <template slot-scope="scope">
                <td class="is-center">{{scope.row.event_id}}</td>
                <td class="is-center">{{scope.row.page}}</td>
                <td class="is-center">{{scope.row.local_time}}</td>
                <td class="is-left">{{scope.row.arg1}}</td>
                <td class="is-left">{{scope.row.arg2}}</td>
                <td class="is-left">{{scope.row.arg3}}</td>
                <td class="is-left">{{scope.row.args}}</td>
            </template>
        </mu-data-table>
    </div>
</template>

<script>
    export default {
        name: "Statistics",
        props: {
            record: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                columns: [
                    {title: 'event_id', name: 'event_id', width: 126, align: 'center'},
                    {title: 'page', name: 'page', width: 128, align: 'center'},
                    {title: 'local_time', name: 'local_time', width: 170, align: 'center'},
                    {title: 'arg1', name: 'arg1', width: 250, align: 'center'},
                    {title: 'arg2', name: 'arg2', width: 250, align: 'center'},
                    {title: 'arg3', name: 'arg3', width: 250, align: 'center'},
                    {title: 'args', name: 'args', width: 250, align: 'center'},
                ],
                exclude: ['event_id', 'page', 'local_time', 'arg1', 'arg2', 'arg3', 'args']
            }
        }
    }
</script>

<style scoped>

</style>
