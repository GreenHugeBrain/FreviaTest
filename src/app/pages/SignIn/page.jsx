'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage('გთხოვთ შეავსოთ ყველა ველი.');
      return;
    }

    setLoading(true);

    const data = {
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch('https://5.83.153.81:25608/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          username: result.username,
          user_id: result.user_id,
          role: result.role,
          token: result.access_token
        }));

        router.push('/');
      } else {
        setErrorMessage(result.message || 'ავტორიზაცია ვერ მოხერხდა');
      }
    } catch (error) {
      setErrorMessage('დაფიქსირდა შეცდომა. გთხოვთ სცადეთ ხელახლა.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f6f6 0%, #ffffff 100%)',
      padding: '20px',
      fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif'
    }}>

      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#000',
          letterSpacing: '-0.025em'
        }}>
          ავტორიზაცია
        </h1>

        {['email', 'password'].map((field) => (
          <div key={field} style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000',
              textTransform: 'capitalize'
            }}>
              {field === 'password' ? 'პაროლი' : 'ელფოსტა'}
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={field === 'password' ? (showPassword[field] ? 'text' : 'password') : 'email'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  backgroundColor: '#fafafa'
                }}
                placeholder={field === 'password' ? 'შეიყვანეთ პაროლი' : 'შეიყვანეთ ელფოსტა'}
              />

              {field === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({
                    ...prev,
                    [field]: !prev[field]
                  }))}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    color: '#666'
                  }}
                >
                  {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {errorMessage && (
          <p style={{
            color: 'red',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.025em'
          }}
        >
          {loading ? 'იტვირთება...' : 'შესვლა'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          არ გაქვთ ანგარიში?{' '}
          <Link
            href="./SignUp"
            style={{
              color: '#000',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            რეგისტრაცია
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
