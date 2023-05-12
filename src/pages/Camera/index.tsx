import { base64ToFile, getBase64, setLocalData } from '../../utils';
import { useRef, useState } from 'react';
import { SpinLoading } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import { Camera } from 'react-camera-pro';
import { useNavigate } from 'react-router-dom';

const CameraPage = () => {
   const navigate = useNavigate()
	const [isFrontCamera, setIsFrontCamera] = useState(false);
	const [appLoading, setAppLoading] = useState(false);
	const [imageData, setImageData] = useState('');
	const handleCameraSwitch = () => {
		setLocalData('IS_FRONT_CAMERA', !isFrontCamera);
		setIsFrontCamera(!isFrontCamera);
	};
	const handleCaptureImage = () => {
		const base64 = camera.current.takePhoto();
		docsApiSubmit(base64);
		setImageData(base64);
	};
	const camera = useRef(null);
	const docsApiSubmit = async (imageUri: string) => {
		setAppLoading(true);
		try {
			base64ToFile(imageUri, (file) => {
        console.log('file',file)
				// uploadDocs(file, (res) => {
				// 	onChange(res);
				// 	setAppLoading(false);
				// });
			});
		} catch (error) {
			setAppLoading(false);
		}
	};
	const handleFromGallery = (e: any) => {
		const file = e.target.files[0];
		setAppLoading(true);
		getBase64(file, (imageUri) => {
			setImageData(imageUri);
			docsApiSubmit(imageUri);
		});
	};
	return (
		<>
			{appLoading && (
				<div className='fixed h-full w-full flex justify-center items-center z-50'>
					<SpinLoading  color='primary' />
				</div>
			)}
			<div className='container h-screen'>
        <div className='absolute text-[#f1f5f9] h-5 w-5 top-4 left-2' onClick={()=>{
          navigate(-1)
        }}>
          <CloseOutline fontSize={24} /> 
        </div>
				<div className='screen bg-slate-900 flex flex-col justify-center items-center  h-full w-full'>
					<img
						src={imageData}
						className={`h-full w-full object-contain  ${
							imageData?.length <= 0 && 'hidden'
						}`}
						alt='Captured Image'
					/>
					<div
						className={`h-full w-full flex flex-col justify-center items-center ${
							imageData?.length > 0 && 'hidden'
						}`}
					>
						{!isFrontCamera && (
							<Camera
								facingMode={'environment'}
                aspectRatio={0.8}
								ref={camera}
								errorMessages={{
									canvas: 'Your browser does not support canvas',
									noCameraAccessible: 'No camera accessible',
									permissionDenied: 'Permission denied',
									switchCamera:
										'Your browser does not support switching cameras',
								}}
							/>
						)}
						{isFrontCamera && (
							<Camera
								facingMode={'user'}
								aspectRatio={0.8}
								ref={camera}
								errorMessages={{
									canvas: 'Your browser does not support canvas',
									noCameraAccessible: 'No camera accessible',
									permissionDenied: 'Permission denied',
									switchCamera:
										'Your browser does not support switching cameras',
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<div className='fixed bottom-0 left-0 w-full'>
				<div className='py-1 bg-black container flex justify-between items-center'>
					<div className='flex items-center justify-center flex-1 cursor-pointer relative'>
						<img src='/gallery.svg' alt='' className='h-4 w-4' />
						<input
							onChange={handleFromGallery}
							type='file'
							className='absolute left-0 top-0 h-full w-full z-50 opacity-0 cursor-pointer'
						/>
					</div>
					<div
						className='flex-1 flex justify-center cursor-pointer'
						onClick={handleCaptureImage}
					>
						<div className='h-10 w-10 bg-white rounded-full flex items-center justify-center'>
							<div className='h-8 w-8 bg-white rounded-full border-solid border-black border-2' />
						</div>
					</div>
					<div
						className='flex items-center justify-center flex-1 cursor-pointer'
						onClick={handleCameraSwitch}
					>
						<img src='/camera-switch.svg' alt='' className='h-4 w-4' />
					</div>
				</div>
			</div>
		</>
	);
};
export default CameraPage;
