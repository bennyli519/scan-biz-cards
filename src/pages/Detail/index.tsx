/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { memo, useEffect, useState, useMemo } from 'react';

import { Form, Input, Button, TextArea, Toast } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';

import addressIcon from '@/assets/images/icons/address.svg';
import call from '@/assets/images/icons/call.svg';
import emailIcon from '@/assets/images/icons/email.svg';
import whatAppIcon from '@/assets/images/icons/whatsapp.svg';
import { get, patch } from '@/plugins/request';

import { type ItemInfo, type XFCardResult } from '../ScanResult';

type Result = XFCardResult<Array<ItemInfo<string>>> & {
  eventName: string;
  notes: string;
};

type Props = {
  data: Result;
};

function ScanResult(props: Props) {
  const { bizCardId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Result>({} as Result);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const res = await patch(`/biz-card/${bizCardId!}`, values).catch((err) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Toast.show(`Update Failed ${err}`);
    });
    Toast.show('Saved Successfully');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const phone = useMemo(() => {
    if (Object.keys(data).length > 0) {
      return data?.telephone[0]?.item.number;
    }
  }, [data]);

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
    window.location.href = `https://wa.me/${phone.replaceAll(
      /[(|)|+]/g,
      '',
    )}?text=${bodyText}`;
  };

  const callPhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const checkMap = (address: string) => {
    console.log('address', address);
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const getDetail = async () => {
    const res = await get(`/biz-card/${bizCardId!}`);
    setData(res);
  };

  useEffect(() => {
    void getDetail();
  }, []);

  useEffect(() => {
    form.setFieldsValue(data);
  }, [form, data]);

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
        <img
          width={40}
          height={40}
          src={addressIcon}
          onClick={() => {
            checkMap(data.origin_address[0].item);
          }}
        />
        <img
          width={40}
          height={40}
          src={call}
          onClick={() => {
            callPhone(phone!);
          }}
        />
      </div>
      <Form
        form={form}
        layout="horizontal"
        initialValues={data}
        footer={
          <Button block type="submit" color="primary" size="large">
            Save
          </Button>
        }
        onFinish={onFinish}
      >
        {data?.formatted_name &&
          data.formatted_name.length > 0 &&
          data.formatted_name.map((item, index) => {
            return (
              <Form.Item
                key={'formatted_name' + index}
                name={['formatted_name', index, 'item']}
                label="Name"
              >
                <Input placeholder="Name" />
              </Form.Item>
            );
          })}

        {data?.nickname &&
          data.nickname.length > 0 &&
          data.nickname.map((item, index) => {
            return (
              <Form.Item
                key={'nickname' + index}
                name={['nickname', index, 'item']}
                label="NickName"
              >
                <Input placeholder="NickName" />
              </Form.Item>
            );
          })}

        {data?.title &&
          data.title.length > 0 &&
          data.title.map((item, index) => {
            return (
              <Form.Item
                key={'title' + index}
                name={['title', index, 'item']}
                label="Title"
              >
                <Input placeholder="Title" />
              </Form.Item>
            );
          })}

        {data?.origin_address &&
          data.origin_address.length > 0 &&
          data.origin_address.map((item, index) => {
            return (
              <Form.Item
                key={'origin_address' + index}
                name={['origin_address', index, 'item']}
                label="Address"
              >
                <TextArea rows={3} placeholder="Address" />
              </Form.Item>
            );
          })}

        {data?.email &&
          data.email.length > 0 &&
          data.email.map((item, index) => {
            return (
              <Form.Item
                key={'email' + index}
                name={['email', index, 'item']}
                label="Email"
              >
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
                  key={'organization' + index}
                  name={['organization', index, 'item', 'unit']}
                  label="Organization"
                >
                  <Input clearable />
                </Form.Item>
              );
            }

            return (
              <Form.Item
                key={'organization' + index}
                name={['organization', index, 'item', 'name']}
                label="Organization"
              >
                <TextArea />
              </Form.Item>
            );
          })}

        {data?.telephone &&
          data.telephone.length > 0 &&
          data.telephone.map((item, index) => {
            return (
              <Form.Item
                key={'telephone' + index}
                name={['telephone', index, 'item', 'number']}
                label="Telephone"
              >
                <Input clearable />
              </Form.Item>
            );
          })}

        {data?.url &&
          data.url.length > 0 &&
          data.url.map((item, index) => {
            return (
              <Form.Item
                key={'url' + index}
                name={['url', index, 'item']}
                label="Website"
              >
                <Input clearable />
              </Form.Item>
            );
          })}

        <Form.Item name="eventName" label="EventName">
          <TextArea
            showCount
            placeholder="EventName"
            maxLength={100}
            rows={2}
          />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <TextArea showCount placeholder="Notes" maxLength={100} rows={2} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(ScanResult);
