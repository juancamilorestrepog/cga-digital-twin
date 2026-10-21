export type Approval='Sin aprobar'|'Aprobada'|'Rechazada';
export type UpdateDefinition={id:string;name:string;family:'Todos'|'Windows 11'|'Windows Server';reboot:boolean;description:string};
export type ZeusClient={id:string;name:string;group:string;family:'Windows 11'|'Windows Server';online:boolean;allowInstall:boolean;allowRestart:boolean;detected:boolean;installed:boolean;restarted:boolean};
export type ZeusState={synced:boolean;windowOpen:boolean;update:UpdateDefinition;approvals:Record<string,Approval>;clients:ZeusClient[]};
export const zeusGroups=['Piloto','Administrativos','Servicios críticos'];
export const zeusUpdates:UpdateDefinition[]=[{id:'ACT-SIM-01',name:'Seguridad de Windows · ejemplo',family:'Todos',reboot:true,description:'Paquete ficticio para explicar aprobación, instalación y reinicio. No es una KB real.'},{id:'ACT-SIM-02',name:'Calidad de Windows 11 · ejemplo',family:'Windows 11',reboot:true,description:'Permite mostrar equipos a los que una actualización no resulta aplicable.'},{id:'ACT-SIM-03',name:'Componente sin reinicio · ejemplo',family:'Todos',reboot:false,description:'Paquete ficticio que permite completar el ejercicio sin reinicio.'}];
export function createZeusState():ZeusState{return {synced:false,windowOpen:false,update:zeusUpdates[0],approvals:{},clients:Array.from({length:8},(_,i)=>({id:'cliente-'+(i+1),name:'EQ-PRUEBA-'+String(i+1).padStart(2,'0'),group:i<2?'Piloto':i<6?'Administrativos':'Servicios críticos',family:i>=6?'Windows Server':'Windows 11',online:i!==4,allowInstall:i!==3&&i!==7,allowRestart:i===0||i===2||i===6,detected:false,installed:false,restarted:false}))};}
export function clientState(c:ZeusClient,s:ZeusState):string{
 if(!s.synced)return 'Catálogo pendiente';
 if(!c.online)return 'Sin conexión';
 if(!c.detected)return 'Pendiente de detección';
 if(s.update.family!=='Todos'&&s.update.family!==c.family)return 'No aplicable';
 if(c.installed)return s.update.reboot&&!c.restarted?'Reinicio pendiente':'Actualizado';
 const approval=s.approvals[c.group]??'Sin aprobar';
 if(approval==='Rechazada')return 'No aprobada';
 if(approval!=='Aprobada')return 'Pendiente de aprobación';
 if(!c.allowInstall)return 'Bloqueado por política';
 if(!s.windowOpen)return 'Esperando ventana';
 return 'Listo para instalar';
}
export function detectClients(s:ZeusState):ZeusState{if(!s.synced)return s;return {...s,clients:s.clients.map(c=>c.online?{...c,detected:true}:c)};}
export function nextInstallable(s:ZeusState,group:string){return s.clients.find(c=>c.group===group&&clientState(c,s)==='Listo para instalar');}
export function installNext(s:ZeusState,group:string):{state:ZeusState;client?:ZeusClient}{const client=nextInstallable(s,group);if(!client)return {state:s};return {state:{...s,clients:s.clients.map(c=>c.id===client.id?{...c,installed:true,restarted:!s.update.reboot}:c)},client};}
export function restartAuthorized(s:ZeusState,group:string):{state:ZeusState;count:number}{let count=0;if(!s.windowOpen)return {state:s,count};const clients=s.clients.map(c=>{if(c.group===group&&c.online&&c.allowRestart&&c.installed&&s.update.reboot&&!c.restarted){count++;return {...c,restarted:true};}return c;});return {state:{...s,clients},count};}
export function changeZeusUpdate(s:ZeusState,update:UpdateDefinition):ZeusState{return {...s,update,approvals:{},clients:s.clients.map(c=>({...c,detected:false,installed:false,restarted:false}))};}
export function zeusReport(s:ZeusState){const states=s.clients.map(c=>clientState(c,s));return {total:states.length,updated:states.filter(x=>x==='Actualizado').length,restart:states.filter(x=>x==='Reinicio pendiente').length,ready:states.filter(x=>x==='Listo para instalar').length,offline:states.filter(x=>x==='Sin conexión').length,blocked:states.filter(x=>x==='Bloqueado por política').length,notApplicable:states.filter(x=>x==='No aplicable').length,pending:states.filter(x=>!['Actualizado','No aplicable'].includes(x)).length};}
