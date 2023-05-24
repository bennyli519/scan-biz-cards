/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import { memo } from 'react';

import {
  Form,
  Input,
  Button,
  TextArea,
  Space,
  Image,
  Toast,
} from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';

import { post } from '@/plugins/request';

export type ItemInfo<T> = {
  item: T;
  position: string;
};

export type XFCardResult<K> = {
  address: Array<
    ItemInfo<{
      locality: string;
      street: string;
      type: string[];
    }>
  >;
  email: K;
  formatted_name: K;
  name: Array<
    ItemInfo<{
      family_name: string;
      given_name: string;
    }>
  >;
  nickname: K;
  organization: Array<ItemInfo<{ unit: string }>>;
  origin_address: K;
  telephone: Array<ItemInfo<{ number: string }>>;
  title: K;
  url: K;
};

function ScanResult() {
  const navigate = useNavigate();
  const {
    state: { data, imageData },
  } = useLocation() as {
    state: {
      data: XFCardResult<Array<ItemInfo<string>>>;
      imageData: string;
    };
  };

  const onFinish = async (values: any) => {
    const visitorId = localStorage.getItem('visitor-id');
    const res = await post('/biz-card', {
      visitor_id: visitorId,
      ...values,
    }).catch((err: Error) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Toast.show(`Saved Failed ${err}`);
    });
    Toast.show('Saved Successfully');
    navigate('/');
  };

  return (
    <div>
      <Space className="w-full" justify="center" align="center">
        <Image src={imageData} width={300} height={150} fit="contain" />
      </Space>
      <Form
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
                label={index ? <div /> : 'Name'}
              >
                <Input clearable placeholder="Name" />
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
                <Input clearable placeholder="NickName" />
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
                label={index ? <div /> : 'Title'}
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
                label={index ? <div /> : 'Address'}
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
                  label={index ? <div /> : 'Organization'}
                >
                  <Input clearable />
                </Form.Item>
              );
            }

            return (
              <Form.Item
                key={'organization' + index}
                name={['organization', index, 'item', 'name']}
                label={index ? <div /> : 'Organization'}
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
                label={index ? <div /> : 'Telephone'}
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
