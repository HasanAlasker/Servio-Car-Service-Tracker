import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { alert } from "react-native-alert-queue";
import { deleteUser, getUserProfile, undeleteUser } from "../../api/user";
import CarCard from "../../components/cards/CarCard";
import ShopCard from "../../components/cards/ShopCard";
import GapContainer from "../../components/general/GapContainer";
import MenuBackBtn from "../../components/general/MenuBackBtn";
import PriBtn from "../../components/general/PriBtn";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import SimpleTitleText from "../../components/general/SimpleTitleText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import useApi from "../../hooks/useApi";
import useAppToast from "../../hooks/useAppToast";

function UsersProfiles(props) {
  const [user, setUser] = useState();
  const [cars, setCars] = useState(null);
  const [shops, setShops] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [deleting, setDeleting] = useState(false);
  const toast = useAppToast();

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

  const handleSuspension = async () => {
    setDeleting(true);
    try {
      if (user?.isDeleted) {
        const res = await undeleteUser(user._id);
        if (res.ok) navigation.navigate("Users");
      } else {
        const confimed = await alert.confirm();
        if (confimed) {
          const res = await deleteUser(user._id);
          if (res.ok) navigation.navigate("Users");
        }
      }
    } catch (error) {
      toast.error("Action Failed");
      console.log(error);
    }
  };

  return (
    <SafeScreen>
      <ScrollScreen>
        <MenuBackBtn onClose={() => navigation.goBack()} />
        <GapContainer>
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          <SimpleTitleText title={user?._id} text1={user?.name} />
          {user?.role !== "admin" && (
            <PriBtn
              full
              square
              red={!user?.isDeleted}
              title={user?.isDeleted ? "Remove Suspension" : "Suspend User"}
              onPress={handleSuspension}
            />
          )}
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