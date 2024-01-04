import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Spinner,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function BoardEdit() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const { id } = useParams();

  const toast = useToast();

  const [removeMainImgs, setRemoveMainImgs] = useState([]);
  const [mainImg, setMainImg] = useState(null);

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
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        price: board.price,
        removeMainImgs,
        mainImg,
      })
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

  function handleRemoveMainImgSwitch(e) {
    if (e.target.checked) {
      setRemoveMainImgs([...removeMainImgs, e.target.value]);
    } else {
      setRemoveMainImgs(
        removeMainImgs.filter((item) => item !== e.target.value),
      );
    }
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

      <Flex>
        {/* 이미지 출력 */}
        {board.mainImgs.length > 0 &&
          board.mainImgs.map((mainImg) => (
            <Box key={mainImg.id} my="5px">
              <FormControl display="flex" alignItems="center">
                <FormLabel>
                  <FontAwesomeIcon color="red" icon={faTrashCan} />
                </FormLabel>
                <Switch
                  value={mainImg.id}
                  colorScheme="red"
                  onChange={handleRemoveMainImgSwitch}
                />
              </FormControl>

              <Box>
                <Image src={mainImg.url} alt={mainImg.name} w={"150px"} />
              </Box>
            </Box>
          ))}
      </Flex>

      <FormControl>
        <FormLabel>메인 이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setMainImg(e.target.files)}
        />
      </FormControl>

      <Button onClick={handleUpdate}>수정</Button>
      <Button onClick={() => navigate("/")}>돌아가기</Button>
    </Box>
  );
}
