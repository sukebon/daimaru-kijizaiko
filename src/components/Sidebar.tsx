import { FC } from "react";
import { Box } from "@chakra-ui/react";
import { MenuLists } from "./MenuLists";

export const Sidebar: FC = () => {
  const returnNull = () => {
    return;
  };
  return (
    <Box
      as="nav"
      display={{ base: "none", "2xl": "block" }}
      pt={12}
      pl={6}
      minW="250px"
      h="100vh"
      bg="white"
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex={1}
    >
      <MenuLists onClose={returnNull} />
    </Box>
  );
};
