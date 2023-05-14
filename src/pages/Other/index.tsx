import { memo } from 'react';
import { Button } from 'antd-mobile'

const Other = () => {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center'>
      <Button color='primary' onClick={()=>{
        localStorage.clear()
      }}>Clear the data</Button>
      <div className='mt-1'>It will clear all your Contacts</div>
    </div>
  );
};
export default memo(Other);
