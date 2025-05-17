import { Users, FileText, Monitor, ShieldCheck } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import { useEffect, useState } from "react";
import { getDashboardStatsApi } from "../../services/api.service";

const Statistic = ({ users }) => {
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

  const activeAvatars = users
    .filter((user) => user.status === "active")
    .map((user) => user.avatar?.url);

  const avatarsToShow = activeAvatars.slice(0, 5);
  const extraCount = activeAvatars.length - 5;

  if (error) {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="text-crimson-red flex w-full max-w-4xl justify-center rounded-2xl bg-white p-8 shadow dark:bg-[#16163B]">
          Error loading statistics: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="flex w-full max-w-4xl justify-center rounded-2xl bg-white p-8 text-gray-400 shadow dark:bg-[#16163B]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-6">
      <div className="flex w-full max-w-4xl flex-col divide-y divide-gray-100 rounded-2xl bg-white shadow md:flex-row md:divide-x md:divide-y-0 dark:divide-gray-800 dark:bg-[#16163B]">
        {/* Total Users */}
        <div className="flex flex-1 items-center gap-4 px-4 py-6">
          <div className="bg-silver-tree/20 rounded-full p-3">
            <Users className="text-silver-tree h-6 w-6" />
          </div>
          <div>
            <div className="font-body text-silver-chalice text-xs font-medium">
              Total Members
            </div>
            <div className="font-body text-ebony-clay text-2xl font-bold dark:text-white">
              {data.total_users}
            </div>
            <div className="text-silver-tree font-body mt-1 flex items-center gap-1 text-xs font-medium">
              {data.new_users_today > 0 && (
                <span className="">+{data.new_users_today} members today</span>
              )}
            </div>
          </div>
        </div>
        {/* Tổng Notes */}
        <div className="flex flex-1 items-center gap-4 px-4 py-6">
          <div className="bg-cornflower-blue/15 rounded-full p-3">
            <FileText className="text-indigo h-6 w-6" />
          </div>
          <div>
            <div className="text-silver-chalice font-body text-xs font-medium">
              Total Notes
            </div>
            <div className="font-body text-ebony-clay text-2xl font-bold dark:text-white">
              {data.total_notes}
            </div>
          </div>
        </div>
        {/* Active Now */}
        <div className="flex flex-1 items-center gap-4 px-4 py-6">
          <div className="bg-silver-tree/20 rounded-full p-3">
            <Monitor className="text-silver-tree h-6 w-6" />
          </div>
          <div>
            <div className="text-silver-chalice font-body text-xs font-medium">
              Active Now
            </div>
            <div className="font-body text-gravel text-2xl font-bold">
              {data.active_users}
            </div>
            <div className="mt-2 flex">
              {avatarsToShow.map((src, idx) => (
                <Avatar
                  key={idx}
                  src={src}
                  className={`-ml-2 h-6 w-6 rounded-full border-2 border-white first:ml-0 dark:border-gray-900`}
                />
              ))}
              {extraCount > 0 && (
                <div className="font-body text-gravel -ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs leading-8 font-medium dark:border-gray-900 dark:bg-gray-700 dark:text-white">
                  +{extraCount}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* System Health */}
        <div className="flex flex-1 items-center gap-4 px-4 py-6">
          <div className="bg-yellow-orange/20 rounded-full p-3">
            <ShieldCheck
              className={`h-6 w-6 ${data.system_health.status === "healthy" ? "text-silver-tree" : "text-red-500"}`}
            />
          </div>
          <div>
            <div className="text-silver-chalice font-body text-xs font-medium">
              System Health
            </div>
            <div
              className={`font-body text-lg font-bold ${data.system_health.status === "healthy" ? "text-silver-tree" : "text-red-500"}`}
            >
              {data.system_health.status.charAt(0).toUpperCase() +
                data.system_health.status.slice(1)}
            </div>
            <div className="font-body text-silver-chalice mt-1 text-xs">
              Last checked:{" "}
              {new Date(data.system_health.last_checked).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
