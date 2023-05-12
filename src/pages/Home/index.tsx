import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraOutline } from 'antd-mobile-icons'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='h-8 w-8 bg-blue-400 flex justify-center items-center rounded-full'  onClick={()=>navigate('/camera')}>
        <CameraOutline color='#fff' fontSize={36} />
      </div>
    </div>
  );
};
export default memo(Home);
