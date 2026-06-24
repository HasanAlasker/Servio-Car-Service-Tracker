import { Feather, Ionicons } from "@expo/vector-icons";
import NavBtn from "./NavBtn";
import NavCont from "./NavCont";
import MoreBtn from "./MoreBtn";

function ShopOwner({ onMenu }) {
  return (
    <NavCont>
      <NavBtn
        icon={<Feather name="home" size={26} />}
        name={"ShopDash"}
        lable={"Home"}
        activeIn={["Schedule"]}
      />

      <NavBtn
        icon={<Ionicons name="storefront-outline" size={30} />}
        name={"MyShop"}
        lable={"Shops"}
        textStyle={{ bottom: 1 }}
        activeIn={['AddShop']}
      />

      <NavBtn
        icon={<Feather name="calendar" size={26} />}
        name={"ShopBook"}
        lable={"Bookings"}
        activeIn={["ShopAppointments"]}
      />

      <NavBtn
        icon={<Ionicons name="car-outline" size={35} />}
        name={"MyCars"}
        lable={"Cars"}
        textStyle={{ bottom: 2 }}
        activeIn={["AddCar", "AddPart", "CarParts", "Service"]}
      />

      <MoreBtn />
    </NavCont>
  );
}

export default ShopOwner;
