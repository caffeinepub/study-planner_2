export function downloadLeaveApplicationAsPDF(letterContent: string, studentName: string): void {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download PDF');
    return;
  }

  const sanitizedName = studentName.trim().replace(/\s+/g, '_') || 'Student';
  const date = new Date().toISOString().split('T')[0];
  const fileName = `Leave_Application_${sanitizedName}_${date}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${fileName}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
            margin: 0;
            padding: 20px;
            background: white;
          }
          
          pre {
            font-family: 'Times New Roman', Times, serif;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
            font-size: 12pt;
            line-height: 1.8;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <pre>${letterContent}</pre>
        <script>
          window.onload = function() {
            document.title = '${fileName}';
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
