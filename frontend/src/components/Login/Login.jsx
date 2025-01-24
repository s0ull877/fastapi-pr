import AxeSVG from '../Axe'
import styles from "./Login.module.css";
import AxeHero from '../../assets/Login/axe-hero.png'
import GoogleLogo from '../../assets/Login/google.svg'
import SteamLogo from '../../assets/Login/steam.svg'
import FacebookLogo from '../../assets/Login/facebook.svg'

import Header from '../Header/Header';

import { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Form, Input } from 'antd';


const layout = {
    wrapperCol: { span: 18,  offset: 3},
};

const validateMessages = {
    required: '${label} обязательное поле!',
};
  

export default function Login () {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true); 
        setError(''); // Очищаем ошибки
        delete values.password2
    
        try {
          const response = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          
          console.log(response)
          const data = await response.json();

          if (response.status === 200) {
            navigate(`/${data.username}`)
          } else {
            setError(data.detail || 'Что-то пошло не так. Попробуйте снова.');
          }
        } catch (err) {
          setError('Ошибка подключения к серверу.');
        } finally {
          setLoading(false); // Отключаем индикатор загрузки
        }
      };


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
                            
                            {error && <p>Проверка верификации...</p>}

                            <Form
                            {...layout}
                            name="nest-messages"
                            onFinish={onFinish}
                            style={{ width: '100%' }}
                            className={styles.sign_list}
                            validateMessages={validateMessages}
                            >
                                <Form.Item 
                                    className={styles.sign_item}
                                    name={'username'} 
                                    rules={[
                                        { required: true }, 
                                        {
                                            pattern: /^[a-zA-Z0-9а-яА-Я_]+$/,
                                            message: 'Недопустимые символы!',
                                        },
                                    ]}
                                >
                                <Input placeholder='username' className={`${styles.custom_placeholder}`}/>
                                </Form.Item>
                                <Form.Item 
                                    className={styles.sign_item}
                                    name="password" 
                                    rules={[
                                        { required: true }, 
                                        { min: 8, message: 'Пароль должен быть не менее 8 символов!' },
                                        {
                                            pattern: /^[a-zA-Z0-9а-яА-Я]+$/,
                                            message: 'Недопустимые символы в пароле!',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder='Пароль' className={styles.custom_placeholder}/> 
                                </Form.Item>
                                <Button className={styles.form_item_button} type="primary" htmlType="submit">
                                    {!loading ? 'Войти' : 'Загрузка..'}
                                </Button>
                            </Form>
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