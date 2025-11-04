import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import SubmitBtn from '../components/Submit';
import Loader from "../Modal/OnscreenModal";
import Modal from '../Modal/AuthModal';
import ReactS3 from 'react-s3';
import { profilePhoto } from '../store/action/appStorage';
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;
const imageMimeType = /image\/(png|jpg|jpeg)/i;

function ProfilePhotoPage() {
    const [preloader, setPreloader] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isErrorInfo, setIsErrorInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUrl, setIsUrl] = useState('');
    const [photo, setPhoto] = useState(false);
    const [photoDataURL, setPhotoDataURL] = useState(null);
    const [isChangePhoto, setIsChangePhoto] = useState(false);

    const { email, seedphrase } = location.state || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setPreloader(false);
        }, 5000);
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let imgUrl;

        const config = {
            dirName: import.meta.env.VITE_S3_DIR_NAME,
            bucketName: import.meta.env.VITE_S3_BUCKET_NAME,
            region: import.meta.env.VITE_S3_REGION,
            accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY
          };
          
        const upload = async () => {
            if (!photo) return;
            return ReactS3.uploadFile(photo, config)
                .then(response => {
                    if (response.result.status !== 204) throw new Error("Upload failed");
                    imgUrl = response.location;
                })
                .catch(error => console.log(error));
        };

        await upload();

        const response = await dispatch(profilePhoto({ profilePhotoUrl: imgUrl }));

        setIsLoading(false);
        setIsError(true);
        setIsErrorInfo(response.message);
        setIsUrl(response.url);
    };

    const closeModal = () => {
        setIsError(false);
        if (isUrl) navigate(`${isUrl}`, { state: { email, seedphrase } });
    };

    const changePhotoHandler = (e) => {
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Invalid file type");
            return;
        }
        setIsChangePhoto(true);
        setPhoto(file);
    };

    useEffect(() => {
        let fileReader, isCancel = false;
        if (photo) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) setPhotoDataURL(result);
            };
            fileReader.readAsDataURL(photo);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        };
    }, [photo]);

    const container = {
        display: 'flex',
        alignItems: 'start',
        width: '100vw',
        backgroundColor: 'white',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        minHeight: '100vh',
        padding: '20px', 
        paddingTop:'0px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        boxSizing: 'border-box',
        width: '100%',
    };

    const formWrapperStyle = {
        width: '100%',
        maxWidth: '500px',
        paddingTop:'0px',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
    };

    const imagePreviewStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ccc',
        marginBottom: '20px',
    };

    const inputStyle = {
        margin: '10px 0',
        width: '100%',
    };

    const headingStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '30px',
        justifyContent: 'start',
    };

    return (
        <div style={container}>
            {isError && <Modal modalVisible={isError} updateVisibility={closeModal} message={isErrorInfo} />}
            <div style={containerStyle}>
                {isLoading && <Loader />}
                <form style={formWrapperStyle} onSubmit={submitHandler}>
                    <div style={headingStyle}>
                        <span className='material-icons'>arrow_back</span>
                        <h2 style={{ marginLeft: '25%' }}>Profile Photo</h2>
                    </div>

                    <p>Pick a profile image of yourself</p>

                    <div>
                        {photoDataURL ? (
                            <img src={photoDataURL} alt="Preview" style={imagePreviewStyle} />
                        ) : (
                            <span className="material-icons" style={{ fontSize: '100px', color: '#aaa' }}>person</span>
                        )}
                    </div>

                    <div style={inputStyle}>
                        <input type="file" onChange={changePhotoHandler} />
                    </div>

                    {photoDataURL && (
                        <div style={{ marginTop: '20px' }}>
                            <SubmitBtn style={{ borderRadius: '20px', padding: '10px 20px' }} text="Upload" />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProfilePhotoPage;

