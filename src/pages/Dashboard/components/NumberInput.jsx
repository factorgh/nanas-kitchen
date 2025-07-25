const NumberInput = ({ label, name, error, inputRef, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      ref={inputRef}
      type="number"
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default NumberInput;
