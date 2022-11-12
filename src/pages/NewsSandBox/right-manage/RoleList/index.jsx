import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { UnorderedListOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function RoleList() {
  //table数据
  const [dataSource, setDataSource] = useState([])
  //控制弹出框的显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  //权限数据 
  const [rightList, setRightList] = useState([])
  //弹出框数据
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [count, setCount] = useState(0)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalOpen(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
          }} />

        </div>
      }
    },
  ];
  useEffect(() => {
    axios.get('/roles').then((res) => {
      setDataSource(res.data)
    })
  }, [count])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setRightList(res.data)
    })
  }, [count])
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
    axios.delete(`/roles/${item.id}`).then(() => setCount(count + 1))
  }
  //弹出框
  const handleOk = () => {
    setIsModalOpen(false)
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    }).then(()=>setCount(count+1))
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly
        />
      </Modal>
    </div>
  )
}
