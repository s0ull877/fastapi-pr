import styles from "./Notifications.module.css";
import Header from '../Header/Header';


import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/AuthStore";
import moment from 'moment';

import { fetchWithAccess } from '../../utils/fetchWithAuth'
import { useEffect, useState } from "react";

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}.${month}`;
};

export default function Notifications ()  {
    const [error, setError] = useState()
    const authStore = useAuthStore();
    const [comments, setComments] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        async function fetchCommentsData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/comment/new`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedComments = await response.json();
            setComments(fetchedComments)
            
        }

        fetchCommentsData()

    }, [navigate, authStore.isAuthenticated]);

    async function onClick(id, approve) {
        try {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/comment/${id}`, authStore, 
                {
                    method: 'PATCH',
                    body: JSON.stringify({ approve }),
                    headers : {
                        "Content-Type": 'application/json'
                    }
                }
            )

            if ([200, 204].indexOf(response.status) === -1 ) {
                setError('Непредвиденная ошибка')
            } else {
                setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            }
        } catch(err) {
            console.log(err)
        }

    }


    if (!comments) {
        return <div>Loading...</div>
    }
    
    return (
        <div className={styles.fixed_page}>
            <Header></Header>
            <div className={styles.center}>
                {error && <div style={{textAlign: 'center'}}>{error}</div>}
                <div className={styles.page_block}>
                    <ul className={styles.notification_list}>
                        {comments.length !== 0 ? comments.map(comment => (
                            <li key={comment.id} className={styles.notification_item}>
                                <div className={styles.notification}>
                                    <div className={styles.notification_head}>
                                        <Link className={styles.notification_owner} to={`/profile/${comment.owner.username}`} >
                                            <div className={styles.cyrcle}>
                                                <img className={styles.cyrcle_inner} src={comment.owner.image ? comment.owner.image : DefaultAvatar} alt=""/>
                                            </div>
                                            <div>
                                                <span className={styles.notification_owner_name}>{comment.owner.username}</span>
                                                <p className={styles.notification_time}>
                                                    {moment(comment.created_at).fromNow()}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className={styles.notification_to_post}>
                                        <Link to={`/${authStore.user.username}/post/${comment.post.id}`}>
                                            <span className={styles.post_time}>Отклик к посту от {formatDate(comment.post.created_at)}: </span>
                                            <span className={styles.post_text}>
                                                {comment.post.text}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className={styles.notification_content}>
                                        {comment.text}
                                    </div>
                                    <div className={styles.notification_buttons}>
                                        <button onClick={() => onClick(comment.id, 1)} className={styles.approve_notification}>Принять</button>
                                        <button onClick={() => onClick(comment.id, 0)} className={styles.eject_notificaton}>Отклонить</button>
                                    </div>
                                </div>
                            </li>
                        ))
                        :  
                            <li className={styles.empty_notifications}>
                                <h2>У вас пока нет новых откликов</h2>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
