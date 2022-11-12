import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import { } from '@ant-design/icons'
import { Layout, Menu } from 'antd';
import "./index.css"

const { Sider } = Layout;

 function SideMenu(props) {
  const navigate = useNavigate();
  const pathname=useLocation().pathname;
  const [menu, setMenu] = useState([])
  const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
  //发起请求获取侧边栏数据
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // console.log(res.data);
      setMenu(res.data)

    })
  }, [])
  //生成侧边栏项
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    }
  }
  // 根据获取的数据生成侧边栏
  const items = menu.map(itemObj => {
    //判断是否要展示到侧边栏
    if (itemObj.pagepermisson === 1&&rights.includes(itemObj.key)) {
      
      //判断是否多级菜单
      if (itemObj.children.length > 0) {
        const childItems = itemObj.children.map((childItemsObj) => {
          //判断是否要展示到侧边栏
          if (childItemsObj.pagepermisson === 1&&rights.includes(childItemsObj.key)) {
            return getItem(childItemsObj.title, childItemsObj.key)
          }
          return null;
        })
        return getItem(itemObj.title, itemObj.key, null, childItems)
      }
      else {
        return getItem(itemObj.title, itemObj.key)
      }
    }
    return null
  })
  //点击后跳转路由
  function onClick(e) {
    // console.log(items);
    // console.log(e);
    navigate(e.key, {
      replace: false,
    })
  }
 
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo">全球新闻发布系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={['/'+pathname.split('/')[1]]}
            items={items}
          /></div>
          </div>
    </Sider>
  )
}

export default connect(
  state=>({isCollapsed:state.isCollapsed})
  )(SideMenu)