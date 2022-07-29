import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal

export default function RoleList() {
     const [dataSource, setdataSource] = useState([])
     const [rightList, setrightList] = useState([])
     const [currentRights, setcurrentRights] = useState([])
     const [currentId, setcurrentId] = useState(0)
     const [isModalVisible, setisModalVisible] = useState(false)

     const columns = [
          {
               title: "ID",
               dataIndex: "id",
               render: (id) => {
                    return <b>{id}</b>
               }
          }, {
               title: "角色名称",
               dataIndex: "roleName",
               render: (id) => {
                    return <b>{id}</b>
               }
          }, {
               title: "操作",
               render: (item) => {
                    return <div>
                         <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                         <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                              setisModalVisible(true)
                              setcurrentRights(item.rights)
                              setcurrentId(item.id)
                         }} />

                    </div>
               }
          }
     ]

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
               axios.delete(`http://localhost:5000/roles/${item.id}`)
          } else {
               let list = dataSource.filter(data => data.id === item.rightId)
               list[0].children = list[0].children.filter(data => data.id !== item.id)
               axios.delete(`http://localhost:5000/roles/${item.id}`)
          }

     }

     useEffect(() => {
          axios.get("http://localhost:5000/roles").then(res => {
               setdataSource(res.data)
          })
     }, [])

     useEffect(() => {
          axios.get("http://localhost:5000/rights?_embed=children").then(res => {
               setrightList(res.data)
          })
     }, [])


     const handleOk = () => {
          setisModalVisible(false);
          // 同步datassource
          setdataSource(dataSource.map(item => {
               if (item.id === currentId) {
                    return {
                         ...item,
                         rights: currentRights
                    }
               }
               return item
          }))
          //patch
          axios.patch(`http://localhost:5000/roles/${currentId}`, {
               rights: currentRights
          })
     };

     const handleCancel = () => {
          setisModalVisible(false);
     };
     // checkedKeys参数是官方封装的，点击时传回checkedKeys参数，是数组，相应减少或增加
     const onCheck = (checkedKeys) => {
          setcurrentRights(checkedKeys.checked)
     }

     return (
          <div>
               {/* rowKey={(item)=>item.id}这句话告诉table去找item.id作为唯一的key值 */}
               <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>

               <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Tree
                         checkable
                         onCheck={onCheck}
                         checkedKeys={currentRights}
                         checkStrictly={true}
                         treeData={rightList}

                    />
               </Modal>
          </div>
     )
}
