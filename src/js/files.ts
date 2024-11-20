import { ref, computed, resolveComponent } from 'vue'
import { ElMessage, ElMessageBox, resultProps } from 'element-plus';
import type { UploadProps, UploadFiles, UploadUserFile } from 'element-plus'
import { Column } from 'element-plus/lib/components/index.js';
import { Icon } from '@iconify/vue';

import axios from 'axios';
import { Buffer } from 'buffer';

export let paths = '/path/fdsf/dfsfsdf/'
export const pathParts = ref(paths.split('/').filter(Boolean))
// const links = computed(() => {
//     return pathParts.value.map((item, index) => {
//         return {
//             text: item,
//             link: '/' + pathParts.value.slice(0, index + 1).join('/')
//         }
//     })
// })

export const searchContent = ref('')
var oldVal = ''
export const search = () => {
    console.log('search')
    if (oldVal != searchContent.value) {
        oldVal = searchContent.value
        // TODO
    }
}
export const flushPath = async (i: any) => {
    console.log(i)
    if (i === -1) {
        pathParts.value = []
        paths = '/'
    } else {
        console.log(pathParts.value[i])
        pathParts.value = pathParts.value.slice(0, i + 1)
        paths = pathParts.value.length > 0 ? `/${pathParts.value.join('/')}/` : '/'
    }
    console.log(pathParts)
    console.log(paths);
    try {
        let ret = await getPathFiles()
        flushFileList.value = !flushFileList.value
    } catch (err) {
        console.log(err)
    }
}

export const uploadList = ref<UploadFiles>([])
const uploadingList = ref<UploadFiles>([])
export const headers = ref({
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

export const onFileChange: UploadProps['onChange'] = async (file, fileList) => {
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
export const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

export const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

export const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `Cancel the transfer of ${uploadFile.name} ?`
    ).then(
        () => true,
        () => false
    )
}
// ---------------------------------------------------------------------
export const getPathFiles = async () => {
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
        return tableFile
    } catch (err) {
        //ElMessage({ message: err.response.data.message })
    }
}
const selectAll = ref(false)
const tableRef = ref(null)
export const totalFile = ref(0)
// let tableFile = [
//     { name: '1.jpg', size: 1024, time: "11111111" },
//     { name: '2.jpg', size: 1024, time: "11111111" },
// ]
export var tableFile: any[] = [];
export const flushFileList = ref(false);
(async () => { await getPathFiles() })()

export const getSelectedTableData = () => {
    //通过Element-Plus表格的getSelectionRows的方法，获取已选中的数据
    let tableData = tableRef.value.getSelectionRows();
    console.log("选中数据", tableData)
};
export const popref = ref(false)

export const deleteAction = async (files: any) => {
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

export async function createDir(current: string, dirname: string): Promise<boolean> {
    // TODO: name check
    try {
        const ret = await axios.post('/createDir', { current: current, dirname: dirname }, { headers: headers.value })
        if (ret.status) {
            ElMessage.success('创建成功')
            return true
        }
    } catch (err) {
        console.log(err)
    }
    return false
}

export async function handleCellClick(row: Object, column: Column, cell: Element, event: PointerEvent) {
    // console.log(row);
    // console.log(column);
    // console.log(cell);
    // console.log(event);
    //如果规定点击某一列执行，利用column中的label属性
    if (column.label === '文件名') {
        if (row.type == 'directory') {

            pathParts.value.push(row.name)
            paths += `${row.name}/`
            console.log(pathParts)
            console.log(paths);
            await getPathFiles()
            flushFileList.value = !flushFileList.value

        }
    }
}

export function formattedTime(time: number): string {
    const date = new Date(time * 1000)
    return date.toLocaleString()
}

export function formatFileSize(size: number): string {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else if (size < 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }
    return size.toString()
}

export async function DownloadFile(path: string, filename: string) {
    try {
        const header = {
            Authorization: "Bearer " + localStorage.getItem('token'),
            //"Content-Security-Policy": "upgrade-insecure-requests",
        }
        const ret = await axios.get('/download/' + filename, { params: { path: path }, responseType: 'blob', headers: header })
        let content = await ret.data.text()
        let encodeData = JSON.parse(content).content
        console.log(encodeData)
        const decoded = Buffer.from(encodeData, 'base64')
        // can not use atob, will overflow
        const url = window.URL.createObjectURL(new Blob([decoded]));
        const link = document.createElement('a');
        console.log(url);
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    } catch (err) {
        console.error(err)
    }
}

export async function shareFiles() { }