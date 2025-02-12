import styles from "./CreatePost.module.css";

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import { Link } from "react-router-dom";

import {useNavigate} from 'react-router-dom'

import { Button, Form, Upload } from 'antd';

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../store/AuthStore";
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';

import Header from '../Header/Header';

import { fetchWithAccess } from '../../utils/fetchWithAuth'





const CreatePost = observer(() => {
    const authStore = useAuthStore();
    const navigate = useNavigate()
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState('')
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        async function fetchData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post/categories`, authStore)
    
            if (response.status === 400) {
                navigate('/404'); 
            }
            const data = await response.json();
            setCategories(data.categories)
        }

        fetchData()

    }, [navigate, authStore.isAuthenticated]);

    if (!categories) {
        return <div>Загрузка...</div>;
    }

    const mediaItems = fileList.map(file => (
        <div 
            key={file.uid} 
            className={styles.media_item} 
            style={{ position: 'static' }}
        >
            <img
                src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''}
                alt="preview"
            />
        </div>
    ));

    const onFinish = async (values) => {
        if (!values.category) {
            setError('Выберите категорию')
            return
        }
        
        if (fileList.length == 0 & !values.text) {
            setError('Вы не можете отправить пустой пост')
            return
        }
        
        try {
            const formData = new FormData();
            formData.append('category', values.category);
            formData.append('text', values.text);

            // Добавляем файлы
            fileList.forEach(file => {
                formData.append('images', file.originFileObj);
            });
            
            

            // Отправка данных на сервер
            const response = await fetchWithAccess(
                'http://localhost:8000/api/v1/post/',
                authStore,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (response.status === 201) {
                navigate('/'); // Перенаправление после успешной публикации
            } else {
                setError('Ошибка при создании поста');
            }
        } catch (err) {
            console.log(err)
            setError('Ошибка сети');
        } finally {
            setLoading(false);
        }}

    return (
        <>
            <div className={styles.fixed_page}>
                <Header></Header>
                <div className={styles.center}>
                    { error && <div>{error}</div>}
                    <div className={`${styles.page_block} ${styles.no_border}`}>
                        <div className={styles.full_bkg}>
                        <div className={styles.post_item}>
                                <Form onFinish={onFinish} initialValues={{ category: '', images: [], text: ''}}>
                                    <div className={styles.post}>
                                        <div className={styles.post_head}>
                                            <div className={`${styles.post_owner_pic} ${styles.cyrcle}`}>
                                                <img className={styles.cyrcle_inner} src={authStore.user.image ? authStore.user.image : DefaultAvatar} alt="post_profile_photo"/>
                                            </div>
                                            <div className={styles.post_head_links}>
                                                <Link className={styles.post_owner} to={`/profile/${authStore.user.username}`}>{authStore.user.username}</Link>
                                                <Form.Item name='category' noStyle>
                                                    <select className={styles.post_category} name="category" id="category">
                                                        <option value="">Выберите категорию</option>
                                                        {categories.map(category => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                </Form.Item>
                                            </div>
                                            <span className={styles.post_time}>
                                                Только что
                                            </span>
                                        </div>
                                        <Form.Item name={'images'} noStyle>
                                            <Upload 
                                                accept=".png,.jpg"
                                                showUploadList={false}
                                                fileList={fileList} 
                                                name='images' 
                                                maxCount={3}
                                                beforeUpload={() => false} 
                                                onChange={({ fileList }) => {
                                                    setFileList(fileList);
                                                }}>
                                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                            </Upload>
                                        </Form.Item >
                                        <div className={styles.media_post_data}>
                                            {mediaItems}
                                        </div>
                                        <Form.Item name='text' noStyle>
                                            <div className={styles.text_post_data}>
                                                <textarea name="post_text" id="post_text" placeholder="Расскажите что нибудь"></textarea>
                                            </div>
                                        </Form.Item>
                                        <Button className={styles.publish_btn} type="primary" htmlType="submit">
                                            <span>{!loading ? 'Опубликовать' : 'Загрузка..'}</span>
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
})

export default CreatePost