import { Language, isRTLLanguage } from './leaveApplicationLetterTemplate';

export function downloadLeaveApplicationAsPDF(letterContent: string, studentName: string, language: Language): void {
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Please allow pop-ups to download PDF');
    return;
  }

  const sanitizedName = studentName.trim().replace(/\s+/g, '_') || 'Student';
  const date = new Date().toISOString().split('T')[0];
  const fileName = `Leave_Application_${sanitizedName}_${date}`;

  const isRTL = isRTLLanguage(language);
  const direction = isRTL ? 'rtl' : 'ltr';
  const textAlign = isRTL ? 'right' : 'left';

  // Font selection based on language
  let fontFamily = "'Times New Roman', Times, serif";
  if (language === 'arabic' || language === 'urdu') {
    fontFamily = "'Traditional Arabic', 'Arabic Typesetting', 'Noto Naskh Arabic', 'Times New Roman', serif";
  } else if (language === 'chinese' || language === 'japanese' || language === 'korean') {
    fontFamily = "'Noto Sans CJK', 'Microsoft YaHei', 'SimSun', 'MS Gothic', 'Malgun Gothic', serif";
  } else if (language === 'hindi' || language === 'bengali' || language === 'tamil') {
    fontFamily = "'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Mangal', 'Lohit', serif";
  }

  // Escape the letter content for safe HTML embedding
  const escapedContent = letterContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const htmlContent = `<!DOCTYPE html>
<html dir="${direction}" lang="${language}">
  <head>
    <meta charset="UTF-8">
    <title>${fileName}</title>
    <style>
      @page {
        size: A4;
        margin: 2.5cm 2cm 2.5cm 2cm;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: ${fontFamily};
        font-size: 12pt;
        line-height: 1.6;
        color: #000000;
        background: #ffffff;
        direction: ${direction};
        text-align: ${textAlign};
      }

      .letter-content {
        font-family: ${fontFamily};
        font-size: 12pt;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-word;
        direction: ${direction};
        text-align: ${textAlign};
        color: #000000;
      }

      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .letter-content {
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="letter-content">${escapedContent}</div>
    <script>
      window.onload = function() {
        document.title = '${fileName}';
        setTimeout(function() { window.print(); }, 300);
      };
    </script>
  </body>
</html>`;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
