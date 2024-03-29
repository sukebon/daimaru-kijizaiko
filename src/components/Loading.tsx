import { FC } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { useLoadingStore } from "../../store";

export const Loading: FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  return (
    <>
      {isLoading && (
        <Flex
          position="fixed"
          width="100%"
          height="100vh"
          justifyContent="center"
          alignItems="center"
          zIndex={10000}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            position="absolute"
            zIndex={100000}
            style={{ transform: "translate(-50%,-50%)" }}
          />
        </Flex>
      )}
    </>
  );
};
