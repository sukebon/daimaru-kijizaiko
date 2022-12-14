import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { features } from "../../../datalist";
import { db } from "../../../firebase";
import {
  colorsState,
  grayFabricsState,
  loadingState,
  materialNamesState,
  productsState,
  suppliersState,
  usersState,
} from "../../../store";
import MaterialsModal from "./MaterialsModal";

type Props = {
  items: any;
  setItems: Function;
  title: string;
  toggleSwitch: string;
  product: any;
};

const ProductInputArea: NextPage<Props> = ({
  items,
  setItems,
  title,
  toggleSwitch,
  product,
}) => {
  const router = useRouter();
  const productId = router.query.productId;
  const grayFabrics = useRecoilValue(grayFabricsState);
  const users = useRecoilValue(usersState);
  const suppliers = useRecoilValue(suppliersState);
  const products = useRecoilValue(productsState);
  const colors = useRecoilValue(colorsState);
  const materialNames = useRecoilValue(materialNamesState);
  const setLoading = useSetRecoilState(loadingState);

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

  const handleRadioChange = (e: string, name: string) => {
    const value = e;
    setItems({ ...items, [name]: Number(value) });
  };

  const handleCheckedChange = (e: any, name: string) => {
    if (e.target.checked) {
      setItems({
        ...items,
        [name]: [...(items[name] || []), e.target.value],
      });
    } else {
      setItems({
        ...items,
        [name]: [...items[name]?.filter((n: string) => n !== e.target.value)],
      });
    }
  };

  const getSupplierName = (supplierId: string) => {
    const supplierObj = suppliers.find(
      (supplier: { id: string }) => supplier.id === supplierId
    );
    return supplierObj.name;
  };

  const getMixed = (materials: any) => {
    let array = [];
    const t = materials.t ? `??????????????????${materials.t}% ` : "";
    const c = materials.c ? `???${materials.c}% ` : "";
    const n = materials.n ? `????????????${materials.n}% ` : "";
    const r = materials.r ? `????????????${materials.r}% ` : "";
    const f = materials.f ? `???${materials.f}% ` : "";
    const pu = materials.pu ? `??????????????????${materials.pu}% ` : "";
    const w = materials.w ? `?????????${materials.w}% ` : "";
    const ac = materials.ac ? `????????????${materials.ac}% ` : "";
    const cu = materials.cu ? `????????????${materials.cu}% ` : "";
    const si = materials.si ? `?????????${materials.si}% ` : "";
    const z = materials.z ? `???????????????${materials.z}% ` : "";
    array.push(t, c, n, r, f, pu, w, ac, cu, si, z);

    return array
      .filter((item) => item)
      .map((item) => <Text key={item}>{item}</Text>);
  };

  // ????????????
  const addProduct = async () => {
    const result = window.confirm("????????????????????????????????????");
    if (!result) return;
    setLoading(true);
    const docRef = collection(db, "products");
    try {
      await addDoc(docRef, {
        productType: items.productType || 1,
        staff: items.productType === 2 ? items.staff : "R&D",
        supplierId: items.supplierId || "",
        supplierName: getSupplierName(items.supplierId) || "",
        grayFabricId: items.grayFabricId || "",
        productNumber:
          items.productNum + (items.colorNum ? "-" + items.colorNum : "") || "",
        productNum: items.productNum || "",
        productName: items.productName || "",
        colorNum: items.colorNum || "",
        colorName: items.colorName || "",
        price: Number(items.price) || 0,
        materialName: items.materialName || "",
        materials: items.materials || {},
        fabricWidth: items.fabricWidth || "",
        fabricWeight: items.fabricWeight || "",
        fabricLength: items.fabricLength || "",
        features: items.features || [],
        noteProduct: items.noteProduct || "",
        noteFabric: items.noteFabric || "",
        noteEtc: items.noteEtc || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push("/products");
    }
  };

  const updateProduct = async () => {
    const result = window.confirm("????????????????????????????????????");
    if (!result) return;
    setLoading(true);
    const docRef = doc(db, "products", `${productId}`);
    try {
      await updateDoc(docRef, {
        productType: items.productType || 1,
        staff: items.productType === 2 ? items.staff : "R&D",
        supplierId: items.supplierId || "",
        supplierName: getSupplierName(items.supplierId) || "",
        productNumber:
          items.productNum + (items.colorNum ? "-" + items.colorNum : "") || "",
        productNum: items.productNum || "",
        productName: items.productName || "",
        colorNum: items.colorNum || "",
        colorName: items.colorName || "",
        price: Number(items.price) || 0,
        materialName: items.materialName || "",
        materials: items.materials || {},
        fabricWidth: items.fabricWidth || "",
        fabricWeight: items.fabricWeight || "",
        fabricLength: items.fabricLength || "",
        features: items.features || [],
        noteProduct: items.noteProduct || "",
        noteFabric: items.noteFabric || "",
        noteEtc: items.noteEtc || "",
        grayFabricId: items.grayFabricId || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push(`/products/${productId}`);
    }
  };

  const reset = () => {
    setItems(product);
    router.push(`/products/${productId}`);
  };

  // ???????????????????????????????????????????????????
  const requiredInput = () => {
    const staff = items.productType === 2 ? items.staff : true;
    return (
      !staff ||
      !items.supplier ||
      !items.productNum ||
      !items.colorName ||
      !items.price
    );
  };

  // ?????????????????????????????????????????????
  const registeredInput = () => {
    const item = items.productNum + items.colorNum + items.colorName;
    const base = products.map(
      (product: { productNum: string; colorNum: string; colorName: string }) =>
        product.productNum + product.colorNum + product.colorName
    );
    const result = base?.includes(item);
    if (!result) return;
    return result;
  };

  return (
    <Box w="100%" mt={12}>
      <Container maxW="800px" my={6} p={6} bg="white" rounded="md">
        <Box as="h1" fontSize="2xl">
          {title}
        </Box>

        <Stack spacing={6} mt={6}>
          <Box w="100%">
            <RadioGroup
              defaultValue="1"
              value={String(items.productType)}
              onChange={(e) => handleRadioChange(e, "productType")}
            >
              <Stack direction="row">
                <Radio value="1">?????????</Radio>
                <Radio value="2">?????????</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          {items.productType === 2 && (
            <Box>
              <Text fontWeight="bold">
                ?????????
                <Box ml={1} as="span" textColor="red">
                  ?????????
                </Box>
              </Text>
              <Select
                mt={1}
                placeholder="?????????????????????"
                value={items.staff}
                name="staff"
                onChange={(e) => handleInputChange(e)}
              >
                {users?.map((user: { id: string; name: string }) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </Box>
          )}
          <Flex gap={6}>
            <Box w="100%">
              <Text fontWeight="bold">
                ?????????
                <Box ml={1} as="span" textColor="red">
                  ?????????
                </Box>
              </Text>
              <Select
                mt={1}
                placeholder="???????????????????????????????????????"
                value={items.supplierId}
                name="supplierId"
                onChange={(e) => handleInputChange(e)}
              >
                {suppliers?.map((supplier: { id: string; name: string }) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          {toggleSwitch === "new" && (
            <Box fontSize="3xl" fontWeight="bold" color="red">
              {registeredInput() && "????????????????????????????????????"}
            </Box>
          )}
          <Flex
            gap={6}
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box w="100%" flex="1">
              <Text fontWeight="bold">
                ??????
                <Box ml={1} as="span" textColor="red">
                  ?????????
                </Box>
              </Text>
              <Input
                mt={1}
                name="productNum"
                type="text"
                placeholder="??????M2000 "
                value={items.productNum}
                onChange={handleInputChange}
              />
            </Box>
            <Box w="100%" flex="1">
              <Text fontWeight="bold">??????</Text>
              <Input
                mt={1}
                name="colorNum"
                type="text"
                placeholder="??????G1 ??????????????????"
                value={items.colorNum}
                onChange={handleInputChange}
              />
            </Box>
            <Box w="100%" flex="1">
              <Text fontWeight="bold">
                ???
                <Box ml={1} as="span" textColor="red">
                  ?????????
                </Box>
              </Text>
              <Select
                mt={1}
                placeholder="????????????"
                value={items.colorName}
                name="colorName"
                onChange={(e) => handleInputChange(e)}
              >
                {colors?.map((c: { id: number; name: string }) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          <Flex
            gap={6}
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box flex={2} w="100%">
              <Text fontWeight="bold">??????</Text>
              <Input
                mt={1}
                name="productName"
                type="text"
                placeholder="???????????????????????????"
                value={items?.productName}
                onChange={handleInputChange}
              />
            </Box>
            <Box flex={1} w="100%">
              <Text fontWeight="bold">
                ???????????????
                <Box ml={1} as="span" textColor="red">
                  ?????????
                </Box>
              </Text>
              <NumberInput
                mt={1}
                name="price"
                defaultValue={0}
                min={0}
                max={10000}
                value={items.price === 0 ? "" : items.price}
                onChange={(e) => handleNumberChange(e, "price")}
              >
                <NumberInputField textAlign="right" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </Flex>
          <Flex gap={6}>
            <Box w="100%">
              <Text fontWeight="bold">???????????????</Text>
              <Select
                mt={1}
                placeholder="????????????????????????????????????"
                value={items.grayFabricId}
                name="grayFabricId"
                onChange={(e) => handleInputChange(e)}
              >
                {grayFabrics?.map(
                  (grayFabric: {
                    id: string;
                    productNumber: string;
                    productName: string;
                  }) => (
                    <option key={grayFabric.id} value={grayFabric.id}>
                      {grayFabric.productNumber} {grayFabric.productName}
                    </option>
                  )
                )}
              </Select>
            </Box>
          </Flex>
          <Box flex={1} w="100%">
            <Text>??????????????????????????????</Text>
            <Textarea
              mt={1}
              name="noteProduct"
              value={items.noteProduct}
              onChange={handleInputChange}
            />
          </Box>

          <Divider />

          <Flex
            gap={6}
            w="100%"
            alignItems="flex-start"
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Stack spacing={6} flex={1} w="100%">
              <Box w="100%">
                <Text>?????????</Text>
                <Select
                  mt={1}
                  placeholder="?????????????????????????????????"
                  value={items.materialName}
                  name="materialName"
                  onChange={(e) => handleInputChange(e)}
                >
                  {materialNames?.map((m: { id: number; name: string }) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Flex gap={6}>
                <Box w="100%">
                  <Text>???????????????cm</Text>
                  <NumberInput
                    mt={1}
                    defaultValue={0}
                    min={0}
                    max={200}
                    value={items.fabricWidth}
                    onChange={(e) => handleNumberChange(e, "fabricWidth")}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
                <Box w="100%">
                  <Text>??????????????????m</Text>
                  <NumberInput
                    mt={1}
                    defaultValue={0}
                    min={0}
                    max={200}
                    value={items.fabricLength}
                    onChange={(e) => handleNumberChange(e, "fabricLength")}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
              </Flex>
              <Box w="100%">
                <Text>??????????????????</Text>
                <NumberInput
                  mt={1}
                  defaultValue={0}
                  min={0}
                  max={200}
                  value={items.fabricWeight}
                  onChange={(e) => handleNumberChange(e, "fabricWeight")}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Stack>
            <Flex flex={1} gap={6} w="100%">
              <Box w="100%">
                <Text>??????</Text>
                {items.materials && (
                  <Box
                    mt={1}
                    p={3}
                    rounded="md"
                    border="1px"
                    borderColor="gray.100"
                  >
                    <Stack spacing={3} w="100%">
                      {getMixed(items.materials)}
                    </Stack>
                  </Box>
                )}
                <MaterialsModal items={items} setItems={setItems} />
              </Box>
            </Flex>
          </Flex>

          <Box w="100%">
            <Text>?????????</Text>

            <Flex
              m={1}
              p={2}
              wrap="wrap"
              rounded="md"
              border="1px"
              borderColor="gray.100"
              gap={3}
            >
              {features.map((f, index) => (
                <Box key={f}>
                  <input
                    id={f}
                    type="checkbox"
                    checked={items?.features?.includes(f)}
                    value={f}
                    onChange={(e) => handleCheckedChange(e, "features")}
                  />
                  <Box as="span" mx={1}>
                    <label htmlFor={f}>{f}</label>
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>

          <Box w="100%">
            <Text>??????</Text>
            <FormControl mt={1}>
              <FormLabel htmlFor="gazo" mb="0" w="150px" cursor="pointer">
                <Box
                  p={2}
                  fontWeight="bold"
                  textAlign="center"
                  color="#385898"
                  border="1px"
                  borderColor="#385898"
                  rounded="md"
                >
                  ??????????????????
                </Box>
              </FormLabel>
              <Input
                mt={1}
                id="gazo"
                display="none"
                type="file"
                accept="image/*"
              />
            </FormControl>
          </Box>
          <Box flex={1} w="100%">
            <Text>?????????????????????????????????</Text>
            <Textarea
              mt={1}
              name="noteFabric"
              value={items.noteFabric}
              onChange={handleInputChange}
            />
          </Box>
          <Divider />
          <Box flex={1} w="100%">
            <Text>?????????????????????</Text>
            <Textarea
              mt={1}
              name="noteEtc"
              value={items.noteEtc}
              onChange={handleInputChange}
            />
          </Box>
          {toggleSwitch === "new" && (
            <Button
              colorScheme="facebook"
              disabled={
                !items.supplier ||
                !items.productNum ||
                !items.colorName ||
                !items.price ||
                registeredInput()
              }
              onClick={addProduct}
            >
              ??????
            </Button>
          )}
          {toggleSwitch === "edit" && (
            <Flex gap={3}>
              <Button w="100%" onClick={reset}>
                ???????????????
              </Button>
              <Button w="100%" colorScheme="facebook" onClick={updateProduct}>
                ??????
              </Button>
            </Flex>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductInputArea;
