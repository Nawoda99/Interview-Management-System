export default function IconButton({
  icon: Icon,
  onClick,
  className = "",
  iconClassName = "",
  color = "text-gray-700",
  bg = "bg-transparent",
  fill = "none",
  hoverBg = "hover:bg-gray-200 dark:hover:bg-gray-700",
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center p-2 rounded-full transition ${bg} ${hoverBg} ${className}`}
      {...props}
    >
      {Icon && (
        <Icon className={`w-5 h-5 ${color} ${iconClassName}`} fill={fill} />
      )}
    </button>
  );
}
