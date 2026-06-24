import { StyleSheet } from "react-native";
import CardComp from "./CardComp";
import GapContainer from "../general/GapContainer";
import SquareInfo from "./SquareInfo";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { deleteCar } from "../../api/car";
import { useState } from "react";
import { UseCar } from "../../context/CarContext";
import RowCont from "../general/RowCont";
import GhostBtn from "../general/GhostBtn";
import VerticalLine from "../general/VerticalLine";
import { Feather } from "@expo/vector-icons";
import SeparatorComp from "../general/SeparatorComp";
import { alert } from "react-native-alert-queue";

function CarOptionsCard({ params }) {
  const { removeCar, cars } = UseCar();
  const { theme } = useTheme();
  const [showBtns, setShowBtns] = useState(false);

  const navigate = useNavigation();

  const car = cars.find((c) => c._id === params?.id);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const confirmed = await alert.confirm();
      if (confirmed) {
        const response = await deleteCar(params?.id);
        if (response.ok) {
          navigate.navigate("MyCars");
          removeCar(response.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CardComp onPress={() => setShowBtns(!showBtns)}>
      <GapContainer gap={8}>
        <RowCont style={{ justifyContent: "space-between" }}>
          <SquareInfo
            icon={"gauge"}
            title={capFirstLetter(car?.make) + " " + capFirstLetter(car?.name)}
            text={`${car?.mileage.toLocaleString() + " " + capFirstLetter(car?.unit)}`}
            fliped
          />
          <Feather
            name={!showBtns ? "chevron-right" : "chevron-down"}
            color={theme.sec_text}
            size={25}
            style={{ alignSelf: "center" }}
          />
        </RowCont>
        {showBtns && <SeparatorComp full color="faded" />}
        {showBtns && (
          <RowCont gap={10}>
            <GhostBtn
              square
              auto
              title={"Edit"}
              disabled={isDeleting}
              onPress={() => navigate.navigate("AddCar", params)}
            />
            <VerticalLine color="faded" />
            <GhostBtn
              square
              auto
              red
              title={!isDeleting ? "Delete" : "Deleting..."}
              disabled={isDeleting}
              onPress={handleDelete}
            />
          </RowCont>
        )}
      </GapContainer>
    </CardComp>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CarOptionsCard;
