import ContextMenu from '@imengyu/vue3-context-menu'
import { paths, createDir, getPathFiles } from './files';
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
        onClick: () => { }
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
            ElMessage.success(value)
          }).catch()
        }
      },
    ]
  });
}

export default onContextMenu