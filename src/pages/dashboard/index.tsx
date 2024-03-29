import {
  Box,
  Container,
  Flex,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { NextPage } from "next";
import {
  useGrayFabricStore,
  useProductsStore,
} from "../../../store";
import { Charts } from "../../components/dashboard/Charts";
import { StatCard } from "../../components/dashboard/StatCard";

const Dashboard: NextPage = () => {
  const products = useProductsStore((state) => state.products);
  const grayFabrics = useGrayFabricStore((state) => state.grayFabrics);
  const grayFabricOrders = useGrayFabricStore((state) => state.grayFabricOrders);
  const fabricDyeingOrders = useProductsStore((state) => state.fabricDyeingOrders);
  const fabricPurchaseOrders = useProductsStore((state) => state.fabricPurchaseOrders);

  const getTotalProductsQuantity = (props: string[]) => {
    let total = 0;
    products.forEach((product) => {
      props.forEach((prop) => {
        total += Number(product[prop]);
      });
    });
    return total;
  };
  const getTotalProductsPrice = (props: string[]) => {
    let total = 0;
    products.forEach((product) => {
      props.forEach((prop) => {
        total += product.price * product[prop];
      });
    });
    return total;
  };


  return (
    <Box w="100%" mt={12} px={{ base: 0, md: 3 }}>
      <Container maxW="100%" my={6}>
        <Flex
          gap={{ base: 3, md: 6 }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Flex flex="1" gap={{ base: 3, md: 6 }} direction={{ base: "row" }}>
            <StatGroup
              p={3}
              flex="1"
              gap={3}
              alignItems="center"
              bg="white"
              rounded="md"
              boxShadow="md"
            >
              <Stat borderRight="1px" borderColor="gray.300">
                <StatLabel>キバタ登録件数</StatLabel>
                <StatNumber>
                  {grayFabrics.length}
                  <Box as="span" fontSize="sm" ml={1}>
                    件
                  </Box>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>生地登録件数</StatLabel>
                <StatNumber>
                  {products.length}
                  <Box as="span" fontSize="sm" ml={1}>
                    件
                  </Box>
                </StatNumber>
              </Stat>
            </StatGroup>
          </Flex>
          <Flex flex="1" gap={{ base: 3, md: 6 }} direction={{ base: "row" }}>
            <StatGroup
              p={3}
              flex="1"
              gap={3}
              alignItems="center"
              bg="white"
              rounded="md"
              boxShadow="md"
            >
              <Stat borderRight="1px" borderColor="gray.300">
                <StatLabel>キバタ仕掛</StatLabel>
                <StatNumber>
                  {grayFabricOrders?.length}
                  <Box as="span" fontSize="sm" ml={1}>
                    件
                  </Box>
                </StatNumber>
              </Stat>
              <Stat borderRight="1px" borderColor="gray.300">
                <StatLabel>染め仕掛</StatLabel>
                <StatNumber>
                  {fabricDyeingOrders?.length}
                  <Box as="span" fontSize="sm" ml={1}>
                    件
                  </Box>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>入荷予定</StatLabel>
                <StatNumber>
                  {fabricPurchaseOrders?.length}
                  <Box as="span" fontSize="sm" ml={1}>
                    件
                  </Box>
                </StatNumber>
              </Stat>
            </StatGroup>
          </Flex>
        </Flex>

        <Flex
          mt={{ base: 3, md: 6 }}
          gap={{ base: 3, md: 6 }}
          direction={{ base: "column", md: "row" }}
        >
          <StatCard
            title="TOTAL数量"
            quantity={Number(
              getTotalProductsQuantity([
                "wip",
                "externalStock",
                "arrivingQuantity",
                "tokushimaStock",
              ]).toFixed()
            ).toLocaleString()}
            unit="m"
            fontSize="4xl"
          />
          <StatCard
            title="TOTAL金額"
            quantity={Number(
              getTotalProductsPrice([
                "wip",
                "externalStock",
                "arrivingQuantity",
                "tokushimaStock",
              ]).toFixed()
            ).toLocaleString()}
            unit="円"
            fontSize="4xl"
          />
        </Flex>

        <Flex gap={{ base: 3, md: 6 }}>
          <Flex
            flex="1"
            mt={{ base: 3, md: 6 }}
            gap={{ base: 3, md: 6 }}
            direction={{ base: "column" }}
          >
            <Flex
              gap={{ base: 3, md: 6 }}
              direction={{ base: "column", md: "row" }}
            >
              <StatCard
                title="染め仕掛数量"
                quantity={Number(
                  getTotalProductsQuantity(["wip"]).toFixed()
                ).toLocaleString()}
                unit="m"
                fontSize="3xl"
              />
              <StatCard
                title="外部在庫数量"
                quantity={Number(
                  getTotalProductsQuantity(["externalStock"]).toFixed()
                ).toLocaleString()}
                unit="m"
                fontSize="3xl"
              />
            </Flex>
            <Flex
              gap={{ base: 3, md: 6 }}
              direction={{ base: "column", md: "row" }}
            >
              <StatCard
                title="入荷予定数量"
                quantity={Number(
                  getTotalProductsQuantity(["arrivingQuantity"]).toFixed()
                ).toLocaleString()}
                unit="m"
                fontSize="3xl"
              />
              <StatCard
                title="徳島在庫数量"
                quantity={Number(
                  getTotalProductsQuantity(["tokushimaStock"]).toFixed()
                ).toLocaleString()}
                unit="m"
                fontSize="3xl"
              />
            </Flex>
          </Flex>

          <Flex
            flex="1"
            mt={{ base: 3, md: 6 }}
            gap={{ base: 3, md: 6 }}
            direction={{ base: "column" }}
          >
            <Flex
              gap={{ base: 3, md: 6 }}
              direction={{ base: "column", md: "row" }}
            >
              <StatCard
                title="染め仕掛金額"
                quantity={Number(
                  getTotalProductsPrice(["wip"]).toFixed()
                ).toLocaleString()}
                unit="円"
                fontSize="3xl"
              />
              <StatCard
                title="外部在庫金額"
                quantity={Number(
                  getTotalProductsPrice(["externalStock"]).toFixed()
                ).toLocaleString()}
                unit="円"
                fontSize="3xl"
              />
            </Flex>
            <Flex
              gap={{ base: 3, md: 6 }}
              direction={{ base: "column", md: "row" }}
            >
              <StatCard
                title="入荷予定金額"
                quantity={Number(
                  getTotalProductsPrice(["arrivingQuantity"]).toFixed()
                ).toLocaleString()}
                unit="円"
                fontSize="3xl"
              />
              <StatCard
                title="徳島在庫金額"
                quantity={Number(
                  getTotalProductsPrice(["tokushimaStock"]).toFixed()
                ).toLocaleString()}
                unit="円"
                fontSize="3xl"
              />
            </Flex>
          </Flex>
        </Flex>
        <Charts />
      </Container>
    </Box>
  );
};

export default Dashboard;
