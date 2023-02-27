import { Text, Image } from "react-native";
import React, { useState } from "react";
import {
  AlertDialog,
  Button,
  Center,
  Icon,
  IconButton,
  Modal,
  Spinner,
  VStack,
} from "native-base";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
const AttachFileModal = ({ setImage, image }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const cancelRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const pickImage = async () => {
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    const data = new FormData();
    console.log(result);
    data.append("file", {
      uri: result.uri,
      type: "image/jpg",
      name: "tronten123456",
    });
    data.append("upload_preset", "chat-chit");
    data.append("cloud_name", "voluu");
    fetch("https://api.cloudinary.com/v1_1/voluu/image/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setImage(data.url);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        justifyContent="flex-end"
        bottom="4"
        size="lg"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Select Attachment File</Modal.Header>
          <Modal.Body>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: 200 }}
              />
            ) : (
              <Text>Choose an image to send</Text>
            )}
          </Modal.Body>
          <Modal.Footer>
            {image && (
              <Button mr="2" onPress={pickImage}>
                Chooose image
              </Button>
            )}
            <Button flex="1" onPress={pickImage}>
              <Text className="text-center text-white">
                Select an {image && "other"} image from camera roll
              </Text>
            </Button>
            <Button
              variant={"ghost"}
              colorScheme={"danger"}
              onPress={() => {
                setImage("");
                setModalVisible(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <VStack space={8} alignItems="center">
        <IconButton
          zIndex={10}
          colorScheme="dark"
          variant="ghost"
          icon={
            <Icon
              as={<Entypo name="attachment" size={24} color="black" />}
              size={5}
              color="blue.400"
            />
          }
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        ></IconButton>
      </VStack>
      <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={loading}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Attachment Image</AlertDialog.Header>
            <AlertDialog.Body>
              <Spinner></Spinner>
              <Text>Uploading...</Text>
            </AlertDialog.Body>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </>
  );
};

export default AttachFileModal;
