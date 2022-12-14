import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { db } from "../../../firebase";

type Props = {
  obj: {
    id: string;
    name: string;
  };
  pathName: string;
};

const EditModal: NextPage<Props> = ({ obj, pathName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState<any>();
  useEffect(() => {
    setItems(obj);
  }, [obj]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const updateDocEdit = async () => {
    const docRef = doc(db, `${pathName}`, `${obj.id}`);
    await updateDoc(docRef, {
      name: items.name,
    });
  };

  const reset = () => {
    setItems(obj);
  };

  return (
    <>
      <FaEdit cursor="pointer" size="20px" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              name="name"
              value={items?.name}
              onChange={handleInputChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updateDocEdit();
                onClose();
              }}
            >
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
