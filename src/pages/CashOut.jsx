import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "sonner";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useBalance from "../hooks/useBalance";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const CashOut = () => {
  const { user } = useContext(AuthContext);
  const [balance, refetch] = useBalance();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setFocus("agentInfo");
  }, [setFocus]);

  const errorHandle = () => {
    setFocus("agentInfo");
    reset({ agentInfo: "" });
    setLoading(false);
  };

  const cashOut = useMutation({
    mutationFn: (transaction) => {
      return axiosSecure.post("/cash-out", transaction);
    },
  });

  const handleCashOut = async (data) => {
    setLoading(true);

    if (data.agentInfo === user?.email || data.agentInfo === user?.number) {
      toast.error("You can't cash out to yourself");
      errorHandle();
      return;
    }

    const amount = parseInt(data.amount);
    const fee = Math.floor(amount * 0.015);
    const totalDeduction = amount + fee;

    if (totalDeduction > balance.balance) {
      toast.error("You don't have enough balance");
      setFocus("amount");
      reset({ amount: (balance.balance - fee)>0? (balance.balance - fee):0 });
      setLoading(false);
      return;
    }

    try {
      const res = await axiosPublic.get(`/user/role/${data.agentInfo}`);
      if (res?.data) {
        if (res.data.role !== "agent") {
          toast.error(`This info represents a ${res.data.role}. You can only cash out through an agent`);
          errorHandle();
          return;
        }
      }
    } catch (error) {
      toast.error("Agent not found. Please try again");
      errorHandle();
      return;
    }

    const transaction = {
      senderName: user?.name,
      sender: user.number,
      receiver: data.agentInfo,
      amount: amount,
      fee: fee,
      pin: data.pin,
      date: new Date().toISOString(),
    };
    

    Swal.fire({
      icon: "question",
      html: `
            <div style="text-align: center; font-size: 16px;">
                <p style="margin: 10px 0; font-weight: bold;">
                    Are you sure you want to cash out 
                    <span style="color: #d9534f;">${amount} tk</span>
                    to <span style="color: #d9534f;">${data.agentInfo} ?</span> 
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
        cashOut.mutate(transaction, {
          onSuccess: (data) => {
            setLoading(false);
            if (data.data.success) {
              toast.success("Cash Out Successful", {
                description: `You have cashed out ${amount}tk to ${transaction.receiver}`,
              });
              refetch();
              reset();
            } else {
              toast.error("Error Cashing Out", {
                description: data.data.message,
              });
              errorHandle();
            }
          },
          onError: (error) => {
            setLoading(false);
            console.log(error)
            toast.error("Error Cashing Out", {
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
          <h1 className="text-2xl font-bold">Cash Out</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleCashOut)}
          className="space-y-4 py-6 px-4"
        >
          <div>
            <input
              {...register("agentInfo", {
                required: "Agent Email/ Phone number is required",
                pattern: {
                  value:
                    /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|^\+?(\d{1,3})?[-. (]?\d{1,4}[-. )]?\d{1,4}[-. ]?\d{1,9})$/,
                  message: "Enter the correct format",
                },
              })}
              placeholder="Agent Email or Number"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
            {errors.agentInfo && (
              <p className="mt-1 text-red-500">{errors.agentInfo.message}</p>
            )}
          </div>
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
                "Cash Out"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashOut;
