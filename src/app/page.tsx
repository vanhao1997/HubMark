import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex border-b border-gray-200 pb-16">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900">Hub<span className="text-blue-600">Mark</span> AI</h1>
      </div>
      <div className="mt-16 text-center">
        <p className="text-xl text-gray-600 mb-8 max-w-2xl px-4 leading-relaxed">
          Quản lý bookmark thông minh. Tự động lưu trữ, phân loại và <strong className="text-blue-600">tóm tắt nội dung bằng Gemini AI</strong>.
        </p>
        <a
          href="/api/auth/signin"
          className="inline-block rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition-all focus:outline-none"
        >
          Bắt đầu sử dụng
        </a>
      </div>
    </main>
  );
}
