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

  const [details, setDetails] = useState([]);

  // ------------------------------ 상품 클릭시 상품 렌더링 ------------------------------
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, [id]);

  // ------------------------------ 상세선택 렌더링 ------------------------------
  useEffect(() => {
    axios.get("/api/board/details/" + id).then((response) => {
      console.log(response.data);
      setDetails(response.data);
    });
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

  function handleRemoveMainImgSwitch(mainImgId) {
    setBoard((prevBoard) => ({
      ...prevBoard,
      mainImgs: prevBoard.mainImgs.filter((img) => img.id !== mainImgId),
    }));
    setRemoveMainImgs((prev) => [...prev, mainImgId]);
  }

  const handleDetailChange = (index, field, value) => {
    // 'details' 배열의 깊은 복사본을 생성합니다.
    const updatedDetails = [...details];

    // 'details' 배열의 특정 인덱스에 있는 객체를 업데이트합니다.
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };

    // 업데이트된 배열로 'setDetails' 상태를 업데이트합니다.
    setDetails(updatedDetails);
    console.log(updatedDetails);
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>상품명</FormLabel>
        <Input
          value={board.title}
          onChange={(e) => {
            setBoard({ ...board, title: e.target.value });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>상품설명</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) => setBoard({ ...board, content: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>제조사</FormLabel>
        <Input
          value={board.manufacturer}
          onChange={(e) => setBoard({ ...board, manufacturer: e.target.value })}
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
        {board.mainImgs.length > 0 &&
          board.mainImgs.map((img) => (
            <Box key={img.id} my="5px">
              <FormControl display="flex" alignItems="center">
                <FormLabel>
                  <FontAwesomeIcon color="red" icon={faTrashCan} />
                </FormLabel>
                <Switch
                  value={img.id}
                  colorScheme="red"
                  onChange={() => handleRemoveMainImgSwitch(img.id)}
                />
              </FormControl>
              <Box>
                <Image src={img.url} alt={img.name} w="150px" />
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

      {details.map((detail, index) => (
        <Flex key={index} my={2}>
          {detail.color > 0 && (
            <FormControl>
              <FormLabel>색상</FormLabel>
              <Input
                value={detail.color}
                onChange={(e) =>
                  handleDetailChange(index, "color", e.target.value)
                }
              />
            </FormControl>
          )}

          {detail.axis && (
            <FormControl ml={2}>
              <FormLabel>스위치</FormLabel>
              <Input
                value={detail.axis}
                onChange={(e) =>
                  handleDetailChange(index, "axis", e.target.value)
                }
              />
            </FormControl>
          )}

          {detail.line && (
            <FormControl ml={2}>
              <FormLabel>선</FormLabel>
              <Input
                value={detail.line}
                onChange={(e) =>
                  handleDetailChange(index, "line", e.target.value)
                }
              />
            </FormControl>
          )}

          {detail.inch && (
            <FormControl ml={2}>
              <FormLabel>인치</FormLabel>
              <Input
                value={detail.inch}
                onChange={(e) =>
                  handleDetailChange(index, "inch", e.target.value)
                }
              />
            </FormControl>
          )}
        </Flex>
      ))}

      <Button onClick={handleUpdate}>수정</Button>
      <Button onClick={() => navigate("/")}>돌아가기</Button>
    </Box>
  );
}
