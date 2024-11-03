<script setup lang="ts">
import { formattedTime, formatFileSize, DownloadFile } from "../js/files"

import { ref, computed, resolveComponent } from 'vue'
import { Search, MoreFilled, House, UploadFilled, Upload, Finished } from '@element-plus/icons-vue'
import { ElTable, ElBreadcrumb, ElBreadcrumbItem, ElMessage, ElMessageBox, resultProps } from 'element-plus';
import type { UploadProps, UploadFiles, UploadUserFile } from 'element-plus'
import { Icon } from '@iconify/vue';
import axios from 'axios';

let paths = '/path/fdsf/dfsfsdf/'
const pathParts = ref(paths.split('/').filter(Boolean))
// const links = computed(() => {
//     return pathParts.value.map((item, index) => {
//         return {
//             text: item,
//             link: '/' + pathParts.value.slice(0, index + 1).join('/')
//         }
//     })
// })

const searchContent = ref('')
var oldVal = ''
const search = () => {
    console.log('search')
    if (oldVal != searchContent.value) {
        oldVal = searchContent.value
        // TODO
    }
}
const flushPath = (i) => {
    console.log(i)
    console.log(pathParts.value[i])
    pathParts.value = pathParts.value.slice(0, i + 1)
    paths = pathParts.value.length > 0 ? `/${pathParts.value.join('/')}/` : '/'
    console.log(paths)
}

const uploadList = ref<UploadFiles>([])
const uploadingList = ref<UploadFiles>([])
const headers = ref({
    // Authorization: localStorage.getItem('token')
    Authorization: "Bearer " + localStorage.getItem('token')
})
const chunkSize = 1024 * 1024 * 3
const uploadChunk = async (file: any, fname: string, chunkIndex: any) => {
    const fileForm = new FormData()
    fileForm.append('chunk', file)
    fileForm.append('chunkIndex', chunkIndex)
    fileForm.append('filename', fname)
    const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // 将读取的内容转换为 base64 编码
            const base64Content = event.target.result;
            resolve(base64Content);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
    const data = {
        filename: fname,
        chunk: base64Content.split(',')[1],
        //chunk: Buffer.from(content).toString('base64'),
        chunkIndex: chunkIndex,
    }
    return axios.post('/upload', data, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token'),
            'Transfer-Encoding': 'chunked',
            //'Content-Type': 'multipart/form-data',
        }
    })
}
const onFileChange: UploadProps['onChange'] = async (file, fileList) => {
    uploadingList.value.push({ ...file })

    let filename = file.name
    const fsize = file.size || 0
    console.log(fsize)
    const chunkNum = Math.ceil(fsize / chunkSize)
    if (chunkNum > 0) {
        var failed = false
        for (let i = 0; i < chunkNum; i++) {
            const chunk = file.raw?.slice(i * chunkSize, Math.min((i + 1) * chunkSize, fsize))
            try {
                const result = await uploadChunk(chunk, filename, i)
                if (result.status != 200) {
                    failed = true
                }
            } catch (err) {
                failed = true
                console.log(err)
                break
            }
        }
        if (!failed) {
            const data = {
                filename: paths + filename,
                chunkIndex: chunkNum,
            }
            const ret = await axios.post('/uploadOver', data, { headers: headers.value })
            if (ret.status != 200) {
                ElMessage.error("文件上传失败")
            }
            await getPathFiles()
        }
    }
}
// ---------------------------------------------------------------------
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `Cancel the transfer of ${uploadFile.name} ?`
    ).then(
        () => true,
        () => false
    )
}
// ---------------------------------------------------------------------
const getPathFiles = async () => {
    const query = {
        path: paths,
        page: 0,
        pageSize: 10,
    }
    try {
        const ret = await axios.get('/listFiles', { params: query, headers: headers.value })
        console.log(ret)
        tableFile = ret.data.fileInfos
        totalFile.value = Number(ret.data.total)
    } catch (err) {
        //ElMessage({ message: err.response.data.message })
    }
}
const selectAll = ref(false)
const tableRef = ref(null)
const totalFile = ref(0)
// let tableFile = [
//     { name: '1.jpg', size: 1024, time: "11111111" },
//     { name: '2.jpg', size: 1024, time: "11111111" },
// ]
var tableFile: any[] = [];
(async () => { await getPathFiles() })()

const getSelectedTableData = () => {
    //通过Element-Plus表格的getSelectionRows的方法，获取已选中的数据
    let tableData = tableRef.value.getSelectionRows();
    console.log("选中数据", tableData)
};
const popref = ref(false)

const deleteAction = async (files: any) => {
    let data = {
        path: paths,
        files: files.map((item: any) => item.name),
    }
    try {
        const res = await axios.post('/deleteFiles', data, { headers: headers.value })
        ElMessage.success("删除成功")
        console.log(res)
        await getPathFiles()
    } catch (err) {
        console.log(err)
    }
}
</script>

<template>
    <el-row class="file-nav">
        <el-col :span="5" :sm="5" :md="10">
            <el-breadcrumb separator="/">
                <el-icon>
                    <House />
                </el-icon>/
                <el-breadcrumb-item v-for="(item, index) in pathParts" @click="flushPath(index)"><a>{{
                    item }}</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="7">
            <el-input id="search-input" v-model="searchContent" placeholder="搜索文件" @change="search" style="width: 250px"
                :prefix-icon="Search" clearable></el-input>
        </el-col>
        <el-col :span="1">
            <el-upload v-model:file-list="uploadList" action="#" :headers="headers" :auto-upload="false" multiple
                :on-change="onFileChange" :on-remove="handleRemove" :before-remove="beforeRemove"
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
    <el-table v-model="tableFile" :data="tableFile" ref="tableRef" stripe style="width: 100%"
        @selection-change="getSelectedTableData">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="文件名" min-width="280">
            <template #default="scope">
                <!-- 截取前面一段字符，tips悬浮提示完整字符 -->
                <el-tooltip :content="scope.row.name">
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
</template>