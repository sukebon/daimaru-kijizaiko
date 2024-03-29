import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { BsFilter } from "react-icons/bs";
import { useSettingStore } from "../../../store";
import { Product } from "../../../types";
import { Switch } from "@chakra-ui/react";

type Props = {
  search: Product;
  setSearch: Function;
  cuttingScheduleSearch: boolean;
  setCuttingScheduleSearch: (paiload: boolean) => void;
  onReset: Function;
};

export const ProductSearchDrawer: FC<Props> = ({
  search,
  setSearch,
  onReset,
  cuttingScheduleSearch,
  setCuttingScheduleSearch,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const colors = useSettingStore((state) => state.colors);
  const materialNames = useSettingStore((state) => state.materialNames);
  const suppliers = useSettingStore((state) => state.suppliers);

  return (
    <Flex gap={3}>
      <Button
        size="sm"
        colorScheme="facebook"
        onClick={onOpen}
        leftIcon={<BsFilter />}
        shadow="md"
      >
        フィルター
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>絞り込み検索</DrawerHeader>

          <DrawerBody>
            <Stack spacing={6}>
              <Box>
                <Text>品番</Text>
                <Input
                  mt={1}
                  type="text"
                  name="productNumber"
                  placeholder="生地の品番を検索..."
                  value={search.productNumber}
                  onChange={(e) =>
                    setSearch({ ...search, productNumber: e.target.value })
                  }
                />
              </Box>
              <Box>
                <Text>色</Text>
                <Select
                  mt={1}
                  name="colorName"
                  placeholder="色を検索..."
                  value={search.colorName}
                  onChange={(e) =>
                    setSearch({ ...search, colorName: e.target.value })
                  }
                >
                  {colors.map((color: string) => (
                    <option key={color}>{color}</option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text>品名</Text>
                <Input
                  mt={1}
                  type="text"
                  name="productName"
                  placeholder="品名を検索..."
                  value={search.productName}
                  onChange={(e) =>
                    setSearch({ ...search, productName: e.target.value })
                  }
                />
              </Box>
              <Box>
                <Text>組織名</Text>
                <Select
                  mt={1}
                  name="materialName"
                  placeholder="色を検索..."
                  value={search.materialName}
                  onChange={(e) =>
                    setSearch({ ...search, materialName: e.target.value })
                  }
                >
                  {materialNames.map((materialName: string) => (
                    <option key={materialName} value={materialName}>
                      {materialName}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text>仕入先名</Text>
                <Select
                  mt={1}
                  name="supplier"
                  placeholder="仕入先を検索..."
                  value={search.supplierId}
                  onChange={(e) =>
                    setSearch({ ...search, supplierId: e.target.value })
                  }
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <FormControl display="flex" alignItems="center">
                  <FormLabel
                    htmlFor="cuttingScheduleSwitch"
                    mb="0"
                    fontWeight="normal"
                  >
                    使用予定
                  </FormLabel>
                  <Switch
                    id="cuttingScheduleSwitch"
                    defaultChecked={cuttingScheduleSearch}
                    isChecked={cuttingScheduleSearch}
                    onChange={(e) =>
                      setCuttingScheduleSearch(!cuttingScheduleSearch)
                    }
                  />
                </FormControl>
              </Box>
              <Button onClick={() => onReset()}>リセット</Button>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
