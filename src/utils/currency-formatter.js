export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  return formatter.format(amount);
}

// console.log(formatCurrency(1234.56, "GHS", "en-GH")); // Output: GH₵1,234.56
// console.log(formatCurrency(1234.56, "USD", "en-US")); //
