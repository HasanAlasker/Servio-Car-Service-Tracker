import RowCont from "../general/RowCont";
import GapContainer from "../general/GapContainer";
import SText from "../text/SText";
import TText from "../text/TText";
import SquareIcon from "../general/SquareIcon";

function SquareInfo({ icon, danger, soon, title, text, fliped = false, flex }) {
  return (
    <RowCont gap={10}>
      <SquareIcon icon={icon} />
      <GapContainer flex={flex} gap={1}>
        {!fliped ? (
          <SText
            thin={fliped}
            color={fliped ? "sec_text" : "main_text"}
            numberOfLines={1}
          >
            {title}
          </SText>
        ) : (
          <TText
            numberOfLines={1}
            thin={fliped}
            color={fliped ? "sec_text" : "main_text"}
          >
            {title}
          </TText>
        )}
        {!fliped ? (
          <TText
            numberOfLines={1}
            thin={!fliped}
            color={fliped ? "main_text" : "sec_text"}
          >
            {text}
          </TText>
        ) : (
          <SText
            numberOfLines={1}
            thin={!fliped}
            color={
              danger
                ? "red"
                : soon
                  ? "orange"
                  : !fliped
                    ? "sec_tex"
                    : "main_text"
            }
          >
            {text}
          </SText>
        )}
      </GapContainer>
    </RowCont>
  );
}

export default SquareInfo;
