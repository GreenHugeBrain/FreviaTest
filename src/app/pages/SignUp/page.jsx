'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('პაროლები არ ემთხვევა');
      return;
    }

    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await fetch('https://5.83.153.81:25608/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setShowVerificationModal(true);
      } else {
        alert(result.message || 'რეგისტრაცია ვერ მოხერხდა');
      }
    } catch (error) {
      alert('დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ მოგვიანებით');
    }
  };

  const VerificationModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#22c55e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle size={40} color="white" />
        </div>
        
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#000',
          marginBottom: '1rem',
          fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif'
        }}>
          რეგისტრაცია წარმატებით დასრულდა!
        </h2>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <Mail size={24} color="#666" style={{ marginRight: '0.5rem' }} />
          <p style={{
            fontSize: '1rem',
            color: '#666',
            margin: 0,
            fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif'
          }}>
            {formData.email}
          </p>
        </div>
        
        <p style={{
          fontSize: '1rem',
          color: '#333',
          lineHeight: '1.6',
          marginBottom: '2rem',
          fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif'
        }}>
          ვერიფიკაციის ლინკი გაიგზავნა თქვენს ელფოსტაზე. 
          <br />
          გთხოვთ, შეამოწმოთ ინბოქსი და დააჭიროთ ვერიფიკაციის ლინკს.
        </p>
        
        <button
          onClick={() => setShowVerificationModal(false)}
          style={{
            width: '100%',
            padding: '0.875rem 1.5rem',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif'
          }}
        >
          გასაგებია
        </button>
      </div>
      
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );

  const fields = [
    { label: 'სახელი', name: 'username' },
    { label: 'ელფოსტა', name: 'email' },
    { label: 'პაროლი', name: 'password' },
    { label: 'გაიმეორე პაროლი', name: 'confirmPassword' }
  ];

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: '"BPG Ingiri", system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #f6f6f6 0%, #ffffff 100%)',
        padding: '20px'
      }}>
        <form onSubmit={handleSubmit} style={{
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
            რეგისტრაცია
          </h1>

          {fields.map(({ label, name }) => (
            <div key={name} style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#000'
              }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={name.includes('password') ? (showPassword[name] ? 'text' : 'password') : name === 'email' ? 'email' : 'text'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa'
                  }}
                />
                {name.includes('password') && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({
                      ...prev,
                      [name]: !prev[name]
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
                    {showPassword[name] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000'
            }}>
              როლი
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            >
              <option value="freelancer">ფრილანსერი</option>
              <option value="employer">დამსაქმებელი</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.025em'
            }}
          >
            რეგისტრაცია
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            უკვე გაქვთ ანგარიში?{' '}
            <Link
              href="./SignIn"
              style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              შესვლა
            </Link>
          </p>
        </form>
      </div>

      {showVerificationModal && <VerificationModal />}
    </>
  );
};

export default SignUpForm;