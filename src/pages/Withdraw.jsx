import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useBalance from "../hooks/useBalance";

const Withdraw = () => {
  const { user } = useContext(AuthContext);
  const [balance, refetch] = useBalance();
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

  const withdraw = useMutation({
    mutationFn: (transaction) => {
      return axiosSecure.post("/withdraw", transaction);
    },
  });

  const handleWithdraw = async (data) => {
    setLoading(true);

    const amount = parseInt(data.amount);
    const fee = Math.floor(amount * 0.005);
    const totalDeduction = amount + fee;
    const pin = data.pin;

    if (totalDeduction > balance.balance) {
        toast.error("You don't have enough balance");
        setFocus("amount");
        reset({ amount: (balance.balance - fee)>0? (balance.balance - fee):0 });
        setLoading(false);
        return;
    }

    const transaction = {
      senderName: user?.name,
      sender: user?.number,
      receiver: "admin@cashtaka.com",
      amount: amount,
      fee: 0,
      pin: pin,
      date: new Date().toISOString(),
    };

    Swal.fire({
      icon: "question",
      html: `
            <div style="text-align: center; font-size: 16px;">
                <p style="margin: 10px 0; font-weight: bold;">
                    Are you sure you want to Withdraw 
                    <span style="color: #d9534f;">${amount} tk</span> 
                </p>
                <p style="margin: 10px 0; font-weight: bold;">
                    <span style="color: #22c55e;">Total Deduction: ${totalDeduction} tk</span>
                </p>
                <p style="margin: 10px 0; font-size: 12px; color: #f0ad4e;">
                    Fee Applied: ${fee} tk
                </p>
            </div>
        `,
      showDenyButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
      confirmButtonColor: "#0A5C36",
    }).then((result) => {
      if (result.isConfirmed) {
        withdraw.mutate(transaction, {
          onSuccess: (data) => {
            setLoading(false);
            if (data.data.success) {
              toast.success("Withdraw Successful", {
                description: `You have withdrawed ${amount}tk`,
              });
              refetch();
              reset();
            } else {
              toast.error("Error Withdrawal. Please Try again");
              errorHandle();
            }
          },
          onError: (error) => {
            setLoading(false);
            toast.error("Error Withdrawal", {
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
          <h1 className="text-2xl font-bold">Withdraw</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleWithdraw)}
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
                "Withdraw"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;
