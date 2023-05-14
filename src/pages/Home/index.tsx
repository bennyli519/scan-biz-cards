import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { List,Empty } from 'antd-mobile';
import { getLocalData } from '@/utils';

const Home = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  function addFriendInWeChat(username:string, message:string) {
    const url = `weixin://addfriend/${username}?hello=${encodeURIComponent(
      message,
    )}`;
    window.location.href = url;
  }

  useEffect(() => {
    const list = getLocalData('contactList') || [];
    console.log('list', list);
    setList(list);
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {
        list.length === 0 &&
        <div className='h-full bg-white flex justify-center'>
          <Empty description='No contacts yet' />
        </div>
      }
      <List>
        {
          (list|| []).map((item,idx)=>{
            return (
              <List.Item key={idx} onClick={()=>{
                navigate(`detail/${item?.userId}`);
              }}>{item?.name}</List.Item>
            )
          })
        }
      </List>
      {/* <div>
        <span>当前卡片人名：{list[0]?.CName}</span>
      </div>
      <Space>
        <Button onClick={()=>{
          window.location.href = `mailto:${list[0]?.CName}?subject=邮件主题&body=Hello,I'am benny from eventX`
        }}>Send Email</Button>
        <Button onClick={()=>{
          window.location.href = `https://wa.me/${list[0]?.mobile}?text=I'am benny from eventX`
        }}>Call On What's APP</Button>
      </Space>
      <Space>
        <Button onClick={()=>{
          addFriendInWeChat(list[0]?.mobile, 'hello,this is benny');
        }}>Wechat</Button>
      </Space> */}
    </div>
  );
};
export default memo(Home);
