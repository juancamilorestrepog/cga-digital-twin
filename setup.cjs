// Preparación de recursos en GitHub Actions. Las fuentes se mantienen en src/.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
if(!fs.existsSync('src/App.tsx'))throw new Error('Faltan las fuentes de la aplicación en src/.');
if(!fs.existsSync('CGA.zip'))throw new Error('Falta CGA.zip con el logo institucional original.');
fs.mkdirSync('public',{recursive:true});
execFileSync('unzip',['-jo','CGA.zip','CGA.png','-d','public'],{stdio:'inherit'});
const logo=fs.readFileSync('public/CGA.png');
if(!logo.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('El logo institucional no es un PNG válido.');
console.log('Logo institucional CGA preparado para la compilación.');
