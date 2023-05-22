import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { List,Empty } from 'antd-mobile';
import { getLocalData } from '@/utils';

const Home = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    const list = getLocalData('contactList') || [];
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
              }}>{item?.formatted_name && item?.formatted_name[0]?.item ?? "No name"} </List.Item>
            )
          })
        }
      </List>
    </div>
  );
};
export default memo(Home);
