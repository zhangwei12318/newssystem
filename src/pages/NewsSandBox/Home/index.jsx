import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { BarChartOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import ReactECharts from 'echarts-for-react';
import _ from 'lodash'
import { Link } from 'react-router-dom';
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [barDataList, setBarDataList] = useState([])
  const [pieDataList, setPieDataList] = useState([])
  const [open, setOpen] = useState(false)
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get("http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      // console.log(res.data);
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      // console.log(res.data);
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("http://localhost:5000/news?publishState=2&_expand=category").then(res => {
      setBarDataList(_.groupBy(res.data, item => item.category.title))
     const current=_.groupBy(res.data.filter(item=>item.author===username),item=>item.category.title)
     var list=[];
     for (const key in current) {
      list.push({
        name:key,
        value:current[key].length
      })
     }
     setPieDataList(list)
    })
  }, [username])

  const renderView = (data) => {
    const options = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    }
    return options
  }

  const option = {
    title: {
      text: '当前用户新闻分类图示',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '发布数量',
        type: 'pie',
        radius: '50%',
        data: [
          ...pieDataList
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true} icon={<BarChartOutlined/>}>

              <List
                size="small"
                dataSource={viewList}
                renderItem={item => <List.Item><Link className="list-group-item " to={`/news-manage/preview/${item.id}`} >{item.title}</Link></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                size="small"
                dataSource={starList}
                renderItem={item => <List.Item><Link className="list-group-item " to={`/news-manage/preview/${item.id}`} >{item.title}</Link></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => setOpen(true)} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : "全球"}</b>&nbsp;&nbsp;
                    {roleName}
                  </div>
                }
              />
            </Card>
          </Col>
          <ReactECharts option={renderView(barDataList)} style={{ height: "400px", width: "90%" }} />
        </Row>
        <Drawer title="个人新闻分类" placement="right" onClose={() => { setOpen(false) }} open={open} width="40%">
          <ReactECharts option={option} />
        </Drawer>
      </div>
    </div>
  )
}
