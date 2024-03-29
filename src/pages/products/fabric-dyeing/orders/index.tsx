import { Box, Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { FabricDyeingOrderTable } from "../../../../components/products/fabric-dyeing/OrderTable";

const FabricDyeingsOrders: NextPage = () => {
  return (
    <Box width="calc(100% - 250px)" px={6} mt={12} flex="1">
      <Box my={6} bg="white" boxShadow="md" rounded="md">
        <Flex p={6} gap={3} align="center">
          <Box as="h2" fontSize="2xl">
            染色仕掛
          </Box>
          <Link href="/products/fabric-dyeing/confirms">
            <Button size="xs">履歴</Button>
          </Link>
        </Flex>
        <FabricDyeingOrderTable />
      </Box>
    </Box>
  );
};

export default FabricDyeingsOrders;
