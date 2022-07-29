import React, { useEffect, useState, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps
const { Option } = Select


export default function NewsAdd(props) {
     const [current, setCurrent] = useState(0)
     const [categoryList, setCategoryList] = useState([])
     // 存储对象信息
     const [formInfo, setformInfo] = useState({})
     //存储content信息
     const [content, setContent] = useState("")
     const NewsForm = useRef(null)

     const handleNext = () => {
          //校验功能
          if (current === 0) {
               NewsForm.current.validateFields().then(res => {
                    console.log(res);
                    // 收集表单信息 存储起来
                    setformInfo(res)
                    setCurrent(current + 1)
               }).catch(error => {
                    console.log(error);
               })
          } else {
               // 判断文本框内容不能为空
               if (content === "" || content.trim() === "<p></p>") {
                    message.error("新闻内容不能为空")
               }
               setCurrent(current + 1)
          }
     }
     const handlePrevious = () => {
          setCurrent(current - 1)
     }

     const layout = {
          labelCol: {
               span: 4
          },
          wrapperCol: {
               span: 20
          }
     }

     useEffect(() => {
          // 该方法取得当前路径下的id
          axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
               let { title, categoryId, content } = res.data
               NewsForm.current.setFieldsValue({
                    title,
                    categoryId
               })

               setContent(content)
          })
     }, [props.match.params.id])



     useEffect(() => {
          axios.get("/categories").then(res => {
               setCategoryList(res.data)
          })
     }, [])

     //auditState是后台提供字段，为0代表草稿箱为1代表列表箱
     const handleSave = (auditState) => {
          axios.patch(`/news/${props.match.params.id}`, {
               ...formInfo,
               "content": content,
               "auditState": 0,
          }).then(res => {
               props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

               notification.info({
                    message: `通知`,
                    description:
                         `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                    placement: "bottomRight",
               });
          })
     }
     return (
          <div>
               <PageHeader
                    className="site-page-header"
                    onBack={() => props.history.goBack()}
                    title="更新新闻"
                    subTitle="This is a subtitle"
               />
               <Steps current={current}>
                    <Step title="基本信息" description="新闻标题，新闻分类." />
                    <Step title="新闻内容" description="新闻主题内容" />
                    <Step title="新闻提交" description="保存草稿或者提价审核" />
               </Steps>

               <div style={{ marginTop: "50px" }}>
                    <div className={current === 0 ? '' : style.active}>
                         <Form {...layout}
                              name="basic"
                              ref={NewsForm}
                         >
                              <Form.Item
                                   label="新闻标题"
                                   name="title"
                                   rules={[
                                        {
                                             required: true,
                                             message: 'Please input your username!',
                                        },
                                   ]}
                              >
                                   <Input />
                              </Form.Item>
                              <Form.Item
                                   label="新闻分类"
                                   name="categoryId"
                                   rules={[
                                        {
                                             required: true,
                                             message: 'Please input your username!',
                                        },
                                   ]}
                              >
                                   <Select>
                                        {
                                             categoryList.map(item =>
                                                  <Option value={item.id} key={item.id}>{item.title}</Option>
                                             )
                                        }
                                   </Select>
                              </Form.Item>
                         </Form>
                    </div>
                    <div className={current === 1 ? '' : style.active}>
                         {/* 子传父 回调函数调用 */}
                         <NewsEditor getContent={(value) => {
                              setContent(value)
                         }} content={content}></NewsEditor>
                    </div>
                    <div className={current === 2 ? '' : style.active}>

                    </div>
               </div>

               <div style={{ marginTop: "50px" }}>
                    {
                         current === 2 && <span>
                              {/* auditState传0代表草稿箱，传1代表审核列表,2代表已经发布 */}
                              <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                              <Button danger onClick={() => handleSave(1)}> 提交审核</Button>
                         </span>
                    }
                    {
                         current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                    }
                    {
                         current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                    }
               </div>
          </div >
     )
}
