import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Row, Col, Card, List } from 'antd';
import _ from 'lodash'

export default function New() {
     const [list, setlist] = useState([])
     useEffect(() => {
          axios.get("/news?publishState=2&_expand=category").then(
               res => {
                    // Object.entries方法可以将数据改为二维数组 Home组件里有代码方法
                    console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
                    setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
               }
          )
     }, [])
     return (
          <div style={{ width: "95%", margin: '0 auto' }}>
               <PageHeader
                    className="全球大新闻"
                    title="查看新闻"
                    subTitle="This is a subtitle"
               />
               <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                         {list.map(
                              item => <Col span={8} key={item[0]}>
                                   <Card title={item[0]} bordered={true} hoverable={true}>
                                        <List
                                             size="small"
                                             header={<div>Header</div>}
                                             bordered
                                             dataSource={item[1]}
                                             pagination={{
                                                  pageSize: 3
                                             }}
                                             renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                        />
                                   </Card>
                              </Col>
                         )}
                    </Row>
               </div>
          </div>
     )
}
