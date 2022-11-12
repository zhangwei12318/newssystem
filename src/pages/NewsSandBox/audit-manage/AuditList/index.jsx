import React, { useEffect, useState } from 'react'
import { Table, Tag, Button,notification } from 'antd'
import {  } from '@ant-design/icons';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  const {username}=JSON.parse(localStorage.getItem('token'))
  const navigate=useNavigate()
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      // console.log(res.data);
      setDataSource(res.data)
    })
  },[username])
  //表格头
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => {return category.title}
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: auditState => auditState===1?<Tag color="orange">审核中</Tag>:auditState===2?<Tag color="green">已通过</Tag>:<Tag color="red">未通过</Tag>
    },
    {
      title: '  操作',
      render: (item) => {
        return <div>
          {
            item.auditState===2?<Button type='primary' onClick={()=>handlePublish(item)}>发布</Button>:
            item.auditState===1?<Button type='danger' onClick={()=>handleRervert(item)}>撤销</Button>:
            <Button onClick={()=>handleUpdate(item)}>更新</Button>
          }
         
        </div>
      }
    },
  ]
  //撤回方法
  const handleRervert=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message: "通知",
        description:
          `撤销成功！您可以到草稿箱中查看您的新闻`,
        placement:"bottomRight"
      });
    })
  }
  //更新方法
  const handleUpdate=(item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }
  //发布方法
const handlePublish=(item)=>{
  setDataSource(dataSource.filter(data=>data.id!==item.id))
  axios.patch(`/news/${item.id}`,{
    "publishTime":Date.now(),
    "publishState":2
  }).then(res=>{
    notification.info({
      message: "通知",
      description:
        `发布成功！您可以到已发布中查看您的新闻`,
      placement:"bottomRight"
    });
  })

}
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>
    </div>
  )

}
