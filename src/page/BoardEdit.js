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

  const [removeMainImgs, setRemoveMainImgs] = useState([]); // 이미지 삭제
  const [mainImg, setMainImg] = useState(null); // 이미지 추가

  const [details, setDetails] = useState([]); // 상세선택 배열 상태

  const [newDetails, setNewDetails] = useState([]);

  useEffect(() => {
    // ---------------------------- 상품 렌더링 로직 ----------------------------
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
    // ---------------------------- 상품 상세항목 렌더링 로직 ----------------------------
    axios
      .get("/api/board/details/" + id)
      .then((response) => setDetails(response.data));
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
        manufacturer: board.manufacturer,
        removeMainImgs,
        mainImg,
      })
      .then(() => {
        // ------------------- 상품 등록할 때 처럼 상세등록 정보도 따로 보내기 -------------------
        return axios.put("/api/board/updateDetails", details);
      })

      // ----------------------- 상품 등록시 상세항목 추가 안한 상품 수정할때 상세항목 추가 가능하도록 -----------------------
      .then(() => {
        // 새로운 상세 정보가 있다면 추가 요청
        if (newDetails.length > 0) {
          return axios.post("/api/board/addList", {
            boardId: board.id,
            newDetails,
          });
        }
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

  // ------------------------------ 메인이미지 삭제 로직 ------------------------------
  function handleRemoveMainImgSwitch(mainImgId) {
    setBoard((prevBoard) => ({
      ...prevBoard,
      mainImgs: prevBoard.mainImgs.filter((img) => img.id !== mainImgId),
    }));
    setRemoveMainImgs((prev) => [...prev, mainImgId]);
  }

  // ------------------------------ 상세선택 수정 로직 ------------------------------
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...details];
    const updatedDetail = { ...updatedDetails[index], [field]: value };
    updatedDetails[index] = updatedDetail;
    setDetails(updatedDetails);
  };

  const handleRemoveDetail = (index) => {
    // 상세선택에서 특정 인덱스의 항목을 제거
    setDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
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
          {detail.color && (
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
          {/* 삭제 버튼 */}
          <Button colorScheme="red" onClick={() => handleRemoveDetail(index)}>
            삭제
          </Button>
        </Flex>
      ))}

      <Button onClick={handleUpdate}>수정</Button>
      <Button onClick={() => navigate("/")}>돌아가기</Button>
    </Box>
  );
}
