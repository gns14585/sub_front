import {
  Box,
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

  return (
    <Box justifyContent={"center"} border={"1px solid red"} w="100%">
      <Box w="80%" justifyContent={"center"} display={"flex"}>
        <h1>게시물 목록</h1>
        <SimpleGrid columns={3} spacing={9} m={20}>
          {boardList.map((board) => (
            <Box
              _hover={{ cursor: "pointer" }}
              key={board.id}
              onClick={() => navigate("/board/" + board.id)}
            >
              {/* 게시물의 첫 번째 이미지를 표시 */}
              {board.mainImgs && board.mainImgs.length > 0 && (
                <Image src={board.mainImgs[0].url} alt="Board Image" />
              )}

              <Text>{board.id}</Text>
              <Text>title : {board.title}</Text>
              <Text>content : {board.content}</Text>
              <Text>writer : {board.writer}</Text>
              <Text>inserted : {board.inserted}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
