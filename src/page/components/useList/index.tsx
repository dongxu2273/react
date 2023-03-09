import React,{useState}from 'react';
import { Space, Table,Button,Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;
import styles from './index.module.scss'

interface DataType {
  key: string;
  name: string;
  age: number;
  phone:number;
}





const App: React.FC = () => {
  const navigate  =useNavigate();
  const [data,setData] = useState(JSON.parse(localStorage.getItem("data")||"[]"))

  const deleteUser = (record: { key: string; })=>{
    confirm({
      title: '确定删除吗？',
      cancelText:"取消",
      okText:"确认",
      icon: <ExclamationCircleFilled />,
      onOk() {
        const newData = data.filter((item: { key: string; })=>item.key!==record.key)
        setData(newData)
        localStorage.setItem("data",JSON.stringify(newData))
      },
      onCancel() {
      },
    });

  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'UseName',
      dataIndex: 'useName',
      key: 'useName',
      align:"center",
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      responsive: ['md'],
      align:"center"
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['lg'],
      align:"center"
    },
   
    {
      title: 'Action',
      key: 'action',
      align:"center"
  ,
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={()=>navigate("/useDetail",{state:{...record,isDetail:true}})}>详情</Button>
          <Button  onClick={()=>navigate("/useDetail",{state:{...record,isUpdate:true}})}>修改</Button>
          <Button onClick={ ()=>{deleteUser(record)}}>删除</Button>
        </Space>
      ),
    },
 
  
  ];

 return <div className={styles.box}>
  <Button onClick={()=>navigate("/useDetail",{state:{isRegister:true}})} className={styles.registerButton}>注册新用户</Button>
  <Table columns={columns} dataSource={data}  pagination={{total:data.length,defaultPageSize:5 }} />
 </div>

};

export default App;