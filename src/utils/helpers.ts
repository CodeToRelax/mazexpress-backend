export const validateLibyanNumber = (phoneNumber: string) => {
  const allowedCarriers = ['91', '92', '94', '95'];
  const firstTwoNumbers = phoneNumber.slice(0, 2);
  return allowedCarriers.includes(firstTwoNumbers) && phoneNumber.length === 9 ? true : false;
};

export const validateUserBirthdate = (value: Date) => {
  if (value > new Date()) return false;
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 80);
  if (value < minDate) return false;
  return true;
};
