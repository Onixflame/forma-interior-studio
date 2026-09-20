import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,defaults,normalizeInput,money} from '../src/lib/pricing.ts';
test('reference example is 63,000–84,000 USD',()=>assert.deepEqual(calculate(defaults),{low:63000,high:84000}));
test('condition and property coefficients, rounding',()=>{assert.deepEqual(calculate({...defaults,condition:'updating'}),{low:69300,high:92400});assert.deepEqual(calculate({...defaults,condition:'extensive',property:'house'}),{low:86600,high:115500});assert.deepEqual(calculate({...defaults,area:31,package:'Essential'}),{low:18600,high:24800});});
test('boundaries accepted and out of range rejected',()=>{for(const area of [30,150])assert.ok(calculate({...defaults,area}));for(const area of [29,151,0,-1,NaN,Infinity])assert.equal(calculate({...defaults,area}),null);});
test('untrusted query parameters normalize without unsafe keys',()=>{assert.deepEqual(normalizeInput({area:'invalid',package:'__proto__',property:'castle',condition:'bad',start:'no'}),defaults);assert.equal(normalizeInput({area:'151'}).area,151);assert.equal(calculate({...defaults,package:'toString' as typeof defaults.package}),null);});
test('locale changes display, not numerical inputs',()=>{for(const locale of ['en','cs','ru']){assert.ok(money(63000,locale).includes('63'));assert.deepEqual(calculate(defaults),{low:63000,high:84000});}});
