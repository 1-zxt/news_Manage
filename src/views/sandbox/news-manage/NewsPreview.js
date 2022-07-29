import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import moment from 'moment';
import axios from 'axios';

//通过props拿到路径值
export default function NewsPreview(props) {

  const [newsInfo, setnewsInfo] = useState(null)
  useEffect(() => {
    // 该方法取得当前路径下的id
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      setnewsInfo(res.data)
    })
  }, [props.match.params.id])

  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const publishList = ["未发布", "待发布", "已上线", "已下线"]

  const colorList = ["black", "orange", "green", "red"]
  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              {/* moment需要npm安装  用法如下*/}
              <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH-mm-ss")}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{
                newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH-mm-ss") : "-"
              }</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态"><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
              <Descriptions.Item label="发布状态"><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>

            </Descriptions>
          </PageHeader>

          {/* 固定用法，否则返回的数据是<p>aaa</p> 不支持dom解析，防止用户写的js脚本，返回到前端来运行脚本进行脚本攻击，加了dangerouslySetInnerHTML属性后可以解析 */}
          <div dangerouslySetInnerHTML={
            { __html: newsInfo.content }
          } style={{
            margin: "0px 24px",
            border: "1px solid gray"
          }}>
          </div>
        </div>
      }
    </div>
  )
}
