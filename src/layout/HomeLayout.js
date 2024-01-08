import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box fontWeight={"700"} fontFamily={"Pretendard-Regular"}>
      <NavBar />
      <Outlet />
    </Box>
  );
}
