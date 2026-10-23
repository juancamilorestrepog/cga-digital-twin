import {jsPDF} from 'jspdf';
import {buildPresentationPages,hefestoPillars,type PresentationPage} from './presentation-model.ts';
import type {Scenario} from './domain.ts';
export const PRESENTATION_PDF_FILENAME='CGA-Hefesto-Digital-Twin-360-Presentacion.pdf';
const W=960,H=540,M=48;
const C={background:'#081421',surface:'#102234',ink:'#e5edf8',muted:'#9ab0c6',accent:'#73dfcd',border:'#284457'};
export type PdfTextLayout={page:number;kind:string;x:number;y:number;width:number;height:number;size:number;lines:number};
const clean=(s:string)=>s.normalize('NFC').replace(/[\u2010-\u2015]/g,'-').replace(/\u2026/g,'...').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"');
export function createPresentationPdf(s:Scenario,logo:Uint8Array,date=new Date()){
 const doc=new jsPDF({orientation:'landscape',unit:'pt',format:[W,H],compress:true,putOnlyUsedFonts:true});
 const pages=buildPresentationPages(s);const layouts:PdfTextLayout[]=[];
 const dateLabel=new Intl.DateTimeFormat('es-CO',{timeZone:'America/Bogota',day:'2-digit',month:'2-digit',year:'numeric'}).format(date);
 doc.setProperties({title:'CGA / Hefesto Digital Twin 360 - Presentación ejecutiva',subject:'Visualizar, simular, transformar y decidir',author:'Dirección de Sistemas - CGA',creator:'Hefesto Digital Twin 360'});
 function box(text:string,x:number,y:number,width:number,height:number,kind:string,max=18,min=14,color=C.ink,bold=false){doc.setFont('helvetica',bold?'bold':'normal');let size=max;let lines:string[]=[];for(;size>=min;size--){doc.setFontSize(size);lines=doc.splitTextToSize(clean(text),width) as string[];if(lines.length*size*1.35<=height)break;}if(size<min)throw new Error('El texto de '+kind+' excede el espacio disponible. Revisa la extensión de los campos del escenario.');doc.setTextColor(color);doc.text(lines,x,y+size,{lineHeightFactor:1.35});layouts.push({page:doc.getNumberOfPages(),kind,x,y,width,height:lines.length*size*1.35,size,lines:lines.length});return lines.length*size*1.35;}
 function layers(x:number,y:number){doc.setDrawColor(C.accent);doc.setLineWidth(1.8);for(let i=0;i<3;i++){const dy=i*6;doc.line(x,y+dy,x+13,y+dy-6);doc.line(x+13,y+dy-6,x+26,y+dy);doc.line(x+26,y+dy,x+13,y+dy+6);doc.line(x+13,y+dy+6,x,y+dy);}}
 function frame(index:number){doc.setFillColor(C.background);doc.rect(0,0,W,H,'F');layers(M,35);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(C.ink);doc.text('CGA / HEFESTO DIGITAL TWIN 360',M+40,39);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(C.muted);doc.text('Transformación Tecnológica al servicio de la CGA',M+40,55);doc.setFillColor('#ffffff');doc.roundedRect(800,22,112,42,5,5,'F');doc.addImage(logo,'PNG',806,26,100,34,'logo-cga','FAST');doc.setDrawColor(C.border);doc.setLineWidth(.7);doc.line(M,79,W-M,79);doc.line(M,490,W-M,490);doc.setTextColor(C.muted);doc.setFontSize(9);doc.text(dateLabel+'  |  Dirección de Sistemas - CGA',M,511);doc.text(String(index+1).padStart(2,'0')+' / '+pages.length,W-M,511,{align:'right'});}
 function flow(){const y=419;doc.setDrawColor(C.accent);doc.setLineWidth(1.5);const xs=[M+2,M+230,M+458];for(let i=0;i<2;i++){doc.line(xs[i]+64,y+15,xs[i+1]-20,y+15);doc.circle(xs[i+1]-20,y+15,2,'S');}for(let j=0;j<3;j++){const x=xs[j];if(j===0){for(let i=0;i<3;i++){doc.roundedRect(x,y+i*12,49,9,2,2,'S');doc.circle(x+40,y+i*12+4,1,'S');}}else if(j===1){doc.ellipse(x+24,y+3,24,7,'S');doc.line(x,y+3,x,y+32);doc.line(x+48,y+3,x+48,y+32);doc.ellipse(x+24,y+32,24,7,'S');}else{doc.circle(x+14,y+17,12,'S');doc.circle(x+33,y+9,17,'S');doc.circle(x+52,y+20,11,'S');doc.line(x+14,y+31,x+52,y+31);}}}
 pages.forEach((page:PresentationPage,index)=>{if(index)doc.addPage([W,H],'landscape');frame(index);box((page.kind==='chapter'?String((page.chapter??0)+1).padStart(2,'0')+' / ':'')+page.label.toUpperCase(),M,96,850,25,'sección',10,10,C.accent,true);
  if(page.kind==='pillars'){box(page.title,M,128,850,70,'título de pilares',30,26,C.ink,true);hefestoPillars.forEach((p,i)=>{const x=M+(i%2)*440,y=218+Math.floor(i/2)*125;doc.setFillColor(C.surface);doc.setDrawColor(C.border);doc.roundedRect(x,y,424,112,7,7,'FD');box(String(i+1).padStart(2,'0')+' / '+p.title,x+18,y+12,388,28,'pilar',17,17,C.accent,true);box(p.body,x+18,y+43,388,62,'descripción de pilar',14,13,C.ink);});return;}
  const titleHeight=box(page.title,M,131,850,106,'título',page.kind==='cover'?34:33,26,C.ink,true);
  box(page.body,M,148+titleHeight,850,page.kind==='cover'?244:229-titleHeight,'contenido',page.kind==='cover'?17:18,14,C.muted);
  if(page.kind==='chapter')flow();
 });
 return {doc,pages,layouts};
}
export async function downloadPresentationPdf(s:Scenario,logoUrl:string){const response=await fetch(logoUrl);if(!response.ok)throw new Error('No se pudo cargar el logo institucional. Recarga la página e intenta de nuevo.');const logo=new Uint8Array(await response.arrayBuffer());const{doc,pages}=createPresentationPdf(s,logo);const url=URL.createObjectURL(doc.output('blob'));const link=document.createElement('a');link.href=url;link.download=PRESENTATION_PDF_FILENAME;document.body.appendChild(link);link.click();link.remove();return {pages:pages.length,url,filename:PRESENTATION_PDF_FILENAME};}
