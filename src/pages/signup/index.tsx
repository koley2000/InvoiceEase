import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaData } from "../../utils/userSchema";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit: handleFormSubmit,
    setError,
    formState: { errors: errors },
  } = useForm<SignupSchemaData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchemaData) => {
    // You can handle your signup API call here
    const response = await axios.post("/api/auth/signup", {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (response.status === 201) {
      // Signup successful
      toast.success("Signup successful! Please log in.");
      router.push("/login");
    } else {
      toast.error("Signup failed. Please try again.");
      setError("email", { type: "manual", message: "Invalid email or password" });
      setError("password", { type: "manual", message: "Invalid email or password" });
      setError("name", { type: "manual", message: "Invalid name" });
      setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-background shadow-lg rounded-lg p-6 mt-7 w-full max-w-sm transform scale-95">
        <h2 className="text-2xl p-3 font-medium text-center mb-5">
          Create New Account
        </h2>

        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`w-full px-3 py-2 mb-1 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-secondary-accent"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              className={`w-full px-3 py-2 mb-1 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-secondary-accent"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className={`w-full px-3 py-2 pr-10 mb-1 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-secondary-accent"
                }`}
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password with visibility toggle */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-1 text-sm"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className={`w-full px-3 py-2 pr-10 border border-neutral-400 rounded-sm focus:outline-none focus:ring-2 text-sm ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-secondary-accent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white mt-6 px-4 py-2 rounded-sm bg-accent hover:bg-secondary-accent transition text-md font-medium hover:cursor-pointer"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
