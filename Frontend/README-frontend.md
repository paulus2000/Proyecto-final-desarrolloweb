Instrucciones para inicializar el frontend (React) en Windows PowerShell

Ruta objetivo: `c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Frontend`

Opción recomendada (sin prompts, compatible con la mayoría de setups):

1) Crear la app con Create React App (CRA):

```powershell
cd 'c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Frontend'
# crea la carpeta `app` con el boilerplate de CRA
npx create-react-app app
cd app
# instalar librerías adicionales
npm install sweetalert2 axios react-router-dom
# arrancar la app
npm start
```

Opción moderna (Vite) — nota sobre Node.js:
- Vite requiere Node >= 20.19.0 o >= 22.12.0. Si tu Node es anterior (por ejemplo 20.18), actualiza Node antes de usar Vite.

```powershell
cd 'c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Frontend'
# crear con Vite (puede pedir confirmaciones si tu versión de npm/Node es distinta)
npm create vite@latest app -- --template react
cd app
npm install
npm install sweetalert2 axios react-router-dom
npm run dev
```

