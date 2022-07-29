import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'

const { confirm } = Modal

export default function RightList() {
     const [dataSource, setdataSource] = useState([])

     useEffect(() => {
          axios.get("http://localhost:5000/rights?_embed=children").then(res => {
               const list = res.data
               list.forEach(item => {
                    if (item.children.length === 0) {
                         item.children = ""
                    }
               })
               setdataSource(list)
          })
     }, [])


     // antd组件库的使用 render，tag等
     const columns = [
          {
               title: "ID",
               dataIndex: "id",
               render: (id) => {
                    return <b>{id}</b>
               }
          },
          {
               title: "权限名称",
               dataIndex: "title"
          },
          {
               title: "权限路径",
               dataIndex: "key",
               render: (key) => {
                    return <Tag color="orange">{key}</Tag>
               }
          },
          {
               title: "操作",
               render: (item) => {
                    return <div>
                         <Button danger shape="circle" icon={<DeleteOutlined />}
                              onClick={() => confirmMethod(item)} />
                         <Popover content={
                              <div style={{ textAlign: "center" }}>
                                   <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}>
                                   </Switch>
                              </div>} title="页面配置" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                         </Popover>

                    </div>
               }
          }
     ];

     const switchMethod = (item) => {
          item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
          // console.log(item.pagepermisson)
          setdataSource([...dataSource])
     }


     //antd引入confirm组件
     const confirmMethod = (item) => {
          confirm({
               title: '您确定要删除吗?',
               icon: <ExclamationCircleOutlined />,
               onOk() {
                    deleteMethod(item);
               },
               onCancel() {
                    console.log('Cancel');
               },
          });
     }

     // 删除函数
     const deleteMethod = (item) => {
          // 当前页面同步状态+后端同步
          if (item.grade === 1) {
               setdataSource(dataSource.filter(data => data.id !== item.id))
               axios.delete(`http://localhost:5000/rights/${item.id}`)
          } else {
               let list = dataSource.filter(data => data.id === item.rightId)
               list[0].children = list[0].children.filter(data => data.id !== item.id)
               setdataSource([...dataSource])
               axios.delete(`http://localhost:5000/rights/${item.id}`)
          }

     }
     return (
          <div>
               <Table dataSource={dataSource} columns={columns} pagination={{
                    pageSize: 5
               }} />
          </div>
     )
}
