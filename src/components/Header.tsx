import {
  Box,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdOutlineSettings } from "react-icons/md";
import Link from "next/link";
import { useAuthStore } from "../../store";
import { auth } from "../../firebase";
import { MenuDrawerButton } from "./MenuDrawerButton";

export const Header: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);

  // サインアウト
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("ログアウトしました");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 担当者名の表示
  const displayStaff = (id: string) => {
    const user = users?.find((user) => id === user.id);
    return user?.name;
  };

  return (
    <Flex
      w="100%"
      h={12}
      alignItems="center"
      bg="white"
      boxShadow="sm"
      position="fixed"
      top={0}
      zIndex={10}
    >
      <Container maxW="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <MenuDrawerButton />
          <Link href="/dashboard">
            <Box fontSize="xl" fontWeight="700">
              生地在庫WEB
            </Box>
          </Link>
          <Flex alignItems="center" gap={3}>
            <Box>
              <Text fontSize="sm" display={{ base: "none", "2xl": "block" }}>
                {displayStaff(currentUser)}
              </Text>
            </Box>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<MdOutlineSettings size="25px" />}
                variant="outline"
              />
              <MenuList fontSize="sm">
                <Link href="/">
                  <MenuItem>トップページ</MenuItem>
                </Link>
                <MenuItem onClick={signOut}>ログアウト</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
