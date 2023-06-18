import { memo, useEffect, useState } from 'react';

import { List, Empty } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { post } from '@/plugins/request';
import { getLocalData } from '@/utils';

import { type UserInfo } from '../UserCenter';

type CardItem = {
  id: string;
  formatted_name: Array<{
    item: string;
  }>;
};

function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  const generateIdentity = async () => {
    const res = (await post('/visitor', {})) as {
      id: string;
    };
    localStorage.setItem('visitor-id', res.id);
  };

  const getContactList = async () => {
    const user = getLocalData('user') as UserInfo;
    const visitorIds = user.visitors.map((item) => item.id) ?? [];
    const res = await post('/biz-card/contacts', {
      visitor_ids:
        visitorIds.length > 0 ? visitorIds : localStorage.getItem('visitor-id'),
    });
    if (res.length > 0) {
      setList(res);
    }
  };

  useEffect(() => {
    const visitorId = localStorage.getItem('visitor-id');
    if (visitorId) {
      void getContactList();
    } else {
      void generateIdentity();
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {list.length === 0 && (
        <div className="h-full bg-white flex justify-center">
          <Empty description="No contacts yet" />
        </div>
      )}
      <List>
        {(list || []).map((item: CardItem) => {
          return (
            <List.Item
              key={item.id}
              onClick={() => {
                navigate(`detail/${item?.id}`);
              }}
            >
              {(item?.formatted_name && item?.formatted_name[0]?.item) ??
                'No name'}{' '}
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}

export default memo(Home);
