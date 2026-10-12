'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function CustomSelect({
  value,
  onChange,
  placeholder = 'Select option...',
  options = [],
  disabled = false,
  className,
  id,
}) {
  // Ensure safe string value and handle empty string / null without crashing Radix Select
  const safeValue = value !== undefined && value !== null && value !== '' ? String(value) : undefined;

  const handleValueChange = (newVal) => {
    const resolvedValue = newVal === '__CLEAR__' ? '' : newVal;
    if (onChange) {
      // Support standard synthetic event syntax: e.target.value
      onChange({ target: { value: resolvedValue } });
    }
  };

  return (
    <Select
      value={safeValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={cn(
          'w-full transition-all',
          !safeValue && 'text-slate-400 dark:text-slate-500 font-normal',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {placeholder && (
          <SelectItem
            value="__CLEAR__"
            className="text-slate-400 dark:text-slate-500 italic py-2"
          >
            {placeholder}
          </SelectItem>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? String(opt.value ?? opt.id) : String(opt);
          const optLabel = typeof opt === 'object' ? (opt.label ?? opt.name) : opt;
          const optSub = typeof opt === 'object' ? opt.sublabel : null;

          return (
            <SelectItem key={optValue} value={optValue}>
              <div className="flex items-center justify-between gap-2.5 w-full min-w-0">
                <span className="truncate flex-1 text-left">{optLabel}</span>
                {optSub && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-normal">
                    {optSub}
                  </span>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
