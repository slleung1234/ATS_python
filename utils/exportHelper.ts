import { StudentStat } from "../types";

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("沒有數據可匯出");
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);
  
  // Map friendly headers for HK teachers if possible, else use keys
  const headerMap: {[key: string]: string} = {
      studentId: "學生編號",
      name: "姓名",
      class: "班級",
      levelId: "關卡 ID",
      status: "狀態",
      attempts: "嘗試次數",
      timeSpent: "使用時間(秒)",
      lastPlayed: "最後遊玩時間"
  };

  const csvContent = [
    // Header Row
    headers.map(h => headerMap[h] || h).join(','),
    // Data Rows
    ...data.map(row => headers.map(fieldName => {
        const val = row[fieldName];
        return typeof val === 'string' ? `"${val}"` : val;
    }).join(','))
  ].join('\n');

  // Create Blob and download
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel Chinese support
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
