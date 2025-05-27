import { useState, useEffect } from "react";
import { Trash2, Plus, UserX } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import blankAvatar from "../../assets/images/blank-avatar.jpg";
import {
  getAllUsersApi,
  deleteUserApi,
  createUserApi,
  deactivateUserApi,
} from "../../services/api.service";
import UserDialog from "./UserDialog";
import ConfirmDialog from "../../components/ui/popup/ConfirmDialog";
import notify from "../../components/ui/CustomToast";

const PAGE_SIZE_DEFAULT = 5;
const PAGE_INDEX_DEFAULT = 1;

const UserManagement = ({ users, setUsers }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCreateUser, setErrorCreateUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: PAGE_INDEX_DEFAULT,
    limit: PAGE_SIZE_DEFAULT,
    total: 0,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });

  const fetchUsers = async (page) => {
    setLoading(true);

    await getAllUsersApi(page, pagination.limit)
      .then((response) => {
        setUsers(response.data);
        setPagination((prev) => ({
          ...prev,
          page: response.paging.page,
          total: response.paging.total,
        }));
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(pagination.page);
  }, [pagination.page]);

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const confirmDelete = (userId) => {
    setDialogConfig({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user permanently?",
      confirmText: "Delete",
      onConfirm: () => handleDeleteUser(userId),
    });
  };

  const confirmDeactivate = (userId) => {
    setDialogConfig({
      isOpen: true,
      title: "Deactivate User",
      message: "Are you sure you want to deactivate this user?",
      confirmText: "Deactivate",
      onConfirm: () => handleDeactivateUser(userId),
    });
  };

  const closeDialog = () => {
    setDialogConfig({ ...dialogConfig, isOpen: false });
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await deleteUserApi(userId);
      if (res.data) {
        notify("success", "User deleted!", "", "var(--color-silver-tree)");
      } else {
        notify("error", "Delete user failed", "", "var(--color-crimson-red)");
      }
      // Refresh the current page
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
    } finally {
      closeDialog();
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const res = await deactivateUserApi(userId);
      if (res.data) {
        notify("success", "User deactivated!", "", "var(--color-silver-tree)");
      } else {
        notify(
          "error",
          "Deactivate user failed",
          "",
          "var(--color-crimson-red)",
        );
      }
      // Refresh the current page
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.message);
      console.error("Error deactivating user:", err);
    } finally {
      closeDialog();
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const res = await createUserApi(userData);
      if (res.data) {
        setIsDialogOpen(false);
        setErrorCreateUser(null);
        notify("success", "User created!", "", "var(--color-silver-tree)");
        // Refresh the current page
        fetchUsers(pagination.page);
      } else {
        if (res.code === 500) {
          setErrorCreateUser("Email already exists");
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating user:", err);
    }
  };

  if (error) {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="text-crimson-red flex w-full max-w-6xl justify-center rounded-2xl bg-white p-8 shadow dark:bg-[#16163B]">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-6">
      <div className="w-full max-w-6xl rounded-2xl bg-white shadow dark:bg-[#16163B]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-100/20">
          <h2 className="text-ebony-clay font-body text-xl font-bold dark:text-white">
            User Management
          </h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-cornflower-blue/80 hover:bg-cornflower-blue focus:ring-cornflower-blue flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8 text-gray-400">
              Loading...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    User
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Email
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Phone
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Gender
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Role
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Status
                  </th>
                  <th className="font-body px-6 py-4 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Created At
                  </th>
                  <th className="font-body px-6 py-4 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          src={user.avatar?.url || blankAvatar}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-ebony-clay font-body text-sm font-medium dark:text-white">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-ebony-clay font-body text-sm dark:text-white">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-ebony-clay font-body text-sm dark:text-white">
                        {user.phone || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-ebony-clay font-body text-sm capitalize dark:text-white">
                        {user.gender || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-ebony-clay font-body text-sm capitalize dark:text-white">
                        {user.system_role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-body inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          user.status === "active"
                            ? "bg-silver-tree/20 text-silver-tree"
                            : user.status === "banned"
                              ? "bg-crimson-red/20 text-crimson-red"
                              : "bg-yellow-orange/20 text-yellow-orange"
                        }`}
                      >
                        {user.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-ebony-clay font-body text-sm dark:text-white">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {user.status !== "banned" && (
                          <button
                            onClick={() => confirmDeactivate(user.id)}
                            className="me-2 inline-flex cursor-pointer items-center justify-center text-red-500 transition-colors hover:text-red-900"
                            title="Deactivate User"
                          >
                            <UserX className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="inline-flex cursor-pointer items-center justify-center text-red-500 transition-colors hover:text-red-700"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ConfirmDialog
          isOpen={dialogConfig.isOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          confirmText={dialogConfig.confirmText}
          cancelText="Cancel"
          onConfirm={dialogConfig.onConfirm}
          onCancel={closeDialog}
        />

        {/* Pagination */}
        <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="font-body flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.page === 1 || loading}
                className="text-ebony-clay cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={
                  pagination.page * pagination.limit >= pagination.total ||
                  loading
                }
                className="text-ebony-clay cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
        handleCreateUser={handleCreateUser}
        errorCreateUser={errorCreateUser}
      />
    </div>
  );
};

export default UserManagement;
