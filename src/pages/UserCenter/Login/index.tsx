import React, { useState, useEffect, useRef } from 'react';

import { Button, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { login, type LoginParams, sendEmail } from '@/api/route';

function LoginForm() {
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

  const handleSubmit = async (values: LoginParams) => {
    const res = await login({
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
    <div className="pt-8">
      <Form
        form={form}
        layout="horizontal"
        mode="card"
        footer={
          <div>
            <Button block type="submit" color="primary" size="large">
              Log In
            </Button>
            <div className="mt-1 text-right">
              Don’t have an account?{' '}
              <span
                className="text-[#09090b] font-semibold underline"
                onClick={() => {
                  navigate('/register');
                }}
              >
                Sign up Now
              </span>
            </div>
          </div>
        }
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: '请输入邮箱' }]}
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
  );
}

export default LoginForm;
