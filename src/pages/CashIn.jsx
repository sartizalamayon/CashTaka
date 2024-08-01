import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "sonner";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CashIn = () => {
  const { user } = useContext(AuthContext);
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

  const cashIn = useMutation({
    mutationFn: (cashInReq) => {
      return axiosSecure.post("/cash-in", cashInReq);
    },
  });

  const handleCashIn = async (data) => {
    setLoading(true);

    if (data.agentInfo === user?.email || data.agentInfo === user?.number) {
      toast.error("You can't cash in to yourself");
      errorHandle();
      return;
    }

    const amount = parseInt(data.amount);

    try {
      const res = await axiosPublic.get(`/user/role/${data.agentInfo}`);
      if (res?.data) {
        if (res.data.role !== "agent") {
          toast.error(`This info represents a ${res.data.role}. You can only cash in through an agent`);
          errorHandle();
          return;
        }
      }
    } catch (error) {
      toast.error("Agent not found. Please try again");
      errorHandle();
      return;
    }

    const cashInReq = {
      senderName: user?.name,
      sender: user.number,
      receiver: data.agentInfo,
      amount: amount,
      date: new Date().toISOString(),
    };

    Swal.fire({
      icon: "question",
      html: `
            <div style="text-align: center; font-size: 16px;">
                <p style="margin: 10px 0; font-weight: bold;">
                    Are you sure you want to cash in 
                    <span style="color: #d9534f;">${amount} tk</span>
                    to <span style="color: #d9534f;">${data.agentInfo} ?</span> 
                </p>
            </div>
        `,
      showDenyButton: true,
      confirmButtonText: "Proceed",
      denyButtonText: `Cancel`,
      confirmButtonColor: "#0A5C36",
    }).then((result) => {
      if (result.isConfirmed) {
        cashIn.mutate(cashInReq, {
          onSuccess: (data) => {
            setLoading(false);
            if (data.data.success) {
              toast.success("Cash In Request Successful", {
                description: `You have sent a cash in request of ${amount}tk to ${cashInReq.receiver}`,
              });
              reset();
            } else {
              toast.error("Error Sending Cash In Request", {
                description: data.data.message,
              });
              errorHandle();
            }
          },
          onError: (error) => {
            setLoading(false);
            toast.error("Error Sending Cash In Request", {
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
          <h1 className="text-2xl font-bold">Cash In</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleCashIn)}
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
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-primary rounded hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Send Cash In Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashIn;
