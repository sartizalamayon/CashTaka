import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const TopUp = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setFocus("amount");
  }, [setFocus]);

  const errorHandle = () => {
    setFocus("amount");
    reset({ amount: "" });
    setLoading(false);
  };

  const topUp = useMutation({
    mutationFn: (topUpReq) => {
      return axiosSecure.post("/top-up", topUpReq);
    },
  });

  const handleTopUp = async (data) => {
    setLoading(true);

    const amount = parseInt(data.amount);
    const pin = data.pin;

    const topUpReq = {
      senderName: user?.name,
      sender: user?.number,
      receiver: "admin@cashtaka.com",
      amount: amount,
      fee:0,
      pin: pin,
      date: new Date().toISOString(),
    };

    Swal.fire({
      icon: "question",
      html: `
            <div style="text-align: center; font-size: 16px;">
                <p style="margin: 10px 0; font-weight: bold;">
                    Are you sure you want to request a top-up of 
                    <span style="color: #d9534f;">${amount} tk</span>?
                </p>
            </div>
        `,
      showDenyButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
      confirmButtonColor: "#0A5C36",
    }).then((result) => {
      if (result.isConfirmed) {
        topUp.mutate(topUpReq, {
          onSuccess: (data) => {
            setLoading(false);
            if (data.data.success) {
              toast.success("Top Up Request Successful", {
                description: `You have sent a top-up request of ${amount}tk`,
              });
              reset();
            } else {
              toast.error("Error Sending Top Up Request", {
                description: data.data.message,
              });
              errorHandle();
            }
          },
          onError: (error) => {
            setLoading(false);
            toast.error("Error Sending Top Up Request", {
              description: `${error?.response?.data?.message || error?.message}. Please try again`,
            });
          },
        });
      } else if (result.isDenied || result.isDismissed) {
        setLoading(false);
        return;
      }
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-md items-center space-y-6 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-primary w-full h-24 rounded-t-lg p-4 text-white">
          <h1 className="text-2xl font-bold">Top Up</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleTopUp)}
          className="space-y-4 py-6 px-4"
        >
          <div>
            <input
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 50,
                  message: "Amount has to be at least 50tk",
                },
              })}
              placeholder="Amount"
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
            {errors?.amount && (
              <p className="mt-1 text-red-500">{errors.amount.message}</p>
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
              required
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
                "Send Top Up Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUp;
