import { StyleSheet } from "react-native";
import CardComp from "../../components/cards/CardComp";
import SquareInfo from "../../components/cards/SquareInfo";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import CardLeftBorder from "../../components/cards/CardLeftBorder";
import GapContainer from "../general/GapContainer";
import SimpleTitleText from "../general/SimpleTitleText";

function AppSummary({ params }) {
  return (
    <>
      <CardComp short>
        <GapContainer gap={15}>
          <SimpleTitleText
            title={capFirstLetter(params.shop.name)}
            text1={
              capFirstLetter(params.car.make) +
              " " +
              capFirstLetter(params.car.name) +
              " - " +
              params.car.model
            }
          />
          <CardLeftBorder
            noPadding
            icon={"invoice-list-outline"}
            miniTitle={"Service Parts"}
            customColor={"sec_text"}
            status={"status"}
            parts={params.parts}
          />
        </GapContainer>
      </CardComp>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AppSummary;
