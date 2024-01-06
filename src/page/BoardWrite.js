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
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 상품설명
  const [price, setPrice] = useState(""); // 금액
  const [manufacturer, setManufacturer] = useState(""); // 제조사

  const toast = useToast();
  const [mainImg, setMainImg] = useState(null); // 메인이미지

  const [color, setColor] = useState(""); // 상세선택 컬러
  const [axis, setAxis] = useState(""); // 상세선택 축
  const [line, setLine] = useState(""); // 상세선택 선 유무
  const [inch, setInch] = useState(""); // 상세선택 인치

  const [isSubmitting, setIsSubmitting] = useState(false); // 더블클릭 방지

  const navigate = useNavigate();
  const [details, setDetails] = useState([]); // 상세선택 배열 상태

  const [productType, setProductType] = useState(""); // 상품 타입

  // ------------------------------ 저장버튼 클릭시 상품 저장 로직 ------------------------------
  function handleSubmit() {
    setIsSubmitting(true);
    // 상품 저장 로직
    axios
      .postForm("/api/board/add", {
        title,
        content,
        price,
        manufacturer,
        mainImg,
      })
      .then((response) => {
        // ------------------------------ 상품 저장시 상세항목 저장 로직 ------------------------------
        const detailsToSend = details.length === 0 ? null : details;

        // boardId를 넣어줌
        if (detailsToSend) {
          detailsToSend.forEach((e) => (e.boardId = response.data));
        }

        details.forEach((e) => (e.boardId = response.data)); // boardId 를 넣어줌
        axios.post("/api/board/addList", {
          title,
          content,
          price,
          details: detailsToSend,
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

  // ------------------------------ 상세선택 관련 로직 ------------------------------
  const handleAddDetail = () => {
    setDetails([...details, { color, axis, line, inch }]);
    setColor("");
    setAxis("");
    setLine("");
    setInch("");
  };
  // ------------------------------ 상세 선택항목 제거 함수 ------------------------------
  const handleRemoveDetail = () => {
    setDetails(details.slice(0, -1));
  };

  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
    setDetails([]);
  };

  // ------------------------------ 상세선택 상품에 맞게 변경 로직 ------------------------------
  const renderDetailsForm = () => {
    switch (productType) {
      // ----------------- 키보드 -----------------
      case "keyboard":
        return (
          <VStack>
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
          </VStack>
        );

      // ----------------- 마우스 -----------------
      case "mouse":
        return (
          <VStack>
            <HStack>
              <Text w="130px">색상 : </Text>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                w="50%"
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
          </VStack>
        );

      // ----------------- 모니터 -----------------
      case "monitor":
        return (
          <VStack>
            <HStack>
              <Text w="130px">인치 : </Text>
              <Input
                value={inch}
                onChange={(e) => setInch(e.target.value)}
                w="50%"
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
          </VStack>
        );
      default:
        return null;
    }
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
          <FormLabel>제조사</FormLabel>
          <Input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </FormControl>

        {/*<FormControl>*/}
        {/*  <FormLabel>제조사</FormLabel>*/}
        {/*  <Input value{company}*/}
        {/*</FormControl>*/}

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
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>상품 종류</FormLabel>
          <Select
            w="30%"
            value={productType}
            onChange={handleProductTypeChange}
          >
            <option value="">상품을 선택하세요.</option>
            <option value="keyboard">키보드</option>
            <option value="mouse">마우스</option>
            <option value="monitor">모니터</option>
          </Select>
        </FormControl>

        {renderDetailsForm()}

        {/* 상세 정보 표시 */}
        {details.map((detail, index) => (
          <Box key={index}>
            {detail.color && <Text>색상: {detail.color}</Text>}
            {detail.axis && <Text>스위치: {detail.axis}</Text>}
            {detail.line && <Text>선: {detail.line}</Text>}
            {detail.inch && <Text>인치: {detail.inch}</Text>}
          </Box>
        ))}

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
