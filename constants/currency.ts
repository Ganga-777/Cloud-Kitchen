// Currency configuration
export const currency = {
  symbol: '₹',
  code: 'INR',
  format: (amount: number) => {
    // Format with Indian thousands separator (e.g., 1,00,000 instead of 100,000)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount).replace('₹', ''); // Remove the symbol as we'll add it separately
  }
};