import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useProductsStore, useSettingStore } from "../../../store";
import { Product } from "../../../types";
import { useGetDisp } from "../../hooks/UseGetDisp";
import { useUtil } from "../../hooks/UseUtil";

const CompleteId: NextPage = () => {
  const router = useRouter();
  const products = useProductsStore((state) => state.products);
  const [product, setProduct] = useState<Product>();
  const quantity = router.query.quantity;
  const scheduledAt = router.query.scheduledAt;
  const serialNumber = router.query.serialNumber;
  const stockPlace = router.query.stockPlace;
  const createUser = router.query.createUser;
  const stockPlaces = useSettingStore((state) => state.stockPlaces);
  const { getSerialNumber } = useGetDisp();
  const { getNow } = useUtil();
  const [items, setItems] = useState({ orderType: "発注書", show: "1" });

  useEffect(() => {
    const product = products.find(
      (product) => router.query.productId === product.id
    );
    setProduct(product);
  }, [products, router.query.productId]);

  const pdhDownloadHandler = () => {
    const target = document.getElementById("pdf-id");
    if (target === null) return;

    html2canvas(target, { scale: 2.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/svg", 1.0);
      let pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "SVG",
        5,
        10,
        canvas.width / 10,
        canvas.height / 10
      );
      pdf.save(`${serialNumber}.pdf`);
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement> | string,
    prop = ""
  ) => {
    if (typeof e === "string") {
      setItems({ ...items, [prop]: e });
    } else {
      const name = prop || e.target.name;
      const value = e.target.value;
      setItems({ ...items, [name]: value });
    }
  };

  return (
    <Box w="100%" mt={12} px={6}>
      <Container
        maxW="800px"
        my={6}
        p={6}
        bg="white"
        rounded="md"
        boxShadow="md"
      >
        <Flex w="full" direction="column" align="center" fontSize="xl">
          <Box as="h1" mt={6} fontSize="3xl">
            登録が完了しました
          </Box>
          <Box mt={3} fontSize="sm">
            発注No.{getSerialNumber(Number(serialNumber))}
          </Box>
          <Flex
            p={6}
            mt={3}
            direction="column"
            align="flex-start"
            border="1px"
            borderColor="gray.200"
          >
            <Flex>
              <Box>品番：{product?.productNumber}</Box>
              <Box ml={3}>{product?.productName}</Box>
            </Flex>
            <Box>数量：{quantity}m</Box>
          </Flex>
        </Flex>
      </Container>
      <Container
        maxW="800px"
        my={6}
        p={6}
        bg="white"
        rounded="md"
        boxShadow="md"
      >
        <Heading as="h2" fontSize="lg">
          発注書を作成する
        </Heading>
        <RadioGroup
          mt={6}
          p={3}
          name="orderType"
          onChange={(e) => handleInputChange(e, "orderType")}
          value={items.orderType}
          border="1px"
          borderColor="gray.200"
        >
          <label>種別</label>
          <Stack mt={2} direction="row">
            <Radio value="発注書">発注書</Radio>
            <Radio value="出荷依頼">出荷依頼</Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup
          mt={6}
          p={3}
          name="orderType"
          onChange={(e) => handleInputChange(e, "show")}
          value={items.show}
          border="1px"
          borderColor="gray.200"
        >
          <label>送り先</label>
          <Stack mt={2} direction="row">
            <Radio value="1">表示</Radio>
            <Radio value="2">非表示</Radio>
          </Stack>
        </RadioGroup>

        <Flex justify="center">
          <Button mt={6} colorScheme="facebook" onClick={pdhDownloadHandler}>
            PDF作成
          </Button>
        </Flex>
      </Container>
      <Container
        id="pdf-id"
        maxW="800px"
        my={6}
        p={6}
        bg="white"
        rounded="md"
        boxShadow="md"
      >
        <Stack spacing={6}>
          <Flex justify="space-between" align="center">
            <Box textAlign="left" fontSize="2xl">
              {product?.supplierName} 御中
            </Box>
            <Box>{getNow()}</Box>
          </Flex>
          <Flex direction="column" align="flex-end">
            <Box fontSize="xl">（株）大丸白衣</Box>
            <Box fontSize="base">TEL 06-6632-0891</Box>
            <Box fontSize="base">FAX 06-6641-9200</Box>
            <Box fontSize="base">{createUser}</Box>
          </Flex>
          <Box textAlign="center" fontSize="3xl">
            {items.orderType}
          </Box>
          <TableContainer>
            <Table variant="simple" border="1px">
              <Thead>
                <Tr>
                  <Th w="full" border="1px">
                    品番/商品名
                  </Th>
                  <Th border="1px">数量</Th>
                  <Th border="1px">希望納期</Th>
                  <Th border="1px">発注書NO.</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr fontSize="md">
                  <Td border="1px">
                    {product?.productNumber} {product?.productName}
                  </Td>
                  <Td border="1px" isNumeric>
                    {quantity}m
                  </Td>
                  <Td border="1px" isNumeric>
                    {scheduledAt}
                  </Td>
                  <Td border="1px" isNumeric>
                    {getSerialNumber(Number(serialNumber))}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            {Number(items.show) === 1 && (
              <Table variant="simple" mt={2} border="1px">
                <Thead>
                  <Tr>
                    <Th w="full" border="1px">
                      送り先
                    </Th>
                    <Th border="1px">住所</Th>
                    <Th border="1px">TEL</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr fontSize="sm">
                    <Td border="1px">{stockPlace}</Td>
                    {stockPlaces.map(
                      (place) =>
                        stockPlace === place?.name && (
                          <>
                            <Td border="1px">{place?.address}</Td>
                            <Td border="1px" isNumeric>
                              {place?.tel}
                            </Td>
                          </>
                        )
                    )}
                  </Tr>
                </Tbody>
              </Table>
            )}
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
};

export default CompleteId;
