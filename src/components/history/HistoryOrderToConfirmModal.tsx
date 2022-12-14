import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { todayDate } from "../../../functions";
import { stockPlacesState } from "../../../store";
import { HistoryType } from "../../../types/HistoryType";

type Props = {
  history: HistoryType;
  items: HistoryType;
  setItems: Function;
  onClick: Function;
};

const HistoryConfirmModal: NextPage<Props> = ({
  history,
  items,
  setItems,
  onClick,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState(1);
  const stockPlaces = useRecoilValue(stockPlacesState);

  useEffect(() => {
    setItems({ ...history });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleNumberChange = (e: string, name: string) => {
    const value = e;
    setItems({ ...items, [name]: Number(value) });
  };

  const inputReset = () => {
    setItems({ ...history });
  };

  const remainingOrderReset = () => {
    setItems({
      ...items,
      remainingOrder: history.quantity - items.quantity,
    });
  };

  return (
    <>
      <Button
        size="xs"
        colorScheme="facebook"
        onClick={() => {
          setStatus(1);
          onOpen();
        }}
      >
        確定
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          inputReset();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>確定処理</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <Flex gap={3}>
                <Box>品　　番</Box>
                <Flex gap={1}>
                  <Box>{history.productNumber}</Box>
                  <Box>{history.productName}</Box>
                </Flex>
              </Flex>
              <Box>
                <Flex gap={3}>
                  <Box>発注数量</Box>
                  {history?.quantity}m
                </Flex>
                {status === 2 && (
                  <Flex gap={3}>
                    <Box>入荷数量</Box>
                    {items?.quantity}m
                  </Flex>
                )}
              </Box>
              <Box>
                {status === 1 && (
                  <>
                    <Box w="100%">
                      <Text>入荷数量(m)</Text>
                      <NumberInput
                        mt={1}
                        name="quantity"
                        defaultValue={0}
                        min={0}
                        max={100000}
                        value={items.quantity}
                        onChange={(e) => handleNumberChange(e, "quantity")}
                      >
                        <NumberInputField textAlign="right" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                    <Box w="100%" mt={3}>
                      <Text>仕上り日</Text>
                      <Input
                        type="date"
                        mt={1}
                        name="fixedAt"
                        value={items.fixedAt || todayDate()}
                        onChange={handleInputChange}
                      />
                    </Box>
                    {items.orderType === "purchase" && (
                      <Box w="100%" mt={3}>
                        <Text>送り先</Text>
                        <Select
                          mt={1}
                          name="stockPlace"
                          placeholder="送り先を選択してください"
                          value={items.stockPlace || history.stockPlace}
                          defaultValue="徳島工場"
                          onChange={(e) => handleInputChange(e)}
                        >
                          {stockPlaces?.map(
                            (m: { id: number; name: string }) => (
                              <option key={m.id} value={m.name}>
                                {m.name}
                              </option>
                            )
                          )}
                        </Select>
                      </Box>
                    )}
                  </>
                )}
                {status === 2 && (
                  <>
                    <Box w="100%">
                      <Text>残数量(m)</Text>
                      <NumberInput
                        mt={1}
                        name="remainingOrder"
                        defaultValue={history.quantity - items.quantity}
                        min={0}
                        max={10000}
                        value={items.remainingOrder}
                        onChange={(e) =>
                          handleNumberChange(e, "remainingOrder")
                        }
                      >
                        <NumberInputField textAlign="right" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                    <Box w="100%" mt={3}>
                      <Text>予定納期</Text>
                      <Input
                        type="date"
                        mt={1}
                        name="scheduledAt"
                        value={items.scheduledAt}
                        onChange={handleInputChange}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            {status === 1 && (
              <>
                <Button
                  mr={3}
                  onClick={() => {
                    inputReset();
                    onClose();
                  }}
                >
                  閉じる
                </Button>
                <Button
                  colorScheme="facebook"
                  onClick={() => {
                    remainingOrderReset();
                    setStatus(2);
                  }}
                >
                  次へ
                </Button>
              </>
            )}
            {status === 2 && (
              <>
                <Button
                  mr={3}
                  onClick={() => {
                    remainingOrderReset();
                    setStatus(1);
                  }}
                >
                  戻る
                </Button>
                <Button
                  colorScheme="facebook"
                  disabled={items.remainingOrder >= 0 ? false : true}
                  onClick={() => {
                    onClick(history);
                    onClose();
                  }}
                >
                  確定
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HistoryConfirmModal;
