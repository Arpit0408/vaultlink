import React, { useState } from "react";
import { createShortUrl } from "../apis/shortUrlApi.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createShortUrl(url, slug);
      setShortUrl(res);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* URL Shortener Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-lg border border-slate-200 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className="text-slate-400 hidden sm:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
        </svg>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL here..."
          required
          className="w-full mr-0 flex-grow mx-4 py-3 text-lg bg-transparent rounded-md outline-none text-slate-700 placeholder-slate-400"
        />

        {isAuthenticated && (
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Custom slug (optional)"
            className="w-full sm:w-40 px-4 py-3 text-lg bg-transparent border rounded-md outline-none text-slate-700 placeholder-slate-400"
          />
        )}

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all whitespace-nowrap"
        >
          Shorten URL
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 text-red-600 bg-red-100 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Result Display Area */}
      {shortUrl && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-center animate-fade-in">
          <p className="text-slate-600 mb-2">Your shortened URL is ready!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white p-3 rounded-lg">
            <span className="text-blue-700 font-medium text-lg flex-grow text-left break-all">
              {shortUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-md transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
