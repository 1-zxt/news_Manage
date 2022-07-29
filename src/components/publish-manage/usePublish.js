import { notification } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
// 自定义的hooks
function usePublish(type) {

     const handlePublish = (id) => {
          console.log(id);
          setdataSource(dataSource.filter(item => item.id !== id))

          axios.patch(`/news/${id}`, {
               "publishState": 2,
               "publishTime": Date.now()
          }).then(
               res => {
                    notification.info({
                         message: `通知`,
                         description: `您可以到【发布管理/已经发布】中查看你的新闻`,
                         placement: "bottomRight"
                    })
               }
          )
     }

     const handleSunset = (id) => {
          console.log(id);
          setdataSource(dataSource.filter(item => item.id !== id))
          axios.patch(`/news/${id}`, {
               "publishState": 3
          }).then(
               res => {
                    notification.info({
                         message: `通知`,
                         description: `您可以到【发布管理/已下线】中查看你的新闻`,
                         placement: "bottomRight"
                    })
               }
          )
     }

     const handleDelete = (id) => {
          console.log(id);
          setdataSource(dataSource.filter(item => item.id !== id))
          axios.delete(`/news/${id}`).then(
               res => {

                    notification.info({
                         message: `通知`,
                         description: `您已经删除了你的新闻`,
                         placement: "bottomRight"
                    })
               }
          )
     }
     const [dataSource, setdataSource] = useState([])
     const { username } = JSON.parse(localStorage.getItem("token"))

     useEffect(() => {
          // axios不加方法默认get方法获取数据
          axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
               // console.log(res.data);
               setdataSource(res.data)
          })
     }, [username, type])


     return {
          dataSource,
          handlePublish,
          handleSunset,
          handleDelete
     }
}

export default usePublish