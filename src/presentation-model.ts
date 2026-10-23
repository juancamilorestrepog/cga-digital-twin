import {presentation} from './data.ts';
import {licensing,type Scenario} from './domain.ts';
export const presentationIntroTitle='Una nueva visión para avanzar juntos, al servicio de la CGA.';
export const presentationIntro=[
 'Desde mi llegada a la CGA, he impulsado mejoras que hoy constituyen una base para continuar la transformación. La nueva Dirección de Sistemas abre la oportunidad de consolidar estos avances y proyectar una visión de modernización con mayor alcance institucional.',
 'Bajo su liderazgo y con el aporte del equipo, propongo Hefesto Digital Twin 360 como una herramienta para hacer visible nuestra infraestructura, mostrar los avances y evaluar juntos los siguientes pasos. Mi aporte técnico se integra a una ruta compartida de prioridades, continuidad y decisiones de inversión.'
];
export const hefestoPillars=[
 {title:'Visualizar',body:'Comprender cómo se conectan los servidores, las redes, la SAN IBM, la seguridad y los servicios institucionales.'},
 {title:'Simular',body:'Explorar configuraciones de servidores, procesadores, núcleos, licencias y escenarios de migración.'},
 {title:'Transformar',body:'Representar la transición de sistemas heredados hacia una arquitectura basada en Windows Server 2025.'},
 {title:'Decidir',body:'Explicar inversiones, dependencias, licenciamiento, riesgos y beneficios para apoyar las decisiones de la alta gerencia.'}
];
export const hefestoScope='Hefesto se alimenta con información de inventario y configuraciones editables. Actualmente no monitorea la infraestructura en tiempo real. Su evolución hacia un gemelo digital operativo podría incorporar rendimiento, disponibilidad y cambios de infraestructura mediante integraciones con los equipos y sistemas productivos.';
export function presentationDescription(index:number,s:Scenario){if(index===5){const c=licensing(s.config.processors,s.config.cores,s.license.pack16,s.license.pack2);return 'Host actual del escenario: '+c.physical+' núcleos físicos; '+c.required+' requeridos; '+c.offered+' ofertados; '+c.missing+' faltantes.';}if(index===3)return s.config.manufacturer+' '+s.config.model+': '+s.config.processors+' CPU, '+s.config.processors*s.config.cores+' núcleos físicos y '+s.config.ram+' GB RAM. Propuesta editable, sujeta a validación.';if(index===6)return s.vms.length+' VM en el escenario de planificación. Cada servicio necesita compatibilidad, respaldo, pruebas y reversión. Los cambios de este escenario no intervienen servicios reales.';return presentation[index]?.[2]||'';}
export type PresentationPage={kind:'cover'|'pillars'|'chapter';label:string;title:string;body:string;chapter?:number};
export function buildPresentationPages(s:Scenario):PresentationPage[]{return [{kind:'cover',label:'PRESENTACIÓN EJECUTIVA',title:presentationIntroTitle,body:presentationIntro.join('\n\n')},{kind:'pillars',label:'LOS CUATRO PILARES DE HEFESTO 360',title:'De la comprensión técnica a la decisión estratégica.',body:''},...presentation.map(([label,title],chapter)=>({kind:'chapter' as const,label,title,body:presentationDescription(chapter,s),chapter}))];}
