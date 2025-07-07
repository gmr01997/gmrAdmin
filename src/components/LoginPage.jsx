import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Default credentials
  const defaultCredentials = {
    username: 'admin',
    password: 'password123'
  };

  const handleLogin = () => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === defaultCredentials.username && password === defaultCredentials.password) {
        // Set authentication in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        // Navigate to dashboard
        navigate('/');
        // For demo purposes, reload the page
        window.location.reload();
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  const styles = {
    body: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: '20px'
    },
    container: {
      width: '100%',
      maxWidth: '400px'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    logo: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      margin: '0 auto 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    title: {
      color: '#333',
      marginBottom: '30px',
      fontSize: '28px',
      fontWeight: '600'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    button: {
      background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '10px',
      transform: loading ? 'none' : 'translateY(0)',
      boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.2)'
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '10px',
      padding: '10px',
      background: '#fdf2f2',
      borderRadius: '5px',
      border: '1px solid #fecaca'
    },
    credentials: {
      background: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      color: '#666',
      border: '1px solid #e9ecef',
      textAlign: 'left'
    },
    forgotPassword: {
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px',
      marginTop: '15px',
      display: 'inline-block'
    },
      logoContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%', // Remove this if you don't want circular logo
    objectFit: 'contain', // This ensures the image fits well within the container
    objectPosition: 'center'
  }
  };

  // Handle input focus effect
  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e1e5e9';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonHover = (e) => {
    if (!loading) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
    }
  };

  const handleButtonLeave = (e) => {
    if (!loading) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
    }
  };

  return (
   <div style={styles.body}>
  <div style={styles.container}>
    <div style={styles.card}>
      <div style={styles.logoContainer}>
        <img 
          src="/GMR_Group.png" 
          alt="GMR Logo" 
          style={styles.logoImage}
        />
      </div>
      <h1 style={styles.title}>Welcome Back</h1>
          
          {/* <div style={styles.credentials}>
            <strong>Default Credentials:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>password123</code>
          </div> */}

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
                placeholder="Enter your username"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="button"
              disabled={loading}
              style={styles.button}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              onClick={handleLogin}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {error && <div style={styles.error}>{error}</div>}
{/* 
            <span style={styles.forgotPassword}>
              Forgot your password?
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}