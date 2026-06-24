import { StyleSheet } from "react-native";
import SafeScreen from "../../components/general/SafeScreen";
import ScrollScreen from "../../components/general/ScrollScreen";
import GapContainer from "../../components/general/GapContainer";
import Navbar from "../../components/general/Navbar";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { deleteSuggestion, getAllSuggestions } from "../../api/suggestion";
import SuggestionCard from "../../components/cards/SuggestionCard";
import LText from "../../components/text/LText";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import SText from "../../components/text/SText";

function SeeSuggestions(props) {
  const [sug, setSug] = useState([]);
  const { data, request, loading, error } = useApi(getAllSuggestions);

  useEffect(() => {
    request();
  }, []);

  useEffect(() => {
    setSug(data);
  }, [data]);

  const handleDelete = async (id) => {
    try {
      setSug((p) => p.filter((sug) => sug._id !== id));
      await deleteSuggestion(id);
    } catch (error) {
      console.log(error);
    }
  };

  const RenderSug = sug.map((s) => (
    <SuggestionCard
      key={s._id}
      id={s._id}
      suggestion={s}
      onAction={handleDelete}
    />
  ));

  return (
    <SafeScreen>
      <ScrollScreen>
        <GapContainer>
          <LText>User Suggestions</LText>
          {RenderSug}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}
          {loading && <LoadingSkeleton />}

          {!loading && sug.length === 0 && (
            <SText
              thin
              color={"sec_text"}
              style={{ margin: "auto", textAlign: "center" }}
            >
              There are no suggestions
            </SText>
          )}
        </GapContainer>
      </ScrollScreen>
      <Navbar />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SeeSuggestions;
