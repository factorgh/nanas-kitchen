const TextInput = ({
  label,
  error,
  value,
  onChange,
  onBlur,
  name,
  type = "text",
  placeholder,
  inputRef,
  ...rest
}) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={inputRef}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      {...rest}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default TextInput;
