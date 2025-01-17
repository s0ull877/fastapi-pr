import './Login.css'
import AxeSVG from '../Axe'
import HeaderLogo from '../../assets/Header/header_logo.svg'
import SearchSVG from '../../assets/Header/search.svg'
import AxeHero from '../../assets/Login/axe-hero.png'
import GoogleLogo from '../../assets/Login/google.svg'
import SteamLogo from '../../assets/Login/steam.svg'
import FacebookLogo from '../../assets/Login/facebook.svg'
import { Link } from "react-router-dom";


export default function Login () {
    return (
        <div className="fixed-page">
            <header className="center">
                <ul className="header-list">
                    <li className="header-item">
                        <Link to="/">
                            <img src={HeaderLogo} alt="" />
                        </Link>
                    </li>
                    <li className="header-item">
                        <div className="search-box">
                            <label className="search-box-view">
                                <img src={SearchSVG} alt="" />
                                <input type="search" placeholder="Поиск" id="search-header"/>
                            </label>
                        </div>
                    </li>
                </ul>
            </header>
            <div className="center page-information">
                <div className="greeting">
                    <div className="greeting-title">Добро пожаловать на Аксевич!</div>
                    <div className="greeting-subtitle">
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
                        <img src={AxeHero} alt="axe-hero"/>
                    </div>
                    <div className="greeting-descr">Присоединяйтесь к лучшему фанатскому ресурсу The world of Axe!</div>
                </div>
                <div className="sign">
                    <div className="sign-block">
                        <div className="sign-in">
                            <AxeSVG width='70' height='70' ></AxeSVG>
                            <div className="sign-in-title">Вход Аксевич</div>
                            <form className="sign-in-form" action="./profile.html">
                                <ul className="sign-list">
                                    <li className="sign-item">
                                        <input type="text" placeholder="Email или username" className="custom-placeholder"/>
                                    </li>
                                    <li className="sign-item">
                                        <input type="password" placeholder="Пароль" className="custom-placeholder"/>
                                    </li>
                                    <button className="center-button">
                                        <li className="sign-button sign-item" id="continue">
                                            <span className="continue-in">Войти</span>
                                        </li>
                                    </button>
                                </ul>
                            </form>
                            <p className="sociallapp-sign">Или войдите с помощью</p>
                            <div className="sociallapp-list">
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
                    <div className="sign-block">
                        <div className="sign-up">
                            <ul className="sign-list">
                                <li className="sign-button">
                                    <Link to='/register'>
                                        <span className="create-account">Создать аккаунт</span>
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
            <footer className="center">
                <div>
                    <div>
                        <a href="#">Аксевич © 2024</a>
                    </div>
                </div>
                <div className="footer-more-info">
                    <Link to="/about">О Аксевич</Link>
                    <Link to="/rules">Правила</Link>
                    <Link to="/api">Axe API</Link>
                </div>
                <div className="change-language">
                    <a href="./informations.html">Сменить язык | Change language</a>
                </div>
            </footer>
        </div>
    )
}