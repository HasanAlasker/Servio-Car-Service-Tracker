import { StyleSheet } from "react-native";
import CardComp from "./CardComp";
import SquareInfo from "./SquareInfo";
import { formatDate } from "../../functions/formatDate";
import StatusLabel from "../general/StatusLabel";
import GapContainer from "../general/GapContainer";
import SText from "../text/SText";
import PriBtn from "../general/PriBtn";

function SuggestionCard({ suggestion, id, onAction }) {
  return (
    <CardComp>
      <GapContainer gap={18}>
        <SquareInfo
          color={"lightBlue"}
          title={suggestion.user.name}
          text={formatDate(suggestion.createdAt) + " - " + suggestion.user.role}
          icon={"account"}
        />
        <StatusLabel status={suggestion.type} />
        <GapContainer gap={5}>
          <SText thin color={"sec_text"}>
            {suggestion.title}
          </SText>
          <SText>{suggestion.message}</SText>
        </GapContainer>
        <PriBtn square full title={"Delete"} onPress={() => onAction(id)} />
      </GapContainer>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SuggestionCard;
