import { Box, Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { FabricPurchaseConfirmTable } from "../../../../components/products/fabric-purchase/ConfirmTable";

const TokushimaFabricPurchaseConfirms: NextPage = () => {
  const HOUSE_FACTORY = "徳島工場";
  return (
    <Box width="calc(100% - 250px)" px={6} mt={12} flex="1">
      <Box w="100%" my={6} bg="white" boxShadow="md" rounded="md">
        <Flex p={6} gap={3} alignItems="center">
          <Box as="h2" fontSize="2xl">
            入荷履歴
          </Box>
          <Link href="/tokushima/fabric-purchase/orders">
            <Button size="xs">入荷予定</Button>
          </Link>
        </Flex>
        <FabricPurchaseConfirmTable HOUSE_FACTORY={HOUSE_FACTORY} />
      </Box>
    </Box>
  );
};

export default TokushimaFabricPurchaseConfirms;
