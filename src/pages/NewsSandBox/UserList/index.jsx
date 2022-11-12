import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/UserForm';

const { confirm } = Modal
export default function UserList() {
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [dataSource, setDataSource] = useState([])
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  //每次执行完axios请求就更新count，重新渲染页面
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [updateOpen, setupdateOpen] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState({})
  //获取用户数据
  const {roleId,region}=JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    //请求权限列表
    axios.get("/users?_expand=role").then((res) => {
      // console.log(res.data);
      setDataSource(roleId===1?res.data:[...res.data.filter(item=>item.region===region)])
    })
  }, [count,roleId,region])
  // 请求区域列表
  useEffect(() => {
    axios.get("/regions").then((res) => {
      setRegionList(res.data)
      // console.log(res.data);
    })
  }, [])
  // 请求角色列表
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setRoleList(res.data)
    })
  }, [])
  //表格头
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[...regionList.map((item=>{
        return {
          text:item.title,
          value:item.value
        }
      })),{
        text:'全球',
        value:""
      }],
      onFilter: (value,item) => item.region===value,
      render: region => <b>{region ? region : '全球'}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => (role.roleName)
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />&nbsp;
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleupdate(item)} />
        </div>
      }
    },
  ]
  //删除提示
  function confirmMethod(item) {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // console.log(item);
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  //删除的方法
  const deleteMethod = (item) => {
    axios.delete(`/users/${item.id}`).then(res => setCount(count + 1))
  }
  //添加用户方法
  const addFormOk = () => {
    addForm.current.validateFields().then(res => {
      setOpen(false)
      addForm.current.resetFields()
      axios.post("/users", {
        ...res,
        "roleState": true,
        "default": false,
      }).then(res => setCount(count + 1))
    }).catch(err => {
      console.log(err);
    })
  }
  //改变用户状态的方法
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  //更新用户的方法
  const handleupdate = (item) => {
    setupdateOpen(true)
    setCurrent(item)
    if(item.roleId===1){
      setIsUpdateDisabled(true)
    }
    else{
      setIsUpdateDisabled(false)
    }
    setTimeout(() => {
      updateForm.current.setFieldsValue(item)
    }, 0);
  }
  //更新用户点击确认
  const updateFormOk = () => {
    updateForm.current.validateFields().then(res => {
      setupdateOpen(false)
      axios.patch(`/users/${current.id}`,res).then(res=>setCount(count+1))
      setIsUpdateDisabled(!isUpdateDisabled)
    })
    
  }
  return (
    <div>
      <Button type='primary' onClick={() => setOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

      {/* 弹出框 */}
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { 
          setOpen(false) 
          addForm.current.resetFields()
          setIsUpdateDisabled(false)
         }}
        onOk={addFormOk}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>

      <Modal
        open={updateOpen}
        title="更新用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => { 
          setIsUpdateDisabled(!isUpdateDisabled)
          setTimeout(() => {
            setupdateOpen(false)
          }, 0);
         }}
        onOk={()=>updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}  isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  )
}
