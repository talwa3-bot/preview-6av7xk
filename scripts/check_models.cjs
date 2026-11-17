const assert=require('node:assert/strict');
const {cashModel,proForma}=require('../models.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
near(cashModel(250,100).closing,340);
near(cashModel(250,70).closing,-71);
near(proForma(0,35).operating,70);
near(proForma(10,35).operating,175);
near(proForma(-20,15).operating,-620);
for(const opening of [0,250,10000])for(const receipts of [70,100,130]){
 const m=cashModel(opening,receipts);let balance=opening;
 for(const row of m.rows){balance+=row.receipt-row.payment;near(balance,row.closing);}
 near(m.closing,opening+m.receipts-m.payments);
}
for(const growth of [-20,10,40])for(const margin of [15,35,60]){
 const m=proForma(growth,margin);near(m.revenue-m.cost,m.gross);near(m.gross-m.expenses,m.operating);
}
assert.equal(cashModel(-1,100),null);assert.equal(cashModel(250,NaN),null);
assert.equal(proForma(41,35),null);assert.equal(proForma(10,61),null);
console.log('PASS: default and downside results, 18 scenario identities, rolling cash balances and invalid input limits.');
