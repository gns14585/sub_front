import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
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

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);

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

  return (
    <Box w="100%">
      <h1>글 보기</h1>

      <Box>
        <Button colorScheme="blue" onClick={() => navigate("/edit/" + id)}>
          수정
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          삭제
        </Button>
      </Box>

      <Flex>
        <Box>
          {board.mainImgs.map((mainImg) => (
            <Box key={mainImg.id} my="5px" w="100%" border="3px solid black">
              <Image w="100%" src={mainImg.url} alt={mainImg.name} />
            </Box>
          ))}
        </Box>

        <VStack w="70%">
          <FormControl>
            <FormLabel fontWeight="bold">상품명</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">상품 설명</FormLabel>
            <Input value={board.content} readOnly />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">판매가</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold">작성일시</FormLabel>
            <Input value={board.inserted} readOnly />
          </FormControl>
        </VStack>
      </Flex>

      <Box w="100%">
        {/* 기존 UI 코드 */}
        <Box>
          {/* 상세 정보 출력 */}
          <h2>상세 정보</h2>
          {details.map((detail, id) => (
            <div key={id}>
              <p>상품명: {detail.productName}</p>
              <p>색상: {detail.color}</p>
              <p>축: {detail.axis}</p>
              <p>선: {detail.line}</p>
            </div>
          ))}
        </Box>
        {/* 기존 UI 코드 */}
      </Box>

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
