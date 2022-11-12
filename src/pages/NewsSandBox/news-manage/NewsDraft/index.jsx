import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tooltip,notification } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'
import { Link } from 'react-router-dom';

const { confirm } = Modal

export default function NewDraft() {
  //table数据
  const [dataSource, setDataSource] = useState([])
  const [count, setCount] = useState(0)
  const { username } = JSON.parse(localStorage.getItem("token"));

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <Link className="list-group-item " to={`/news-manage/preview/${item.id}`}>{title}</Link>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Tooltip title="删除新闻">
            <Button danger shape="circle" size="middle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} /></Tooltip>&nbsp;
          <Link className="list-group-item " to={`/news-manage/update/${item.id}`}><Tooltip title="更新新闻"> <Button shape="circle" size="middle" icon={<EditOutlined />} /> </Tooltip></Link>&nbsp;
          <Tooltip title="提交审核">
            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item)} /></Tooltip>

        </div>
      }
    },
  ];
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
      setDataSource(res.data)
    })
  }, [username, count])

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
    axios.delete(`/news/${item.id}`).then(() => setCount(count + 1))
  }
  //提交审核
  const handleCheck=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState: 1
    }).then(res=>{
      notification.info({
        message: "通知",
        description:
          `您可以到审核列表中查看您的新闻`,
        placement:"bottomRight"
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />

    </div>
  )
}
