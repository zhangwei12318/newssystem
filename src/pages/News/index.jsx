import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row,List } from 'antd';
import { } from '@ant-design/icons';
import _ from 'lodash'
import { Link } from 'react-router-dom';


export default function News() {
    const [list,setList]=useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
           setList(Object.entries(_.groupBy(res.data,item=>item.category.title)))
        })
    },[])

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <Row gutter={[16,16]}>
               {
                list.map(item=>
                    <Col span={8} key={item[0]}>
                    <Card title={item[0]} bordered={false} hoverable={true}>
                        <List
                            size="small"
                            dataSource={item[1]}
                            pagination={{
                                pageSize:3
                            }}
                            renderItem={data => <List.Item> <Link className="list-group-item " to={`/detail/${data.id}`}>{data.title}</Link></List.Item>}
                        />
                    </Card>
                </Col>)
               }

            </Row>
        </div>
    )
}
