import styles from "./Header.module.css";

import HeaderLogo from '../../assets/Header/header_logo.svg'
import SearchSVG from '../../assets/Header/search.svg'
import DefaultAvatar from '../../assets/Header/default-avatar.jpeg'
import BellNotf from '../../assets/Header/bell-notification-svgrepo-com.svg'
import NewPost from '../../assets/Header/plus-square-svgrepo-com.svg'

import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";


export default function Header () {

    const authStore = useAuthStore();

    return (
        <>
            <header className={styles.center}>
                <ul className={styles.header_list}>
                    <li className={styles.header_item}>
                        <Link to="/">
                            <img src={HeaderLogo} alt="" />
                        </Link>
                    </li>
                    <li className={styles.header_item}>
                        <div className={styles.search_box}>
                            <label className={styles.search_box_view}>
                                <img src={SearchSVG} alt="" />
                                <input type="search" placeholder="Поиск" id="search_header" autoComplete="on"/>
                            </label>
                        </div>
                    </li>

                    {
                        authStore.isAuthenticated &&
                        
                        <div className={styles.profile_actions}>
                            <Link to='/post/create'>
                                <img width="30" height="30" src={NewPost} alt="plus-post"/>
                            </Link>
                            <Link to='/notifications'>
                                <img width="30" height="30" src={BellNotf} alt="notification"/>
                            </Link>
                            <Link className={`${styles.profile_pic} ${styles.cyrcle}`} to={`/profile/${authStore.user.username}`}>
                                <img className={styles.cyrcle_inner} src={authStore.user.image ? authStore.user.image : DefaultAvatar} alt="profile-photo-mini"/>
                            </Link>
                        </div>
                    }

                </ul>
            </header>
        </>
    )
}