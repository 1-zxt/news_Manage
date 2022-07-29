import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import { Switch, Route, Redirect } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'
// 动态创建路由，自己写一个映射数组，规定路径对应组件，然后从后台获取数据
const LocalRouterMap = {
     "/home": Home,
     "/user-manage/list": UserList,
     "/right-manage/role/list": RoleList,
     "/right-manage/right/list": RightList,
     "/news-manage/add": NewsAdd,
     "/news-manage/draft": NewsDraft,
     "/news-manage/category": NewsCategory,
     "/news-manage/preview/:id": NewsPreview,
     "/news-manage/update/:id": NewsUpdate,
     "/audit-manage/audit": Audit,
     "/audit-manage/list": AuditList,
     "/publish-manage/unpublished": Unpublished,
     "/publish-manage/published": Published,
     "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {

     const [BackRouteList, setBackRouteList] = useState([])
     useEffect(() => {
          Promise.all([
               axios.get("http://localhost:5000/rights"),
               axios.get("http://localhost:5000/children"),
          ]).then(res => {
               // console.log(res)
               setBackRouteList([...res[0].data, ...res[1].data])
               // console.log(BackRouteList)
          })
     }, [])

     // 取得当前登录用户的角色权力属性
     const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

     const checkRoute = (item) => {
          // 检测有这个路径，并且配置开关permission是1，开着的,Routepermission是判断这个预览功能路由特有字段，也指登录用户有页面集权限，有预览路由权限
          return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
     }
     // 检测当前登录的用户是否有该路径权限
     const checkUserPermission = (item) => {
          return rights.includes(item.key)
     }

     return (
          <Spin size="large" spinning={props.isSpinning}>
               <Switch>
                    {
                         BackRouteList.map(item => {
                              if (checkRoute(item) && checkUserPermission(item)) {
                                   return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                              }
                              return null
                         }
                         )
                    }

                    <Redirect from="/" to="/home" exact />
                    {
                         BackRouteList.length > 0 && <Route path="*" component={Nopermission} />
                    }
               </Switch>
          </Spin>
     )
}

const mapStateToProps = ({ SpinningReducer: { isSpinning } }) => (
     { isSpinning }
)

export default connect(mapStateToProps)(NewsRouter)