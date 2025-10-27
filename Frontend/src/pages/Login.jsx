import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logIn } from "../Scripts/login";
import store from "../Store/store";
import { setUser } from "../Features/user/userSlice";
import { useSelector } from "react-redux";
import '../index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState("password");
  const [imagePath, setImagePath] = useState('eyeOn.png');
  const [showIncorrect, setShowIncorrect] = useState(false);

  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  const toggleShow = (e) => {
    e.preventDefault();
    setPasswordType(prevType => (prevType === "password" ? "text" : "password"));
    setImagePath(prevType => (prevType === 'eyeOn.png' ? "eyeOff.png" : 'eyeOn.png'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await logIn(username, password);
    if (!result) {
      setShowIncorrect(true);
      return;
    }
    setShowIncorrect(false);
    store.dispatch(setUser({
      ...user,
      accessToken: result.accessToken,
      username: result.user.username,
      role: result.user.role
    }));
    navigate('/tracker/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6"
      >
        {/* Header */}
        <h2 className="text-4xl font-bold text-white text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center">Please enter your details to login</p>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="peer w-full rounded-md bg-gray-700 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="username"
            className={`absolute left-4 text-gray-400 text-sm transition-all
              ${username ? 'top-1 text-xs text-blue-400' : 'top-3 text-base'}`}
          >
            Username
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={passwordType}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="peer w-full rounded-md bg-gray-700 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="absolute right-3 top-3 w-6 h-6"
            style={{ backgroundColor: '#364153'}}
            onClick={toggleShow}
          >
            <img src={imagePath} alt="toggle password visibility" />
          </button>
          <label
            htmlFor="password"
            className={`absolute left-4 text-gray-400 text-sm transition-all
              ${password ? 'top-1 text-xs text-blue-400' : 'top-3 text-base'}`}
          >
            Password
          </label>
        </div>

        {/* Error Message */}
        {showIncorrect && (
          <p className="text-red-500 text-sm text-center">
            Incorrect username or password
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold py-3 rounded-md shadow-md"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
