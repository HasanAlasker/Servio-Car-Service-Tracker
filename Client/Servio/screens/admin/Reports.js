import { Platform, StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import Navbar from "../../components/general/Navbar";
import TabNav from "../../components/general/TabNav";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { getClosedReports, getOpenReports } from "../../api/report";
import GapContainer from "../../components/general/GapContainer";
import ReportCard from "../../components/cards/ReportCard";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useReportStore } from "../../store/admin/useReportStore";
import SText from "../../components/text/SText";
import SearchBar from "../../components/general/SearchBar";

function Reports(props) {
  const [tab, setTab] = useState("1");
  const [refreshing, setRefreshing] = useState(false);

  const open = useReportStore((state) => state.open);
  const closed = useReportStore((state) => state.closed);
  const loading = useReportStore((state) => state.loading);
  const loadReports = useReportStore((state) => state.loadReports);
  const closeReport = useReportStore((state) => state.closeReport);
  const openReport = useReportStore((state) => state.openReport);
  const [filter, setFilter] = useState("");

  const handleTab = () => {
    if (tab === "1") setTab("2");
    else setTab("1");
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadReports();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const dataSource = tab === "1" ? open : closed;

  const filteredReports = dataSource?.filter((r) => {
    const q = filter.toLowerCase();
    return (
      r.reporter.name?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q) ||
      r.reportedShop.name?.toLowerCase().includes(q) ||
      r.appointment.car.name?.toLowerCase().includes(q) ||
      r.appointment.car.make?.toLowerCase().includes(q) ||
      r.appointment.status?.toLowerCase().includes(q)
    );
  });

  const RenderReports =
    filteredReports.length > 0 ? (
      filteredReports?.map((o) => (
        <ReportCard
          key={o._id}
          reason={o.reason}
          status={o.status}
          createdAt={o.createdAt}
          reporter={o.reporter}
          appointment={o.appointment}
          id={o._id}
          shop={o.reportedShop}
          updatedAt={o.updatedAt}
          onClose={closeReport}
          onOpen={openReport}
        />
      ))
    ) : (
      <SText
        thin
        color={"sec_text"}
        style={{ margin: "auto", textAlign: "center" }}
      >
        {!filter && filteredReports.length === 0
          ? "No reports here"
          : filter
            ? "No results found"
            : null}
      </SText>
    );

  return (
    <SafeScreen>
      <ScrollScreen
        {...(Platform.OS !== "web" && { refreshing, onRefresh: refresh })}
        stickyHeader
        stickyHeaderIndices={[0]}
      >
        <TabNav
          one={"Open"}
          two={"Closed"}
          onTabChange={handleTab}
          active={tab}
        />
        <SearchBar onChangeText={setFilter} />
        <GapContainer>
          {RenderReports}
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

export default Reports;
