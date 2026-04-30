import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login , error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const LoggedInUser = await login(formData.email, formData.password);
    setIsSubmitting(false);
    if (LoggedInUser) {
      navigate("/setup");
    }
  };
  return (
    <div className="flex items-center text-center justify-center min-h-screen  ">
      <div className="card bg-base-200 card-bordered card-normal w-fit p-10 ">
        <div className="card-body ">
          <h1 className="card-title text-3xl text-center justify-center font-bold">
            Login
          </h1>
        </div>
        <form className="form flex flex-col  ">
          <div className="gap-3 flex flex-col">
            {error && <p className="text-error text-sm">{error}</p>}
            <input
              type="email"
              name="email"
              className="input input-bordered w-fit text-center mx-auto px-9"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="input input-bordered px-9 mx-auto w-fit text-center"
              value={formData.password}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="flex flex-col  text-center gap-0">
            <p className="text-base-content/50 text-center mt-3">
              Don't have an account?
            </p>
            <a
              onClick={() => navigate("/register")}
              className="text-primary cursor-pointer"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
