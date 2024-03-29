import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../firebase/sever";
import { User, CuttingReportType } from "../../../../types";

const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let monthStr = "0" + month;
  monthStr = monthStr.slice(-2);
  const day = date.getDate();
  let dayStr = "0" + day;
  dayStr = dayStr.slice(-2);
  return `${year}-${monthStr}-${dayStr}`;
};

const days = 1000 * 60 * 60 * 12;

type Data = {
  contents: CuttingReportType[];
  count?: FirebaseFirestore.AggregateField<number>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) {
  //   if (req.query.API_KEY !== process.env.BACKEND_API_KEY) {
  //     return res.status(405).json("error");
  //   }
  if (req.method === "GET") {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as User)
    );

    const querySnapshot = await db
      .collection("cuttingReports")
      .orderBy("createdAt", "desc")
      .get();
    //   .startAt(getTodayDate())
    //   .endAt(new Date(Number(new Date().getTime()) - days))

    const reports = querySnapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id } as CuttingReportType))
      .filter((report) => Number(report?.itemType) === 1);
    const contents = reports.map((content) => {
      const user = users.find((user) => user.uid === content.staff);
      return { ...content, username: user.name };
    });
    return res.status(200).json({ contents });
  }
}
