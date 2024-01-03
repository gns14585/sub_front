import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Menu,
  MenuItem,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();
  const [mainImg, setMainImg] = useState(null);

  const [color, setColor] = useState("");
  const [axis, setAxis] = useState("");
  const [line, setLine] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [details, setDetails] = useState([]);

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .postForm("/api/board/add", {
        title,
        content,
        writer,
        mainImg,
      })
      .then((response) => {
        details.forEach((e) => (e.boardId = response.data));
        axios.post("/api/board/addList", {
          title,
          content,
          writer,
          details,
        });

        toast({
          description: "새 글 작성되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // 사용자 작성중 문제
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else {
          // 서버 문제
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  const handleAddDetail = () => {
    setDetails([...details, { color, axis, line }]);
    // 필드 초기화
    setColor("");
    setAxis("");
    setLine("");
  };

  // 상세 항목 제거 함수
  const handleRemoveDetail = () => {
    setDetails(details.slice(0, -1));
  };

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>상품명</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>상품설명</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>

        <FormControl>
          <FormLabel>메인 이미지</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setMainImg(e.target.files)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>판매가</FormLabel>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </FormControl>

        <VStack mt={10}>
          <Box style={{ fontWeight: "bold", fontSize: "20px" }}>상세 선택</Box>
          <HStack>
            <Text w="130px">색상 : </Text>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              w="50%"
            />
            <Text w="180px">스위치 : </Text>
            <Input
              value={axis}
              onChange={(e) => setAxis(e.target.value)}
              w="50%"
            />
            <Text w="80px">선 :</Text>
            <Input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              w="10%"
            />
          </HStack>
          <HStack>
            <Button w="100px" onClick={handleAddDetail}>
              추가
            </Button>
            <Button w="100px" onClick={handleRemoveDetail}>
              빼기
            </Button>
          </HStack>
          {details.map((detail, index) => (
            <Box key={index}>
              색상: {detail.color}, 스위치: {detail.axis}, 선: {detail.line}
            </Box>
          ))}
        </VStack>

        {/* 저장 버튼 */}
        <Button
          mt={10}
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          colorScheme="blue"
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}
