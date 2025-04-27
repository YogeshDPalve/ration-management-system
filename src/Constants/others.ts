const d = new Date();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentMonthName = monthNames[d.getMonth() + 1];

export const notificationType = {
  allotment: {
    type: "Allotment",
    msg: `Monthly allotment for  ${currentMonthName} has been assigned.`,
  },
};
