import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaData } from "../../utils/userSchema";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FiEye, FiEyeOff  } from "react-icons/fi";
import Link from "next/link";

const Login: React.FC = () => {

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit: handleFormSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaData) => {
    toast.loading("Logging in...");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    toast.dismiss();

    if (res?.error) {
      toast.error("Login failed. Please check your credentials.");
      // Mark fields invalid so borders turn red on server/auth errors
      setError("email", { type: "manual", message: "Invalid email or password" });
      setError("password", { type: "manual", message: "Invalid email or password" });
    } else {
      toast.success("Login successful!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-background shadow-lg rounded-lg p-6 w-full max-w-sm transform scale-95">
        <h2 className="text-2xl p-3 font-medium text-center mb-5">Log In</h2>

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1 text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              className={`w-full px-3 py-2 mb-1 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-secondary-accent"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                {...register("password")}
                className={`w-full px-3 py-2 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-secondary-accent"
                }`}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white mt-6 px-4 py-2 rounded-sm bg-accent hover:bg-secondary-accent transition text-md font-medium hover:cursor-pointer"
          >
            LOG IN
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
