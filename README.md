# CGA / Hefesto Digital Twin 360

Propuesta para fortalecer la infraestructura tecnológica de la CGA desde la Dirección de Sistemas. Aporto una ruta técnica para priorizar, junto con la dirección y el equipo, la modernización y la continuidad institucional. React, TypeScript, Vite, Tailwind CSS, React Flow, Motion, Recharts y Lucide. Estática, sin base de datos ni acceso a servidores reales.

## Uso para el administrador funcional

Abra la aplicación publicada por GitHub Pages desde la sección **Deployments** del repositorio. No necesita instalar software.

- **ZEUS / WSUS:** avance implementado y laboratorio explicativo de actualizaciones. Sincronice el catálogo ficticio, detecte necesidades, apruebe un grupo, abra su ventana y simule la distribución. Los reinicios solo avanzan para los equipos de ejemplo que los permiten. El reporte CSV está marcado como simulación.
- **Inicio:** visión del escenario y arquitectura interactiva.
- **Iniciar presentación:** 12 capítulos. Use las flechas del teclado; Esc cierra. Profundizar muestra detalle y permite abrir el módulo técnico. La pantalla completa depende del navegador.
- **Diagrama:** arrastre equipos, use el zoom, cambie de vista, seleccione capas y pulse un equipo para editar su ficha. Al seleccionar se resaltan sus conexiones directas. Puede crear enlaces arrastrando entre los conectores de los nodos o desde Administración.
- **Configurador:** cambie hardware, RAM o cantidad de VM; los indicadores y el cálculo de núcleos se actualizan. Cambiar de modelo no certifica que las piezas sean compatibles.
- **Licenciamiento:** ingrese paquetes ilustrativos de 2 y 16 cores, SKU, canal y CAL. Ninguna licencia se considera adquirida o activada.
- **Máquinas virtuales:** seleccione una fila para editar recursos, función, dependencia, SO, host, criticidad, compatibilidad y avance.
- **Administración:** agregue o elimine equipos y enlaces, edite etapas, guarde hasta 10 versiones, restaure versiones e importe o exporte escenarios JSON.
- **Simuladores:** migración de VM, encendido, transición de AD y sincronización de usuario son explicativos. No ejecutan operaciones reales.

Los borradores y versiones se conservan en el almacenamiento del navegador que utiliza. Borrar datos del navegador o cambiar de dispositivo puede perderlos. La exportación JSON es opcional. Un cambio en la aplicación **no modifica GitHub** ni se comparte automáticamente con otros visitantes. No se necesita una carpeta de proyecto ni instalar herramientas en el equipo del administrador.

Los cambios permanentes se conservan en este repositorio y se validan antes de publicar. La propuesta mantiene mi aporte técnico y una perspectiva institucional para la Dirección de Sistemas y la CGA.

## Datos y límites

La vista incluye las VLAN de referencia de la CGA: 20 Servidores; 13 Acceso Contraloría, entregado desde los switches de la Gobernación; 21 Red inalámbrica; 23 Cámaras; 200 Telefonía; 1 Gestión. El resto de las relaciones de arquitectura requiere validación. Mantenemos fuera del sitio las IP de producción, las credenciales, las reglas del firewall y la información personal.

Los aproximadamente 30 registros VM son un escenario de capacidad; no constituyen inventario certificado. Los roles repetidos son ejemplos editables y no indican que existan cinco servicios reales de cada tipo.

**Implementado** identifica los avances que implementamos desde la Dirección de Sistemas: identidad híbrida con Entra Connect Sync / hash de contraseñas y recuperación de conectividad iSCSI, además de ZEUS / WSUS para gestionar las actualizaciones. Propuse e implementé ZEUS al identificar numerosos equipos desactualizados. Su host, SO, cobertura y políticas de producción quedan pendientes de inventario. Las simulaciones describen estos avances sin operar sobre la infraestructura. **Verificado** solo debe asignarse al registrar evidencia. El resto se clasifica como **Propuesto**, **Pendiente de validación** o **Simulación**.

El R770 de referencia (2 × Xeon 6 6527P, 24 cores por CPU, 512 GB RAM, 25 GbE) es una propuesta. No se certifican CPU, HBA, NIC, firmware o BOM. Los hilos por núcleo son un supuesto editable. R660 y otros nombres no implican configuraciones compatibles.

No se asume que una interfaz de administración de IBM sea un puerto iSCSI. Ethernet por fibra no equivale a FC. FC requiere equipamiento compatible; el Dell 5548 no se representa como switch FC. MPIO requiere validación. El uso del almacenamiento no implica alta disponibilidad del host.

