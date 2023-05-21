import { memo, useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, TextArea, Space } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { getLocalData, setLocalData } from '@/utils';
import whatAppIcon from '@/assets/images/icons/whatsapp.svg';
import emailIcon from '@/assets/images/icons/email.svg';
import addressIcon from '@/assets/images/icons/address.svg';
import call from '@/assets/images/icons/call.svg';
import { ItemInfo, XFCardResult } from '../ScanResult';


type Result = XFCardResult<ItemInfo<string>[]> & {
  eventName:string;
  notes:string;
}

interface Props {
  data: Result;
}

const ScanResult = (props: Props) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Result>({} as Result);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {

    const updateData = {
      userId,
      ...values
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

  const phone = useMemo(() => {
    if(Object.keys(data).length>0){
      return data?.telephone[0]?.item.number
    }
  } , [data])

  const addFriendInWeChat = (username: string, message: string) => {
    const url = `weixin://addfriend/${username}?hello=${encodeURIComponent(
      message,
    )}`;
    window.location.href = url;
  };

  const sendEmail = (email: string) => {
    const bodyText = `Hello, This is benny from ${data?.eventName ?? 'xxx'}`;
    window.location.href = `mailto:${email}?subject=邮件主题&body=${bodyText}`;
  };

  const addWhatApp = (phone: string) => {
    const bodyText = `Hello, This is benny from ${data?.eventName ?? 'xxx'}`;
    console.log('2',`https://wa.me/${phone.replaceAll(/[(|)|+]/g,'')}?text=${bodyText}`);
    window.location.href = `https://wa.me/${phone.replaceAll(/[(|)|+]/g,'')}?text=${bodyText}`;
  };

  const callPhone = (phone:string)=>{
    window.location.href = `tel:${phone}`
  }

  const checkMap =(address:string)=>{
    console.log('address',address)
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${address}`
  }

  useEffect(() => {
    const list = getLocalData('contactList') || [];
    const data = list.filter(
      (item: { userId: string }) => item.userId === userId,
    )[0];
    setData(data);
  }, []);

  useEffect(() => {
    form.setFieldsValue(data)
   }, [form, data])

  return (
    <div>
      <div className="w-full h-10 flex justify-around items-center bg-white mb-2">
        <img
          width={45}
          height={45}
          src={emailIcon}
          onClick={() => {
            sendEmail(data.email[0].item);
          }}
        />
        <img
          width={40}
          height={40}
          src={whatAppIcon}
          onClick={() => {
            addWhatApp(phone!);
          }}
        />
        <img width={40} height={40} src={addressIcon}onClick={()=>{
           checkMap(data.origin_address[0].item)
        }} 
        />
        <img width={40} height={40} src={call} onClick={()=>{callPhone(phone!)}} />
      </div>
      <Form
        form={form}
        layout="horizontal"
        initialValues={data}
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Save
          </Button>
        }>
        {data?.formatted_name &&
          data.formatted_name.length > 0 &&
          data.formatted_name.map((item, index) => {
            return (
              <Form.Item
                name={['formatted_name', index, 'item']}
                key={'formatted_name' + index}
                label="Name">
                <Input placeholder="Name" />
              </Form.Item>
            );
          })}

        {data?.nickname &&
          data.nickname.length > 0 &&
          data.nickname.map((item, index) => {
            return (
              <Form.Item
                name={['nickname', index, 'item']}
                key={'nickname' + index}
                label="NickName">
                <Input placeholder="NickName" />
              </Form.Item>
            );
          })}

        {data?.title &&
          data.title.length > 0 &&
          data.title.map((item, index) => {
            return (
              <Form.Item
                name={['title', index, 'item']}
                key={'title' + index}
                label="Title">
                <Input placeholder="Title" />
              </Form.Item>
            );
          })}

        {data?.origin_address &&
          data.origin_address.length > 0 &&
          data.origin_address.map((item, index) => {
            return (
              <Form.Item
                name={['origin_address', index, 'item']}
                key={'origin_address' + index}
                label="Address">
                <TextArea rows={3} placeholder="Address" />
              </Form.Item>
            );
          })}

        {data?.email &&
          data.email.length > 0 &&
          data.email.map((item, index) => {
            return (
              <Form.Item
                name={['email', index, 'item']}
                key={'email' + index}
                label="Email">
                <Input clearable />
              </Form.Item>
            );
          })}

        {data?.organization &&
          data.organization.length > 0 &&
          data.organization.map((organization, index) => {
            if (organization.item.unit) {
              return (
                <Form.Item
                  name={['organization', index, 'item', 'unit']}
                  key={'organization' + index}
                  label="Organization">
                  <Input clearable />
                </Form.Item>
              );
            } else {
              return (
                <Form.Item
                  name={['organization', index, 'item', 'name']}
                  key={'organization' + index}
                  label="Organization">
                  <TextArea />
                </Form.Item>
              );
            }
          })}

        {data?.telephone &&
          data.telephone.length > 0 &&
          data.telephone.map((item, index) => {
            return (
              <Form.Item
                name={['telephone', index, 'item', 'number']}
                key={'telephone' + index}
                label="Telephone">
                <Input clearable />
              </Form.Item>
            );
          })}

        {data?.url &&
          data.url.length > 0 &&
          data.url.map((item, index) => {
            return (
              <Form.Item
                name={['url', index, 'item']}
                key={'url' + index}
                label="Website">
                <Input clearable />
              </Form.Item>
            );
          })}

        <Form.Item name="eventName" label="EventName">
          <TextArea
            placeholder="EventName"
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <TextArea placeholder="Notes" maxLength={100} rows={2} showCount />
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(ScanResult);
