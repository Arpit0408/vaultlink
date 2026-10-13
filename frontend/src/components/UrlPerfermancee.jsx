import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllUserUrls } from '../apis/userApi.js'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const UrlPerformance = () => {
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ['UrlPerformances'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const [copiedId, setCopiedId] = React.useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error loading your URLs: {error.message}
      </div>
    );
  }

  if (!urls || !urls.urls || urls.urls.length === 0) {
    return (
      <div className="text-center text-gray-500 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-lg font-medium">No URLs found</p>
        <p className="mt-1">You haven't created any shortened URLs yet.</p>
      </div>
    );
  }

  // Top 8 URLs based on clicks
  const top8Urls = urls.urls
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);

  // Chart data same as top8Urls but mapped to needed shape
  const chartData = top8Urls.map(url => ({
    name: url.short,
    clicks: url.clicks,
  }));

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg mt-5 overflow-hidden">

      {/* Chart Section */}
      <div className="w-full h-96 md:p-4 sm:p-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Top  URL Performers</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
          >
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#4f46e5"
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {top8Urls.map((url) => (
              <tr key={url._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-xs">{url.full}</div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`${window.location.origin}/${url.short}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 hover:underline text-sm font-mono"
                  >
                    {`/${url.short}`}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleCopy(`${window.location.origin}/${url.short}`, url._id)}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      copiedId === url._id
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copiedId === url._id ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy URL
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UrlPerformance;
