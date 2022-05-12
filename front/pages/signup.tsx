import React from 'react';
import { Form, Input, Button, Avatar, Typography } from 'antd';
import { RocketOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';

const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = (values: FormData) => {
    console.log('Received values of form: ', values);
    return;
    axios('http://localhost:3500/join', {
      method: 'POST',
      data: values,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          width: '80%',
          height: '25%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar size={70} icon={<RocketOutlined />} style={{ backgroundColor: '#1890ff' }} />
        <Title level={2}>회원가입</Title>
      </div>
      <Form
        name="normal_login"
        form={form}
        style={{ width: '80%', height: '75%' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="userId"
          label="아이디"
          rules={[
            { required: true, message: '아이디를 입력해주세요.' },
            { max: 10, message: '아이디는 10글자 미만으로 작성해주세요.' },
          ]}
        >
          <Input placeholder="사용할 ID" />
        </Form.Item>
        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input placeholder="이름" />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력해주세요.' },
            {
              pattern:
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: '이메일 형식으로 정확하게 입력해주세요.',
            },
          ]}
        >
          <Input placeholder="이메일" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>
        <Form.Item
          name="passwordCheck"
          label="비밀번호 확인"
          rules={[
            { required: true, message: '비밀번호 확인을 입력해주세요.' },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('비밀번호와 비밀번호 확인이 다릅니다.')),
            }),
          ]}
        >
          <Input.Password type="password" placeholder="비밀번호 확인" />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Button type="primary" htmlType="submit" className="login-form-button">
              가입하기
            </Button>

            <Link href="/">이미 아이디가 있다면? 로그인 하러가기</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SignUp;
