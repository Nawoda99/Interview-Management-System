const StatCard = ({ label, value, icon, className = "" }) => (
  <div
    className={`p-4 bg-white rounded-lg shadow flex items-center justify-between ${className}`}
  >
    <div>
      <p className="text-sm font-medium text-amber-600">{label}</p>
      <p className="text-2xl font-bold text-amber-900">{value}</p>
    </div>
    {icon}
  </div>
);

export default StatCard;
