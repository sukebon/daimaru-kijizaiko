// 今日の日付を取得
export const todayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const getSerialNumber = (serialNumber: number) => {
  const str = "0000000" + String(serialNumber);
  return str.slice(-7);
};

export const getCreateUserName = (users: any, userId: string) => {
  const user = users?.find((user: { uid: string }) => userId === user.uid);
  return user?.name || "";
};
