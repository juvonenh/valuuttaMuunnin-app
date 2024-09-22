import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View, TextInput, Button, Image } from "react-native";

export default function App() {
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState("");
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const myHeaders = new Headers();
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  myHeaders.append("apikey", apiKey);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  const fetchUrl = () => {
    fetch(
      "https://api.apilayer.com/exchangerates_data/latest?base=EUR",
      requestOptions
    )
      .then((response) => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);

        return response.json();
      })
      .then((data) => {
        setCurrencyRates(data.rates);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  const handleConvert = () => {
    const amountEur = Number(amount) / currencyRates[selectedCurrency];
    setConverted(`${amountEur.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("./euro_picture.png")}
      ></Image>
      <Text style={styles.text}>{converted} €</Text>
      <View>
        <Button title="CONVERT" onPress={handleConvert} />
        <View>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={amount}
            onChangeText={(amount) => setAmount(amount)}
            keyboardType="numeric"
          />
          <Picker
            style={styles.picker}
            selectedValue={selectedCurrency}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCurrency(itemValue)
            }
          >
            {Object.keys(currencyRates)
              .sort()
              .map((key) => (
                <Picker.Item label={key} value={key} key={key} />
              ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  image: {
    width: 180,
    height: 180,
  },
  text: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  input: {
    height: 40,
    width: 150,
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
  },
  picker: { width: "100%" },
});
