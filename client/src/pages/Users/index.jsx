import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      id: 1,
      uid: "8jW0LG41pnfuwGjfeY4ofbIfUE33",
      username: "admin",
      email: "nawoda@nibm.lk",
      employeeID: "1",
      mobileNumber: "0776261417",
      role: "admin",
      status: "active",
      lastLogin: "2025-06-12 09:30",
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      uid: "9kX1MH52qogvxHkgfZ5pgcJgVF44",
      username: "hr_manager",
      email: "sarah.johnson@company.com",
      employeeID: "2",
      mobileNumber: "0771234567",
      role: "hr_manager",
      status: "active",
      lastLogin: "2025-06-12 08:15",
      createdAt: "2025-02-01",
    },
    {
      id: 3,
      uid: "7iY0NH41pnfuwGjfeY4ofbIfUE22",
      username: "interviewer1",
      email: "john.smith@company.com",
      employeeID: "3",
      mobileNumber: "0779876543",
      role: "interviewer",
      status: "active",
      lastLogin: "2025-06-11 16:45",
      createdAt: "2025-02-15",
    },
    {
      id: 4,
      uid: "6hZ9MG40onfvwGjfeY4ofbIfUE11",
      username: "recruiter1",
      email: "emma.wilson@company.com",
      employeeID: "4",
      mobileNumber: "0775555555",
      role: "recruiter",
      status: "inactive",
      lastLogin: "2025-06-08 14:20",
      createdAt: "2025-03-01",
    },
    {
      id: 5,
      uid: "5gY8LF39nmevwGjfeY4ofbIfUE00",
      username: "coordinator1",
      email: "mike.brown@company.com",
      employeeID: "5",
      mobileNumber: "0773333333",
      role: "coordinator",
      status: "inactive",
      lastLogin: "2025-06-12 07:30",
      createdAt: "2025-03-15",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeID.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} selected users?`
      )
    ) {
      setUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    }
  };

  const handleStatusToggle = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      hr_manager: "bg-blue-100 text-blue-800",
      interviewer: "bg-green-100 text-green-800",
      recruiter: "bg-purple-100 text-purple-800",
      coordinator: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} className="text-amber-700" />
            <h1 className="text-3xl font-bold text-amber-900">
              User Management
            </h1>
          </div>
          <p className="text-amber-700">
            Manage system users, roles, and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {users.length}
                </p>
              </div>
              <Users size={24} className="text-amber-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <UserCheck size={24} className="text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Inactive Users
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {users.filter((u) => u.status === "inactive").length}
                </p>
              </div>
              <UserX size={24} className="text-red-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Admins</p>
                <p className="text-2xl font-bold text-amber-900">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <Shield size={24} className="text-amber-600" />
            </div>
          </Card>
        </div>
        <Card>
          <div className="p-6 border-b border-amber-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 w-full sm:w-64"
                  />
                </div>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="interviewer">Interviewer</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="coordinator">Coordinator</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => navigate("/users/create")}
                  variant="primary"
                >
                  <span className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add User
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-3 text-left"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100 ">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-amber-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-amber-900 flex items-center gap-1">
                        <Mail size={14} />
                        {user.email}
                      </div>
                      <div className="text-sm text-amber-600 flex items-center gap-1">
                        <Phone size={14} />
                        {user.mobileNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>

                        <button className="text-amber-600 hover:text-amber-800 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="small"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="small"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
