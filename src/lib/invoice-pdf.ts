type InvoicePayload = {
  taxId: string;
  companyName: string;
  address: string;
  qty: number;
  total: number;
  savings: number;
  note: string;
  title?: string;
  filename?: string;
  position?: string;
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
  }
  return cursorY;
}

function canvasToJpeg(canvas: HTMLCanvasElement): Uint8Array {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const binary = atob(dataUrl.split(",")[1]!);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function buildPdfFromJpeg(jpeg: Uint8Array, imgW: number, imgH: number): Blob {
  const pageW = 595;
  const pageH = Math.round((imgH / imgW) * pageW);
  const encoder = new TextEncoder();
  const header = "%PDF-1.4\n";

  const objBodies = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
  ];

  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  const contentObj = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`;

  const xrefOffsets: number[] = [0];
  let pos = encoder.encode(header).length;
  const encodedObjs: Uint8Array[] = [];

  const addObj = (bytes: Uint8Array) => {
    xrefOffsets.push(pos);
    encodedObjs.push(bytes);
    pos += bytes.length;
  };

  for (const body of objBodies) {
    addObj(encoder.encode(body));
  }

  const imgObjHead = encoder.encode(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  const imgObjTail = encoder.encode("\nendstream\nendobj\n");
  const imgObj = new Uint8Array(imgObjHead.length + jpeg.length + imgObjTail.length);
  imgObj.set(imgObjHead, 0);
  imgObj.set(jpeg, imgObjHead.length);
  imgObj.set(imgObjTail, imgObjHead.length + jpeg.length);
  addObj(imgObj);
  addObj(encoder.encode(contentObj));

  const xrefPos = pos;
  let xref = `xref\n0 ${xrefOffsets.length}\n`;
  xref += "0000000000 65535 f \n";
  for (let i = 1; i < xrefOffsets.length; i += 1) {
    xref += `${String(xrefOffsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${xrefOffsets.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  const xrefBytes = encoder.encode(xref + trailer);

  const out = new Uint8Array(pos + xrefBytes.length);
  let offset = 0;
  const headerBytes = encoder.encode(header);
  out.set(headerBytes, 0);
  offset = headerBytes.length;
  for (const obj of encodedObjs) {
    out.set(obj, offset);
    offset += obj.length;
  }
  out.set(xrefBytes, offset);
  return new Blob([out], { type: "application/pdf" });
}

export function downloadInvoicePdf(payload: InvoicePayload) {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1C1C1E";
  ctx.font = "700 48px Inter, sans-serif";
  ctx.fillText("DUBAI", 80, 100);
  ctx.font = "400 22px Inter, sans-serif";
  ctx.fillStyle = "#48B02C";
  ctx.fillText("орехи и сухофрукты", 80, 136);

  ctx.fillStyle = "#1C1C1E";
  ctx.font = "700 36px Inter, sans-serif";
  ctx.fillText(payload.title ?? "Счёт-фактура (демо)", 80, 220);

  ctx.fillStyle = "#333333";
  let y = 280;
  const line = (label: string, value: string) => {
    ctx.font = "600 20px Inter, sans-serif";
    ctx.fillText(label, 80, y);
    ctx.font = "400 20px Inter, sans-serif";
    y = wrapText(ctx, value, 320, y, 820, 28) + 40;
  };

  line("Продавец:", "ООО «Дубай», УНП 193000000, г. Минск");
  line("Покупатель:", payload.companyName);
  line("УНП / ИНН:", payload.taxId);
  line("Адрес:", payload.address);
  line("Позиция:", payload.position ?? `Брендированные подарочные наборы — ${payload.qty} шт.`);
  line("Сумма:", `${payload.total.toFixed(2)} BYN`);
  line("Экономия:", `${payload.savings.toFixed(2)} BYN`);
  line(
    "Примечание:",
    payload.note || "Заказ резервируется на складе на 3 дня до поступления оплаты.",
  );

  ctx.fillStyle = "#48B02C";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText("Документ сформирован на сайте Dubai. Печать и подпись — демо-макет.", 80, 1680);

  const jpeg = canvasToJpeg(canvas);
  const blob = buildPdfFromJpeg(jpeg, canvas.width, canvas.height);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = payload.filename ?? `schet-dubai-${payload.taxId || "draft"}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
