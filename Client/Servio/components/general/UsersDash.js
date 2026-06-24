import CardLeftBorder from "../../components/cards/CardLeftBorder";
import GapContainer from "../../components/general/GapContainer";
import { useNavigation } from "@react-navigation/native";
import { UseService } from "../../context/ServiceContext";
import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";
import QuickActions from "./QuickActions";
import SText from "../text/SText";
import QuickPeek from "./QuickPeek";
import { UseCar } from "../../context/CarContext";

function UsersDash(props) {
  const navigaiton = useNavigation();
  const { services, loading } = UseService();
  const { cars } = UseCar();

  const impServices = services.filter((s) => s.status !== "soon");

  const statusPriority = { overdue: 0, due: 1 };

  const goThrough = () => {
    const carMap = {};

    for (const service of impServices) {
      const carId = service.car._id;
      if (
        !carMap[carId] ||
        statusPriority[service.status] < statusPriority[carMap[carId].status]
      ) {
        carMap[carId] = service;
      }
    }

    return Object.values(carMap).sort(
      (a, b) => statusPriority[a.status] - statusPriority[b.status],
    );
  };
  const ServiceList = goThrough().map((s) => (
    <CardLeftBorder
      key={s._id}
      shadow
      status={s.status}
      customText={capFirstLetter(s.car.make + " " + s.car.name)}
      showBtn
      onPress={() => navigaiton.navigate("Service")}
    />
  ));
  return (
    <>
      {!loading && ServiceList.length > 0 ? (
        <GapContainer gap={20}>
          <SText thin color={"sec_text"}>
            {ServiceList[0].props.status === "soon"
              ? "Coming Later"
              : "Attention Needed"}
          </SText>
          {ServiceList}
        </GapContainer>
      ) : !loading && ServiceList.length === 0 && cars.length > 0 ? (
        <CardLeftBorder
          shadow
          status={" "}
          icon={"checkbox-marked-circle-outline"}
          customColor={"green"}
          miniTitle={"You're all set"}
          customText={"No services required!"}
        />
      ) : null}

      <QuickActions />

      {cars.length > 0 && <QuickPeek />}
    </>
  );
}

export default UsersDash;
