import { memo, useMemo } from 'react';
import { Form, Input, Button, TextArea, Space, Image } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLocalData, setLocalData } from '@/utils';

interface CardInfo {
  ItemCoord?: Record<string, string>;
  Name: string;
  Value: string;
  Key: string;
}

interface Props {
  result: CardInfo[];
}

const ScanResult = ({ result }: Props) => {
  const navigate = useNavigate()
  const {
    state: { data, imageData },
  } = useLocation();
  console.log('data', data);

  const uuidv4 = ()=> {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
  }

  const onFinish = (values: any) => {
    console.log('Value', values);
    const arr = [];
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      arr.push({
        Name: key,
        Value: value,
      });
    }

    const updateData = {
      userId: uuidv4(),
      name: values['姓名'],
      phone: values['手机'],
      email:values['邮箱'],
      imageUri:imageData,
      data: arr,
    };

    const currentList = getLocalData('contactList') ?? [];
    console.log('currentList',currentList)
    const index = currentList.findIndex(
      (item: { userId: string }) => item.userId === updateData.userId,
    );
    if (index > 0) {
      currentList.splice(index, 1, updateData);
    } else {
      currentList.push(updateData);
    }
    setLocalData('contactList', currentList);
    navigate('/')
  };

  const initialValues = useMemo(() => {
    const obj: Record<string, string> = {};
    data.forEach((item: CardInfo) => {
      if(item.Name === '英文地址'){
        item.Value = item.Value.replaceAll(',',', ')
      }
      obj[item.Name] = item.Value;
    });
    obj.notes = '';
    return obj;
  }, [data]);

  return (
    <div>
      <Space className="w-full" justify="center" align="center">
        <Image src={imageData} width={300} height={150} fit="contain" />
      </Space>
      <Form
        layout="horizontal"
        initialValues={initialValues}
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Save
          </Button>
        }>
        {data.map((item: CardInfo, index: number) => {
          return (
            <Form.Item name={item.Name} key={index} label={item.Name}>
              <Input value={item.Value} clearable />
            </Form.Item>
          );
        })}
         <Form.Item name="EventName" label="EventName">
          <TextArea placeholder="EventName" maxLength={100} rows={2} showCount />
        </Form.Item>
        <Form.Item name="Notes" label="Notes">
          <TextArea placeholder="Notes" maxLength={100} rows={2} showCount />
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(ScanResult);
