import './EditProfile.css'

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'

import {useNavigate} from 'react-router-dom'

import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload } from 'antd';

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../store/AuthStore";
import { useEffect, useState } from "react";

import Header from '../Header/Header';

import { fetchWithAccess } from '../../utils/fetchWithAuth'


const layout = {
    wrapperCol: { span: 18,  offset: 3},
};


const EditProfile = observer(() => {
    const authStore = useAuthStore();
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({...authStore.user})

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
    }, [navigate, authStore.isAuthenticated]);


    const onFinish = async (values) => {

        setLoading(true); 
        setError('');

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('status', values.status != null ? values.status : '');

        if (values.image && values.image.file) {
            formData.append('image', values.image.file.originFileObj);
        }
        
        try {
            const response = await fetchWithAccess(
            'http://localhost:8000/api/v1/user/profile/edit', authStore, 
            {   
                body: formData, 
                method: 'POST', 
                headers : {
                    'accept': 'application/json'
                }
            })

            const data = await response.json();
            if (response.status === 200) {
                console.log(data)
                authStore.setAuthData({
                    accessToken: authStore.accessToken,
                    refreshToken: authStore.refreshToken,
                    user: data.user
                    }
                )
                setError(data.error)
                // navigate(`${authStore.user.username}`); // Перенаправляем пользователя
            } else {
                console.log(data.detail)
                setError( 'Что-то пошло не так. Попробуйте снова.');
            }
            } catch (err) {
                console.log(err)
                setError('Ошибка подключения к серверу.');
            } finally {
                setLoading(false); // Отключаем индикатор загрузки
            }
        };

    function handleChange(e) {
        setUser(
            {
                ...user,
                image: URL.createObjectURL(e.file.originFileObj),
            }
        )
    }

    return (
        <>
            <div className="fixed-page">
                <Header></Header>
                <div className="page-content center">
                { error && <div style={{color: 'red'}} className='center'>{error}</div>}

                    <Form
                        {...layout}
                        name="nest-messages"
                        onFinish={onFinish}
                        style={{ width: '100%' }}
                        initialValues={{ username: user.username, status: user.status, image: user.image}}
                        >
                            <div className="profile-head page-block">
                                <div className="profile-photo cyrcle">
                                    <img id="profile-photo-large" className="cyrcle-inner" src={user.image ? user.image : DefaultAvatar} alt="profile-photo"/>
                                </div>
                                <div className="profile-info">
                                    <Form.Item 
                                        name={'username'} 
                                        rules={[
                                            {
                                                pattern: /^[a-zA-Z0-9а-яА-Я_]+$/,
                                                message: 'Недопустимые символы в username!',
                                            },
                                        ]}
                                    >
                                        <Input placeholder='username' defaultValue={user.username} className="custom-placeholder"/>
                                    </Form.Item>

                                    <Form.Item name="status" >
                                        <Input.TextArea defaultValue={user.status} className="custom-placeholder"/>
                                    </Form.Item>
                                    
                                    <Form.Item name="image" >
                                            <Upload name='image' onChange={handleChange} maxCount={1} accept=".png,.jpg">
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                       </Upload>
                                    </Form.Item>
                                    
                                </div>
                                <div className="profile-settings">
                                    <Button className="profile-settings-button"  type="primary" htmlType="submit">
                                        {!loading ? 'Подтвердить' : 'Загрузка..'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    <div className='wrp'>
                        <a href='#' className="logout-btn">Выйти из аккаунта</a>
                    </div>
                </div>
            </div>
        </>
    )
})

export default EditProfile