"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (role === "Customer") {
      router.push("/dashboard");
    } else if (role === "Admin") {
      router.push("/admin");
    } else {
      router.push("/manager");
    }
  };

  return (
    <div className="min-h-screen bg-[#020B2D] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#5B4DFF] rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold">
            B
          </div>

          <h1 className="text-3xl font-bold mt-4">
            BankManager
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-2xl px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-2xl px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <p className="font-medium mb-3">
              Login As
            </p>

            <div className="grid grid-cols-3 gap-2">

              {["Customer", "Admin", "Manager"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`py-3 rounded-2xl border transition ${
                    role === item
                      ? "bg-[#5B4DFF] text-white"
                      : "bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5B4DFF] text-white py-3 rounded-2xl hover:bg-[#4B3DF0]"
          >
            Sign In
          </button>

        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#5B4DFF] font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}