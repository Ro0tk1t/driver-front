<script setup lang="js">
import { ref, reactive } from 'vue'
import { useRoute } from "vue-router"
import { ElTable, ElTableColumn } from "element-plus";
import { Back, Search, FolderAdd, Share, MoreFilled, House, UploadFilled, Upload, Refresh, Finished } from '@element-plus/icons-vue'

import { shareList, shareOfUser, getShares, shareOptions, showShareMenu, onContextMenuShare, getSelectedShareData } from '../js/share';
import { downloadShares, shareListTable, handleShareCellClick } from '../js/share';
//import { options, onContextMenuShare, showShareMenu, shareOption } from "../js/menu";
import { formatFileSize } from "../js/files"

let params = useRoute().params
let query = useRoute().query

console.log(params)
console.log(query);

(async () => { await getShares(params.id, query.password) })()
</script>

<template>
    <!-- {{ $route.params }}
    {{ $route.query }} -->
    <span>用户 <a>{{ shareOfUser }}</a> 给您分享了文件：</span><br /><br /><br />
    <div class="container2">
        <div class="box2" style="flex:1" @contextmenu="onContextMenuShare($event)">
            <ElTable v-model="shareList" :data="shareList" ref="shareListTable" style="width: 100%"
                @selection-change="getSelectedShareData" @cell-click="handleShareCellClick">
                <ElTableColumn type="selection" width="55" />
                <ElTableColumn prop="name" label="文件名"></ElTableColumn>
                <ElTableColumn prop="size" label="大小" width="180">
                    <template #default="scope">
                        {{ formatFileSize(scope.row.size) }}
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>

    <div>
        <context-menu v-model:show="showShareMenu" :options="shareOptions">
            <context-menu-item label="share" @click="">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <Share />
                    </el-icon>
                </el-button>
                <span>保存到</span>
            </context-menu-item>
            <context-menu-item label="share" @click="downloadShares($route.params.id)">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <Share />
                    </el-icon>
                </el-button>
                <span>下载</span>
            </context-menu-item>
        </context-menu>
    </div>
</template>