import './EditProfile.css'

import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'

import {useNavigate} from 'react-router-dom'

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../store/AuthStore";
import { useEffect, useState } from "react";

import Header from '../Header/Header';

import { fetchWithAccess } from '../../utils/fetchWithAuth'


const EditProfile = observer(() => {
    const authStore = useAuthStore();
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
        
        async function fetchData() {
            const response = await fetchWithAccess(`http://localhost:8000/api/v1/user/${authStore.user.username}`, authStore)
    
            if (response.status === 404) {
                navigate('/404'); 
            }
            const fetchedUser = await response.json();
            setUser(fetchedUser)
            
        }
        fetchData()
        
    }, [navigate, authStore.isAuthenticated]);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <div className="fixed-page">
                <Header></Header>
                <div className="page-content center">
                    <form action="#">
                        <div className="profile-head page-block">
                            <div className="profile-photo cyrcle">
                                <img id="profile-photo-large" className="cyrcle-inner" src={user.image ? user.image : DefaultAvatar} alt="profile-photo"/>
                            </div>
                            <div className="profile-info">
                                <h2 className="profile-username">
                                    <input className="custom-placeholder" name="username" type="text" value={user.username} placeholder="Придумайте username"/>
                                </h2>
                                <span className="profile-status">
                                    <textarea className="custom-placeholder" name="status" placeholder={user.status}></textarea>
                                </span>
                                <p>
                                    <input id="new-profile-pic" className="custom-placeholder" name="avatar" type="file"/>
                                </p>
                            </div>
                            <div className="profile-settings">
                                <button className="profile-settings-button" >Подтвердить</button>
                            </div>
                        </div>
                    </form>
                    <div className='wrp'>
                        <a href='#' className="logout-btn">Выйти из аккаунта</a>
                    </div>
                </div>
            </div>
            <script src="./js/preview-to-new-avatar.js"></script>
        </>
    )
})

export default EditProfile