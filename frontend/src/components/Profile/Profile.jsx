import './Profile.css'

import Header from '../Header/Header';
import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'

import {Link, useNavigate, useParams} from 'react-router-dom'

import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../store/AuthStore";

import { useEffect } from "react";


const Profile = observer(() => {
    const { username } = useParams();
    const authStore = useAuthStore();
    const navigate = useNavigate()
    console.log(authStore)

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/');
        }
    }, [navigate, authStore.isAuthenticated]);

    return (
    <>
        <div className="fixed-page">
            <Header></Header>
            <div className="page-content center">
                <div className="profile-head page-block">
                    <div className="profile-photo cyrcle">
                        <img className="cyrcle-inner" src={DefaultAvatar} alt="profile-photo"/>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-username">Какой либо юзер</h2>
                        <span className="profile-status">
                            12345678901234567890123456789012 34567890Кк фырвпафывыфы рпыфвыр фоврыо фврфыовырфвфоа
                        </span>
                    </div>
                    <div className="profile-settings">
                        {username == authStore.user.username &&
                            <a className="profile-settings-button" href="./edit-profile.html">Редактировать профиль</a>
                        }
                    </div>
                </div>
                <div className="profile-body page-block">
                    <h2>{username == authStore.user.username ? 'Ваши посты' : `Посты ${username}`}</h2>
                    <ul className="post-list">

                    </ul>
                </div>
            </div>
        </div>
    </>
    )
}
)


export default Profile