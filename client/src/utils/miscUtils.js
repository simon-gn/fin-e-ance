export const getDateRange = (range, customStartDate, customEndDate) => {
  let startDate = new Date();
  let endDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (range) {
    case "Today":
      break;
    case "Yesterday":
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "Last 7 Days":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "Last Month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "Last 3 Month":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "Last 6 Month":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "Last Year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "Custom Range":
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = null;
        endDate = null;
      }
      break;
    default:
      startDate = null;
      endDate = null;
  }

  return { startDate, endDate };
};

export const formatDate = (date) => {
  const transactionDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  let day;

  if (transactionDate.toDateString() === today.toDateString()) day = "Today";
  else if (transactionDate.toDateString() === yesterday.toDateString())
    day = "Yesterday";
  else
    day = transactionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return `${day}, ${transactionDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
