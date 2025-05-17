import { useState, useEffect } from "react";
import { Trash2, Plus, UserX } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import blankAvatar from "../../assets/images/blank-avatar.jpg";
import { getAllUsersApi, deleteUserApi, createUserApi, deactivateUserApi } from "../../services/api.service";
import UserDialog from "./UserDialog";

const PAGE_SIZE_DEFAULT = 5;
const PAGE_INDEX_DEFAULT = 1;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: PAGE_INDEX_DEFAULT, limit: PAGE_SIZE_DEFAULT, total: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await getAllUsersApi(page, pagination.limit);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.paging.page,
        total: response.paging.total
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page);
  }, [pagination.page]);

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserApi(userId);
      // Refresh the current page
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await deactivateUserApi(userId);
      // Refresh the current page
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.message);
      console.error("Error deactivating user:", err);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUserApi(userData);
      setIsDialogOpen(false);
      // Refresh the current page
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err);
    }
  };

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-6">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow p-8 flex justify-center text-red-500">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center text-gray-400">
              Loading...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          src={user.avatar?.url || blankAvatar}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">{user.gender || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">{user.system_role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'banned' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {user.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-red-500 hover:text-red-900 transition-colors inline-flex items-center justify-center cursor-pointer me-2"
                            title="Deactivate User"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.page === 1 || loading}
                className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={pagination.page * pagination.limit >= pagination.total || loading}
                className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Dialog */}
      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UserManagement;