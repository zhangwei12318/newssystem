import React from 'react'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import { Outlet } from 'react-router-dom'
import { Layout,Spin } from 'antd';
import { connect } from 'react-redux';
import "./index.css"
const {Content } = Layout;


 function NewsSandBox(props) {
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
  
          {/* 注册路由 */}
          <Spin size="large" spinning={props.isLoading}> <Outlet /></Spin>
        
        </Content>
      </Layout>
    </Layout>
  )
}

export default connect(
  state=>({isLoading:state.isLoading})
  )(NewsSandBox)