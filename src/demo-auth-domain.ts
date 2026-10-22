// Acceso de demostración: todo es local y modificable; no protege el sitio público.
export type DemoRole='Administrador'|'Usuario de demostración';
export type DemoUser={id:string;username:string;name:string;email:string;role:DemoRole;active:boolean;mustChange:boolean;salt:string;digest:string};
export const DEMO_USERS_KEY='cga-demo-users-v1';
export const DEMO_SESSION_KEY='cga-demo-session-v1';
export const DEMO_PASSWORD='CGA-Demo-360!';
export const normalizeUsername=(value:string)=>value.trim().toLowerCase();
export function validateDemoUsername(value:string,users:DemoUser[]){const username=normalizeUsername(value);if(!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username))throw new Error('Usa de 3 a 32 letras, números, puntos, guiones o guiones bajos.');if(users.some(u=>u.username===username))throw new Error('Ese usuario ya existe en esta demostración.');return username;}
export function validateDemoPassword(value:string){if(value.length<8||value.length>128)throw new Error('La contraseña de prueba debe tener de 8 a 128 caracteres.');}
const hex=(bytes:Uint8Array)=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
export async function demoDigest(password:string,salt:string){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},material,256)));}
export async function withDemoPassword(user:DemoUser,password:string,mustChange=false):Promise<DemoUser>{validateDemoPassword(password);const salt=hex(crypto.getRandomValues(new Uint8Array(16)));return {...user,salt,digest:await demoDigest(password,salt),mustChange};}
export async function verifyDemoPassword(user:DemoUser,password:string){return user.active&&(await demoDigest(password,user.salt))===user.digest;}
export async function seedDemoUsers():Promise<DemoUser[]>{return Promise.all([{id:'demo-jcrestrepo',username:'jcrestrepo',name:'Juan Camilo Restrepo',email:'JCRESTREPO@cga.gov.co',role:'Administrador' as DemoRole,active:true,mustChange:false,salt:'',digest:''},{id:'demo-root',username:'root',name:'Administrador de respaldo',email:'',role:'Administrador' as DemoRole,active:true,mustChange:true,salt:'',digest:''}].map(u=>withDemoPassword(u,DEMO_PASSWORD,u.mustChange)));}
export function parseDemoUsers(raw:string):DemoUser[]{const list:unknown=JSON.parse(raw);if(!Array.isArray(list)||list.length<2||list.length>100)throw new Error('Las cuentas de demostración guardadas no son válidas.');const ids=new Set<string>();const names=new Set<string>();for(const u of list){if(!u||typeof u!=='object'||!['id','username','name','email','salt','digest'].every(k=>typeof u[k]==='string')||!['Administrador','Usuario de demostración'].includes(u.role)||typeof u.active!=='boolean'||typeof u.mustChange!=='boolean'||!/^[a-f0-9]{32}$/.test(u.salt)||!/^[a-f0-9]{64}$/.test(u.digest)||ids.has(u.id)||names.has(u.username)||normalizeUsername(u.username)!==u.username)throw new Error('Las cuentas de demostración guardadas no son válidas.');ids.add(u.id);names.add(u.username);}if(!list.some(u=>u.id==='demo-root'&&u.username==='root'&&u.active&&u.role==='Administrador'))throw new Error('Falta la cuenta de respaldo de la demostración.');return list as DemoUser[];}
export function canDeactivateDemoUser(actor:DemoUser,target:DemoUser){return actor.active&&actor.role==='Administrador'&&target.id!==actor.id&&target.id!=='demo-root';}

// El almacenamiento puede estar bloqueado por privacidad, políticas o cuota.
export type DemoStorage={getItem:(key:string)=>string|null;setItem:(key:string,value:string)=>void;removeItem:(key:string)=>void};
export function createDemoPersistence(getLocal:()=>DemoStorage,getSession:()=>DemoStorage){
 let temporaryAccounts=false;let temporarySession=false;let invalidAccounts=false;let loading:Promise<DemoUser[]>|undefined;
 const saveUsers=(users:DemoUser[])=>{parseDemoUsers(JSON.stringify(users));if(temporaryAccounts)return;try{getLocal().setItem(DEMO_USERS_KEY,JSON.stringify(users));}catch{temporaryAccounts=true;}};
 return {
  loadUsers():Promise<DemoUser[]>{if(loading)return loading;loading=(async()=>{let raw:string|null=null;try{raw=getLocal().getItem(DEMO_USERS_KEY);}catch{temporaryAccounts=true;}if(raw!==null){try{return parseDemoUsers(raw);}catch{temporaryAccounts=true;invalidAccounts=true;}}const users=await seedDemoUsers();saveUsers(users);return users;})();return loading;},
  saveUsers,
  readSession(){try{return getSession().getItem(DEMO_SESSION_KEY)||'';}catch{temporarySession=true;return '';}},
  writeSession(id:string){try{if(id)getSession().setItem(DEMO_SESSION_KEY,id);else getSession().removeItem(DEMO_SESSION_KEY);}catch{temporarySession=true;}},
  accountsAreTemporary:()=>temporaryAccounts,
  notice(){if(invalidAccounts)return 'No se pudieron leer las cuentas guardadas. Se usan las cuentas iniciales temporalmente, sin modificar los datos anteriores. Los cambios de cuentas duran mientras esta página permanezca abierta.';if(temporaryAccounts)return 'Este navegador no permite guardar las cuentas. Puedes usar la plataforma, pero los cambios de usuarios y contraseñas duran solo mientras esta página permanezca abierta.';if(temporarySession)return 'Este navegador no permite recordar la sesión. Las cuentas se conservan, pero deberás volver a ingresar al recargar la página.';return '';}
 };
}
