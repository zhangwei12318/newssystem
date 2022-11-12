import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import { Button, Form, Input, message } from 'antd';
// import Particles from "react-tsparticles";
import ParticlesBg from 'particles-bg'
import './index.css'
import axios from 'axios';


export default function Login() {
  const navigate=useNavigate()
 const onFinish=(value)=>{
  axios.get(`http://localhost:5000/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then(res=>{
    if (res.data<1) {
      message.error("用户名或密码不匹配")
    }else{
      localStorage.setItem('token',JSON.stringify(res.data[0]))
        navigate('/home',{replace:false})
    }
    
  })
  
 }
  return (
    <div style={{ backgroundColor: "rgb(35,39,65)", height: "100%",overflow:"hidden" }}>
      
     <div className='formContainer'> 
     <div className='loginTitle'>全球新闻发布管理系统</div>
      <Form
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
           登录
          </Button>

        </Form.Item>
      </Form>
      </div>

      <ParticlesBg type='circle'  />
    </div>
  )
}
