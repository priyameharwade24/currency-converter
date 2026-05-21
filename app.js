const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ----------------------
// Populate dropdowns
// ----------------------
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ----------------------
// Fetch exchange rate
// ----------------------
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${from}.json`;

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    let data = await response.json();

    let rate = data[from][to];

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${from.toUpperCase()} = ${finalAmount.toFixed(
      2
    )} ${to.toUpperCase()}`;
  } catch (error) {
    console.log("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate ❌";
  }
};

// ----------------------
// Update flag
// ----------------------
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ----------------------
// Button click handler
// ----------------------
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// ----------------------
// Auto load rate on page load
// ----------------------
window.addEventListener("load", () => {
  updateExchangeRate();
});