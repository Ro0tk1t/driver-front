<script setup lang="ts">
import { Back, Search, FolderAdd, Share, MoreFilled, House, UploadFilled, Upload, Refresh, Finished } from '@element-plus/icons-vue'

import { formattedTime, formatFileSize, DownloadFile, deleteAction } from "../js/files"
import { pathParts, flushPath, flushFileList, getPathFiles, paths, tableFile, tableRef, totalFile } from "../js/files"
import { uploadList, headers, getSelectedTableData, search, searchContent } from "../js/files"
import { onFileChange, handleExceed, handleRemove, beforeRemove, handleCellClick } from "../js/files"
import { popref } from "../js/files"
import onContextMenu from '../js/menu';
import { showMenu, options, onContextMenu1, newDir } from '../js/menu';

</script>

<template>
    <div class="container">
        <div class="box1" style="flex:1" @contextmenu="onContextMenu1($event)">
            <!-- <h2>{{ choose }}</h2> -->
            <el-row class="file-nav">
                <el-col :span="5" :sm="5" :md="10">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><a @click="flushPath(-1)">
                                <el-icon>
                                    <House />
                                </el-icon>
                            </a></el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item, index) in pathParts" @click="flushPath(index)"><a>{{
                            item }}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="7">
                    <el-input id="search-input" v-model="searchContent" placeholder="搜索文件" @change="search"
                        style="width: 250px" :prefix-icon="Search" clearable></el-input>
                </el-col>
                <el-col :span="1">
                    <el-upload v-model:file-list="uploadList" action="#" :headers="headers" :auto-upload="false"
                        multiple :on-change="onFileChange" :on-remove="handleRemove" :before-remove="beforeRemove"
                        :on-exceed="handleExceed">
                        <el-button type="primary" circle>
                            <el-icon>
                                <UploadFilled />
                            </el-icon>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :span="1">
                    <el-popover ref="popoverRef" :hide="popref" placement="bottom-end" title="uploading：">
                        <template #reference>
                            <el-icon>
                                <Finished />
                            </el-icon>
                        </template>
                    </el-popover>
                </el-col>
            </el-row>
            <!-- <el-table v-model="tableFile" :data="tableFile" ref="tableRef" stripe style="width: 100%" -->
            <el-table v-model="tableFile" :data="tableFile" ref="tableRef" :key="flushFileList" stripe
                style="width: 100%" @selection-change="getSelectedTableData" @cell-click="handleCellClick">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="文件名" min-width="280" click="test">
                    <template #default="scope">
                        <!-- 截取前面一段字符，tips悬浮提示完整字符 -->
                        <el-tooltip :content="scope.row.name" v-if="scope.row.name.length > 30">
                            {{ scope.row.name.length > 30 ? scope.row.name.substring(0, 30) + " ..." : scope.row.name }}
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="时间" width="180">
                    <template #default="scope">
                        {{ formattedTime(scope.row.time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="大小" width="180">
                    <template #default="scope">
                        {{ formatFileSize(scope.row.size) }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="180">
                    <template #default="scope">
                        <el-dropdown placement="top-end">
                            <el-icon>
                                <MoreFilled />
                            </el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>分享</el-dropdown-item>
                                    <el-dropdown-item @click="DownloadFile(paths, scope.row.name)">下载</el-dropdown-item>
                                    <el-dropdown-item>详情</el-dropdown-item>
                                    <el-dropdown-item @click="deleteAction([scope.row])">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" size="small" :total="totalFile" />
        </div>
    </div>

    <div>
        <context-menu v-model:show="showMenu" :options="options">
            <context-menu-item label="back" @click="flushPath(-1)">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <Back />
                    </el-icon>
                </el-button>
                &nbsp;<span>返回上级目录</span>
            </context-menu-item>
            <context-menu-item label="mkdir" @click="newDir">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <FolderAdd />
                    </el-icon>
                </el-button>
                <span>新建文件夹</span>
            </context-menu-item>
            <context-menu-item label="upload file" @click="">
                <el-upload v-model:file-list="uploadList" action="#" :headers="headers" :auto-upload="false" multiple
                    :on-change="onFileChange" :on-remove="handleRemove" :before-remove="beforeRemove"
                    :on-exceed="handleExceed">
                    <el-button type="primary" size="small" circle>
                        <el-icon>
                            <UploadFilled />
                        </el-icon>
                    </el-button>
                </el-upload>
                <span>上传文件</span>
            </context-menu-item>
            <!-- <context-menu-item label="refrash" @click="getPathFiles" class="center-content"> -->
            <context-menu-item label="refrash" @click="getPathFiles">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
                <span>刷新</span>
            </context-menu-item>
            <context-menu-item label="share">
                <el-button type="primary" size="small" circle>
                    <el-icon>
                        <Share />
                    </el-icon>
                </el-button>
                <span>分享</span>
            </context-menu-item>
        </context-menu>
    </div>
</template>

<style>
.center-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.context-menu-item {
    display: grid;
    place-items: center;
}
</style>