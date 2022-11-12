import React, { useEffect, useState } from 'react'
import { Table, Button, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
const { confirm } = Modal


export default function NewsPublish(props) {
    const [tableData, setTableData] = useState(null)
    useEffect(() => {
        setTableData(props.dataSource)
    }, [props.dataSource])
    //表格头
    const columns = [
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
            render: category => { return category.title }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        props.type === 1 ? <Button type="primary" onClick={() => handlePublish(item)} >发布</Button> :
                            props.type === 2 ? <Button type="primary" onClick={() => handleSunset(item)} >下线</Button> :
                                <Button type="primary" onClick={() => handleDelete(item)} >删除</Button>
                    }

                </div>
            }
        },
    ]
    //发布
    const handlePublish = (item) => {
        axios.patch(`news/${item.id}`, {
            publishState: 2,
            "publishTime":Date.now()
        }).then(res => {
            setTableData(tableData.filter(data => {
                return data.id !== item.id
            }))
            message.success("发布成功！")
        })
    }
    // 下线
    const handleSunset = (item) => {
        confirm({
            title: '你确定要下线该新闻吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                axios.patch(`news/${item.id}`, {
                    publishState: 3
                }).then(res => {
                    setTableData(tableData.filter(data => {
                        return data.id !== item.id
                    }))
                    message.success("下线成功！")
                })
            },
            onCancel() {

            },
        });

    }
    // 删除
    const handleDelete = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                axios.delete(`news/${item.id}`).then(res => {
                    setTableData(tableData.filter(data => {
                        return data.id !== item.id
                    }))
                    message.success("删除成功！")
                })
            },
            onCancel() {

            },
        });

    }
    return (
        <div>
            {
                tableData && <Table dataSource={tableData} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
            }
        </div>
    )
}

