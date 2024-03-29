import {
  Box,
  Flex,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  CuttingReportType,
  CuttingProductType,
  CuttingHistoryType,
} from "../../../../types";
import { CuttingReportModal } from "../../../components/tokushima/CuttingReportModal";
import { HistoryProductMenu } from "../../../components/tokushima/HistoryProductMenu";
import { SearchArea } from "../../../components/SearchArea";
import { useCuttingReportFunc } from "../../../hooks/UseCuttingReportFunc";
import { useGetDisp } from "../../../hooks/UseGetDisp";
import { useUtil } from "../../../hooks/UseUtil";
import { useForm, FormProvider } from "react-hook-form";
import { useSWRCuttingReports } from "../../../hooks/swr/useSWRCuttingReports";
import { NextPage } from "next";

type Inputs = {
  start: string;
  end: string;
  client: string;
  staff: string;
};

const HistoryCutting: NextPage = () => {
  const {
    getSerialNumber,
    getUserName,
    getProductNumber,
    getProductName,
    getColorName,
  } = useGetDisp();
  const { scaleCalc } = useCuttingReportFunc(null, null);
  const { getTodayDate, get3monthsAgo } = useUtil();
  const [startDay, setStartDay] = useState(get3monthsAgo());
  const [endDay, setEndDay] = useState(getTodayDate());
  const [staff, setStaff] = useState("");
  const [client, setClient] = useState("");
  const { data, isLoading } = useSWRCuttingReports(startDay, endDay);
  const [cuttingList, setCuttingList] = useState([] as CuttingReportType[]);

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
    setCuttingList(
      data?.contents
        ?.map((report: CuttingReportType) =>
          report?.products.map(
            (product: CuttingProductType) =>
            ({
              ...report,
              ...product,
            } as CuttingHistoryType)
          )
        )
        .flat()
        .filter((report) => staff === report.staff || staff === "")
        .filter((report) => report.client.includes(String(client)))
    );
  }, [startDay, endDay, data, staff, client]);

  if (cuttingList === null)
    return (
      <Flex w="full" h="100vh" justify="center" align="center">
        <Spinner />
      </Flex>
    );

  return (
    <Box width="calc(100% - 250px)" px={6} mt={12} flex="1">
      <Box w="100%" my={6} p={6} bg="white" boxShadow="md" rounded="md">
        <Stack spacing={8}>
          <Box as="h2" fontSize="2xl">
            裁断生地一覧
          </Box>
          <FormProvider {...methods}>
            <SearchArea onSubmit={onSubmit} onReset={onReset} client="client" />
          </FormProvider>
          <TableContainer p={3} w="100%">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>詳細</Th>
                  <Th>裁断日</Th>
                  <Th>生地品番</Th>
                  <Th>色番</Th>
                  <Th>品名</Th>
                  <Th>数量</Th>
                  <Th>裁断報告書NO.</Th>
                  <Th>加工指示書NO</Th>
                  <Th>受注先名</Th>
                  <Th>製品名</Th>
                  <Th>数量</Th>
                  <Th>用尺</Th>
                  <Th>担当者名</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cuttingList?.map((list: any, index: number) => (
                  <Tr key={index}>
                    <Td>
                      <Flex alignItems="center" gap={3}>
                        <HistoryProductMenu productId={list.productId} />
                        <CuttingReportModal
                          reportId={list.id}
                          report={list}
                          startDay={startDay}
                          endDay={endDay}
                        />
                      </Flex>
                    </Td>
                    <Td>{list.cuttingDate}</Td>
                    <Td>{getProductNumber(list.productId)}</Td>
                    <Td>{getColorName(list.productId)}</Td>
                    <Td>{getProductName(list.productId)}</Td>
                    <Td isNumeric>{list.quantity}m</Td>
                    <Td>{getSerialNumber(list.serialNumber)}</Td>
                    <Td>{list.processNumber}</Td>
                    <Td>{list.client}</Td>
                    <Td>{list.itemName}</Td>
                    <Td isNumeric>{list.totalQuantity}</Td>
                    <Td isNumeric>
                      {scaleCalc(list.quantity, list.totalQuantity)}m
                    </Td>
                    <Td>{getUserName(list.staff)}</Td>
                    <Td></Td>
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

export default HistoryCutting;
