import { buyAmount, sellAmount } from "./lib/trade.js"

const price = 0.0504
const amount = 10

const token = buyAmount(price, amount)
const reverse = sellAmount(price, token)

console.log(token, reverse)
