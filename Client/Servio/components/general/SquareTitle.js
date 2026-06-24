import { StyleSheet } from "react-native";
import RowCont from "./RowCont";
import MText from "../text/MText";
import SquareIcon from "./SquareIcon";

function SquareTitle({ icon, title }) {
  return (
    <RowCont gap={10}>
      <SquareIcon icon={icon} />
      <MText color={"main_text"}>{title}</MText>
    </RowCont>
  );
}

export default SquareTitle;
