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

  // ------------------------- 렌더링시 게시물 가져오기 -------------------------
  useEffect(() => {
    // ---------- 상세선택 ----------
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
    // ---------- 게시물 ----------
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  // ------------------------- 게시물 삭제 로직 -------------------------
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

  // ------------------------- 가격 , 쉼표구분 -------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // ------------------------- 수량마다 가격 변경로직 -------------------------
  const handleSelectDetail = (detail) => {
    const key = `${detail.color}-${detail.axis}-${detail.line}`;
    setSelectedDetails((prevDetails) => {
      const existingDetail = prevDetails[key];
      if (existingDetail) {
        return {
          ...prevDetails,
          [key]: {
            ...existingDetail,
            quantity: existingDetail.quantity + 1,
            price: board.price,
          },
        };
      }
      return {
        ...prevDetails,
        [key]: {
          ...detail,
          quantity: 1,
          price: board.price,
        },
      };
    });
  };

  // ------------------------- 수량 증가 로직 -------------------------
  const increaseQuantity = (key) => {
    setSelectedDetails((prevDetails) => ({
      ...prevDetails,
      [key]: {
        ...prevDetails[key],
        quantity: prevDetails[key].quantity + 1,
      },
    }));
  };

  // ------------------------- 수량 감소 로직 -------------------------
  const decreaseQuantity = (key) => {
    setSelectedDetails((prevDetails) => {
      // 현재 항목의 수량 확인
      const currentQuantity = prevDetails[key].quantity;

      if (currentQuantity > 1) {
        // 수량이 1보다 크면 수량 감소
        return {
          ...prevDetails,
          [key]: {
            ...prevDetails[key],
            quantity: currentQuantity - 1,
          },
        };
      } else {
        // 수량이 1이면 해당 항목을 목록에서 제거
        const { [key]: _, ...rest } = prevDetails;
        return rest;
      }
    });
  };

  // ------------------------- 총 가격 계산 로직 -------------------------
  const calculateTotalPrice = () => {
    const total = Object.values(selectedDetails).reduce((total, detail) => {
      const price = detail.price || 0;
      return total + price * detail.quantity;
    }, 0);

    return formatPrice(total); // 총액 포매팅
  };

  // ------------------------- 추가한 상품 삭제 로직 -------------------------
  const handleRemoveDetail = (key) => {
    setSelectedDetails((prevDetails) => {
      const { [key]: _, ...rest } = prevDetails;
      return rest;
    });
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
              <Box mt={-2} p={0} border={"none"}>
                {board.title}
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">상품 설명</FormLabel>
              <Box mt={-2} p={0} border={"none"} readOnly>
                {board.content}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">판매가</FormLabel>
              <Box mt={-2} p={0} border={"none"} readOnly>
                {formatPrice(board.price)}원
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">배송</FormLabel>
              <Box mt={-2} p={0} border={"none"}>
                무료배송
              </Box>
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
              <Box>
                {Object.entries(selectedDetails).map(([key, detail], index) => (
                  <Box bg="#F9F9F9" border={"1px solid #F9F9F9"}>
                    <Box
                      border={"none"}
                      key={index}
                      p={4}
                      borderWidth="1px"
                      mt={2}
                      display="flex"
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize={"15px"} flex="1">
                        {board.title} {detail.axis}, [{detail.color}/
                        {detail.line}]
                      </Text>
                      <Button
                        size={"sm"}
                        onClick={() => handleRemoveDetail(key)}
                        bg={"none"}
                        _hover={{ cursor: "background: none" }}
                        _active={{ bg: "none" }}
                      >
                        X
                      </Button>
                    </Box>
                    <HStack
                      w={"74px"}
                      border={"1px solid gray"}
                      borderRadius={"10px"}
                      bg={"white"}
                      m={3}
                    >
                      <Button
                        size={"xs"}
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
                        size={"xs"}
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
                <Box mt={10} textAlign={"end"}>
                  <Box textAlign={"end"}>
                    <Text color={"gray"}>총 합계 금액</Text>
                    <Text
                      style={{
                        color: "red",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      {calculateTotalPrice()}
                      <span style={{ fontSize: "18px" }}>원</span>
                    </Text>
                  </Box>
                </Box>
              </Box>
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
