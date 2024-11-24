import ContextMenu from '@imengyu/vue3-context-menu'
import { paths, createDir, getPathFiles, flushPath, onFileChange } from './files';
import { ElMessage, ElMessageBox } from 'element-plus';


const onContextMenu = (e: MouseEvent) => {
  //prevent the browser's default menu
  e.preventDefault();
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: "返回上级目录",
        onClick: async () => {
          await flushPath(-1)
        }
      },
      {
        label: "新建文件夹",
        onClick: () => {
          ElMessageBox.prompt('请输入文件夹名', 'Next', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            inputPattern: /^[^<>:"/\\|?*]+$/,
            inputErrorMessage: '非法文件夹名',
          }).then(async ({ value }) => {
            console.log(paths + value + '/')
            let ret = await createDir(value, paths)
            if (ret) {
              await getPathFiles()
            }
          }).catch()
        }
      },
      {
        label: "上传文件",
        onClick: () => {
          //await onFileChange()
          ElMessage.warning("请使用右键菜单上传文件")
          ElMessage.warning("TODO")
        }
      },
      {
        label: "刷新",
        onClick: async () => {
          await getPathFiles()
        }
      },
      {
        label: "分享",
        onClick: async () => {
          await shareFiles()
        }
      },
    ]
  });
}

export default onContextMenu