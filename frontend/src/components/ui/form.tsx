import React from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

interface InputProps
  extends FormFieldProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({
  label,
  error,
  required,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 border rounded-lg
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

interface TextareaProps
  extends FormFieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({
  label,
  error,
  required,
  helperText,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2 border rounded-lg resize-none
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps
  extends FormFieldProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  required,
  helperText,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border rounded-lg
          ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
}

export function Form({
  children,
  spacing = "md",
  className = "",
  ...props
}: FormProps) {
  const spacingClasses = {
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6",
  };

  return (
    <form className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </form>
  );
}
