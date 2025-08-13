const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  onAddUser,
}) => (
  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 border-b border-amber-200">
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 w-full sm:w-64"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
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
      <button
        onClick={onAddUser}
        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="ml-2">Add User</span>
      </button>
    </div>
  </div>
);

export default SearchFilterBar;
