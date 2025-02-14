import './Profile.css'

import Header from '../Header/Header';
import Post from '../Post/Post';
import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'

import {Link, useNavigate, useParams} from 'react-router-dom'

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../store/AuthStore";

import { useEffect, useState } from "react";

import { fetchWithAccess } from '../../utils/fetchWithAuth'


const Profile = observer(() => {
    const { username } = useParams();
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)
    const authStore = useAuthStore();
    const navigate = useNavigate()

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        async function fetchUserData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/user/${username}`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedUser = await response.json();
            setUser(fetchedUser)
            return fetchedUser
            
        }
        async function fetchPostsData(user) {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/post?user_id=${user.id}`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedPosts = await response.json();
            setPosts(fetchedPosts)
            
        }
        if (authStore.user.username === username) {
            setUser(authStore.user)
            fetchPostsData(authStore.user)
        } else {
            (async () => {
                const fetchedUser = await fetchUserData();
                console.log(fetchedUser); 
                fetchPostsData(fetchedUser);
            })();
        }


    }, [navigate, authStore.isAuthenticated]);


    function handleDeletePost(postId) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
    <>
        <div className="fixed-page">
            <Header></Header>
            <div className="page-content center">
                <div className="profile-head page-block">
                    <div className="profile-photo cyrcle">
                        <img className="cyrcle-inner" src={user.image ? user.image : DefaultAvatar} alt="profile-photo"/>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-username">{user.username}</h2>
                        <span className="profile-status">
                            {user.status}
                        </span>
                    </div>
                    <div className="profile-settings">
                        {username == authStore.user.username &&
                            <Link className="profile-settings-button"to='/profile-edit' >Редактировать профиль</Link>
                        }
                    </div>
                </div>
                { posts && 
                    <div className="profile-body page-block">
                        <h2>{username == authStore.user.username ? 'Ваши посты' : `Посты ${username}`}</h2>
                        {posts.map(post => (
                            <ul key={post.id} className="post_list">
                                <Post post={post} onDelete={handleDeletePost}></Post>
                            </ul>
                        ))}
                    </div>
                }
            </div>
        </div>
    </>
    )
}
)


export default Profile