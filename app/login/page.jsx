"use client";

import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    // console.log(data);
    const res = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log(result);
    if (res.ok) {
      localStorage.setItem("token", result.token);
      toast("login sucessfull");
      router.push("/");
    } else {
      console.log("invalid");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg space-y-6"
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 text-sm">Login to your account</p>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="you@example.com"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="******"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <span className="text-blue-600 hover:underline cursor-pointer">
          Sign up
        </span>
      </p>
    </form>
  );
}
