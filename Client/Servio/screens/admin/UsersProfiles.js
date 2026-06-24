import { View, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import SText from "../../components/text/SText";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import useApi from "../../hooks/useApi";
import { getUserProfile } from "../../api/user";
import { useState } from "react";
import { useEffect } from "react";
import SimpleTitleText from "../../components/general/SimpleTitleText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import GapContainer from "../../components/general/GapContainer";
import CarCard from "../../components/cards/CarCard";
import ShopCard from "../../components/cards/ShopCard";

function UsersProfiles(props) {
  const [user, setUser] = useState();
  const [cars, setCars] = useState(null);
  const [shops, setShops] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const { data: profile, request: fetchUser, loading } = useApi(getUserProfile);

  useEffect(() => {
    fetchUser(userId);
  }, []);

  useEffect(() => {
    setUser(profile.user);
    setCars(profile.cars);
    setShops(profile.shops);
    // console.log(profile);
  }, [profile]);

  const carsList = cars?.map((car) => (
    <CarCard
      key={car._id}
      id={car._id}
      image={car?.image}
      make={car.make}
      name={car.name}
      model={car.model}
      plateNumber={car.plateNumber}
      color={car?.color}
      mileage={car.mileage}
      unit={car?.unit}
    />
  ));

  const shopsList = shops?.map((shop) => (
    <ShopCard
      key={shop._id}
      id={shop._id}
      name={shop.name}
      address={shop.address}
      description={shop.description}
      image={shop?.image}
      openHours={shop.openHours}
      rating={shop.rating}
      ratingCount={shop.ratingCount}
      services={shop.services}
      // isVerified={shop.isVerified}
      // isDeleted={shop.isDeleted}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen>
        <MenuBackBtn onClose={() => navigation.goBack()} />
        <GapContainer>
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          <SimpleTitleText title={user?._id} text1={user?.name} />
          {carsList}
          {shopsList}
        </GapContainer>
      </ScrollScreen>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default UsersProfiles;
