import AxeSVG from '../Axe'
import styles from "./Login.module.css";
import AxeHero from '../../assets/Login/axe-hero.png'
import GoogleLogo from '../../assets/Login/google.svg'
import SteamLogo from '../../assets/Login/steam.svg'
import FacebookLogo from '../../assets/Login/facebook.svg'
import { Link } from "react-router-dom";

import Header from '../Header/Header';


export default function Login () {
    return (
        <div className={styles.fixed_page}>
            <Header></Header>
            <div className={`${styles.center} ${styles.page_information}`}>
                <div className={styles.greeting}>
                    <div className={styles.greeting_title}>Добро пожаловать на Аксевич!</div>
                    <div className={styles.greeting_subtitle}>
                        <span>
                            Планируйте стратегии.
                        </span>
                        <span>
                            Придумывайте билды.
                        </span> 
                        <span>
                            Делитесь новостями.
                        </span> 
                    </div>
                    <div>
                        <img src={AxeHero} alt="axe_hero"/>
                    </div>
                    <div className={styles.greeting_descr}>Присоединяйтесь к лучшему фанатскому ресурсу The world of Axe!</div>
                </div>
                <div className={styles.sign}>
                    <div className={styles.sign_block}>
                        <div className={styles.sign_in}>
                            <AxeSVG width='70' height='70' ></AxeSVG>
                            <div className={styles.sign_in_title}>Вход Аксевич</div>
                            <form className={styles.sign_in_form} action="./profile.html">
                                <ul className={styles.sign_list}>
                                    <li className={styles.sign_item}>
                                        <input type="text" placeholder="Email или username" className={styles.custom_placeholder}/>
                                    </li>
                                    <li className={styles.sign_item}>
                                        <input type="password" placeholder="Пароль" className={styles.custom_placeholder}/>
                                    </li>
                                    <button className={styles.center_button}>
                                        <li className={`${styles.sign_button} ${styles.sign_item}`} id="continue">
                                            <span className={styles.continue_in}>Войти</span>
                                        </li>
                                    </button>
                                </ul>
                            </form>
                            <p className={styles.sociallapp_sign}>Или войдите с помощью</p>
                            <div className={styles.sociallapp_list}>
                                <a href="#">
                                    <img src={GoogleLogo} alt="" />
                                </a>
                                <a href="#">
                                    <img src={SteamLogo} alt="" />
                                </a>
                                <a href="#">
                                    <img src={FacebookLogo} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.sign_block}>
                        <div className={styles.sign_up}>
                            <ul className={styles.sign_list}>
                                <li className={styles.sign_button}>
                                    <Link to='/register'>
                                        <span className={styles.create_account}>Создать аккаунт</span>
                                    </Link>
                                </li>
                            </ul>
                            <div>
                                После регистрации вы получите доступ ко всем возможностям нашего сайта
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className={styles.center}>
                <div>
                    <div>
                        <a href="#">Аксевич © 2024</a>
                    </div>
                </div>
                <div className={styles.footer_more_info}>
                    <Link to="/about">О Аксевич</Link>
                    <Link to="/rules">Правила</Link>
                    <Link to="/api">Axe API</Link>
                </div>
                <div className={styles.change_language}>
                    <a href="./informations.html">Сменить язык | Change language</a>
                </div>
            </footer>
        </div>
    )
}