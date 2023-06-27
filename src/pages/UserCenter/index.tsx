import { memo, useState, useEffect } from 'react';

import { Button, List } from 'antd-mobile';

import { getLocalData } from '@/utils';

import LoginForm from './Login';

export type UserInfo = {
  email: string;
  id: string;
  name?: string;
  visitors: Array<{
    id?: string;
  }>;
};

function UserCenter() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  useEffect(() => {
    const userInfo = getLocalData('user') as UserInfo;
    setUserInfo(userInfo);
  }, []);

  return (
    <div className="h-full w-full">
      {userInfo?.id ? (
        <List>
          <List.Item extra={userInfo.email}>邮箱</List.Item>
        </List>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default memo(UserCenter);
