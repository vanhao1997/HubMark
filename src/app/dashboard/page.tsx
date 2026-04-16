"use client";

import { useState, useEffect } from "react";

export default function DashboardClient() {
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        const res = await fetch("/api/bookmarks");
        if (res.ok) {
            setBookmarks(await res.json());
        }
    };

    const addBookmark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setLoading(true);
        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (res.ok) {
                setUrl("");
                fetchBookmarks();
            } else {
                alert("Failed to add bookmark.");
            }
        } catch {
            alert("Error adding bookmark");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">Thêm Bookmark Mới</h2>
                <form onSubmit={addBookmark} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="flex-1 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 transition-all"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white font-medium px-8 py-4 rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {loading ? "Đang gọi Gemini AI..." : "Lưu & Tóm tắt"}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.length === 0 && !loading && (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-lg">Chưa có bookmark nào. Hãy thêm một link ở trên nhé!</p>
                    </div>
                )}
                {bookmarks.map((bm) => (
                    <div key={bm.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col group">
                        <h3 className="font-bold text-lg text-gray-900 leading-snug line-clamp-2" title={bm.title}>
                            {bm.title}
                        </h3>
                        <a href={bm.url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm mt-2 mb-4 truncate w-full block hover:underline">
                            {bm.url}
                        </a>
                        <p className="text-gray-700 text-sm flex-1 line-clamp-5 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {bm.contentSummary || "Đang xử lý tóm tắt..."}
                        </p>
                        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-medium">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                {bm.group?.name || "Chưa phân nhóm"}
                            </span>
                            <span>{new Date(bm.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
