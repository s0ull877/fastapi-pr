import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import styles from './Register.module.css'
import AxeHero from '../../assets/Register/axe-logot.png'
import AxeSVG from '../Axe'

import React from 'react';
import { Button, Form, Input } from 'antd';

const layout = {
  wrapperCol: { span: 18,  offset: 3},
};

const validateMessages = {
  required: '${label} обязательное поле!',
  types: {
    email: '${label} не правильно введен!',
  },
};


export default function Register () {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true); 
        setError(''); // Очищаем ошибки
        delete values.password2
    
        try {
          const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          
          console.log(response)

          if (response.status === 201) {
            navigate('/verification'); // Перенаправляем пользователя
          } else {
            const errorData = await response.json();
            setError(errorData.detail || 'Что-то пошло не так. Попробуйте снова.');
          }
        } catch (err) {
          setError('Ошибка подключения к серверу.');
        } finally {
          setLoading(false); // Отключаем индикатор загрузки
        }
      };

    return (
        <>
            {error && <div className={styles.errors}>{error}</div> }
            
            <div className={styles.popup}>
                <div className={styles.content}>
                    <div className={styles.registration}>
                        <div className={`${styles.axevich_sector} ${styles.half_width}`}>
                            <img src={AxeHero} alt="axe_avatar"/>
                            <h2 className={styles.axevich_title}>Аксевич на голову выше!</h2>
                        </div>
                        <div className={`${styles.form_sector} ${styles.half_width}`}>
                            <AxeSVG width='70' height='70' />
                            <h1 className={styles.form_title}>Кто ты, путник?</h1>
                                <Form
                                {...layout}
                                name="nest-messages"
                                onFinish={onFinish}
                                style={{ width: '100%' }}
                                validateMessages={validateMessages}
                                >
                                    <Form.Item name={'email'} rules={[{ required: true, type: 'email' }]}>
                                    <Input  placeholder='example@email.com' className={styles.custom_placeholder}/>
                                    </Form.Item>
                                    <Form.Item 
                                        name={'username'} 
                                        rules={[
                                            { required: true }, 
                                            {
                                                pattern: /^[a-zA-Z0-9а-яА-Я_]+$/,
                                                message: 'Недопустимые символы в username!',
                                            },
                                        ]}
                                    >
                                    <Input placeholder='username' className={`${styles.custom_placeholder}`}/>
                                    </Form.Item>
                                    <Form.Item 
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
                                    <Form.Item
                                    name="password2"
                                    dependencies={['password']} // Указываем зависимость от поля password
                                    rules={[
                                        { required: true },
                                        ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Пароли не совпадают!'));
                                        },
                                        }),
                                    ]}
                                    >
                                        <Input.Password placeholder='Повторите пароль' className={styles.custom_placeholder}/>
                                    </Form.Item>
                                    <Form.Item label={null}>
                                    <Button className={styles.form_item_button} type="primary" htmlType="submit">
                                    
                                    {!loading ? 'Продолжить' : 'Загрузка..'}
                                    </Button>
                                    </Form.Item>
                                </Form>
                            <p className={styles.form_descr}>После регистрации вам придет пиcьмо для верификации</p>
                        </div>
                    </div>
                    <div className={styles.terms}>
                        Нажимая «Продолжить», вы соглашаетесь с <Link to="/rules">Правилами сайта</Link>
                    </div>
                </div>
            </div>
        </>
    )
}