"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function DashboardClient() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <Card>
                <CardHeader>
                    <CardTitle>Thêm Bookmark Mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addBookmark} className="flex flex-col sm:flex-row gap-4">
                        <Input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/article"
                            required
                            disabled={loading}
                            className="flex-1 text-base h-12"
                        />
                        <Button type="submit" disabled={loading} size="lg" className="h-12 w-full sm:w-auto">
                            {loading ? "Đang gọi Gemini AI..." : "Lưu & Tóm tắt"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.length === 0 && !loading && (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-lg">Chưa có bookmark nào. Hãy thêm một link ở trên nhé!</p>
                    </div>
                )}
                {bookmarks.map((bm) => (
                    <Card key={bm.id} className="flex flex-col hover:border-blue-200 hover:shadow-md transition-all group">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg leading-snug line-clamp-2" title={bm.title}>
                                {bm.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col pb-3">
                            <a href={bm.url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm mb-4 truncate w-full block hover:underline">
                                {bm.url}
                            </a>
                            <div className="text-gray-700 text-sm flex-1 line-clamp-5 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {bm.contentSummary || "Đang xử lý tóm tắt..."}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-medium">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                {bm.group?.name || "Chưa phân nhóm"}
                            </span>
                            <span>{new Date(bm.createdAt).toLocaleDateString("vi-VN")}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
