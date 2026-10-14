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
  placeholderClassName,
  allowClear = true,
  id,
}) {
  // Always use controlled string value; default to '' so Radix stays controlled and renders placeholder
  const safeValue = value !== undefined && value !== null ? String(value) : '';

  const handleValueChange = (newVal) => {
    const resolvedValue = newVal === '__CLEAR__' ? '' : newVal;
    if (onChange) {
      // Support standard synthetic event syntax: e.target.value
      onChange({ target: { value: resolvedValue } });
    }
  };

  const selectedOpt = options.find((opt) => {
    const optValue = typeof opt === 'object' ? String(opt.value ?? opt.id ?? opt._id ?? '') : String(opt);
    return safeValue !== '' && optValue === safeValue;
  });
  const selectedLabel = selectedOpt
    ? (typeof selectedOpt === 'object' ? (selectedOpt.label ?? selectedOpt.name) : selectedOpt)
    : null;

  const hasMatchingOption = options.some((opt) => {
    const optLabel = typeof opt === 'object' ? (opt.label ?? opt.name) : opt;
    return optLabel === placeholder;
  });

  return (
    <Select
      value={safeValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        translate="no"
        className={cn(
          'w-full transition-all notranslate',
          !safeValue && (placeholderClassName || 'text-slate-400 dark:text-slate-500 font-normal data-[placeholder]:text-slate-400 dark:data-[placeholder]:text-slate-500'),
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {selectedLabel ? <span className="truncate">{selectedLabel}</span> : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent translate="no" className="notranslate">
        {placeholder && allowClear && !hasMatchingOption && (
          <SelectItem
            value="__CLEAR__"
            className="text-slate-400 dark:text-slate-500 italic py-2"
          >
            {placeholder}
          </SelectItem>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? String(opt.value ?? opt.id ?? opt._id ?? '') : String(opt);
          const optLabel = typeof opt === 'object' ? (opt.label ?? opt.name) : opt;
          const optSub = typeof opt === 'object' ? opt.sublabel : null;
          const optDisabled = typeof opt === 'object' ? Boolean(opt.disabled) : false;
          const optSubClass = typeof opt === 'object' ? opt.sublabelClass : null;

          return (
            <SelectItem key={optValue} value={optValue} disabled={optDisabled}>
              <div className="flex items-center justify-between gap-2.5 w-full min-w-0">
                <span className={cn("truncate flex-1 text-left", optDisabled && "opacity-60")}>
                  {optLabel}
                </span>
                {optSub && (
                  <span className={cn("text-[11px] shrink-0 font-medium", optSubClass || "text-slate-400 dark:text-slate-500")}>
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
