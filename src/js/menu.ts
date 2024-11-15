import ContextMenu from '@imengyu/vue3-context-menu'


const onContextMenu = (e : MouseEvent) => {
  //prevent the browser's default menu
  e.preventDefault();
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      { 
        label: "A menu item", 
        onClick: () => {
          alert("You click a menu item");
        }
      },
      { 
        label: "A submenu", 
        children: [
          { label: "新建文件夹" },
          { label: "Item2" },
          { label: "Item3" },
        ]
      },
    ]
  }); 
}

export default onContextMenu