import {
  Box,
  Button,
  Flex,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { CuttingReportType } from "../../../../types";
import { useCuttingReportFunc } from "../../../hooks/UseCuttingReportFunc";
import { useGetDisp } from "../../../hooks/UseGetDisp";
import { useUtil } from "../../../hooks/UseUtil";
import SearchArea from "../../../components/SearchArea";
import CuttingReportModal from "../../../components/tokushima/CuttingReportModal";
import { useForm, FormProvider } from "react-hook-form";
import { useSWRCuttingReports } from "../../../hooks/swr/useSWRCuttingReports";
import CuttingReportEditModal from "../../../components/tokushima/CuttingReportEditModal";
import { NextPage } from "next";

type Inputs = {
  start: string;
  end: string;
  client: string;
  staff: string;
};

const CuttingReport: NextPage = () => {
  const { getSerialNumber, getUserName } = useGetDisp();
  const { getTodayDate, get3monthsAgo } = useUtil();
  const [startDay, setStartDay] = useState(get3monthsAgo());
  const [endDay, setEndDay] = useState(getTodayDate());
  const [staff, setStaff] = useState("");
  const [client, setClient] = useState("");
  const [filterData, setFilterData] = useState([] as CuttingReportType[]);
  const { csvData, scaleCalc, deleteCuttingReport } = useCuttingReportFunc(
    startDay,
    endDay
  );
  const { data } = useSWRCuttingReports(startDay, endDay);

  const methods = useForm<Inputs>({
    defaultValues: {
      start: startDay,
      end: endDay,
      staff: "",
      client: "",
    },
  });

  const onSubmit = (data: Inputs) => {
    setStartDay(data.start);
    setEndDay(data.end);
    setClient(data.client);
    setStaff(data.staff);
  };
  const onReset = () => {
    setStartDay(get3monthsAgo());
    setEndDay(getTodayDate());
    setStaff("");
    setClient("");
    methods.reset();
  };

  useEffect(() => {
    if (!staff) {
      setFilterData(
        data?.contents?.filter((report) =>
          report.client.includes(String(client))
        )
      );
    } else {
      setFilterData(
        data?.contents
          ?.filter((report) => staff === report.staff || staff === "")
          .filter((report) => report.client.includes(String(client)))
      );
    }
  }, [data, staff, client]);

  return (
    <Box width="calc(100% - 250px)" px={6} mt={12} flex="1">
      <Box w="100%" my={6} p={6} bg="white" boxShadow="md" rounded="md">
        <Stack spacing={8}>
          <Flex alignItems="center" justifyContent="space-between">
            <Box as="h2" fontSize="2xl">
              裁断報告書
            </Box>
            <CSVLink data={csvData} filename={`裁断報告書_${getTodayDate()}`}>
              <Button size="sm">CSV</Button>
            </CSVLink>
          </Flex>
          <FormProvider {...methods}>
            <SearchArea onSubmit={onSubmit} onReset={onReset} client="client" />
          </FormProvider>
          <TableContainer p={3} w="100%">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>詳細</Th>
                  <Th>裁断報告書NO.</Th>
                  <Th>裁断日</Th>
                  <Th>加工指示書NO.</Th>
                  <Th>品名</Th>
                  <Th>受注先名</Th>
                  <Th>数量</Th>
                  <Th>担当者名</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterData?.map((report: CuttingReportType) => (
                  <Tr key={report.serialNumber}>
                    <Td>
                      <Flex gap={3}>
                        <CuttingReportModal
                          report={report}
                          reportId={report.id}
                          startDay={startDay}
                          endDay={endDay}
                        />
                      </Flex>
                    </Td>
                    <Td>{getSerialNumber(report.serialNumber)}</Td>
                    <Td>{report.cuttingDate}</Td>
                    <Td>{report.processNumber}</Td>
                    <Td>{report.itemName}</Td>
                    <Td>{report.client}</Td>
                    <Td isNumeric>{report.totalQuantity.toLocaleString()}</Td>
                    <Td>{getUserName(report.staff)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Box>
  );
};

export default CuttingReport;
