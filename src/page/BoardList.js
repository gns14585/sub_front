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
    <Box w="100%">
      <Box>게시물 목록</Box>
      <Box display="flex" justifyContent="center">
        <Flex w="70%">
          <SimpleGrid h={"100%"} columns={3} spacing={9} m={10}>
            {boardList.map((board) => (
              <Box
                key={board.id}
                onMouseEnter={() => setHoveredBoardId(board.id)} // 마우스 호버 시 상태 변경
                onMouseLeave={() => setHoveredBoardId(null)}
                borderRadius="10px"
                boxShadow="md"
                _hover={{
                  cursor: "pointer",
                  bg: "gray.100",
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                }}
                overflow="hidden"
                onClick={() => navigate("/board/" + board.id)}
                border={"1px solid gray"}
                alignItems={"center"}
                h={"530px"}
              >
                <Box p={5} height="350px" width="100%" bg="white">
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
                    height="350px" // "cover" 대신 적절한 높이 값 지정
                    opacity={1} // 호버 시 이미지 강조
                  />
                </Box>
                <Flex mt={5} direction="column" p={4} justify="center">
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    [{board.manufacturer}] {board.title}
                  </Text>
                  <Text color="gray.500" textAlign="center">
                    {formatPrice(board.price)}원
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </Box>
  );
}
