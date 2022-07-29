import React, { useEffect, useState } from 'react'
import './index.css'


import { Layout, Menu } from 'antd';
import {
     UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux'

const { SubMenu } = Menu;
const { Sider } = Layout;


const iconList = {
     "/home": < UserOutlined />,
     "/user-manage/list": < UserOutlined />,
     "/right-manage/role/list": < UserOutlined />,
     "/right-manage/right/list": < UserOutlined />,
     "/news-manage/add": < UserOutlined />,
     "/news-manage/draft": < UserOutlined />,
     "/news-manage/category": < UserOutlined />,
     "/audit-manage/audit": < UserOutlined />,
     "/audit-manage/list": < UserOutlined />,
     "/publish-manage/unpublished": < UserOutlined />,
     "/publish-manage/published": < UserOutlined />,
     "/publish-manage/sunset": < UserOutlined />
}


function SideMenu(props) {
     const [menu, setMeun] = useState([])

     // axios去后台请求获取数据
     useEffect(() => {
          axios.get("http://localhost:5000/rights?_embed=children").then(
               res => {
                    setMeun(res.data)
               }
          )
     }, [])

     const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

     //pagepermisson标识是列表属性还是页面属性，有标识代表页面属性
     const checkPagePermission = (item) => {
          return item.pagepermisson === 1 && rights.includes(item.key)
     }

     //根据数据库自动生成列表
     const renderMenu = (menuList) => {
          return menuList.map(item => {
               if (item.children?.length > 0 && checkPagePermission(item)) {
                    return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                         {renderMenu(item.children)}
                    </SubMenu>
               }
               return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {

                    props.history.push(item.key)
               }}>{item.title}</Menu.Item>
          })
     }
     //设置变量控制默认高亮和刷新后仍然列表不关闭，仍然高亮
     const selectKeys = [props.location.pathname]
     const openKeys = ["/" + props.location.pathname.split("/")[1]]

     return (
          <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
               <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                    <div className="logo" >全球新闻发布管理系统</div>
                    <div style={{ flex: 1, "overflow": "auto" }}>
                         <Menu theme='dark' mode='inline' selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                              {renderMenu(menu)}
                         </Menu>
                    </div>
               </div>
          </Sider>

     )
}

// 返回语句isCollapsed大括号外面包了一个小括号，否则会被看作对象
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
     isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))