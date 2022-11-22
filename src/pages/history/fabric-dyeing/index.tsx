import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { db } from "../../../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import HistoryTable from "../../../components/history/HistoryTable";

const HistoryFabricDyeings = () => {
  const [historys, setHistorys] = useState<any>();

  useEffect(() => {
    const getHistory = async () => {
      const q = query(
        collection(db, "historyFabricDyeings"),
        orderBy("createdAt", "desc")
      );
      try {
        onSnapshot(q, (querySnap) =>
          setHistorys(
            querySnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    getHistory();
  }, []);

  return (
    <Box width="calc(100% - 250px)" px={6} mt={12} flex="1">
      <Box w="100%" my={6} bg="white" boxShadow="md">
        <Tabs>
          <TabList>
            <Tab>仕掛中</Tab>
            <Tab>染色履歴</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <HistoryTable
                historys={historys}
                title={"染色仕掛一覧"}
                status={0}
                orderType={2}
              />
            </TabPanel>
            <TabPanel>
              <HistoryTable
                historys={historys}
                title={"染色発注履歴"}
                status={1}
                orderType={2}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default HistoryFabricDyeings;