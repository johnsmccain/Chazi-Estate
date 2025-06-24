import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full bg-white/10 border border-white/20 rounded-xl py-3 text-white
            focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
            transition-all duration-300 appearance-none
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};