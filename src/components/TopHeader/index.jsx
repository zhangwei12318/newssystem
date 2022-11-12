import React from 'react'
import {useNavigate} from 'react-router-dom'
import {connect} from 'react-redux'
import {changeCollapsed} from '../../redux/actions/collapsed'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
const { Header } = Layout;


 function TopHeader(props) {
  const navigate=useNavigate()
  const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))
  //人物下拉选项
const menu = (
  <Menu
    items={[
      {
        key: '1',
        label:roleName,
        
      },
      {
        key: '2',
        danger: true,
        label: '退出',
        onClick:()=>{
          localStorage.removeItem('token')
          navigate('/login',{replace: true})
        }
      },
    ]}
  />
);
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: () => setCollapsed(!collapsed),
    })} */}
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={()=>{props.changeCollapsed()}} /> : < MenuFoldOutlined onClick={()=>{props.changeCollapsed()}} />}
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default connect(state=>(
  {isCollapsed:state.isCollapsed}),
  {
    changeCollapsed,
  }
)(TopHeader)