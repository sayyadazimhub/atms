import React from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, icon: Icon, actionButton, glowColor = "bg-emerald-500/10" }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
      <div className={cn("absolute top-0 right-0 -m-8 h-48 w-48 rounded-full blur-3xl", glowColor)} />
      <div className="relative">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        {description && (
          <p className="text-slate-400 mt-2 flex items-center gap-2 font-medium">
            {Icon && <Icon className="h-4 w-4" />}
            {description}
          </p>
        )}
      </div>
      {actionButton && (
        <div className="relative">
          {actionButton}
        </div>
      )}
    </div>
  );
}
