export type Status='Implementado'|'Verificado'|'Propuesto'|'Pendiente de validación'|'Simulación';
export const statuses:Status[]=['Implementado','Verificado','Propuesto','Pendiente de validación','Simulación'];
export type Device={id:string;name:string;kind:string;layer:string;status:Status;description:string;spec:Record<string,string|number>;x:number;y:number};
export type Link={id:string;source:string;target:string;label:string;protocol:string;speed:string;port:string;status:Status};
export type VM={id:string;name:string;role:string;os:string;target:string;cpu:number;ram:number;disk:number;network:string;dependencies:string;criticality:string;compatibility:string;progress:string;host:string};
export type Config={manufacturer:string;model:string;processors:number;cpu:string;cores:number;threads:number;ram:number;disks:string;controllers:string;nic:string;speed:number;fc:string;iscsi:string;os:string;vmCount:number};
export type License={pack16:number;pack2:number;sku:string;channel:string;calType:string;cals:number;users:number};
export type Stage={id:string;name:string;description:string;status:Status};
export type Scenario={version:1;referenceRevision?:number;name:string;devices:Device[];links:Link[];vms:VM[];config:Config;license:License;stages:Stage[];storage:{protocol:string;speed:string;port:string;switchId:string;compatible:boolean;mpio:boolean};mercurio:{java:string;tomcat:string;database:string;rollback:string;tests:string}};
export function positive(value:unknown,fallback=1){const n=Number(value);return Number.isFinite(n)?Math.max(1,Math.min(100000,Math.floor(n))):fallback;}
export function nonnegative(value:unknown){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100000,Math.floor(n))):0;}
export function licensing(processors:number,cores:number,pack16:number,pack2:number){const physical=positive(processors)*positive(cores);const required=Math.max(16,positive(processors)*Math.max(8,positive(cores)));const offered=nonnegative(pack16)*16+nonnegative(pack2)*2;const missing=Math.max(0,required-offered);const purchase=Math.ceil(missing/2)*2;return {physical,required,offered,missing,excess:Math.max(0,offered-required),pack16:Math.floor(purchase/16),pack2:(purchase%16)/2,covered:Math.min(required,offered)};}
const obj=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
export function parseScenario(text:string):Scenario{
 if(text.length>2000000)throw new Error('El archivo supera el límite de 2 MB.');
 const v:unknown=JSON.parse(text);if(!obj(v)||v.version!==1||!obj(v.config)||!obj(v.license)||!obj(v.storage)||!obj(v.mercurio)||typeof v.name!=='string')throw new Error('Formato de escenario no reconocido.');
 if(v.referenceRevision!==undefined&&(typeof v.referenceRevision!=='number'||!Number.isFinite(v.referenceRevision)||v.referenceRevision<0||!Number.isInteger(v.referenceRevision)))throw new Error('Revisión de referencia inválida.');
 const arrays=['devices','links','vms','stages'] as const;for(const k of arrays)if(!Array.isArray(v[k])||(v[k] as unknown[]).length>500)throw new Error('Listas inválidas o demasiado extensas.');
 const strings=(row:unknown,keys:string[])=>{if(!obj(row)||keys.some(k=>typeof row[k]!=='string'||String(row[k]).length>10000))throw new Error('Campos de texto inválidos.');};
 const nums=(row:Record<string,unknown>,keys:string[],min=0)=>{if(keys.some(k=>typeof row[k]!=='number'||!Number.isFinite(row[k])||Number(row[k])<min||Number(row[k])>100000))throw new Error('Valores numéricos inválidos.');};
 for(const row of v.devices as unknown[]){strings(row,['id','name','kind','layer','status','description']);const d=row as Record<string,unknown>;nums(d,['x','y'],-100000);if(!statuses.includes(d.status as Status)||!obj(d.spec)||Object.values(d.spec).some(x=>typeof x!=='string'&&typeof x!=='number'))throw new Error('Ficha técnica inválida.');}
 const ids=(v.devices as Device[]).map(x=>x.id);if(new Set(ids).size!==ids.length||ids.some(x=>!x))throw new Error('Los identificadores de equipos deben ser únicos.');
 for(const row of v.links as unknown[]){strings(row,['id','source','target','label','protocol','speed','port','status']);const e=row as Link;if(!ids.includes(e.source)||!ids.includes(e.target)||!statuses.includes(e.status))throw new Error('Conexión con equipo o estado inválido.');}
 for(const row of v.vms as unknown[]){strings(row,['id','name','role','os','target','network','dependencies','criticality','compatibility','progress','host']);nums(row as Record<string,unknown>,['cpu','ram','disk'],1);}
 for(const row of v.stages as unknown[]){strings(row,['id','name','description','status']);if(!statuses.includes((row as Stage).status))throw new Error('Estado de etapa inválido.');}
 if(!(v.stages as unknown[]).length)throw new Error('Debe existir al menos una etapa.');
 for(const k of ['vms','links','stages'] as const){const a=v[k] as {id:string}[];if(new Set(a.map(x=>x.id)).size!==a.length)throw new Error('Hay identificadores duplicados.');}
 strings(v.config,['manufacturer','model','cpu','disks','controllers','nic','fc','iscsi','os']);nums(v.config,['processors','cores','threads','ram','speed','vmCount'],1);
 strings(v.license,['sku','channel','calType']);nums(v.license,['pack16','pack2','cals','users']);strings(v.storage,['protocol','speed','port','switchId']);if(typeof v.storage.compatible!=='boolean'||typeof v.storage.mpio!=='boolean')throw new Error('Opciones de almacenamiento inválidas.');
 strings(v.mercurio,['java','tomcat','database','rollback','tests']);return v as unknown as Scenario;
}
export function resizeVMs(vms:VM[],count:number,template:VM):VM[]{const n=Math.min(500,positive(count));return Array.from({length:n},(_,i)=>vms[i]??{...template,id:'vm-'+crypto.randomUUID(),name:'VM-DEMO-'+String(i+1).padStart(2,'0')});}
