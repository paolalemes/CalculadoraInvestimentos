function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function generateReturnsArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  monthlyContribuition = 0,
  returnRate = 0,
  returnTimeFrame = "monthly"
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error("Investimento inicial e prazo devem se preenchidos com valores positivos");
  }

  const finalReturnRate =
    returnTimeFrame === "monthly" ? 1 + returnRate / 100 : convertToMonthlyReturnRate(1 + returnRate / 100);

  const finalTimeHorizon = timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  const referenceInvestimentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArray = [referenceInvestimentObject];

  for (let timeReferences = 1; timeReferences <= finalTimeHorizon; timeReferences++) {
    const totalAmount = returnsArray[timeReferences - 1].totalAmount * finalReturnRate + monthlyContribuition;
    const interestReturns = returnsArray[timeReferences - 1].totalAmount * (finalReturnRate - 1);
    const investedAmount = startingAmount + monthlyContribuition * timeReferences;
    const totalInterestReturns = totalAmount - investedAmount;
    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReferences,
      totalAmount,
    });
  }

  return returnsArray;
}
