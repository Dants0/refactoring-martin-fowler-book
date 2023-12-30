import invoices from '../invoices.json'  assert {type: "json"}
import plays from '../plays.json' assert {type: "json"}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2
  }).format;

  for (let perf of invoice.performances) {  // Correção no nome da propriedade
    const play = playForPerfomance(perf)
    let thisAmount = amountFor(perf, play);

    // return thisAmount

    volumeCredits += Math.max(perf.audience - 30, 0);

    if (playForPerfomance(perf).type === "comedy") {  // Correção na comparação do tipo da peça
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `${playForPerfomance(perf).name}: ${format(thisAmount / 100)} (${perf.audience}%)\n`;

    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;

  return result;
}

function amountFor(aPerformance, play){

  let result = 0;


  switch (playForPerfomance(aPerformance).type) {  
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error("unknown perf type: " + playForPerfomance(aPerformance).type);
  
    }
    return result
}

function playForPerfomance(aPerformance){
  // console.log(aPerformance);
  return plays[aPerformance.playID]
}


// Correção na chamada da função, passando um objeto invoice real
const result = statement(invoices[0], plays);
console.log(result);