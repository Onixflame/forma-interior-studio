import test from 'node:test';
import assert from 'node:assert/strict';
import {detectSupportLanguage,getSupportReply} from '../src/lib/demo-chat.ts';

test('detects Russian from Cyrillic',()=>assert.equal(detectSupportLanguage('Сколько стоит ремонт?'),'ru'));
test('detects Czech with and without diacritics',()=>{assert.equal(detectSupportLanguage('Kolik stojí rekonstrukce?'),'cs');assert.equal(detectSupportLanguage('Dobry den, potrebuji odhad ceny'),'cs');});
test('defaults unsupported Latin languages to English',()=>assert.equal(detectSupportLanguage('Hola, necesito ayuda'),'en'));
test('answers in detected language',()=>{assert.match(getSupportReply('Сколько стоит ремонт?'),/бюджет|стоим|калькулятор/i);assert.match(getSupportReply('Kolik stojí rekonstrukce?'),/rozpočet|cenu/i);assert.match(getSupportReply('How much does it cost?'),/budget|price/i);});
