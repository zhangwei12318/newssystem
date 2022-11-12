import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from 'moment';


export default function NewsPreview() {
  const { id } = useParams()
  const [newsInfo,setNewsInfo]=useState(null)
  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
      setNewsInfo(res.data)
    })
  },[id])
  return (
    <div>
      {
      newsInfo&& <div>
        <PageHeader
        onBack={() => window.history.back()}
        title={newsInfo.title}
        subTitle={newsInfo.category.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态" contentStyle={{color:'red'}}>{newsInfo.auditState===0?"未审核":newsInfo.auditState===1?"审核中":newsInfo.auditState===2?"已通过":"未通过"}</Descriptions.Item>
          <Descriptions.Item label="发布状态" contentStyle={{color:"red"}}>{newsInfo.publishState===0?"未发布":newsInfo.publishState===1?"待发布":newsInfo.publishState===2?"已上线":"已下线"}</Descriptions.Item>
          <Descriptions.Item label="访问数量" contentStyle={{color:"green"}}>{newsInfo.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量" contentStyle={{color:"green"}}>{newsInfo.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量" contentStyle={{color:"green"}}>0</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div dangerouslySetInnerHTML={{
            __html:newsInfo.content
          }} style={{margin:"0 25px",border:"1px solid gray"}}>
          </div>
      </div>
      }
    </div>
  )
}
