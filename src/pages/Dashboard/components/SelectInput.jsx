const SelectInput = ({
  label,
  value,
  onChange,
  onBlur,
  inputRef,
  name,
  options = [],
  error,
}) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      ref={inputRef}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default SelectInput;
