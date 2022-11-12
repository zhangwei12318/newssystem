import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Descriptions, message, PageHeader } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

import axios from 'axios';
import moment from 'moment';

let mark=0;
export default function Detail() {
    const { id } = useParams()
    const [newsInfo, setNewsInfo] = useState(null)
    
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${id}`, {
                view: res.view + 1
            })
        })
        return ()=>{
            mark=0;
        }
    }, [id])
    const handleStar = () => {
       if (mark) {
        message.info("您已经点过赞啦！")
       }
       else{
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${id}`, {
            star: newsInfo.star + 1
        })
        mark++;
       }
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.category.title}&nbsp;
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
                        </div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量" contentStyle={{ color: "green" }}>{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量" contentStyle={{ color: "green" }}>{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量" contentStyle={{ color: "green" }}>0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ margin: "0 25px", border: "1px solid gray" }}>
                    </div>
                </div>
            }
        </div>
    )
}
