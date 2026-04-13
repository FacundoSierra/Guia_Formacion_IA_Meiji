/**
 * Genera y descarga un certificado PDF en el estilo Meiji
 * usando una ventana de impresión del navegador.
 */

interface CertificateData {
  userName: string;
  moduleName: string;
  completionDate: string;
}

export function downloadCertificate({ userName, moduleName, completionDate }: CertificateData): void {
  const svgLogo = buildLogoSvg("cert-clip");
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Certificado — ${userName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      width: 297mm;
      height: 210mm;
      font-family: 'Lato', Arial, sans-serif;
      background: #fff;
      color: #222;
    }

    .page {
      width: 297mm;
      height: 210mm;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14mm 18mm;
    }

    /* Marco rojo exterior */
    .border-outer {
      position: absolute;
      inset: 6mm;
      border: 4px solid #d81e05;
    }

    /* Marco rojo interior (línea fina) */
    .border-inner {
      position: absolute;
      inset: 8.5mm;
      border: 1.5px solid #d81e05;
    }

    /* Contenido centrado */
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5mm;
    }

    /* Logo Meiji */
    .logo-tagline {
      font-size: 9pt;
      font-style: italic;
      color: #444;
      letter-spacing: 0.03em;
      line-height: 1.2;
      margin-bottom: 2mm;
    }

    .logo-svg {
      display: block;
      width: 210px;
      height: auto;
    }

    /* Título del certificado */
    .cert-title {
      font-size: 18pt;
      font-weight: 700;
      color: #111;
      letter-spacing: 0.01em;
      margin-top: 1mm;
    }

    /* Texto "Este documento certifica que" */
    .cert-intro {
      font-size: 11pt;
      color: #444;
      font-weight: 300;
    }

    /* Nombre del usuario */
    .cert-name {
      font-size: 30pt;
      font-weight: 900;
      color: #d81e05;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1.1;
    }

    /* Línea roja bajo el nombre */
    .name-line {
      width: 180mm;
      height: 1.5px;
      background: #d81e05;
      margin-top: -2mm;
    }

    /* "ha completado satisfactoriamente..." */
    .cert-body {
      font-size: 11pt;
      color: #444;
      font-weight: 300;
    }

    /* Nombre del módulo */
    .cert-module {
      font-size: 14pt;
      font-weight: 700;
      color: #111;
      letter-spacing: 0.01em;
      max-width: 230mm;
      line-height: 1.3;
    }

    /* Fecha */
    .cert-date {
      font-size: 10.5pt;
      color: #555;
      font-weight: 300;
    }

    /* Línea de firma */
    .signature-line {
      width: 60mm;
      height: 1px;
      background: #555;
      margin-top: 6mm;
    }

    /* Copyright */
    .copyright {
      font-size: 8.5pt;
      color: #666;
      margin-top: 1.5mm;
    }

    @media print {
      html, body { width: 297mm; height: 210mm; }
      @page { size: A4 landscape; margin: 0; }
      .page { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <div class="content">
      <div>
        <div class="logo-tagline">Now ideas for wellness</div>
        ${svgLogo}
      </div>

      <div class="cert-title">Certificado de Capacitación</div>

      <div class="cert-intro">Este documento certifica que</div>

      <div>
        <div class="cert-name">${escapeHtml(userName)}</div>
        <div class="name-line"></div>
      </div>

      <div class="cert-body">ha completado satisfactoriamente la formación</div>

      <div class="cert-module">"${escapeHtml(moduleName)}"</div>

      <div class="cert-date">Fecha: ${escapeHtml(completionDate)}</div>

      <div>
        <div class="signature-line"></div>
        <div class="copyright">© Meiji Pharma Spain, S.A. All rights reserved.</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=1100,height=780");
  if (!win) {
    alert("Permite las ventanas emergentes para descargar el certificado.");
    return;
  }
  win.document.write(html);
  win.document.close();
}

interface FinalCertificateData {
  userName: string;
  completionDate: string;
  totalModules: number;
}

export function downloadFinalCertificate({ userName, completionDate, totalModules }: FinalCertificateData): void {
  const svgLogo = buildLogoSvg("final-cert-clip");
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Diploma Final — ${escapeHtml(userName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      width: 297mm;
      height: 210mm;
      font-family: 'Lato', Arial, sans-serif;
      background: #fff;
      color: #222;
    }

    .page {
      width: 297mm;
      height: 210mm;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14mm 18mm;
    }

    /* Marco exterior dorado */
    .border-outer {
      position: absolute;
      inset: 6mm;
      border: 4px solid #c8a000;
    }

    /* Marco interior dorado fino */
    .border-inner {
      position: absolute;
      inset: 8.5mm;
      border: 1.5px solid #c8a000;
    }

    /* Esquinas decorativas */
    .corner {
      position: absolute;
      width: 12mm;
      height: 12mm;
    }
    .corner-tl { top: 4mm; left: 4mm; border-top: 3px solid #FF0000; border-left: 3px solid #FF0000; }
    .corner-tr { top: 4mm; right: 4mm; border-top: 3px solid #FF0000; border-right: 3px solid #FF0000; }
    .corner-bl { bottom: 4mm; left: 4mm; border-bottom: 3px solid #FF0000; border-left: 3px solid #FF0000; }
    .corner-br { bottom: 4mm; right: 4mm; border-bottom: 3px solid #FF0000; border-right: 3px solid #FF0000; }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4mm;
    }

    .logo-tagline {
      font-size: 9pt;
      font-style: italic;
      color: #444;
      letter-spacing: 0.03em;
      margin-bottom: 1mm;
    }

    .logo-svg {
      display: block;
      width: 210px;
      height: auto;
    }

    .cert-title {
      font-size: 20pt;
      font-weight: 900;
      color: #c8a000;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 2mm;
    }

    .cert-subtitle {
      font-size: 11pt;
      color: #444;
      font-weight: 300;
    }

    .cert-name {
      font-size: 30pt;
      font-weight: 900;
      color: #FF0000;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .name-line {
      width: 180mm;
      height: 1.5px;
      background: #c8a000;
      margin-top: -2mm;
    }

    .cert-body {
      font-size: 11pt;
      color: #444;
      font-weight: 300;
    }

    .cert-program {
      font-size: 15pt;
      font-weight: 700;
      color: #111;
      letter-spacing: 0.01em;
    }

    .cert-modules {
      font-size: 10pt;
      color: #555;
      font-weight: 400;
      letter-spacing: 0.04em;
    }

    .cert-date {
      font-size: 10.5pt;
      color: #555;
      font-weight: 300;
    }

    .signature-line {
      width: 60mm;
      height: 1px;
      background: #555;
      margin-top: 5mm;
    }

    .copyright {
      font-size: 8.5pt;
      color: #666;
      margin-top: 1.5mm;
    }

    @media print {
      html, body { width: 297mm; height: 210mm; }
      @page { size: A4 landscape; margin: 0; }
      .page { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="content">
      <div>
        <div class="logo-tagline">Now ideas for wellness</div>
        ${svgLogo}
      </div>

      <div class="cert-title">Diploma de Excelencia</div>

      <div class="cert-subtitle">Este diploma certifica que</div>

      <div>
        <div class="cert-name">${escapeHtml(userName)}</div>
        <div class="name-line"></div>
      </div>

      <div class="cert-body">ha completado con éxito el programa completo de formación</div>

      <div class="cert-program">Guía de Formación en Inteligencia Artificial</div>
      <div class="cert-modules">${totalModules} módulos · Meiji Pharma Spain, S.A.</div>

      <div class="cert-date">Fecha de finalización: ${escapeHtml(completionDate)}</div>

      <div>
        <div class="signature-line"></div>
        <div class="copyright">© Meiji Pharma Spain, S.A. All rights reserved.</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=1100,height=780");
  if (!win) {
    alert("Permite las ventanas emergentes para descargar el certificado.");
    return;
  }
  win.document.write(html);
  win.document.close();
}

function buildLogoSvg(clipId: string): string {
  return `<svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189 84" fill="none">
          <g clip-path="url(#${clipId})">
            <path d="M12.504 72.3781C12.3888 70.8822 12.3888 69.0411 12.3888 67.5452C12.043 68.926 11.5821 70.537 11.0058 72.0329L9.27717 77.0959H7.66376L6.16559 72.1479C5.70461 70.652 5.35888 69.0411 5.01315 67.6603C5.01315 69.1562 4.8979 70.9973 4.78266 72.6082L4.55217 77.326H2.47778L3.28449 65.7041H6.05034L7.54851 70.4219C8.00949 71.8027 8.35522 73.1836 8.58571 74.4493C8.93144 73.1836 9.27717 71.8027 9.73815 70.4219L11.3516 65.8192H14.1174L14.8089 77.4411H12.7345L12.504 72.3781Z" fill="#1D1D1B"/>
            <path d="M18.7272 73.5288C18.7272 75.0246 19.9949 75.7151 21.2626 75.7151C22.2998 75.7151 22.9912 75.6 23.5675 75.3699L23.9132 76.8657C23.2217 77.2109 22.1845 77.326 21.0321 77.326C18.2662 77.326 16.6528 75.6 16.6528 73.0685C16.6528 70.7671 18.0358 68.5808 20.8016 68.5808C23.5675 68.5808 24.3742 70.7671 24.3742 72.6082C24.3742 72.9534 24.3742 73.2986 24.2589 73.5288H18.7272ZM22.415 72.0329C22.415 71.2274 22.0693 69.9616 20.6864 69.9616C19.4187 69.9616 18.8425 71.1123 18.7272 72.0329H22.415Z" fill="#1D1D1B"/>
            <path d="M28.6381 66.3945C28.6381 67.0849 28.1772 67.5452 27.4857 67.5452C26.7942 67.5452 26.3333 67.0849 26.3333 66.3945C26.3333 65.7041 26.7942 65.2438 27.4857 65.2438C28.1772 65.2438 28.6381 65.7041 28.6381 66.3945ZM26.4485 77.0959V68.6959H28.6381V77.0959H26.4485Z" fill="#1D1D1B"/>
            <path d="M29.2144 79.0521C29.9058 79.0521 30.482 78.8219 30.8278 78.4767C31.1735 78.0164 31.404 77.4411 31.404 75.6V68.6959H33.4784V76.1753C33.4784 77.9014 33.1326 79.0521 32.4412 79.7425C31.7497 80.4329 30.482 80.7781 29.4448 80.7781L29.2144 79.0521ZM33.5936 66.3945C33.5936 66.9699 33.1326 67.5452 32.4412 67.5452C31.7497 67.5452 31.2887 67.0849 31.2887 66.3945C31.2887 65.7041 31.7497 65.2438 32.4412 65.2438C33.1326 65.2438 33.5936 65.7041 33.5936 66.3945Z" fill="#1D1D1B"/>
            <path d="M38.3187 66.3945C38.3187 67.0849 37.8577 67.5452 37.1662 67.5452C36.4748 67.5452 36.0138 67.0849 36.0138 66.3945C36.0138 65.7041 36.4748 65.2438 37.1662 65.2438C37.7425 65.2438 38.2034 65.7041 38.3187 66.3945ZM36.0138 77.0959V68.6959H38.2034V77.0959H36.0138Z" fill="#1D1D1B"/>
            <path d="M44.5417 65.7041C45.3485 65.589 46.3856 65.4739 47.7686 65.4739C49.2667 65.4739 50.4192 65.8191 51.2259 66.3945C51.9174 66.9698 52.3783 67.8904 52.3783 68.926C52.3783 70.0767 52.0326 70.9972 51.3411 71.5726C50.5344 72.3781 49.1515 72.8383 47.6533 72.8383C47.3076 72.8383 46.8466 72.8383 46.6161 72.7233V77.0959H44.5417V65.7041ZM46.7314 71.1123C46.9619 71.2274 47.3076 71.2274 47.7686 71.2274C49.382 71.2274 50.3039 70.4219 50.3039 69.0411C50.3039 67.7753 49.382 67.0849 47.8838 67.0849C47.3076 67.0849 46.8466 67.0849 46.6161 67.2V71.1123H46.7314Z" fill="#1D1D1B"/>
            <path d="M54.3375 64.8986H56.5272V69.8466C56.7576 69.5014 57.1034 69.1562 57.5644 68.926C58.0253 68.6959 58.4863 68.5808 59.0625 68.5808C60.4454 68.5808 61.9436 69.5014 61.9436 72.263V77.211H59.8692V72.4931C59.8692 71.2274 59.4083 70.3068 58.2558 70.3068C57.4491 70.3068 56.8729 70.8822 56.6424 71.4575C56.5272 71.6877 56.5272 71.8027 56.5272 72.1479V77.211H54.3375V64.8986Z" fill="#1D1D1B"/>
            <path d="M69.204 77.0959L69.0888 76.1753C68.6278 76.8657 67.7059 77.326 66.5534 77.326C64.8248 77.326 63.9028 76.0603 63.9028 74.7945C63.9028 72.7233 65.7467 71.5726 68.8583 71.5726V71.4575C68.8583 70.8822 68.6278 69.9616 67.1297 69.9616C66.323 69.9616 65.401 70.1918 64.8248 70.537L64.4791 69.2712C65.0553 68.926 66.2077 68.5808 67.4754 68.5808C70.126 68.5808 70.9327 70.3068 70.9327 72.1479V75.1397C70.9327 75.9452 70.9327 76.6356 71.048 77.2109H69.204V77.0959ZM68.9736 73.0685C67.4754 73.0685 66.0925 73.4137 66.0925 74.6794C66.0925 75.4849 66.6687 75.8301 67.2449 75.8301C68.0516 75.8301 68.7431 75.2548 68.8583 74.6794C68.8583 74.5644 68.9736 74.3342 68.9736 74.2192V73.0685Z" fill="#1D1D1B"/>
            <path d="M73.468 71.4575C73.468 70.3069 73.468 69.5014 73.3528 68.6959H75.1967L75.3119 70.3069H75.4272C75.8881 69.1562 76.8101 68.4658 77.7321 68.4658C77.9625 68.4658 78.0778 68.4658 78.193 68.4658V70.4219C78.0778 70.4219 77.8473 70.3069 77.6168 70.3069C76.5796 70.3069 75.8882 70.9973 75.7729 71.9178C75.7729 72.148 75.6577 72.3781 75.6577 72.6082V76.9808H73.5833V71.4575H73.468Z" fill="#1D1D1B"/>
            <path d="M79.9217 71.2274C79.9217 70.3068 79.9217 69.5014 79.8064 68.6959H81.6503L81.7656 69.9616C82.2265 69.2712 82.918 68.5808 84.3009 68.5808C85.4534 68.5808 86.2601 69.1561 86.6058 70.0767C86.9515 69.6164 87.2973 69.2712 87.643 69.0411C88.104 68.6959 88.6802 68.5808 89.3717 68.5808C90.7546 68.5808 92.1375 69.5014 92.1375 72.263V77.2109H90.0631V72.6082C90.0631 71.2274 89.6021 70.4219 88.5649 70.4219C87.8735 70.4219 87.2973 70.8822 87.0668 71.5726C87.0668 71.8027 86.9515 72.0329 86.9515 72.263V77.326H84.8771V72.4931C84.8771 71.3425 84.4162 70.537 83.379 70.537C82.5723 70.537 81.996 71.1123 81.8808 71.6877C81.7656 71.9178 81.7656 72.1479 81.7656 72.3781V77.326H79.6912V71.2274H79.9217Z" fill="#1D1D1B"/>
            <path d="M99.5131 77.0959L99.3979 76.1753C98.9369 76.8658 98.015 77.326 96.8625 77.326C95.1339 77.326 94.2119 76.0603 94.2119 74.7945C94.2119 72.7233 96.0558 71.5726 99.1674 71.5726V71.4575C99.1674 70.8822 98.9369 69.9616 97.4387 69.9616C96.632 69.9616 95.7101 70.1918 95.1339 70.537L94.6729 69.1562C95.2491 68.811 96.4015 68.4658 97.6692 68.4658C100.32 68.4658 101.127 70.1918 101.127 72.0329V75.0247C101.127 75.8301 101.127 76.5206 101.242 77.0959H99.5131ZM99.2826 73.0685C97.7845 73.0685 96.4015 73.4137 96.4015 74.6795C96.4015 75.4849 96.9778 75.8301 97.554 75.8301C98.3607 75.8301 99.0522 75.2548 99.1674 74.6795C99.1674 74.5644 99.2826 74.3343 99.2826 74.2192V73.0685Z" fill="#1D1D1B"/>
            <path d="M107.695 74.7945C108.387 75.1397 109.424 75.4849 110.461 75.4849C111.844 75.4849 112.536 74.7945 112.536 73.874C112.536 72.9534 111.96 72.4932 110.461 71.9178C108.502 71.2274 107.35 70.1918 107.35 68.5808C107.35 66.7397 108.963 65.2438 111.499 65.2438C112.766 65.2438 113.688 65.474 114.264 65.8192L113.803 67.5452C113.342 67.3151 112.536 66.9699 111.499 66.9699C110.116 66.9699 109.539 67.6603 109.539 68.3507C109.539 69.2712 110.231 69.6164 111.729 70.3069C113.803 71.1123 114.725 72.0329 114.725 73.7589C114.725 75.6 113.342 77.211 110.346 77.211C109.078 77.211 107.811 76.8658 107.234 76.5206L107.695 74.7945Z" fill="#1D1D1B"/>
            <path d="M116.8 71.5726C116.8 70.4219 116.8 69.6164 116.684 68.8109H118.528L118.644 70.0767C119.22 69.1561 120.257 68.5808 121.525 68.5808C123.484 68.5808 125.097 70.1918 125.097 72.8383C125.097 75.8301 123.138 77.326 121.294 77.326C120.257 77.326 119.335 76.8657 118.874 76.1753V80.5479H116.8V71.5726ZM118.989 73.6438C118.989 73.874 118.989 73.989 119.105 74.2192C119.335 75.0246 120.027 75.7151 120.948 75.7151C122.331 75.7151 123.138 74.5644 123.138 72.9534C123.138 71.4575 122.447 70.3068 121.064 70.3068C120.142 70.3068 119.335 70.9973 119.22 71.9178C119.22 72.1479 119.105 72.263 119.105 72.4931V73.6438H118.989Z" fill="#1D1D1B"/>
            <path d="M131.897 77.0959L131.781 76.1753C131.32 76.8658 130.399 77.326 129.246 77.326C127.517 77.326 126.595 76.0603 126.595 74.7945C126.595 72.7233 128.439 71.5726 131.551 71.5726V71.4575C131.551 70.8822 131.32 69.9616 129.822 69.9616C129.016 69.9616 128.094 70.1918 127.517 70.537L127.056 69.1562C127.633 68.811 128.785 68.4658 130.053 68.4658C132.703 68.4658 133.51 70.1918 133.51 72.0329V75.0247C133.51 75.8301 133.51 76.5206 133.625 77.0959H131.897ZM131.666 73.0685C130.168 73.0685 128.785 73.4137 128.785 74.6795C128.785 75.4849 129.361 75.8301 129.938 75.8301C130.744 75.8301 131.436 75.2548 131.551 74.6795C131.551 74.5644 131.666 74.3343 131.666 74.2192V73.0685Z" fill="#1D1D1B"/>
            <path d="M138.466 66.3945C138.466 67.0849 138.005 67.5452 137.313 67.5452C136.622 67.5452 136.161 67.0849 136.161 66.3945C136.161 65.7041 136.622 65.2438 137.313 65.2438C138.005 65.2438 138.466 65.7041 138.466 66.3945ZM136.161 77.0959V68.6959H138.35V77.0959H136.161Z" fill="#1D1D1B"/>
            <path d="M140.886 71.2274C140.886 70.3068 140.886 69.5014 140.771 68.6959H142.614L142.73 69.9616C143.075 69.2712 143.997 68.4658 145.38 68.4658C146.878 68.4658 148.377 69.3863 148.377 72.0329V76.9808H146.302V72.263C146.302 71.1123 145.841 70.1918 144.689 70.1918C143.882 70.1918 143.306 70.7671 143.075 71.4575C142.96 71.6877 142.96 71.9178 142.96 72.1479V77.0959H140.771V71.2274H140.886Z" fill="#1D1D1B"/>
            <path d="M149.99 79.1671C150.451 77.9014 150.912 76.0603 151.142 74.5644L153.332 74.4493C152.871 76.0603 152.064 77.9014 151.373 79.0521L149.99 79.1671Z" fill="#1D1D1B"/>
            <path d="M159.21 74.7945C159.901 75.1397 160.938 75.4849 161.975 75.4849C163.358 75.4849 164.05 74.7945 164.05 73.874C164.05 72.9534 163.474 72.4932 161.975 71.9178C160.016 71.2274 158.864 70.1918 158.864 68.5808C158.864 66.7397 160.477 65.2438 163.013 65.2438C164.28 65.2438 165.202 65.474 165.778 65.8192L165.317 67.5452C164.856 67.3151 164.05 66.9699 163.013 66.9699C161.63 66.9699 161.053 67.6603 161.053 68.3507C161.053 69.2712 161.745 69.6164 163.243 70.3069C165.317 71.1123 166.239 72.0329 166.239 73.7589C166.239 75.6 164.856 77.211 161.86 77.211C160.592 77.211 159.325 76.8658 158.749 76.5206L159.21 74.7945Z" fill="#1D1D1B"/>
            <path d="M168.083 75.9452C168.083 75.1397 168.659 74.5644 169.351 74.5644C170.158 74.5644 170.619 75.1397 170.619 75.9452C170.619 76.7507 170.158 77.326 169.351 77.326C168.659 77.326 168.083 76.7507 168.083 75.9452Z" fill="#1D1D1B"/>
            <path d="M175.113 73.874L174.076 77.211H171.886L175.574 65.5891H178.225L182.028 77.211H179.723L178.686 73.874H175.113ZM178.455 72.263L177.533 69.3863C177.303 68.6959 177.072 67.8904 176.957 67.2C176.727 67.8904 176.611 68.6959 176.381 69.3863L175.459 72.263H178.455Z" fill="#1D1D1B"/>
            <path d="M183.641 75.9452C183.641 75.1397 184.217 74.5644 184.909 74.5644C185.716 74.5644 186.177 75.1397 186.177 75.9452C186.177 76.7507 185.716 77.326 184.909 77.326C184.217 77.326 183.641 76.7507 183.641 75.9452Z" fill="#1D1D1B"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.2144 46.3726C29.2144 46.3726 26.4486 46.3726 25.9876 46.3726C25.5266 46.3726 24.0284 46.2575 24.0284 44.6466C24.0284 43.0356 24.0284 18.7561 24.0284 18.7561C24.0284 18.7561 24.1437 17.2603 25.1809 17.2603C26.2181 17.2603 28.2925 19.4466 32.4412 19.4466C36.4748 19.4466 39.3559 18.0657 42.0065 17.3753C44.6571 16.6849 44.8876 16.8 46.3858 16.8C47.8839 16.8 51.5717 17.3753 52.6089 20.137C52.6089 20.137 52.8394 20.3671 53.0699 20.137C53.3004 19.9068 57.3339 17.2603 62.4047 17.2603C67.4754 17.2603 72.4309 19.7918 72.4309 26.4657C72.4309 29.9178 72.4309 44.5315 72.4309 44.5315C72.4309 44.5315 72.6614 46.3726 70.587 46.3726C68.5126 46.3726 63.5571 46.3726 63.5571 46.3726C63.5571 46.3726 61.4827 46.6027 61.4827 44.5315C61.4827 43.726 61.4827 31.4137 61.4827 31.4137C61.4827 31.4137 61.4827 26.6959 57.4492 26.6959C56.412 26.6959 55.0291 26.8109 53.7614 28.0767V44.5315C53.7614 44.5315 53.9919 46.3726 52.0327 46.3726C50.0736 46.3726 44.8876 46.3726 44.8876 46.3726C44.8876 46.3726 42.9284 46.3726 42.9284 44.5315C42.9284 42.6904 42.9284 31.4137 42.9284 31.4137C42.9284 31.4137 43.1589 26.6959 38.7797 26.6959C36.8205 26.6959 35.6681 27.6164 35.2071 28.0767V44.5315C35.2071 44.5315 35.3223 46.3726 33.3632 46.3726C31.0583 46.3726 29.2144 46.3726 29.2144 46.3726Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M118.759 18.7562C120.603 18.7562 126.135 18.7562 126.135 18.7562C126.135 18.7562 128.094 18.7562 128.094 20.5973C128.094 22.4384 128.094 44.8767 128.094 44.8767C128.094 44.8767 128.324 46.4877 126.365 46.4877C124.521 46.4877 118.644 46.4877 118.644 46.4877C118.644 46.4877 117.03 46.6027 117.03 44.5315C117.03 42.4603 117.03 20.8274 117.03 20.5973C117.03 20.3671 117.03 18.7562 118.759 18.7562Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M117.146 8.97532C117.146 5.98353 119.566 3.45203 122.677 3.45203C125.674 3.45203 128.209 5.86847 128.209 8.97532C128.209 11.9671 125.789 14.4986 122.677 14.4986C119.566 14.4986 117.146 11.9671 117.146 8.97532Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M100.666 27.9616H90.6394C90.6394 27.9616 89.9479 27.8466 90.2936 27.1562C90.4089 26.926 91.6766 22.8986 96.0558 23.0137C99.9741 23.1288 100.896 26.5808 100.896 26.926C101.011 27.2712 101.127 27.9616 100.666 27.9616ZM110.231 33.3699H90.5241C90.5241 33.3699 89.9479 33.3699 90.0631 33.9452C90.1784 34.5205 91.1003 40.5041 100.205 40.5041C106.774 40.5041 108.733 37.7425 109.885 37.7425C110.346 37.7425 110.577 38.3178 110.461 38.7781C110.461 39.2384 108.733 47.9836 95.7101 48.0986C90.9851 48.0986 77.8473 46.1425 77.8473 31.6438C77.8473 23.7041 84.5314 16.3397 95.9406 16.3397C108.156 16.3397 111.844 26.811 111.844 30.7233C111.844 33.4849 110.231 33.3699 110.231 33.3699Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M135.469 44.5315V20.7123C135.469 20.4822 135.354 18.8712 137.198 18.8712H144.574C144.574 18.8712 146.533 18.8712 146.533 20.7123V48.674C146.533 48.674 146.648 59.2603 134.432 59.7205C130.399 59.8356 125.558 58.4548 123.599 54.5424C123.138 53.5068 123.83 53.3918 124.291 53.3918C124.752 53.5068 126.365 54.0822 128.209 53.9671C130.053 53.852 135.124 53.852 135.469 48.2137C135.469 45.337 135.469 44.5315 135.469 44.5315Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M135.469 8.86026C135.469 5.86848 137.889 3.33698 141.001 3.33698C143.997 3.33698 146.533 5.75341 146.533 8.86026C146.533 11.852 144.113 14.3835 141.001 14.3835C137.889 14.3835 135.469 11.9671 135.469 8.86026Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M155.061 18.7562C156.905 18.7562 162.436 18.7562 162.436 18.7562C162.436 18.7562 164.28 18.7562 164.28 20.5973C164.28 22.4384 164.28 44.8767 164.28 44.8767C164.28 44.8767 164.511 46.4877 162.552 46.4877C160.708 46.4877 154.83 46.4877 154.83 46.4877C154.83 46.4877 153.217 46.6027 153.217 44.5315C153.217 42.4603 153.217 20.8274 153.217 20.5973C153.332 20.3671 153.217 18.7562 155.061 18.7562Z" fill="#FF0000"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M153.332 8.86026C153.332 5.86848 155.752 3.33698 158.864 3.33698C161.86 3.33698 164.396 5.75341 164.396 8.86026C164.396 11.9671 161.975 14.3835 158.864 14.3835C155.868 14.3835 153.332 11.9671 153.332 8.86026Z" fill="#FF0000"/>
          </g>
          <defs>
            <clipPath id="${clipId}">
              <rect width="189" height="84" fill="white"/>
            </clipPath>
          </defs>
        </svg>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
