import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Table, Button, message } from 'antd'
import { Link } from 'react-router-dom';


export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      setDataSource(roleId === 1 ? res.data : [...res.data.filter(item => item.region === region)])
    })
  }, [roleId, region])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => { return category.title }
    },

    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={() => handleAudit(item, 2, 1)} />&nbsp;&nbsp;
          <Button type="danger" shape="circle" icon={<CloseOutlined />} onClick={() => handleAudit(item, 3, 0)} />
        </div>
      }
    },
  ]
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))

    axios.patch(`news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      if (publishState) {
        message.success("审核通过！")
      } else {
        message.warning('成功驳回！')
      }
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
