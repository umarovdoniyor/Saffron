/* eslint-disable no-unused-vars */

import { Link, useNavigate } from "react-router-dom";
import logoMixLight from "/assets/img/logo-light.png";
import safronLogo from "/assets/img/safronLogo.jpeg";
import banner7 from "/assets/img/banner/banner1.jpg";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { API_CONFIG } from "../../services/api.config";

interface FormEventHandler {
  (event: React.FormEvent<HTMLFormElement>): void;
}

const RegisterContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    memberNick: "",
    memberEmail: "",
    memberPhone: "",
    memberPassword: "",
    confirmPassword: "",
    memberAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForm: FormEventHandler = async (event) => {
    event.preventDefault();

    // Validate passwords match
    if (formData.memberPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      const result = await dispatch(
        signupUser({
          memberNick: formData.memberNick,
          memberEmail: formData.memberEmail,
          memberPhone: formData.memberPhone,
          memberPassword: formData.memberPassword,
          memberAddress: formData.memberAddress || undefined,
        }),
      ).unwrap();

      toast.success("Registration Successful! Welcome!");

      // Reset form
      setFormData({
        memberNick: "",
        memberEmail: "",
        memberPhone: "",
        memberPassword: "",
        confirmPassword: "",
        memberAddress: "",
      });

      // Redirect to home
      navigate("/");
    } catch (err: any) {
      toast.error(err || "Registration failed. Please try again.");
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
                  <img src={banner7} alt="Image Not Found" />
                  <div className="logo">
                    <Link to="/">
                      <img src={safronLogo} alt="Image Not Found" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="login-forms">
                  <h2>Create an account</h2>
                  <p>Enter your details to create a new account</p>
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
                            placeholder="Email Address*"
                            name="memberEmail"
                            type="email"
                            value={formData.memberEmail}
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
                            placeholder="Phone Number*"
                            name="memberPhone"
                            type="tel"
                            value={formData.memberPhone}
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
                            placeholder="Address (Optional)"
                            name="memberAddress"
                            type="text"
                            value={formData.memberAddress}
                            onChange={handleChange}
                            autoComplete="off"
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
                        <div className="form-group">
                          <input
                            className="form-control"
                            placeholder="Confirm Password*"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
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
                          {loading ? "Registering..." : "Register"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="login-alternative">
                    <h4>Or Register With</h4>
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
                      Already have an account?{" "}
                      <Link to="/login">Login Now</Link>
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

export default RegisterContent;
