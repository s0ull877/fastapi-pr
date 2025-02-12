import styles from "./SinglePost.module.css";


import Header from '../Header/Header';
import Post from '../Post/Post';

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'

import {Link, useNavigate, useParams} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useAuthStore } from "../../store/AuthStore";

import { fetchWithAccess } from '../../utils/fetchWithAuth'

import { Button, Form, Input, Upload } from 'antd';

import moment from 'moment';

const CommentItem = (comment) => {
    return (
        <li className={styles.comment_item}>
            <Link to={`/profile/${comment.owner.username}`}>
                <div className={`${styles.cyrcle} ${styles.comment_owner_pic}`}>
                    <img className={styles.cyrcle_inner} src={comment.owner.image ? comment.owner.image : DefaultAvatar} alt="comments_owner_2"/>
                </div>
                <div className={styles.comment_owner_name}>
                    <p className={styles.post_owner}>{comment.owner.username}</p>
                    <p className={styles.comment_word}>Комментарий</p>
                </div>
                <div className={styles.comment_publish_time}>
                    {moment(comment.created_at).fromNow()}
                </div>
            </Link>
            <div className={styles.comment_content}>
                {comment.text} 
            </div>
        </li>
    )
}


export default function SinglePost() {
    const { username, id } = useParams();
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    const authStore = useAuthStore();


    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        async function fetchPostData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post/${id}`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedPost = await response.json();
            if (fetchedPost.owner.username !== username) {
                navigate('/404'); 
            }
            setPost(fetchedPost)
        }
        async function fetchComments() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/comment/?post_id=${id}`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedComments = await response.json();
            setComments(fetchedComments.comments)
        }
   
        fetchPostData()
        fetchComments() 

    }, [navigate, authStore.isAuthenticated]);

    console.log
    const onFinish = async (values) => {

        if (!values.text) {
            setMessage('Пустой коммент')
            return
        }

        const body = JSON.stringify({post_id: post.id,...values})
        console.log(body)

        try{
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/comment/`, authStore, {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.status == 201) {
    
                const data = await response.json()
                if (authStore.user.username !== post.owner.username) {
                    setMessage('Ваши комментарии будут видны всем, после одобрения автора')
                }
                setComments(prevComments => [{owner: authStore.user, ...data}].concat(prevComments));
            } 
        }
        catch (err) {
            console.log(err)
        }

            

    }

    function handleDeletePost(postId) {
        navigate('/')
    }


    if (!post) {
        return <div>Загрузка...</div>;
    }


    return (
        <div className={styles.fixed_page}>
            <Header></Header>
            <div className={styles.center}>
                <div className={`${styles.page_block} ${styles.no_border}`}>
                    <div className={styles.full_bkg}>
                        <Post post={post} onDelete={handleDeletePost}></Post>
                        <div className={styles.post_comments}>
                            <ul className={styles.comments_list}>
                                <li className={styles.comment_item}>
                                    <Link to={`/profile/${authStore.user.username}`}>
                                        <div className={`${styles.cyrcle} ${styles.comment_owner_pic}`}>
                                            <img className={styles.cyrcle_inner} src={authStore.user.image ? authStore.user.image : DefaultAvatar} alt="comments_owner_1"/>
                                        </div>
                                        <div className={styles.comment_owner_name}>
                                            <p className={styles.post_owner}>{authStore.user.username}</p>
                                            <p className={styles.comment_word}>Комментарий</p>
                                        </div>
                                        <div className={styles.comment_publish_time}>
                                            Just Now
                                        </div>
                                    </Link>
                                    { message && <div style={{color: 'yellow'}}>{message}</div>}
                                    <div className={styles.comment_content}>
                                        <Form onFinish={onFinish} initialValues={{comment : ''}}>
                                            <Form.Item name="text" noStyle>
                                                <textarea className={styles.comment_text} name="text" id="comment" placeholder="Напишите свой комментарий"></textarea>
                                            </Form.Item>
                                            <Button className={styles.new_comment_button} type="primary" htmlType="submit">Отправить</Button>
                                        </Form>
                                    </div>
                                </li>
                                {comments && comments.map(comment => (
                                    CommentItem(comment)
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}