/* eslint-disable no-unused-vars */

import banner7 from "/assets/img/banner/banner1.jpg";
import logoMixLight from "/assets/img/logo-light.png";
import banner2 from "/assets/img/banner/banner2.jpg";
import safronLogo from "/assets/img/safronLogo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { API_CONFIG } from "../../services/api.config";

interface FormEventHandler {
  (event: React.FormEvent<HTMLFormElement>): void;
}

const LoginContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    memberNick: "",
    memberPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForm: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(
        loginUser({
          memberNick: formData.memberNick,
          memberPassword: formData.memberPassword,
        }),
      ).unwrap();

      toast.success("Login Successful!");

      // Reset form
      setFormData({
        memberNick: "",
        memberPassword: "",
      });

      // Redirect to home or dashboard
      navigate("/");
    } catch (err: any) {
      toast.error(err || "Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <div className="login-area default-padding">
        <div className="container">
          <div className="login-items">
            <div className="row">
              <div className="col-lg-6">
                <div className="login-thumb">
                  <img src={banner2} alt="Image Not Found" />
                  <div className="logo">
                    <Link to="/">
                      <img src={safronLogo} alt="Image Not Found" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="login-forms">
                  <h2>Welcome back</h2>
                  <p>Enter your username and password to continue</p>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleForm}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            placeholder="Username*"
                            name="memberNick"
                            type="text"
                            value={formData.memberNick}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            placeholder="Password*"
                            name="memberPassword"
                            type="password"
                            value={formData.memberPassword}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <button type="submit" disabled={loading}>
                          {loading ? "Logging in..." : "Login"}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="login-alternative">
                    <h4>Or Login With</h4>
                    <ul>
                      <li>
                        <Link to="#">
                          <i className="fab fa-google" /> Google
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="fab fa-facebook-f" /> Facebook
                        </Link>
                      </li>
                    </ul>
                    <p>
                      {`Don't have any account?`}{" "}
                      <Link to="/register">Register Now</Link>
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Admin access?{" "}
                      <a
                        href={`${API_CONFIG.baseURL}/admin`}
                        style={{ color: "#ff6347", fontWeight: "600" }}
                      >
                        Go to Admin Panel
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginContent;
