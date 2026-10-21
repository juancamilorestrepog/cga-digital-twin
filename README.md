# CGA | Transformación de Infraestructura Tecnológica

Aplicación web de planificación y presentación ejecutiva de infraestructura. React, TypeScript, Vite, Tailwind CSS, React Flow, Motion, Recharts y Lucide. Estática, sin base de datos ni acceso a servidores reales.

## Uso para el administrador funcional

Abra la aplicación publicada por GitHub Pages desde la sección **Deployments** del repositorio. No necesita instalar software.

- **Inicio:** visión del escenario y arquitectura interactiva.
- **Iniciar presentación:** 12 capítulos. Use las flechas del teclado; Esc cierra. Profundizar muestra detalle y permite abrir el módulo técnico. La pantalla completa depende del navegador.
- **Diagrama:** arrastre equipos, use el zoom, cambie de vista, seleccione capas y pulse un equipo para editar su ficha. Al seleccionar se resaltan sus conexiones directas. Puede crear enlaces arrastrando entre los conectores de los nodos o desde Administración.
- **Configurador:** cambie hardware, RAM o cantidad de VM; los indicadores y el cálculo de núcleos se actualizan. Cambiar de modelo no certifica que las piezas sean compatibles.
- **Licenciamiento:** ingrese paquetes ilustrativos de 2 y 16 cores, SKU, canal y CAL. Ninguna licencia se considera adquirida o activada.
- **Máquinas virtuales:** seleccione una fila para editar recursos, función, dependencia, SO, host, criticidad, compatibilidad y avance.
- **Administración:** agregue o elimine equipos y enlaces, edite etapas, guarde hasta 10 versiones, restaure versiones e importe o exporte escenarios JSON.
- **Simuladores:** migración de VM, encendido, transición de AD y sincronización de usuario son explicativos. No ejecutan operaciones reales.

Los borradores y versiones se conservan en el almacenamiento del navegador que utiliza. Borrar datos del navegador o cambiar de dispositivo puede perderlos. La exportación JSON es opcional. Un cambio en la aplicación **no modifica GitHub** ni se comparte automáticamente con otros visitantes. No se necesita una carpeta de proyecto ni instalar herramientas en el equipo del administrador.

Para solicitar cambios permanentes, escriba su solicitud en español en el chat y mencione este repositorio. El desarrollador deberá preservar funciones, revisar privacidad y comprobar el flujo de GitHub Actions.

## Datos y límites

La demostración usa identificadores, VLAN y una topología ficticios. No contiene las IP ni las VLAN reales de referencia. No introducir nombres internos, reglas, credenciales o usuarios reales en la versión pública.

Los aproximadamente 30 registros VM son un escenario de capacidad; no constituyen inventario certificado. Los roles repetidos son ejemplos editables y no indican que existan cinco servicios reales de cada tipo.

**Implementado** identifica los avances informados por el usuario: identidad híbrida con Entra Connect Sync / hash de contraseñas y recuperación previa de conectividad iSCSI. No se auditan desde esta herramienta. **Verificado** solo debe asignarse al registrar evidencia. El resto se clasifica como **Propuesto**, **Pendiente de validación** o **Simulación**.

El R770 de referencia (2 × Xeon 6 6527P, 24 cores por CPU, 512 GB RAM, 25 GbE) es una propuesta. No se certifican CPU, HBA, NIC, firmware o BOM. Los hilos por núcleo son un supuesto editable. R660 y otros nombres no implican configuraciones compatibles.

No se asume que una interfaz de administración de IBM sea un puerto iSCSI. Ethernet por fibra no equivale a FC. FC requiere equipamiento compatible; el Dell 5548 no se representa como switch FC. MPIO requiere validación. El uso del almacenamiento no implica alta disponibilidad del host.

Dos controladores de dominio virtuales en el mismo host comparten el riesgo físico. Mercurio requiere inventario de Java, Tomcat, SO y base de datos, validación del fabricante, pruebas y reversión. Mover una VM no actualiza su SO ni migra automáticamente su aplicación.

## Licenciamiento

El simulador calcula Datacenter por núcleos físicos: máximo entre 16 cores por servidor y la suma de al menos 8 cores por procesador. Paquetes de 2 y 16. Ejemplo: 48 requeridos - 16 ofertados = 32 pendientes. Los núcleos no deben sustituirse por hilos.

Con cobertura completa se explican derechos de virtualización de Datacenter sujetos a los términos de adquisición. CAL, RDS CAL si corresponde, versiones, canal y derechos adicionales deben revisarse con el proveedor. Los términos contractuales prevalecen sobre la guía.

Referencia oficial consultada el 21/10/2026: https://www.microsoft.com/licensing/guidance/Windows-Server-2025

## Construcción y publicación en la nube

El flujo **Validar y publicar CGA** de GitHub Actions instala dependencias en un runner de GitHub, ejecuta las pruebas de dominio y privacidad, comprueba TypeScript, construye la versión optimizada y publica el artefacto mediante GitHub Pages.

La primera ejecución genera los archivos desde setup.cjs y los guarda mediante un commit de github-actions[bot]. Las ejecuciones siguientes utilizan directamente src/ y no vuelven a generar ni sobrescriben el código. setup.cjs conserva el arranque inicial para trazabilidad y no tiene dependencias. Los cambios permanentes se hacen en src/.

Si Pages aún no está habilitado: repositorio → **Settings → Pages → Build and deployment → Source → GitHub Actions**. Si la cuenta requiere autorizar GitHub Actions, habilítelo para este repositorio. No hay que introducir tokens en archivos ni compartir contraseñas.

El flujo puede ejecutarse desde **Actions → Validar y publicar CGA → Run workflow**. Una publicación solo existe cuando el trabajo de despliegue termina correctamente; use el enlace que GitHub muestre.

Las dependencias se fijan mediante el package-lock.json generado en la primera ejecución; después se usa npm ci. Para actualizar dependencias se debe actualizar ese archivo con revisión y repetir validaciones. El flujo conserva artefactos de compilación incluso si Pages requiere configuración adicional.

## Versión corporativa futura

Este repositorio público debe conservar únicamente ejemplos anonimizados. Para información real, crear repositorio y alojamiento internos autorizados; colocar el sitio tras autenticación corporativa de la plataforma (por ejemplo, un proxy con Entra ID) y controles de acceso, transporte y retención aprobados. No proteger datos sensibles mediante una pantalla de contraseña en JavaScript ni incluir secretos en variables VITE_.

Esta aplicación no implementa autenticación ni cifrado de borradores. El almacenamiento local no es una base de datos corporativa. Para colaboración persistente se deberá diseñar un servicio autorizado antes de incorporar datos reales.

## Estructura para mantenimiento

- src/domain.ts: tipos, importación validada y fórmulas.
- src/data.ts: escenario inicial, textos y etapas.
- src/App.tsx: módulos y simuladores.
- src/styles.css: diseño, adaptación y reducción de movimiento.
- src/domain.test.ts: pruebas de cálculos y privacidad.
- .github/workflows/pages.yml: validación y publicación.

Pruebas de dominio y compilación no sustituyen una aceptación funcional ni una auditoría de infraestructura.
