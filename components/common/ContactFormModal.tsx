"use client";
import { useState } from "react";

export default function ContactFormModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.name || !form.email || !form.message) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });

        // Optional: close modal after delay
        setTimeout(() => {
          setOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
      >
        CONTACT US
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">
              Contact Us
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              ></textarea>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
