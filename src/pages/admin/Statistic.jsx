import { Users, FileText, Monitor, ShieldCheck, ChevronUp } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import blankAvatar from "../../assets/images/blank-avatar.jpg";
import { useEffect, useState } from "react";
import { getDashboardStatsApi } from "../../services/api.service";

const Statistic = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardStatsApi();
        setData(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching statistics:", err);
      }
    };
    fetchData();
  }, []);

  // Giả lập danh sách avatar (nếu có thể lấy từ API thì thay thế)
  const activeAvatars = [
    blankAvatar,
    blankAvatar,
    blankAvatar,
    blankAvatar,
    blankAvatar,
  ];

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow p-8 flex justify-center text-red-500">
          Error loading statistics: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow p-8 flex justify-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
        {/* Tổng Users */}
        <div className="flex-1 flex items-center gap-4 py-6 px-4">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
            <Users className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-medium">Total Members</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.total_users}</div>
            <div className="flex items-center gap-1 mt-1 text-green-500 text-xs font-medium">
              {data.new_users_today > 0 && (
                <span className="">+{data.new_users_today} members today</span>
              )}
            </div>
          </div>
        </div>
        {/* Tổng Notes */}
        <div className="flex-1 flex items-center gap-4 py-6 px-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
            <FileText className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-medium">Total Notes</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.total_notes}</div>
          </div>
        </div>
        {/* Active Now */}
        <div className="flex-1 flex items-center gap-4 py-6 px-4">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
            <Monitor className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-medium">Active Now</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.active_users}</div>
            <div className="flex mt-2">
              {activeAvatars.slice(0, data.active_users).map((src, idx) => (
                <Avatar
                  key={idx}
                  src={src}
                  className={`w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 -ml-2 first:ml-0`} />
              ))}
            </div>
          </div>
        </div>
        {/* System Health */}
        <div className="flex-1 flex items-center gap-4 py-6 px-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3">
            <ShieldCheck className={`w-6 h-6 ${data.system_health.status === "healthy" ? "text-green-500" : "text-red-500"}`} />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-medium">System Health</div>
            <div className={`text-lg font-bold ${data.system_health.status === "healthy" ? "text-green-500" : "text-red-500"}`}>{data.system_health.status.charAt(0).toUpperCase() + data.system_health.status.slice(1)}</div>
            <div className="text-xs text-gray-400 mt-1">Last checked: {new Date(data.system_health.last_checked).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;