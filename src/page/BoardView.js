import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState({});

  useEffect(() => {
    axios
      .get("/api/board/details/" + id)
      .then((response) => {
        setDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
      })
      .finally(() => console.log("끝"));
  }, [id]);

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
        console.log(error);
      })
      .finally(() => onClose());
  }

  // 상세정보 클릭 시 해당 문구로 변경
  const handleSelectDetail = (detail) => {
    // 고유 키 생성 (예: 색상-축-선)
    const key = `${detail.color}-${detail.axis}-${detail.line}`;

    setSelectedDetails((prevDetails) => {
      // 이미 선택된 상세 정보가 있는 경우 수량 증가
      if (prevDetails[key]) {
        return {
          ...prevDetails,
          [key]: {
            ...detail,
            quantity: prevDetails[key].quantity + 1,
          },
        };
      }

      // 새로운 상세 정보인 경우 추가
      return {
        ...prevDetails,
        [key]: {
          ...detail,
          quantity: 1,
        },
      };
    });
  };

  const increaseQuantity = (key) => {
    setSelectedDetails((prevDetails) => ({
      ...prevDetails,
      [key]: {
        ...prevDetails[key],
        quantity: prevDetails[key].quantity + 1,
      },
    }));
  };

  // 수량 감소 함수
  const decreaseQuantity = (key) => {
    setSelectedDetails((prevDetails) => ({
      ...prevDetails,
      [key]: {
        ...prevDetails[key],
        quantity:
          prevDetails[key].quantity > 1 ? prevDetails[key].quantity - 1 : 1,
      },
    }));
  };

  return (
    <Box w="100%">
      <Box w="80%">
        <Button colorScheme="blue" onClick={() => navigate("/edit/" + id)}>
          수정
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          삭제
        </Button>
      </Box>

      <Flex justifyContent="center" align="center">
        <Flex w={"80%"}>
          <Box w={"38%"}>
            {board.mainImgs.map((mainImg) => (
              <Box
                key={mainImg.id}
                my="5px"
                w="100%"
                border={"1px solid #eeeeee"}
              >
                <Image w="100%" src={mainImg.url} alt={mainImg.name} />
              </Box>
            ))}
          </Box>

          <VStack w="60%" ml={5}>
            <FormControl>
              <FormLabel fontWeight="bold">상품명</FormLabel>
              <Input
                mt={-2}
                p={0}
                border={"none"}
                value={board.title}
                readOnly
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">상품 설명</FormLabel>
              <Input
                mt={-2}
                p={0}
                border={"none"}
                value={board.content}
                readOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">판매가</FormLabel>
              <Input
                mt={-2}
                p={0}
                border={"none"}
                value={board.writer}
                readOnly
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">배송</FormLabel>
              <Input mt={-2} p={0} border={"none"} value="무료배송" readOnly />
            </FormControl>

            {/* -------------------------- 상세선택 메뉴바 -------------------------- */}
            <Box w="100%">
              <Box w="100%" position="relative" mt={5}>
                <Menu>
                  <MenuButton
                    h="70px"
                    as={Button}
                    colorScheme="gray"
                    rightIcon={<ChevronDownIcon />}
                    bg="none"
                    border={"1px solid #eeeeee"}
                    mb={5}
                    mt={3}
                    w="100%"
                    _hover={{
                      bg: "white",
                    }}
                    _active={{
                      bg: "white",
                    }}
                  >
                    {selectedDetail
                      ? `색상: ${selectedDetail.color}, 축: ${selectedDetail.axis}, 선: ${selectedDetail.line}`
                      : "상품을 선택하세요"}
                  </MenuButton>
                  <MenuList position={"absolute"} maxW="100%" w={"100%"}>
                    {details.map((detail, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSelectDetail(detail)}
                      >
                        색상: {detail.color}, 축: {detail.axis}, 선:{" "}
                        {detail.line}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
              {Object.entries(selectedDetails).map(([key, detail], index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  mt={2}
                  display="flex"
                  alignItems="center"
                >
                  <Text flex="1">
                    {board.title} {detail.axis}, [{detail.color}/{detail.line}
                    선]
                  </Text>
                  <HStack border={"1px solid gray"} borderRadius={"10px"}>
                    <Button
                      size={"sm"}
                      bg={"none"}
                      borderRight={"1px solid gray"}
                      borderRadius={0}
                      p={0}
                      onClick={() => increaseQuantity(key)}
                      _hover={{ bg: "none" }}
                      _active={{ bg: "none" }}
                    >
                      <ChevronUpIcon />
                    </Button>
                    <Box>{detail.quantity}</Box>
                    <Button
                      size={"sm"}
                      bg={"none"}
                      borderLeft={"1px solid gray"}
                      borderRadius={0}
                      p={0}
                      onClick={() => decreaseQuantity(key)}
                      _hover={{ bg: "none" }}
                      _active={{ bg: "none" }}
                    >
                      <ChevronDownIcon />
                    </Button>
                  </HStack>
                </Box>
              ))}
            </Box>
          </VStack>
        </Flex>
      </Flex>

      <Box mt={10}>
        <Text fontWeight="bold" fontSize="30px">
          상품 사용 후기
        </Text>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>내용</FormLabel>
          <Input />
        </FormControl>
        <Button colorScheme="blue">저장</Button>
      </Box>

      <Box mt={10}>
        <Text fontWeight="bold" fontSize="30px">
          상품 Q & N
        </Text>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>내용</FormLabel>
          <Input />
        </FormControl>
        <Button colorScheme="blue">저장</Button>
      </Box>

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
