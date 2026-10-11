import React from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, icon: Icon, actionButton }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            {description}
          </p>
        )}
      </div>
      {actionButton && <div className="shrink-0">{actionButton}</div>}
    </div>
  );
}
