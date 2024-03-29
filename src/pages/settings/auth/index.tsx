import {
  Box,
  Button,
  Container,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { User } from "../../../../types";
import { AuthEditModal } from "../../../components/settings/auth/AuthEditModal";
import { NextPage } from "next";

const Auth: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  //firestore users 情報の取得
  useEffect(() => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as User)
        )
      );
    });
    return unsub;
  }, []);

  // 権限管理
  const isAuthToggle = async (user: any, prop: string) => {
    try {
      const docRef = doc(db, "users", user.uid);
      let toggle: boolean;
      if (user[prop] && user[prop] === true) {
        toggle = false;
      } else {
        toggle = true;
      }
      await updateDoc(docRef, {
        [prop]: toggle,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const elementAuthButton = (user: any, prop: string) => (
    <Button
      colorScheme={user[prop] ? "facebook" : "gray"}
      size="sm"
      onClick={() => isAuthToggle(user, prop)}
    >
      {user[prop] ? "有効" : "無効"}
    </Button>
  );

  return (
    <Box w="100%" mt={12} px={6}>
      <Container maxW="900px" my={6} rounded="md" bg="white" boxShadow="md">
        <TableContainer p={6} maxW="100%">
          <Box as="h2" fontSize="2xl">
            権限管理
          </Box>
          <Table mt={6} variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>名前</Th>
                <Th>R&D</Th>
                <Th>営業</Th>
                <Th>経理</Th>
                <Th>徳島工場</Th>

                <Th>編集</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users?.map((user) => (
                <Tr key={user.uid}>
                  <Td>{user.rank}</Td>
                  <Td>{user.name}</Td>
                  <Td>{elementAuthButton(user, "rd")}</Td>
                  <Td>{elementAuthButton(user, "sales")}</Td>
                  <Td>{elementAuthButton(user, "accounting")}</Td>
                  <Td>{elementAuthButton(user, "tokushima")}</Td>
                  <Td>
                    <AuthEditModal uid={user.uid} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default Auth;
