import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-96 border-2 border-purple-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-200"
        >
          Register
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:text-purple-800">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;