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
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {  // Correção no acesso ao tipo da peça
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error("unknown perf type: " + play.type);
    }

    // return thisAmount

    volumeCredits += Math.max(perf.audience - 30, 0);

    if (play.type === "comedy") {  // Correção na comparação do tipo da peça
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience}%)\n`;

    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;

  return result;
}

// Correção na chamada da função, passando um objeto invoice real
const result = statement(invoices[0], plays);
console.log(result);