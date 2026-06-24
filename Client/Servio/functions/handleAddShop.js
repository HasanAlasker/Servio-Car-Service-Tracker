export const handleSubmit = async (values) => {
  setErr(false);
  setErrMsg(null);
  const formattedValues = formatValues(values);

  try {
    const response = await openShop(formattedValues);
    if (response.ok) {
      await loadShops();
      navigate.navigate("MyShop");
    }
    if (!response.ok) {
      setErr(true);
      if (response.data?.message === "Validation error") {
        setErrMsg(response.data.errors[0].message);
      } else {
        setErrMsg("An error occurred. Please try again.");
      }
    }
  } catch (error) {}
};
