import React from "react";

const PageHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={32} className="text-amber-700" />}
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold text-amber-900">{title}</h1>
        {subtitle && <p className="text-amber-700">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default PageHeader;
