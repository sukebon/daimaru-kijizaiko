import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
} from "@chakra-ui/react";

import Link from "next/link";
import { useRecoilValue } from "recoil";
import { stockPlacesState } from "../../../../store";

const StockPlaces = () => {
  const stockPlaces = useRecoilValue(stockPlacesState);

  return (
    <Box w="100%" mt={12}>
      <Container maxW="900px" mt={6} p={0}>
        <Link href="/settings">
          <Button w="100%">一覧へ</Button>
        </Link>
      </Container>
      <Container maxW="900px" my={6} rounded="md" bg="white" boxShadow="md">
        <TableContainer p={6}>
          <Flex justifyContent="space-between">
            <Box as="h2" fontSize="2xl">
              仕入先一覧
            </Box>
            <Link href="/settings/stock-places/new">
              <Button>新規登録</Button>
            </Link>
          </Flex>
          <Table mt={6} variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>仕入先名</Th>
                <Th>フリガナ</Th>
                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockPlaces?.map(
                (stockPlace: { id: string; name: string; kana: string }) => (
                  <Tr key={stockPlace.id}>
                    <Td>{stockPlace.name}</Td>
                    <Td>{stockPlace.kana}</Td>
                    <Td>
                      <Link href={`/settings/stock-places/${stockPlace.id}`}>
                        <Button>詳細</Button>
                      </Link>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default StockPlaces;
