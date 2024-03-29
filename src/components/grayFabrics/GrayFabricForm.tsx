import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState, FC } from "react";
import { useSettingStore } from "../../../store";
import { GrayFabric } from "../../../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useForm } from "react-hook-form";
import { useGrayFabrics } from "../../hooks/useGrayFabrics";

type Props = {
  title: string;
  grayFabric: GrayFabric | undefined;
  toggleSwitch: string;
  onClose?: Function;
};

export const GrayFabricForm: FC<Props> = ({
  title,
  grayFabric,
  toggleSwitch,
  onClose,
}) => {
  const [grayFabrics, setGrayFabrics] = useState([] as GrayFabric[]);
  const suppliers = useSettingStore((state) => state.suppliers);
  const { addGrayFabric, updateGrayFabric } = useGrayFabrics();
  const [flag, setFlag] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...grayFabric,
    },
  });

  const onSubmit = (data: GrayFabric) => {
    switch (toggleSwitch) {
      case "new":
        addGrayFabric(data);
        return;
      case "edit":
        updateGrayFabric(data, grayFabric.id);
        onClose();
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    const getGrayFabrics = async () => {
      const docsRef = collection(db, "grayFabrics");
      const querysnap = await getDocs(docsRef);
      setGrayFabrics(
        querysnap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as GrayFabric)
        )
      );
    };
    getGrayFabrics();
  }, []);

  // 生地が登録しているかのチェック
  useEffect(() => {
    let productNumber = watch("productNumber");
    if (!productNumber) productNumber = "noValue";

    const base = grayFabrics.map(
      (grayFabric) => grayFabric.productNumber
    );
    setFlag(base?.includes(productNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("productNumber")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6} mt={6}>
        <Flex gap={6}>
          <Box w="100%">
            <Text fontWeight="bold">
              仕入先
              <Box
                ml={1}
                as="span"
                textColor="red"
                display={title === "登録" ? "display" : "none"}
              >
                ※
              </Box>
            </Text>
            <Select
              mt={1}
              placeholder="メーカーを選択してください"
              {...register("supplierId", { required: true })}
            >
              {suppliers?.map((supplier: { id: string; name: string; }) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
              {errors.supplierId && <Box>メーカーを選択してください</Box>}
            </Select>
          </Box>
        </Flex>
        {toggleSwitch === "new" && (
          <Box fontSize="xl" fontWeight="bold" color="red">
            {flag && "すでに登録されています。"}
          </Box>
        )}
        <Flex
          gap={6}
          align="center"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Box w="100%" flex="2">
            <Text fontWeight="bold">
              品番
              <Box
                ml={1}
                as="span"
                textColor="red"
                display={title === "登録" ? "display" : "none"}
              >
                ※
              </Box>
            </Text>
            <Input
              mt={1}
              placeholder="例）AQSK2336"
              {...register("productNumber", { required: true })}
            />
          </Box>
          <Box w="100%" flex="3">
            <Text fontWeight="bold">品名</Text>
            <Input
              mt={1}
              placeholder="例）アクアクール"
              {...register("productName")}
            />
          </Box>
        </Flex>
        <Box>
          <Text fontWeight="bold">コメント</Text>
          <Textarea mt={1} {...register("comment")} />
        </Box>
        {toggleSwitch === "new" && (
          <Button type="submit" colorScheme="facebook" disabled={flag}>
            登録
          </Button>
        )}

        {toggleSwitch === "edit" && (
          <Button type="submit" colorScheme="facebook">
            更新
          </Button>
        )}
      </Stack>
    </form>
  );
};
