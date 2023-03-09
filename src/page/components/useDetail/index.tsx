import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from "react-router-dom";
import {
  Button,Form,Input,Modal, Select} from 'antd';
  import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.module.scss'
const { Option } = Select;
const { confirm } = Modal;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {state} = useLocation();
  const data =JSON.parse(localStorage.getItem("data")||"[]")
  useEffect(()=>{
    form.setFieldsValue({
      useName: state?.useName,
      phone: state?.phone,
      age: state?.age
    })
  },[state])

  const useNameValidator = ({
    validator(_:object, value:string) {
      if (!/^[a-zA-Z_]([a-zA-Z0-9_]+){3,12}$/.test(value)&&value) {
        return Promise.reject(new Error("用户名以字母或下划线开头，包含字母、数字、以及下划线 4-12位"));
      } else {
       const isRepetition=  data.filter((item :{ useName: string; })=>item.useName===value)
       if(isRepetition.length>0) {
        if(  isRepetition[0]?.age!==form.getFieldValue("age")) {
        return Promise.resolve();
        }else {
          return Promise.reject(new Error("用户名重复"));
        }
       }else {
        return Promise.resolve();
       }
          }
    }
      
    

  })

  const phoneValidator =  ({
    validator(_:object, value:string) {
      if (!/^1[3456789]\d{9}$/.test(value)&&value) {
        return Promise.reject(new Error("请输入正确格式的手机号"));
      } else {
        const isRepetition=  data.filter((item :{ phone: string; })=>item.phone===value)
        if(isRepetition.length>0) {
         return Promise.reject(new Error("手机号重复"));
        }else {
          return Promise.resolve();
        }
      }
    }
  })

  const ageValidator = ({
    validator(_:object, value:number) {   
      if ((value <= 0 || value > 149)&&value ) {
        return Promise.reject(new Error("年龄不能小于1或大于150"));
      } else {
        return Promise.resolve();
      }
    }
  })
  const onFinish = (values: any) => {
    if(state.isRegister) {
      const newData = [...data,{...values,key:values.phone}]
      localStorage.setItem("data",JSON.stringify(newData))
      navigate(-1)
    }else if (state.isUpdate) {
      confirm({
        title: '确定修改吗？',
        cancelText:"取消",
        okText:"确认",
        icon: <ExclamationCircleFilled />,
        onOk() {
          const newData= data.map((item: { phone: any; useName: any; age: any; })=>{
            if(item.phone===values.phone){
              item.useName=values.useName;
              item.age=values.age;
            }
            return item
          })
          localStorage.setItem("data",JSON.stringify(newData))
          navigate(-1)
        },
        onCancel() {
        },
      });
    }

  };


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
  <div className={styles.box}>
      <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
      disabled={state.isDetail}
    >
      <Form.Item
        name="useName"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
          useNameValidator
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="age"
        label="年龄"
        rules={[{ required: true, message: '请输入年龄', whitespace: true },ageValidator]}
      >
        <Input type="number"/>
      </Form.Item>

      <Form.Item
        name="phone"
        label="手机号"
        rules={[{ required: true, message: '请输入手机号' }, state.isUpdate?{}:phoneValidator]}
      >
        <Input addonBefore={prefixSelector} style={{ width: '100%' }}  type="number"  disabled={state?.isUpdate}/>
      </Form.Item>
      {(state?.isUpdate||state?.isRegister)&&  
      <Form.Item {...tailFormItemLayout}>
       <div className={ styles.updateButton}>
         <Button type="primary" htmlType="submit">
         {state.isUpdate? "修改":"提交"}
        </Button>
          <Button onClick={()=>navigate(-1)}>返回</Button>
              </div>
      </Form.Item>
      }
     
    </Form>
  
    {state?.isDetail&&  <div className={styles.backButton}>
        <Button onClick={()=>navigate(-1)}>返回</Button></div>}
  </div>
  );
};

export default App;