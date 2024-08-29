import { generateReturnsArray } from "./src/investimentGoals";
import { Chart } from "chart.js/auto";

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");
const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();

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

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestimentObject.investedAmount),
            formatCurrency(finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)),
            formatCurrency(finalInvestimentObject.totalInterestReturns * (taxRate / 100)),
          ],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investimentObject) => investimentObject.month),
      datasets: [
        {
          label: "Total investido",
          data: returnsArray.map((investimentObject) => formatCurrency(investimentObject.investedAmount)),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do investimento",
          data: returnsArray.map((investimentObject) => formatCurrency(investimentObject.interestReturns)),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  const errorInputContainers = document.querySelectorAll(".error");
  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }

  resetCharts();
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChart)) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
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
