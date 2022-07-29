import React from 'react'
import { Table } from 'antd'

export default function NewsPublish(props) {
     const columns = [
          {
               title: "新闻标题",
               dataIndex: "title",
               render: (title, item) => {
                    return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
               }
          },
          {
               title: "新闻分类",
               dataIndex: "category",
               render: (category) => {
                    return <div>{category.title}</div>
               }
          },
          {
               title: "操作",
               render: (item) => {
                    return <div>
                         {/* 在渲染按钮组件时，将对应id值传给相应组件，然后组件按钮用箭头函数写的，可以接收到id值，再将id值传给点击事件函数，这样再hooks组件中写函数时就知道删除或者更新哪个新闻 */}
                         {props.button(item.id)}
                    </div>
               }
          }
     ];

     return (
          <div>
               <Table dataSource={props.dataSource} columns={columns} pagination={{
                    pageSize: 5
               }}
                    rowKey={item => item.id} />
          </div>
     )
}
