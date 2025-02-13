import styles from "./Feed.module.css";

import Header from '../Header/Header';
import Post from '../Post/Post';

import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useAuthStore } from "../../store/AuthStore";

import { fetchWithAccess } from '../../utils/fetchWithAuth'

async function fetchPostsData(url, setFunc, authStore) {
    const response = await fetchWithAccess(url, authStore)

    const fetchedPosts = await response.json();
    setFunc(fetchedPosts)
}

const URL =`http://localhost:8000/api/v1/post`

export default function Feed() {

    const navigate = useNavigate()
    const authStore = useAuthStore();
    const [url, setUrl] = useState(URL)
    const [posts, setPosts] = useState([])
    const [showRoles, setShowRoles] = useState(false)
    const [categories, setCategories] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        try {
            fetchPostsData(`http://localhost:8000/api/v1/post/categories`, setCategories, authStore)
            fetchPostsData(url, setPosts, authStore)
        } catch(err) {
            console.log(err)
        }
    
    }, [navigate, authStore.isAuthenticated, url]);

    function handleDeletePost(postId) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }

    function ChangeUrl(key, value) {
        const newParams = new URLSearchParams(searchParams);
    
        if (value) {
            newParams.set(key, value); // Добавляем/обновляем параметр
        } else {
            newParams.delete(key); // Удаляем, если значение пустое
        }

        setSearchParams(newParams); // Обновляем URL в браузере
        setUrl(`${URL}?${newParams.toString()}`)
        setShowRoles(false)
    }

    if (!posts) {
        return <div>Загрузка...</div>;
    }


    return (
        <div className={styles.fixed_page}>
            <Header></Header>
            <div className={styles.center}>
                <div className={`${styles.page_block} ${styles.no_border}`}>
                    <div className={styles.feed_head}>
                        <h1 className={styles.feed_title}>Новости</h1>
                        <div className={styles.feed_filters}>
                            <div className={styles.role_filter}>
                                <button onClick={() => setShowRoles(!showRoles)} className={`${styles.roles_btn} ${styles.feed_filters_child}`}>Роль</button>

                                <div  id="all_roles" className={ showRoles ? styles.all_roles : `${styles.all_roles} ${styles.display_none}`}>
                                
                                    {categories && categories.map(category => 
                                        <a style={{cursor: 'pointer'}}key={category.id} onClick={() => ChangeUrl('catg',category.slug)}>{category.name}</a>
                                    )}
                                </div>
                            </div>
                            <a onClick={() => ChangeUrl('order', 'pop')} className={styles.feed_filters_child}>Популярные</a>
                            <a onClick={() => ChangeUrl('order', 'new')} className={styles.feed_filters_child}>Новые</a>
                        </div>
                    </div>
                    <ul className={styles.post_list}>
                        {posts.length !== 0 && posts.map(post =>
                            <Post key={post.id} post={post} onDelete={handleDeletePost}></Post>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}