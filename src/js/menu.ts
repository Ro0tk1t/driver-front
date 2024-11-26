import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import ContextMenu from '@imengyu/vue3-context-menu'
import type { MenuOptions } from '@imengyu/vue3-context-menu';
import { paths, createDir, getPathFiles, flushPath } from './files';

export const showMenu = ref(false)
export const options = reactive<MenuOptions>({
  iconFontClass: 'iconfont',
  zIndex: 3,
  //minWidth: 190,
  maxWidth: 300,
  x: 500,
  y: 200,
})
export const onContextMenu1 = (e: MouseEvent) => {
  e.preventDefault();
  options.x = e.x;
  options.y = e.y;
  showMenu.value = true;
};

export async function newDir() {
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
          newDir()
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