Dos controladores de dominio virtuales en el mismo host comparten el riesgo físico. Mercurio requiere inventario de Java, Tomcat, SO y base de datos, validación del fabricante, pruebas y reversión. Mover una VM no actualiza su SO ni migra automáticamente su aplicación.

## Licenciamiento

El simulador calcula Datacenter por núcleos físicos: máximo entre 16 cores por servidor y la suma de al menos 8 cores por procesador. Paquetes de 2 y 16. Ejemplo: 48 requeridos - 16 ofertados = 32 pendientes. Los núcleos no deben sustituirse por hilos.

Con cobertura completa se explican derechos de virtualización de Datacenter sujetos a los términos de adquisición. CAL, RDS CAL si corresponde, versiones, canal y derechos adicionales deben revisarse con el proveedor. Los términos contractuales prevalecen sobre la guía.

Referencia oficial consultada el 21/10/2026: https://www.microsoft.com/licensing/guidance/Windows-Server-2025

## Construcción y publicación en la nube

El flujo **Validar y publicar CGA** de GitHub Actions instala dependencias en un runner de GitHub, ejecuta las pruebas de dominio y privacidad, comprueba TypeScript, construye la versión optimizada y publica el artefacto mediante GitHub Pages.

Las fuentes se mantienen directamente en src/. El archivo setup.cjs prepara en el runner de GitHub el logo institucional original de CGA.zip como public/CGA.png, sin alterar sus colores ni proporciones. Vite incorpora ese PNG a la publicación. No se extraen archivos ni se instala software en el equipo del administrador. Los cambios permanentes se hacen en src/.

Si Pages aún no está habilitado: repositorio → **Settings → Pages → Build and deployment → Source → GitHub Actions**. Si la cuenta requiere autorizar GitHub Actions, habilítelo para este repositorio. No hay que introducir tokens en archivos ni compartir contraseñas.

El flujo puede ejecutarse desde **Actions → Validar y publicar CGA → Run workflow**. Una publicación solo existe cuando el trabajo de despliegue termina correctamente; use el enlace que GitHub muestre.

Las dependencias se fijan mediante el package-lock.json generado en la primera ejecución; después se usa npm ci. Para actualizar dependencias se debe actualizar ese archivo con revisión y repetir validaciones. El flujo conserva artefactos de compilación incluso si Pages requiere configuración adicional.

## Versión corporativa futura

El repositorio público contiene el escenario de planificación y las VLAN incluidas en la propuesta. Para incorporar información sensible adicional, desde Sistemas utilizaremos un repositorio y alojamiento internos autorizados; colocar el sitio tras autenticación corporativa de la plataforma (por ejemplo, un proxy con Entra ID) y controles de acceso, transporte y retención aprobados. No proteger datos sensibles mediante una pantalla de contraseña en JavaScript ni incluir secretos en variables VITE_.

Esta aplicación no implementa autenticación ni cifrado de borradores. El almacenamiento local no es una base de datos corporativa. Para colaboración persistente se deberá diseñar un servicio autorizado antes de incorporar datos reales.

## Estructura para mantenimiento

- src/domain.ts: tipos, importación validada y fórmulas.
- src/data.ts: escenario inicial, textos y etapas.
- src/App.tsx: módulos y simuladores.
- src/styles.css: diseño, adaptación y reducción de movimiento.
- src/domain.test.ts: pruebas de cálculos y privacidad.
- .github/workflows/pages.yml: validación y publicación.

Pruebas de dominio y compilación no sustituyen una aceptación funcional ni una auditoría de infraestructura.

## ZEUS / WSUS: alcance del simulador

El módulo utiliza 8 equipos y 3 paquetes ficticios. No consulta ZEUS ni cambia GPO, aprobaciones o equipos reales. La secuencia separa catálogo, detección, aprobación por grupo, ventana de mantenimiento, permiso de instalación, conectividad, aplicabilidad y reinicio autorizado. La aprobación no fuerza por sí sola el estado Actualizado. Cambiar de paquete inicia un ejercicio nuevo. La exportación CSV contiene resultados simulados.

ZEUS figura como servicio lógico implementado en el diagrama y en los avances. No se asume que sea una VM ni se inventan recursos o ubicación física. Los escenarios guardados reciben esta referencia una sola vez, conservando sus ediciones.

Microsoft documenta el papel de aprobaciones y políticas de cliente; los plazos límite y la configuración real pueden modificar el comportamiento. Las referencias oficiales se encuentran en el módulo. WSUS está en desuso según Microsoft, con capacidades actuales mantenidas; su evolución se evalúa como parte de la planificación.

- src/wsus-domain.ts: reglas del simulador.
- src/Zeus.tsx y src/zeus.css: módulo ZEUS.
