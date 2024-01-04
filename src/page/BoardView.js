import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
  const [selectedDetails, setSelectedDetails] = useState({});
  const [selectedColor, setSelectedColor] = useState(""); // 선택한 색상을 관리하기 위한 상태

  // ------------------------------ 렌더링시 게시물 가져오기 ------------------------------
  useEffect(() => {
    // ------------------------------ 상세선택 ------------------------------
    axios.get("/api/board/details/" + id).then((response) => {
      setDetails(response.data);
    });
  }, [id]);

  useEffect(() => {
    // ------------------------------ 게시물 ------------------------------
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  // ------------------------------ 게시물 삭제 로직 ------------------------------
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
      })
      .finally(() => onClose());
  }

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // ------------------------------ 상세선택 메뉴 상품 클릭시 상품목록 실행 로직 ------------------------------
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

  // ------------------------------ 수량 증가 로직 ------------------------------
  const increaseQuantity = (key) => {
    setSelectedDetails((prevDetails) => ({
      ...prevDetails,
      [key]: {
        ...prevDetails[key],
        quantity: prevDetails[key].quantity + 1,
      },
    }));
  };

  // ------------------------------ 수량 감소 로직 ------------------------------
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

  // ------------------------------ 수량에 따라 총 가격 계산 로직 ------------------------------
  const calculateTotalPrice = () => {
    const total = Object.values(selectedDetails).reduce((total, detail) => {
      const price = detail.price || 0;
      return total + price * detail.quantity;
    }, 0);

    return formatPrice(total); // 총액 포매팅
  };

  // ------------------------------ 목록에있는 상품 삭제 로직 ------------------------------
  const handleRemoveDetail = (key) => {
    setSelectedDetails((prevDetails) => {
      const { [key]: _, ...rest } = prevDetails;
      return rest;
    });
  };

  return (
    <Box w="100%">
      <Box w="80%">
        {/* ------------------------------ 상품 수정, 삭제 ------------------------------ */}
        <Button colorScheme="blue" onClick={() => navigate("/edit/" + id)}>
          수정
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          삭제
        </Button>
      </Box>

      {/* ------------------------------ 상품명 ------------------------------ */}
      <Center mt={10} mb={10} w={"100%"} justifyContent={"center"}>
        <Box w={"80%"}>
          <Box fontSize={"1.5rem"} p={0} border={"none"}>
            {board.title}
          </Box>
        </Box>
      </Center>

      {/* ------------------------------ 상품 이미지 ------------------------------ */}
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

          {/* ------------------------------ 이미지 옆 상품 기본 정보 ------------------------------ */}
          <VStack w="60%" ml={5}>
            <HStack w={"100%"} h={"50px"} borderBottom={"1px solid #eeeeee"}>
              <FormLabel w="100px" fontWeight="bold">
                판매가
              </FormLabel>
              <Box
                fontWeight={"bold"}
                fontSize={"20px"}
                mt={-2}
                p={0}
                border={"none"}
                readOnly
              >
                {formatPrice(board.price)}원
              </Box>
            </HStack>

            <HStack w={"100%"} h={"50px"} borderBottom={"1px solid #eeeeee"}>
              <FormLabel w="100px" fontWeight="bold">
                상품 설명
              </FormLabel>
              <Box mt={-2} p={0} border={"none"} readOnly>
                {board.content}
              </Box>
            </HStack>

            <HStack w={"100%"} h={"50px"} borderBottom={"1px solid #eeeeee"}>
              <FormLabel w="100px" fontWeight="bold">
                배송
              </FormLabel>
              <Box mt={-2} p={0} border={"none"}>
                무료배송
              </Box>
            </HStack>

            {/* ------------------------------ 상세선택 메뉴바 ------------------------------ */}
            {/* TODO : 현재 Select , Option 으로 처리했음 문제는 메뉴에 이미지가 안들어감 */}
            {/* TODO : ChakraUI 의 Menu로 변경했을때 width 길이만 해결되면 코드변경예정 */}

            <Box w="100%">
              <Box w="100%" position="relative" mt={5}>
                <Box>
                  <Select
                    mb={10}
                    h={"60px"}
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      const selected = details.find(
                        (detail) =>
                          `${detail.color}-${detail.axis}-${detail.line}` ===
                          e.target.value,
                      );
                      if (selected) {
                        handleSelectDetail(selected);
                      }
                    }}
                    style={{
                      outline: "none",
                      borderColor: "#eeeeee", // 테두리 색 변경해야 수량 증가 감소 버튼이 위 아래 margin 생김
                      boxShadow: "none", // 기본 박스 그림자 제거
                      borderRadius: "0",
                    }}
                  >
                    <option>상품을 선택하세요</option>
                    {details.map((detail, index) => (
                      <option
                        key={index}
                        value={`${detail.color}-${detail.axis}-${detail.line}`}
                      >
                        {`[${detail.color}/${detail.line}] ${detail.axis} `}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Box>
              <Box>
                {/* ------------------------------ 상품 선택시 목록 보이기 ------------------------------ */}
                {Object.entries(selectedDetails).map(([key, detail], index) => (
                  <Box bg="#F9F9F9" border={"1px solid #F9F9F9"} key={key}>
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
                      <Box fontSize={"13px"}>{detail.quantity}</Box>
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

                <Box mt={10}>
                  <Button
                    h={"50px"}
                    w={"20%"}
                    bg={"none"}
                    borderRadius={0}
                    border={"1px solid #eeeeee"}
                  >
                    찜하기
                  </Button>
                  <Button
                    h={"50px"}
                    w={"30%"}
                    borderRadius={0}
                    bg={"none"}
                    border={"1px solid #eeeeee"}
                  >
                    장바구니
                  </Button>
                  <Button
                    h={"50px"}
                    w={"50%"}
                    borderRadius={0}
                    bg={"black"}
                    color={"white"}
                    border={"1px solid #eeeeee"}
                    _hover={{ color: "black", background: "gray.300" }}
                  >
                    구매하기
                  </Button>
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
