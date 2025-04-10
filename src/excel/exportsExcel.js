// 修改导入方式 - 使用命名空间导入
import FileSaver from "file-saver";
import * as XLSX from "xlsx";  // 将所有导出作为XLSX命名空间导入

export function getExcel(dom, title) {
  const excelTitle = title;
  const wb = XLSX.utils.table_to_book(document.querySelector(dom));
  
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  });
  
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${excelTitle}.xlsx`
    );
  } catch (e) {
    console.error('导出Excel失败:', e);
  }
  
  return wbout;
}