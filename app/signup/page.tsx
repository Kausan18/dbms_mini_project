"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState("Customer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, address, password } = form;

    if (!name || !email || !phone || !address || !password) {
      alert("Please fill all fields");
      return;
    }

    alert(`${role} account created successfully!`);

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#020B2D] flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#5B4DFF] rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold">
            B
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join BankManager today
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-2xl px-4 py-3"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-2xl px-4 py-3"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded-2xl px-4 py-3"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Address"
            className="w-full border rounded-2xl px-4 py-3"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-2xl px-4 py-3"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* Role Selection */}
          <div>
            <p className="font-medium mb-3">
              Register As
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
            Create Account
          </button>

        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#5B4DFF] font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}