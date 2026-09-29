import React from 'react';

export function PageHeader({ title, description, icon: Icon, actionButton }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
              <Icon className="h-6 w-6" />
            </div>
          )}
          {title}
        </h1>
        {description && <p className="text-slate-500 mt-2">{description}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
