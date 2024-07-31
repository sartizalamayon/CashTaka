import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";

const Home = () => {
  const [curr, setCurr] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (curr === "login") {
      setFocus("info");
    } else {
      setFocus("name");
    }
  }, [setFocus, curr]);

  useEffect(() => {
    setShowPassword(false);
  }, [curr]);

  const onLogin = (data) => {
    login(data, navigate);
  };

  const onSignup = (data) => {
    signup(data, reset, setCurr);
  };

  return (
    <>
      <Helmet>
        <title>CashTaka - Home</title>
      </Helmet>
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-md space-y-6 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center bg-primary w-full h-32 rounded-t-lg p-4 text-white">
            <button className="flex items-center gap-1 text-white opacity-95">
              <TbPigMoney className="text-[1.7rem]" />
              <span className="text-2xl font-mono font-extralight">
                CashTaka
              </span>
            </button>
            <h1 className="text-2xl font-bold">
              {curr === "login" ? "Welcome Back" : "Get Started"}
            </h1>
          </div>
          <div className="px-8 pb-8 max-w-md space-y-6 bg-white">
            <div className="flex justify-around mb-4 border-b-2 border-gray-300">
              <button
                onClick={() => setCurr("login")}
                className={`py-2 px-4 ${
                  curr === "login"
                    ? "border-b-4 border-primary text-primary"
                    : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurr("signup")}
                className={`py-2 px-4 ${
                  curr === "signup"
                    ? "border-b-4 border-primary text-primary"
                    : "text-gray-500"
                }`}
              >
                Signup
              </button>
            </div>

            {curr === "login" && (
              <form onSubmit={handleSubmit(onLogin)} className="space-y-4 py-6">
                <div>
                  <input
                    {...register("info", {
                      required: "Email/ Phone number is required",
                      pattern: {
                        value:
                          /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|^\+?(\d{1,3})?[-. (]?\d{1,4}[-. )]?\d{1,4}[-. ]?\d{1,9})$/,
                        message: "Enter the correct format",
                      },
                    })}
                    placeholder="Email/Number"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors.info && (
                    <p className="mt-1 text-red-500">{errors.info.message}</p>
                  )}
                </div>
                <div className="relative">
                  <input
                    placeholder="Pin"
                    {...register("pin", {
                      required: "PIN is required",
                      minLength: {
                        value: 5,
                        message: "PIN must be exactly 5 digits",
                      },
                      maxLength: {
                        value: 5,
                        message: "PIN must be exactly 5 digits",
                      },
                      pattern: {
                        value: /^\d{5}$/,
                        message: "PIN must be a 5-digit number",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors?.pin && (
                    <p className="mt-1 text-red-500">{errors?.pin?.message}</p>
                  )}
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-primary rounded hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            )}

            {curr === "signup" && (
              <form onSubmit={handleSubmit(onSignup)} className="space-y-4">
                <div>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Name"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors?.name && (
                    <p className="mt-1 text-red-500">{errors?.name?.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email",
                      },
                    })}
                    placeholder="Email"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors?.email && (
                    <p className="mt-1 text-red-500">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("number", {
                      required: "Phone number is required",
                      pattern: {
                        value:
                          /^\+?(\d{1,3})?[-. (]?\d{1,4}[-. )]?\d{1,4}[-. ]?\d{1,9}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors?.number && (
                    <p className="mt-1 text-red-500">
                      {errors?.number?.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    placeholder="5 Digit Pin"
                    {...register("newPin", {
                      required: "PIN is required",
                      minLength: {
                        value: 5,
                        message: "PIN must be exactly 5 digits",
                      },
                      maxLength: {
                        value: 5,
                        message: "PIN must be exactly 5 digits",
                      },
                      pattern: {
                        value: /^\d{5}$/,
                        message: "PIN must be a 5-digit number",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                  {errors?.newPin && (
                    <p className="mt-1 text-red-500">
                      {errors?.newPin?.message}
                    </p>
                  )}
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-sans">Sign Up As :</span>
                    <label className="flex items-center">
                      <input
                        {...register("role", { required: "Please select a role" })}
                        type="radio"
                        value="user"
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2">User</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register("role", { required: "Please select a role" })}
                        type="radio"
                        value="agent"
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2">Agent</span>
                    </label>
                  </div>
                  {errors?.role && (
                    <p className="mt-1 text-red-500">{errors?.role?.message}</p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-primary rounded hover:hover:shadow-xl transition-all duration-300 flex justify-center items-center "
                  >
                    {loading ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
