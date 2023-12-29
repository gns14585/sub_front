import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .post("/api/board/add", {
        title,
        content,
        writer,
      })
      .then(() => {
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

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>

        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </FormControl>

        <Button
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
