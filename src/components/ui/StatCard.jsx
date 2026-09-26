function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accent = "blue",
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span>{title}</span>

        <div className={`stat-icon ${accent}`}>
          {icon}
        </div>
      </div>

      <strong className="stat-value">{value}</strong>

      <div className="stat-footer">
        {trend && (
          <span className="stat-trend">
            {trend}
          </span>
        )}

        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export default StatCard;