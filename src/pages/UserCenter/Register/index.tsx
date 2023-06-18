import React, { useState, useEffect, useRef } from 'react';

import { Button, Form, Input, NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { type RegisterParams, sendEmail, register } from '@/api/route';
import { getLocalData } from '@/utils';

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(timerRef.current);
      setIsSendingCode(false);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    const res = await form.validateFields(['email']);
    if (!res) return;

    const email = form.getFieldValue('email');
    await sendEmail(email);

    setIsSendingCode(true);
    setCountdown(60);

    timerRef.current = window.setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
  };

  const handleSubmit = async (values: RegisterParams) => {
    const res = await register({
      visitorId: localStorage.getItem('visitor-id')!,
      ...values,
    });

    if (res) {
      const userId = res.id;
      localStorage.setItem('user', JSON.stringify(res));
      localStorage.setItem('token', userId);
      navigate(-1);
    }
  };

  return (
    <div className="h-full bg-white">
      <div style={{ height: '45px' }}>
         
        <NavBar
          onBack={() => {
            navigate(-1);
          }}
        >
          SignUp
        </NavBar>
      </div>
      <div className="mt-8">
        <Form
          form={form}
          layout="horizontal"
          mode="card"
          footer={
            <Button block type="submit" color="primary" size="large">
              Sign Up
            </Button>
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: '请输入邮箱' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="Code"
            extra={
              <Button
                fill="none"
                disabled={isSendingCode || countdown > 0}
                style={{ color: '#1890ff' }}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码'}
              </Button>
            }
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;
