
// مكتبات Tesseract + XLSX مفترض تكون من CDN
// على GitHub ممكن تضيفها من ملفات خارجية أو عبر HTML script tags

const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const downloadExcelBtn = document.getElementById('downloadExcelBtn');
const downloadCSVBtn = document.getElementById('downloadCSVBtn');
const tableContainer = document.getElementById('tableContainer');

let tableData = [];

processBtn.addEventListener('click', async () => {
  const files = fileInput.files;
  if (!files.length) return alert('اختر ملفات أولاً');
  tableContainer.innerHTML = 'جارٍ المعالجة ...';

  tableData = [];
  for (let f of files) {
    const text = await extractText(f);
    const rows = parseTextToTable(text);
    tableData.push(...rows);
  }

  renderTable(tableData);
  localStorage.setItem('tableData', JSON.stringify(tableData));
});

downloadExcelBtn.addEventListener('click', () => exportExcel(tableData));
downloadCSVBtn.addEventListener('click', () => exportCSV(tableData));

// --- دوال مساعدة ---
async function extractText(file) {
  // هنا ممكن تستخدم Tesseract.js
  // مثال placeholder
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.readAsText(file); // مؤقت لعرض النص
  });
}

function parseTextToTable(text) {
  // مثال مؤقت: تقسيم الأسطر ثم الفراغات
  return text.split('\n').map(line => line.split(/\s+/));
}

function renderTable(data) {
  if (!data.length) return tableContainer.innerHTML = 'لا توجد بيانات';
  let html = '<table><thead><tr>';
  data[0].forEach(cell => html += `<th>${cell}</th>`);
  html += '</tr></thead><tbody>';
  for (let i=1; i<data.length; i++) {
    html += '<tr>' + data[i].map(c => `<td contenteditable>${c}</td>`).join('') + '</tr>';
  }
  html += '</tbody></table>';
  tableContainer.innerHTML = html;
}

function exportExcel(data) {
  /* استخدم XLSX.write لتصدير Excel */
  alert('سيتم تنزيل Excel (تحتاج مكتبة XLSX)');
}

function exportCSV(data) {
  let csv = data.map(row => row.join(',')).join('\n');
  let blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'table.csv';
  link.click();
}