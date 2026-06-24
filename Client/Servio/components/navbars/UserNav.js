import { Feather, Ionicons } from "@expo/vector-icons";
import { UseService } from "../../context/ServiceContext";
import { UseAppointment } from "../../context/AppointmentContext";
import NavBtn from "./NavBtn";
import NavCont from "./NavCont";
import MoreBtn from "./MoreBtn";

function UserNav({ onMenu }) {
  const { countDueServices } = UseService();
  const { isConfirmedAppointments, completed } = UseAppointment();

  return (
    <NavCont>
      <NavBtn
        name={"Home"}
        icon={<Feather name="home" size={26} />}
        notificationCondition={completed.length > 0}
        activeIn={["CompletedAppointments"]}
      />

      <NavBtn
        name="MyCars"
        lable={"Garage"}
        icon={<Ionicons name="car-outline" size={35} />}
        textStyle={{ bottom: 4 }}
        activeIn={["CarParts", "AddPart", "AddCar"]}
      />

      <NavBtn
        name="Bookings"
        icon={<Feather name="calendar" size={26} />}
        notificationCondition={isConfirmedAppointments()}
      />

      <NavBtn
        name="Service"
        icon={<Feather name="clock" size={26} />}
        notificationCondition={countDueServices() > 0}
      />

      <MoreBtn />
    </NavCont>
  );
}

export default UserNav;
