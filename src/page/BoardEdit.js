import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardEdit() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const { id } = useParams();

  const toast = useToast();

  // ------------------------------ 상품 클릭시 상품 렌더링 ------------------------------
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, [id]);

  if (board === null) {
    return <Spinner />;
  }

  // ------------------------------ 수정버튼 클릭 로직 ------------------------------
  function handleUpdate() {
    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: id + "번 상품 수정 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "오류가 발생하였습니다.",
          status: "error",
        });
      });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) => {
            setBoard({ ...board, title: e.target.value });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>내용</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) => setBoard({ ...board, content: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>판매가</FormLabel>
        <Input
          value={board.price}
          onChange={(e) => setBoard({ ...board, price: e.target.value })}
        />
      </FormControl>

      <Button onClick={handleUpdate}>수정</Button>
      <Button onClick={() => navigate("/")}>돌아가기</Button>
    </Box>
  );
}
