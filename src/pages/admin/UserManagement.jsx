import { useState } from "react";
import Table from "../../components/ui/Table";
import SearchBar from "../../components/ui/SearchBar";
import CustomSelect from "../../components/ui/CustomSelect";

const mockUsers = [
  { name: "Jane Cooper", company: "Microsoft", phone: "(225) 555-0118", email: "jane@microsoft.com", country: "United States", status: "Active" },
  { name: "Floyd Miles", company: "Yahoo", phone: "(205) 555-0100", email: "floyd@yahoo.com", country: "Kiribati", status: "Inactive" },
  { name: "Ronald Richards", company: "Adobe", phone: "(302) 555-0107", email: "ronald@adobe.com", country: "Israel", status: "Inactive" },
  { name: "Marvin McKinney", company: "Tesla", phone: "(252) 555-0126", email: "marvin@tesla.com", country: "Iran", status: "Active" },
  { name: "Jerome Bell", company: "Google", phone: "(629) 555-0129", email: "jerome@google.com", country: "Réunion", status: "Active" },
  { name: "Kathryn Murphy", company: "Microsoft", phone: "(406) 555-0120", email: "kathryn@microsoft.com", country: "Curaçao", status: "Active" },
  { name: "Jacob Jones", company: "Yahoo", phone: "(208) 555-0112", email: "jacob@yahoo.com", country: "Brazil", status: "Active" },
  { name: "Kristin Watson", company: "Facebook", phone: "(704) 555-0127", email: "kristin@facebook.com", country: "Åland Islands", status: "Inactive" },
];

const columns = [
  { header: "Customer Name", accessorKey: "name" },
  { header: "Company", accessorKey: "company" },
  { header: "Phone Number", accessorKey: "phone" },
  { header: "Email", accessorKey: "email" },
  { header: "Country", accessorKey: "country" },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className={`px-4 py-1 rounded-md text-sm font-medium ${value === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
          {value}
        </span>
      );
    },
  },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(sortOptions[0]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  // Lọc và sort dữ liệu mock (giả lập search/sort)
  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) =>
    sort.value === "newest" ? 0 : 0
  );
  const paged = sorted.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  return (
    <div className="bg-white rounded-2xl shadow p-8 max-w-8xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black mb-1">All Customers</h2>
          <button className="text-green-500 text-base font-medium hover:underline">Active Members</button>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-[#F9FBFF] rounded-md px-3 py-1 flex items-center border border-gray-100">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Short by :</span>
            <CustomSelect
              value={sort}
              onChange={setSort}
              options={sortOptions}
              customStyle={{ width: "w-28", text: "text-sm", padding: "py-1 px-2", border: "border border-gray-200", borderFocused: "border border-indigo", borderMenu: "border border-gray-200", paddingOption: "px-3 py-2" }}
            />
          </div>
        </div>
      </div>
      <Table
        data={paged}
        columns={columns}
        totalCount={filtered.length}
        pagination={pagination}
        setPagination={setPagination}
        isLoadingTable={false}
      />
      <div className="text-gray-400 text-sm mt-4">Showing data {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filtered.length)} of 256K entries</div>
    </div>
  );
};

export default UserManagement;