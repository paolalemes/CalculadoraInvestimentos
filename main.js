import { generateReturnsArray } from "./src/investimentGoals";

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  // const startingAmount = Number(form["starting-amount"].value);
  const startingAmount = Number(document.getElementById("starting-amount").value.replace(",", "."));
  const additionalContribution = Number(document.getElementById("additional-contribution").value.replace(",", "."));
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmoundPeriod = document.getElementById("time-amound-period").value;
  const returnRate = Number(document.getElementById("return-rate").value.replace(",", "."));
  const returnRatePeriod = document.getElementById("return-rate-period").value;
  const taxRate = Number(document.getElementById("tax-rate").value.replace(",", "."));

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmoundPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  const errorInputContainers = document.querySelectorAll(".error");
  // errorInputs.forEach((input) => input.classList.remove("error"));
  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  if (event.target.value === "") {
    return;
  }

  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(",", ".");

  if ((isNaN(inputValue) || Number(inputValue) <= 0) && !parentElement.classList.contains("error")) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "Insira um valor numérico e maior que zero";
    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
