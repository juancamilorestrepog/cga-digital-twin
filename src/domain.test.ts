import test from 'node:test';
import assert from 'node:assert/strict';
import {licensing,positive,nonnegative,parseScenario} from './domain.ts';
import {readFileSync} from 'node:fs';
test('48 cores con oferta de 16 dejan 32 pendientes',()=>{const r=licensing(2,24,1,0);assert.equal(r.required,48);assert.equal(r.offered,16);assert.equal(r.missing,32);assert.equal(r.pack16,2);assert.equal(r.pack2,0);});
test('mínimos por CPU y servidor',()=>{assert.equal(licensing(1,2,0,0).required,16);assert.equal(licensing(4,2,0,0).required,32);assert.equal(licensing(2,10,0,0).required,20);});
test('combinación de paquetes y sobreoferta',()=>{assert.equal(licensing(2,24,2,8).missing,0);assert.equal(licensing(1,17,1,0).pack2,1);assert.equal(licensing(1,16,2,0).excess,16);});
test('normalizar entradas no finitas y negativas',()=>{assert.equal(positive(NaN),1);assert.equal(positive(-5),1);assert.equal(nonnegative(-3),0);assert.equal(nonnegative(Infinity),0);});
test('rechazar archivos sin esquema o listas válidas',()=>{assert.throws(()=>parseScenario('{}'));assert.throws(()=>parseScenario('null'));assert.throws(()=>parseScenario('{"version":2}'));assert.throws(()=>parseScenario('x'.repeat(2000001)));});
test('los datos de demostración no contienen direcciones privadas ni credenciales',()=>{const data=readFileSync(new URL('./data.ts',import.meta.url),'utf8');assert.doesNotMatch(data,/\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);assert.doesNotMatch(data,/\b192\.168\.\d{1,3}\.\d{1,3}\b/);assert.doesNotMatch(data,/\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/);assert.doesNotMatch(data,/(?:ghp_|github_pat_|-----BEGIN PRIVATE KEY)/);});

import {baseScenario} from './data.ts';
test('importar y exportar conserva el escenario completo',()=>assert.deepEqual(parseScenario(JSON.stringify(baseScenario)),baseScenario));
test('rechazar conexiones a equipos inexistentes',()=>{const s=structuredClone(baseScenario);s.links[0].target='equipo-inexistente';assert.throws(()=>parseScenario(JSON.stringify(s)));});
test('rechazar equipos duplicados y etapas vacías',()=>{const s=structuredClone(baseScenario);s.devices.push({...s.devices[0]});assert.throws(()=>parseScenario(JSON.stringify(s)));s.devices.pop();s.stages=[];assert.throws(()=>parseScenario(JSON.stringify(s)));});
test('rechazar recursos nulos y estados desconocidos',()=>{const s=structuredClone(baseScenario);const v=JSON.parse(JSON.stringify(s));v.vms[0].ram=null;assert.throws(()=>parseScenario(JSON.stringify(v)));v.vms[0].ram=8;v.devices[0].status='Operativo sin evidencia';assert.throws(()=>parseScenario(JSON.stringify(v)));});

import {vlans,refreshScenario} from './data.ts';
test('segmentación CGA con seis VLAN y entrega desde Gobernación',()=>{assert.deepEqual(vlans.map(v=>[v.id,v.name]),[[20,'Servidores'],[13,'Acceso Contraloría'],[21,'Red inalámbrica'],[23,'Cámaras'],[200,'Telefonía'],[1,'Gestión']]);assert.match(vlans.find(v=>v.id===13)!.description,/switches de la Gobernación/);});
test('actualizar referencias antiguas conserva las ediciones del escenario',()=>{const s=structuredClone(baseScenario);s.name='Mi escenario personalizado';s.vms[0].ram=24;s.vms[0].network='VLAN 120 · ficticia';s.devices[0].spec.segmento='VLAN 110 · ficticia';const next=refreshScenario(s);assert.equal(next.name,s.name);assert.equal(next.vms[0].ram,24);assert.equal(next.vms[0].network,'VLAN 20 · Servidores');assert.equal(next.devices[0].spec.segmento,'VLAN 13 · Acceso Contraloría');assert.deepEqual(refreshScenario(next),next);});
