import React from 'react';
import { Form, Input, Button, Checkbox, Col, Row, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginForm = () => {
  const router = useRouter();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    axios('http://localhost:3500/login', {
      method: 'POST',
      data: values,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
        if (res?.data?.userIdx) {
          router.push({
            pathname: '/board',
            query: { userIdx: res.data.userIdx },
          });
        }
      })
      .catch((err) => {
        message.error(err?.response?.data);
        console.dir(err);
      });
  };

  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Form name="normal_login" onFinish={onFinish} style={{ width: '30%' }}>
        <Form.Item name="userId" rules={[{ required: true, message: '아이디를 입력해주세요.' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="아이디 입력"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="비밀번호"
          />
        </Form.Item>
        {/* <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item> */}

        <Form.Item>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              로그인
            </Button>
            <div>
              <Link href="/signup">계정이 없으신가요? 회원가입하러가기</Link>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginForm;
