import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import NavBtn from "./NavBtn";
import NavCont from "./NavCont";
import MoreBtn from "./MoreBtn";

function Admin({ onMenu }) {
  return (
    <NavCont>
      <NavBtn icon={<Feather name="home" size={26} />} name={"Dash"} />

      <NavBtn
        icon={<Ionicons name="storefront-outline" size={30} />}
        name={"AdminShops"}
        lable={"Shops"}
        textStyle={{ bottom: 1 }}
      />

      <NavBtn
        icon={
          <MaterialCommunityIcons name="bullhorn-variant-outline" size={26} />
        }
        name={"Reports"}
      />

      <NavBtn icon={<Feather name="users" size={26} />} name={"Users"} />

      <MoreBtn />
    </NavCont>
  );
}

export default Admin;
