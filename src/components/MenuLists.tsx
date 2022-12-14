import React from "react";
import { Box, Divider, List, ListItem, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { NextPage } from "next";
import OrderDrawer from "./order/OrderDrawer";

type Props = {
  onClose: Function;
};
const MenuLists: NextPage<Props> = ({ onClose }) => {
  const menu1 = [
    { id: 1, title: "生地一覧", link: "/products" },
    { id: 2, title: <OrderDrawer />, link: "" },
    // { id: 3, title: "裁断報告書", link: "/cutting-report" },
    { id: 4, title: "マスター登録", link: "/products/new" },
  ];
  const menu2 = [
    { id: 1, title: "キバタ仕掛状況", link: "/history/gray-fabrics" },
    { id: 2, title: "生地仕掛状況", link: "/history/fabric-dyeing" },
    { id: 3, title: "購入状況", link: "/history/fabric-shipment" },
  ];
  const menu3 = [{ id: 1, title: "一覧", link: "/cutting-report" }];

  return (
    <>
      <List my={3} spacing={3}>
        <ListItem fontSize="sm">
          <Link href="/">トップページ</Link>
        </ListItem>
      </List>
      <Divider />

      <Box as="h3" mt={3} fontSize="sm" fontWeight="bold">
        生地
      </Box>
      <List my={3} ml={3} spacing={3} fontSize="sm">
        {menu1.map((m, i) => (
          <ListItem key={i}>
            <Link
              href={m.link}
              onClick={() => {
                if (m.id !== 2) {
                  onClose();
                }
              }}
            >
              {m.title}
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />

      <Box as="h3" mt={3} fontSize="sm" fontWeight="bold">
        受発注状況
      </Box>
      <List my={3} ml={3} spacing={3} fontSize="sm">
        {menu2.map((m, i) => (
          <ListItem key={i}>
            <Link href={m.link} onClick={() => onClose()}>
              {m.title}
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />

      <Box as="h3" mt={3} fontSize="sm" fontWeight="bold">
        裁断報告書
      </Box>
      <List my={3} ml={3} spacing={3} fontSize="sm">
        {menu3.map((m, i) => (
          <ListItem key={i}>
            <Link href={m.link} onClick={() => onClose()}>
              {m.title}
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
};

export default MenuLists;
