import React, { useEffect, useState } from 'react'
import { Button, Table, notification } from 'antd'
import axios from 'axios'

export default function Audit() {

     const [dataSource, setdataSource] = useState([])
     const { roleId, region, author } = JSON.parse(localStorage.getItem("token"))


     useEffect(() => {
          const roleObj = {
               "1": "superadmin",
               "2": "admin",
               "3": "editor"
          }
          axios.get("/news?auditState=1&_expand=category").then(res => {
               const list = res.data
               setdataSource(roleObj[roleId] === "superadmin" ? list : [
                    // 首先自己能显示出来
                    ...list.filter(item => item.author === author),
                    //其次能显示相同地区的 并且也选出
                    ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
               ])
          })
     }, [roleId, region, author])

     const columns = [
          {
               title: '新闻标题',
               dataIndex: 'title',
               render: (title, item) => {
                    return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
               }
          },
          {
               title: '作者',
               dataIndex: 'author',
          },
          {
               title: "新闻分类",
               dataIndex: 'category',
               render: (category) => {
                    return <div>{category.title}</div>
               }
          },
          {
               title: "操作",
               render: (item) => {
                    return <div>
                         <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
                         <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
                    </div>
               }
          }
     ];

     const handleAudit = (item, auditState, publishState) => {
          setdataSource(dataSource.filter(data => data.id !== item.id))
          axios.patch(`/news/${item.id}`, {
               "auditState": auditState,
               "publishState": publishState
          }).then(res => {
               notification.info({
                    message: `通知`,
                    description:
                         `您可以到【审核管理/审核列表】中查看您的新闻的审核状态`,
                    placement: "bottomRight",
               })
          })

     }


     return (
          <div>
               <Table dataSource={dataSource} columns={columns}
                    pagination={{
                         pageSize: 5
                    }}
                    rowKey={item => item.id}
               />
          </div>
     )
}
