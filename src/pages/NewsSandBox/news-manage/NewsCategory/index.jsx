import React, { useEffect, useState, useRef, useContext } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'


const { confirm } = Modal
const EditableContext = React.createContext(null);
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  //每次执行完axios请求就更新count，重新渲染页面
  useEffect(() => {
    //请求权限列表
    axios.get("/categories").then((res) => {
      setDataSource(res.data)
    })
  }, [])
  //失去焦点后的操作方法
  const handleSave = (record) => {
    // console.log(record);
    setDataSource(dataSource.map(item=>{
      if(item.id===record.id){
        return {
          id:item.id,
          title:record.title,
          value:record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{
      title:record.title,
      value:record.title
    })
  }
  //表格头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave,
      }),
    },

    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }
  // ----------------------------------------------*---------------------------------------------------------------
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }} />
    </div>
  )
}