import { ref, reactive } from 'vue'
import { Column } from 'element-plus/lib/components/index.js';
import type { MenuOptions } from '@imengyu/vue3-context-menu';
import { Buffer } from 'buffer';

import { get, post } from './utils';
import { isDark, headers } from '../config'
import { ElMessage, ElMessageBox } from 'element-plus';

export const shareList = ref([])
export const shareListTable = ref(null)
export const shareOfUser = ref('')

export async function getShares(id: string, pwd: string) {
    if (pwd === undefined) {
        const canVisit = await _getShares(id, "")
        if (canVisit === false) {
            ElMessageBox.prompt('输入访问密码', 'Next', {
                confirmButtonText: 'OK',
                //cancelButtonText: 'No',
                //inputPattern: /^[^<>:"/\\|?*]+$/,
                inputErrorMessage: '未知错误',
            }).then(async ({ value }) => {
                const ok = await _getShares(id, value)
                if (ok === false) {
                    ElMessageBox.prompt('密码错误，请重新输入', 'Next', {
                        confirmButtonText: 'OK',
                        //cancelButtonText: 'No',
                        //inputPattern: /^[^<>:"/\\|?*]+$/,
                        inputErrorMessage: '未知错误',
                    }).then(async ({ value }) => {
                        await _getShares(id, value)
                    }).catch()
                }
            }).catch()
        }
    } else {
        await _getShares(id, pwd)
    }
}

export async function _getShares(id: string, pwd: string) {
    try {
        const ret = await get(`/getShare/${id}?password=${pwd}`, { headers: headers.value })
        if (ret.data.code === 404) {
            ElMessage({ message: "资源不存在", type: "warning" })
            setTimeout(() => {
                window.location.href = '/'
            }, 1500)
        } else if (ret.data.code === 200) {
            const js = JSON.parse(ret.data.message)
            shareList.value = js.ShareList
            shareOfUser.value = js.Username
        } else if (ret.data.code === 500 && ret.data.message.search('password incourrect') > -1) {
            return false
        } else {
            ElMessage({ message: ret.data.message, type: "error" })
            setTimeout(() => {
                window.location.href = '/'
            }, 1500)
        }
    } catch (err) {
        console.log(err)
    }
}

export async function downloadShares(id: string) {
    if (shareListTable.value.getSelectionRows().length === 0) {
        ElMessage({ message: "请勾选要下载的文件", type: "warning" })
        return
    }
    let tableData = shareListTable.value.getSelectionRows();
    console.log(tableData)
    console.log(id)
    for (let i = 0; i < tableData.length; i++) {
        const ret = await get(`/download/share/${id}`, {
            params: { id: id, fid: tableData[i].id, filename: tableData[i].name, hash: tableData[i].hash },
            headers: headers.value, responseType: 'blob'
        })
        let content = await ret.data.text()
        let encodeData = JSON.parse(content).content
        console.log(encodeData)
        const decoded = Buffer.from(encodeData, 'base64')
        // can not use atob, will overflow
        const url = window.URL.createObjectURL(new Blob([decoded]));
        const link = document.createElement('a');
        console.log(url);
        link.href = url;
        link.setAttribute('download', tableData[i].name);
        document.body.appendChild(link);
        link.click();
    }
}

export async function handleShareCellClick(row: Object, column: Column, cell: Element, event: PointerEvent) {
    //如果规定点击某一列执行，利用column中的label属性
    if (column.label === '文件名') {
        if (row.type == 'directory') {
            // TODO
            //await getSubFiles()
        }
    }
}
export const getSelectedShareData = () => {
    //通过Element-Plus表格的getSelectionRows的方法，获取已选中的数据
    if (shareListTable.value) {
        let tableData = shareListTable.value.getSelectionRows();
        console.log("选中数据", tableData)
    }
};

export const showShareMenu = ref(false)
export const onContextMenuShare = (e: MouseEvent) => {
    e.preventDefault();
    shareOptions.x = e.x;
    shareOptions.y = e.y;
    showShareMenu.value = true;
    shareOptions.theme = isDark.value ? 'mac dark' : 'mac'
};
export const shareOptions = reactive<MenuOptions>({
    iconFontClass: 'iconfont',
    zIndex: 4,
    //minWidth: 190,
    maxWidth: 300,
    x: 500,
    y: 200,
})