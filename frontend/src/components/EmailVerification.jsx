import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('')


  useEffect(() => {
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    if (!email || !code) {
      navigate("/"); 
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("http://localhost:8000/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        });

        if (response.status === 200) {
          // navigate("/success"); // Перенаправление в случае успеха
          console.log('success')
          setResponse("Вашa почта верифицирована! Теперь вы можете войти в аккаунт!");
        } else {
          const errorData = await response.json();
          setResponse(errorData.detail || "Ошибка верификации.");
        }
      } catch (err) {
        setError("Ошибка подключения к серверу.");
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      {loading && <p>Проверка верификации...</p>}
      {response && <div><p>{response}</p><div><Link to='/'>На главную</Link></div></div>}
    </div>
  );
}