import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'


const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  //每次执行完axios请求就更新count，重新渲染页面
  const [count, setCount] = useState(0)
  useEffect(() => {
    //请求权限列表
    axios.get("/rights?_embed=children").then((res) => {
      res.data.map((dataItem) => dataItem.children.length < 1 ? delete dataItem.children : dataItem)
      // console.log(res.data);
      setDataSource(res.data)
    })
  }, [count])
  //表格头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '权限操作',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: key => <Tag color="green">{key}</Tag>
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;
          <Popover content={<div style={{ textAlign: 'center' }}><Switch defaultChecked={item.pagepermisson} onChange={() => switchMethod(item)} /></div>}
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? '' : "click"}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
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
    // setDataSource(dataSource.filter(data=>data.id!==item.id)) 
    //判断是一级还是二级
    if (item.grade === 1) {
      axios.delete(`/rights/${item.id}`).then(() => setCount(count + 1))
    }
    else {
      axios.delete(`/children/${item.id}`).then(() => setCount(count + 1))
    }
  }
  //修改配置项的方法
  const switchMethod = (item) => {
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson:item.pagepermisson===1?0:1
      })
    }
    else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson:item.pagepermisson===1?0:1
      })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
