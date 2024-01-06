import { Box, Flex, Image, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  const [hoveredBoardId, setHoveredBoardId] = useState(null); // 메인이미지 변경 상태

  // ------------------------------ 상품리스트 렌더링 로직 ------------------------------
  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Box justifyContent={"center"} w="100%">
      <Flex w="80%" justifyContent={"center"} display={"flex"}>
        <h1>게시물 목록</h1>
        <SimpleGrid columns={3} spacing={9} m={20}>
          {boardList.map((board) => (
            <Box
              key={board.id}
              onMouseEnter={() => setHoveredBoardId(board.id)} // 마우스 호버 시 상태 변경
              onMouseLeave={() => setHoveredBoardId(null)} // 마우스 떠날 때 상태 초기화
              onClick={() => navigate("/board/" + board.id)}
              borderRadius="10px"
              boxShadow="md"
              _hover={{
                cursor: "pointer",
                bg: "gray.100",
                transform: "scale(1.05)",
                transition: "transform 0.2s",
              }}
              overflow="hidden"
            >
              <Box height="200px" width="100%" bg="gray.200">
                {/* 마우스 호버 시 2번째 이미지로 변경 */}
                <Image
                  src={
                    board.id === hoveredBoardId && board.mainImgs.length > 1
                      ? board.mainImgs[1].url // 호버 시 2번째 이미지
                      : board.mainImgs[0].url // 기본은 첫 번째 이미지
                  }
                  alt="Board Image"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  transition="opacity 0.2s" // 이미지 변경 시 페이드 효과
                  opacity={1} // 호버 시 이미지 강조
                />
              </Box>
              <Box p={4}>
                <Text fontSize="lg" fontWeight="bold">
                  {board.title}
                </Text>
                <Text color="gray.500">{formatPrice(board.price)}원</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
