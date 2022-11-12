import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd';
import axios from 'axios';
import NewsEditor from '../../../../components/NewsEditor';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;
const { Option } = Select
export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const [categoriesList, setCategoriesList] = useState([])
  const NewsForm = useRef(null)
  const user = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoriesList(res.data)
    })
  },[])
  const handleSave = (auditState) => {
    axios.post("/news", {
      ...formInfo,
      "content": content,
      "region": user.region ? user.region : "全球",
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 1615778911028
    }).then(res => {
      navigate(auditState===0?"/news-manage/draft":"/audit-manage/list")
      notification.info({
        message: "通知",
        description:
          `您可以到${auditState===0?'草稿箱':"审核列表"}中查看您的新闻`,
        placement:"bottomRight"
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类." />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: '50px' }}>
        <div style={current === 0 ? { display: "block" } : { display: "none" }}>
          <Form
            ref={NewsForm}
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Select>
                {categoriesList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div style={current === 1 ? { display: "block" } : { display: "none" }}>
          <NewsEditor getContent={(value) => { setContent(value) }} />
        </div>
        <div style={current === 2 ? { display: "block" } : { display: "none" }}></div>
      </div>
      {/* 按钮 */}
      <div style={{ marginTop: '100px' }}>
        {
          current < 2 ? <Button type='primary' onClick={() => {
            if (current === 0) {
              NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1)
              }).catch(error => console.log(error))
            } else {
              if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
              } else {
                setCurrent(current + 1)
              }
            }
          }}>下一步</Button> :
            <span><Button onClick={() => handleSave(0)}>保存草稿箱</Button><Button onClick={() => handleSave(1)}>提交审核</Button></span>
        }
        {
          current > 0 && <Button type='primary' onClick={() => setCurrent(current - 1)}>上一步</Button>
        }
      </div>
    </div>
  )
}
