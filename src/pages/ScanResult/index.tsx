/* eslint-disable camelcase */
import { memo } from 'react';
import { Form, Input, Button, TextArea, Space, Image } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLocalData, setLocalData } from '@/utils';

export interface ItemInfo<T> {
  item: T;
  position: string;
}

export interface XFCardResult<K> {
  address: ItemInfo<{
    locality: string;
    street: string;
    type: string[];
  }>[];
  email: K;
  formatted_name: K;
  name: ItemInfo<{
    family_name: string;
    given_name: string;
  }>[];
  nickname: K;
  organization: ItemInfo<{ unit: string }>[];
  origin_address:K ;
  telephone: ItemInfo<{ number: string }>[];
  title: K;
  url: K;
}

const ScanResult = () => {
  const navigate = useNavigate();
  const {
    state: { data, imageData },
  } = useLocation() as {
    state: {
      data: XFCardResult<ItemInfo<string>[]>;
      imageData: string;
    };
  };
  console.log('data', data);

  const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
  };

  const onFinish = (values: any) => {
    console.log('Value', values);
    // const arr = [];
    // for (const [key, value] of Object.entries(values)) {
    //   console.log(`${key}: ${value}`);
    //   arr.push({
    //     Name: key,
    //     Value: value,
    //   });
    // }

    const updateData = {
      userId: uuidv4(),
      imageUri: imageData,
      ...values,
    };

    const currentList = getLocalData('contactList') ?? [];
    console.log('currentList', currentList);
    const index = currentList.findIndex(
      (item: { userId: string }) => item.userId === updateData.userId,
    );
    if (index > 0) {
      currentList.splice(index, 1, updateData);
    } else {
      currentList.push(updateData);
    }
    setLocalData('contactList', currentList);
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
                label={index ? <div /> : 'Name'}>
                <Input placeholder="Name" clearable />
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
                <Input placeholder="NickName" clearable />
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
                label={index ? <div /> : 'Title'}>
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
                label={index ? <div /> : 'Address'}>
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
                  label={index ? <div /> : 'Organization'}>
               
                  <Input clearable />
                </Form.Item>
              );
            } else {
              return (
                <Form.Item
                  name={['organization', index, 'item', 'name']}
                  key={'organization' + index}
                  label={index ? <div /> : 'Organization'}>
                  <TextArea  />
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
                label={index ? <div /> : 'Telephone'}>
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
