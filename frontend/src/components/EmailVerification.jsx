import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    // Проверка наличия параметров
    if (!email || !code) {
      navigate("/"); // Перенаправление на главную страницу
      return;
    }

    // POST-запрос на сервер
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
          navigate("/success"); // Перенаправление в случае успеха
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Ошибка верификации.");
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}