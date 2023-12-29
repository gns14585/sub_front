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
    <Box>
      <h1>게시물 목록</h1>
      <SimpleGrid columns={3} spacing={9} m={20}>
        {boardList.map((board) => (
          <Box
            _hover={{ cursor: "pointer" }}
            key={board.id}
            onClick={() => navigate("/board/" + board.id)}
          >
            <Box>
              <Image src={board.mainImg} alt={board.name} />
            </Box>
            <Text>{board.id}</Text>
            <Text>{board.title}</Text>
            <Text>{board.writer}</Text>
            <Text>{board.inserted}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
