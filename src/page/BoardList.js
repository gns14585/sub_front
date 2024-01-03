import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Spinner,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Box justifyContent={"center"} border={"1px solid red"} w="100%">
      <Flex w="80%" justifyContent={"center"} display={"flex"}>
        <h1>게시물 목록</h1>
        <SimpleGrid columns={3} spacing={9} m={20}>
          {boardList.map((board) => (
            <Box
              _hover={{
                cursor: "pointer",
                bg: "gray.100",
                transform: "scale(1.05)", // 이미지를 약간 확대합니다.
                transition: "transform 0.2s",
              }}
              key={board.id}
              onClick={() => navigate("/board/" + board.id)}
              borderRadius="10px"
            >
              {/* 게시물의 첫 번째 이미지를 표시 */}
              {board.mainImgs && board.mainImgs.length > 0 && (
                <Image
                  borderRadius="10px"
                  src={board.mainImgs[0].url}
                  alt="Board Image"
                />
              )}
              <Box color={"gray"} fontSize={"12px"}>
                {board.title}
              </Box>
              <Box fontWeight={"bold"}>{formatPrice(board.price)}원</Box>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
