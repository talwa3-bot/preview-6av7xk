import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.js';
import {createHmac} from 'node:crypto';
import {readFileSync} from 'node:fs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(readFileSync('drizzle/0000_bumpy_thunderbolt_ross.sql','utf8'));
const DB={prepare(sql){let args=[];const statement=sqlite.prepare(sql);return{bind(...v){args=v;return this},async run(){return statement.run(...args)},async first(){return statement.get(...args)||null},async all(){return{results:statement.all(...args)}}}}};
const env={DB,INTAKE_SECRET:'local-test-only',OWNER_EMAIL:'owner@example.test'};
const key=p=>createHmac('sha256',env.INTAKE_SECRET).update('profile:'+p).digest('hex');
const call=(person,method='GET',body,auth=key(person))=>worker.fetch(new Request('https://example.test/api/submissions?person='+person,{method,headers:{Authorization:'Bearer '+auth,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),env);
assert.equal((await call('nitai','GET',undefined,key('chen'))).status,401);
const fields={about:'מקצועיות עם <script>טקסט</script>',expertise:'ביקורת',education:'הכשרה',notes:'הערה פרטית',documents:'קישור פרטי',consent:true,publish:true};
assert.equal((await call('nitai','POST',{...fields,consent:false})).status,400);
for(const person of ['nitai','smadar','chen','eitan']){assert.equal((await call(person,'POST',fields)).status,201);const saved=await(await call(person)).json();assert.equal(saved.payload.notes,fields.notes);}
let publicData=await(await worker.fetch(new Request('https://example.test/api/profiles'),env)).json();assert.equal(Object.keys(publicData.profiles).length,4);for(const p of Object.values(publicData.profiles)){assert.equal(p.about,fields.about);assert.equal(p.notes,undefined);assert.equal(p.documents,undefined);}
await call('nitai','POST',{...fields,publish:false});publicData=await(await worker.fetch(new Request('https://example.test/api/profiles'),env)).json();assert.equal(publicData.profiles.nitai,undefined);
assert.equal((await worker.fetch(new Request('https://example.test/manage',{headers:{'oai-authenticated-user-email':'other@example.test'}}),env)).status,403);
assert.equal((await worker.fetch(new Request('https://example.test/manage',{headers:{'oai-authenticated-user-email':'owner@example.test'}}),env)).status,200);
console.log('PASS: four personal forms, validation, cross-person access, persistence, public-field separation, withdrawal and owner-only management.');
