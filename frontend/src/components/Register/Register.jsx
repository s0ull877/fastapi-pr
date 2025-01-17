import { useState } from 'react';
import { Link } from "react-router-dom";

import './Register.css'
import AxeHero from '../../assets/Register/axe-logot.png'
import AxeSVG from '../Axe'



export default function Register () {
    const [error, setError] = useState('')

    return (
        <>
            {error && <div className="errors">{error}</div> }
            
            <div className="popup">
                <div className="content">
                    <div className="registration">
                        <div className="axevich-sector half-width">
                            <img src={AxeHero} alt="axe-avatar"/>
                            <h2 className="axevich-title">Аксевич на голову выше!</h2>
                        </div>
                        <div className="form-sector half-width">
                            <AxeSVG width='70' height='70' />
                            <h1 className="form-title">Кто ты, путник?</h1>
                            <form action="./profile.html">
                                <ul>
                                    <li className="form-item">
                                        <input className=" custom-placeholder" placeholder="example@gmail.com" type="email"/>
                                    </li>
                                    <li className="form-item">
                                        <input className=" custom-placeholder" placeholder="username" type="text"/>
                                    </li>
                                    <li className="form-item">
                                        <input className=" custom-placeholder" placeholder="Пароль" type="password"/>
                                    </li>
                                    <li className="form-item">
                                        <input className="custom-placeholder" placeholder="Повторите пароль" type="password"/>
                                    </li>
                                    <button className="form-item-button" type="submit">
                                        <li>
                                            Продолжить
                                        </li>
                                    </button>
                                </ul>
                            </form>
                            <p className="form-descr">После регистрации вам придет пиcьмо для верификации</p>
                        </div>
                    </div>
                    <div className="terms">
                        Нажимая «Продолжить», вы соглашаетесь с <Link to="/rules">Правилами сайта</Link>
                    </div>
                </div>
            </div>
        </>
    )
}