import { View, StyleSheet } from "react-native";
import Animated, {
  LightSpeedInLeft,
  LinearTransition,
  SlideInDown,
  SlideInLeft,
} from "react-native-reanimated";
import CardComp from "../cards/CardComp";
import RowCont from "../general/RowCont";
import { PieChart } from "react-native-gifted-charts";
import DonutCenter from "./DonutCenter";
import LegendCont from "./LegendCont";
import Legend from "./Legend";
import { useTheme } from "../../context/ThemeContext";

function PieChartComp({ data, loading, total }) {
  const { theme } = useTheme();

  return (
    <Animated.View layout={LinearTransition} entering={SlideInDown}>
      <CardComp>
        <RowCont gap={20} style={{ justifyContent: "space-between" }}>
          <PieChart
            data={data}
            donut
            innerCircleColor={theme.post}
            radius={70}
            innerRadius={48}
            centerLabelComponent={() => (
              <DonutCenter total={loading ? "..." : total} />
            )}
            strokeWidth={2}
            strokeColor={theme.post}
            animationDuration={600}
          />
          <LegendCont>
            {data[0].label &&
              data.map((d) => (
                <Legend
                  key={d.label}
                  color={d.color}
                  label={d.label}
                  value={d.value}
                />
              ))}
          </LegendCont>
        </RowCont>
      </CardComp>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default PieChartComp;
