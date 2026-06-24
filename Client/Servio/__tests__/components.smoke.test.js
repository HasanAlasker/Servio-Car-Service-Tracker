import React from "react";
import { render, act } from "@testing-library/react-native";

import PriBtn from "../components/general/PriBtn";
import SecBtn from "../components/general/SecBtn";
import GhostBtn from "../components/general/GhostBtn";
import Pill from "../components/general/Pill";
import InputBox from "../components/general/InputBox";
import LoadingCircle from "../components/general/LoadingCircle";
import SafeScreen from "../components/general/SafeScreen";
import ScrollScreen from "../components/general/ScrollScreen";
import GapContainer from "../components/general/GapContainer";

import TText from "../components/text/TText";
import MText from "../components/text/MText";
import SText from "../components/text/SText";

import CarCard from "../components/cards/CarCard";
import AppointmentCard from "../components/cards/AppointmentCard";
import PartCard from "../components/cards/PartCard";

describe("Components smoke test", () => {
  test("PriBtn renders", () => {
    const tree = render(<PriBtn title="OK" onPress={() => {}} />).toJSON();
    expect(tree).toBeTruthy();
  });

  test("SecBtn renders", () => {
    const tree = render(<SecBtn title="OK" onPress={() => {}} />).toJSON();
    expect(tree).toBeTruthy();
  });

  test("GhostBtn renders", () => {
    const tree = render(<GhostBtn title="OK" onPress={() => {}} />).toJSON();
    expect(tree).toBeTruthy();
  });

  test("Pill renders", () => {
    const tree = render(<Pill title="Hello" />).toJSON();
    expect(tree).toBeTruthy();
  });

  test("InputBox renders", () => {
    const tree = render(
      <InputBox placeholder="Email" value="" onChangeText={() => {}} />,
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  test("LoadingCircle renders", () => {
    const tree = render(<LoadingCircle />).toJSON();
    expect(tree).toBeTruthy();
  });

  test("Layout components render", () => {
    const tree = render(
      <SafeScreen>
        <ScrollScreen>
          <GapContainer>
            <TText>Hello</TText>
            <MText>World</MText>
            <SText>Small</SText>
          </GapContainer>
        </ScrollScreen>
      </SafeScreen>,
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  test("CarCard renders", () => {
    const tree = render(
      <CarCard
        id="c1"
        make="toyota"
        name="corolla"
        model={2020}
        plateNumber="ABC-123"
        color="blue"
        mileage={1000}
        unit="km"
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  test("AppointmentCard renders", () => {
    const tree = render(
      <AppointmentCard
        id="a1"
        car={{ make: "toyota", name: "corolla", model: "2020" }}
        customer={{ name: "John" }}
        shop={{ name: "Test Shop", address: { area: "Area", street: "St" } }}
        status="confirmed"
        scheuledAt={new Date().toISOString()}
        type="1"
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  test("PartCard renders", () => {
    const tree = render(
      <PartCard
        part={{
          _id: "p1",
          name: "oil",
          lastChangeDate: new Date().toISOString(),
          lastChangeMileage: 1000,
          recommendedChangeInterval: { months: 6, miles: 5000 },
        }}
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });
});
