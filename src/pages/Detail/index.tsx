import { memo, useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, TextArea, Space } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { getLocalData, setLocalData } from '@/utils';
import whatSApp from '@/assets/images/icons/whatSApp.svg';
import emailIcon from '@/assets/images/icons/email.svg';
import wechat from '@/assets/images/icons/wechat.svg';
import call from '@/assets/images/icons/call.svg';

interface CardInfo {
  ItemCoord?: Record<string, string>;
  Name: string;
  Value: string;
  Key: string;
}

interface Props {
  data: CardInfo[];
}

const ScanResult = (props: Props) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const arr = [];
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      arr.push({
        Name: key,
        Value: value,
      });
    }

    const updateData = {
      userId,
      name: values['姓名'],
      phone: values['手机'],
      email: values['邮箱'],
      data: arr,
    };

    const currentList = getLocalData('contactList') ?? [];

    const index = currentList.findIndex(
      (item: { userId: string }) => item.userId === updateData.userId,
    );
    console.log('index', index);
    if (index !== -1) {
      currentList.splice(index, 1, updateData);
    } else {
      currentList.push(updateData);
    }
    setLocalData('contactList', currentList);
    navigate('/');
  };

  const email = useMemo(
    () =>
      data.filter(
        (item: { Name: string; Value: string }) => item.Name === '邮箱',
      )[0]?.Value ?? '',
    [data],
  );
  const phone = useMemo(
    () =>
      data.filter(
        (item: { Name: string; Value: string }) => item.Name === '手机',
      )[0]?.Value ?? '',
    [data],
  );

  const eventName = useMemo(
    () =>
      data.filter(
        (item: { Name: string; Value: string }) => item.Name === 'EventName',
      )[0]?.Value ?? '',
    [data],
  );

  const addFriendInWeChat = (username: string, message: string) => {
    const url = `weixin://addfriend/${username}?hello=${encodeURIComponent(
      message,
    )}`;
    window.location.href = url;
  };

  const sendEmail = (email: string) => {
    const bodyText = `Hello, This is benny from ${eventName}`;
    window.location.href = `mailto:${email}?subject=邮件主题&body=${bodyText}`;
  };

  const addWhatApp = (phone: string) => {
    const bodyText = `Hello, This is benny from ${eventName}`;
    window.location.href = `https://wa.me/${phone}?text=${bodyText}`;
  };

  const callPhone = (phone:string)=>{
    window.location.href = `tel:${phone}`
  }

  useEffect(() => {
    const list = getLocalData('contactList') || [];
    const { data } = list.filter(
      (item: { userId: string }) => item.userId === userId,
    )[0];
    setData(data);
    data.forEach((item: CardInfo) => {
      form.setFieldValue(item.Name, item.Value);
    });
  }, []);

  return (
    <div>
      <div className="w-full h-10 flex justify-around items-center bg-white mb-2">
        <img
          width={45}
          height={45}
          src={emailIcon}
          onClick={() => {
            sendEmail(email);
          }}
        />
        <img
          width={40}
          height={40}
          src={whatSApp}
          onClick={() => {
            addWhatApp(phone);
          }}
        />
        {/* <img width={40} height={40} src={wechat} /> */}
        <img width={40} height={40} src={call} onClick={()=>{callPhone(phone)}} />
      </div>
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Save
          </Button>
        }>
        {data.map((item: CardInfo, index: number) => {
          if (item.Name === 'Notes' || item.Name === 'EventName') {
            return (
              <Form.Item key={index} name={item.Name} label={item.Name}>
                <TextArea
                  placeholder={item.Name}
                  maxLength={100}
                  rows={2}
                  showCount
                />
              </Form.Item>
            );
          }
          
          return (
            <Form.Item name={item.Name} key={index} label={item.Name}>
              <Input value={item.Value} clearable />
            </Form.Item>
          );
        })}
      </Form>
    </div>
  );
};
export default memo(ScanResult);
