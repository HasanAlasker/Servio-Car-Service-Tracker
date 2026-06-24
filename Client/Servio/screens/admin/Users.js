import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import TabNav from "../../components/general/TabNav";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import {
  deleteUser,
  getAllUsers,
  getDeletedUsers,
  undeleteUser,
} from "../../api/user";
import UserCard from "../../components/cards/UserCard";
import GapContainer from "../../components/general/GapContainer";
import SText from "../../components/text/SText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { alert } from "react-native-alert-queue";
import SearchBar from "../../components/general/SearchBar";

function Users(props) {
  const [tab, setTab] = useState("1");
  const [active, setActive] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [filter, setFilter] = useState("");

  const {
    data: activeUsers,
    request: fActive,
    loading: loadingA,
    error: errA,
  } = useApi(getAllUsers);

  const {
    data: deletedUsers,
    request: fDeleted,
    loading: loadingD,
    error: errD,
  } = useApi(getDeletedUsers);

  const loading = loadingA || loadingD;

  useEffect(() => {
    fActive();
    fDeleted();
  }, []);

  useEffect(() => {
    setActive(activeUsers);
    setDeleted(deletedUsers);
  }, [activeUsers, deletedUsers]);

  const handleTab = () => {
    if (tab === "1") setTab("2");
    else setTab("1");
  };

  const handleAction = async (isDeleted, id) => {
    try {
      if (isDeleted) {
        setDeleted((prev) => prev.filter((user) => user._id !== id));
        setActive((prev) => {
          const user = deleted.find((user) => user._id === id);
          return user ? [{ ...user, isDeleted: false }, ...prev] : prev;
        });
        await undeleteUser(id);
      } else {
        const confirmed = await alert.confirm();
        if (confirmed) {
          setActive((prev) => prev.filter((user) => user._id !== id));
          setDeleted((prev) => {
            const user = active.find((user) => user._id === id);
            return user ? [{ ...user, isDeleted: true }, ...prev] : prev;
          });
          await deleteUser(id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userData = tab === "1" ? active : deleted;

  const filteredUsers = userData?.filter((u) => {
    const q = filter.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u._id.toLowerCase().includes(q)
    );
  });

  const RenderUsers =
    filteredUsers.length > 0 ? (
      filteredUsers?.map((user) => (
        <UserCard
          key={user._id}
          passedUser={user}
          isDeleted={user.isDeleted}
          handleAction={handleAction}
          goToProfile={true}
          full
        />
      ))
    ) : (
      <SText
        thin
        color={"sec_text"}
        style={{ margin: "auto", textAlign: "center" }}
      >
        {filter && !loading && filteredUsers.length === 0
          ? "No results found"
          : !filter && !loading
            ? "No users here"
            : null}
      </SText>
    );

  return (
    <SafeScreen>
      <ScrollScreen stickyHeader stickyHeaderIndices={[0]}>
        <TabNav
          one={"Active"}
          two={"Deleted"}
          onTabChange={handleTab}
          active={tab}
        />
        <SearchBar onChangeText={setFilter} />
        <GapContainer>
          {RenderUsers}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Users;
