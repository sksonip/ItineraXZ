import { getElementById, prepareForPdf } from "@/lib/pdf/browser";

export type GeneratePdfOptions = {
  elementId?: string;
  filename?: string;
  scale?: number;
  backgroundColor?: string;
};

export async function generatePdf(
  options: GeneratePdfOptions = {}
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error(
      "PDF generation can only run in the browser."
    );
  }

  const elementId =
    options.elementId || "pdf-content";

  const filename =
    options.filename ||
    "itinerary.pdf";

  const element =
    getElementById(elementId);

  if (!element) {
    throw new Error(
      `PDF element "#${elementId}" was not found.`
    );
  }

  await prepareForPdf(element);

  const html2canvas =
    (await import("html2canvas")).default;

  const jsPDFModule =
    await import("jspdf");

  const jsPDF =
    jsPDFModule.jsPDF;

  const scale =
    options.scale || 2;

  const canvas =
    await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor:
        options.backgroundColor ||
        "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      windowWidth:
        element.scrollWidth,
      windowHeight:
        element.scrollHeight,
    });

  const imageData =
    canvas.toDataURL(
      "image/jpeg",
      0.95
    );

  const pdf =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 8;

  const contentWidth =
    pageWidth - margin * 2;

  const imageHeight =
    (canvas.height * contentWidth) /
    canvas.width;

  let remainingHeight =
    imageHeight;

  let position = margin;

  pdf.addImage(
    imageData,
    "JPEG",
    margin,
    position,
    contentWidth,
    imageHeight,
    undefined,
    "FAST"
  );

  remainingHeight -=
    pageHeight - margin * 2;

  while (remainingHeight > 0) {
    position =
      margin -
      (imageHeight -
        remainingHeight);

    pdf.addPage();

    pdf.addImage(
      imageData,
      "JPEG",
      margin,
      position,
      contentWidth,
      imageHeight,
      undefined,
      "FAST"
    );

    remainingHeight -=
      pageHeight - margin * 2;
  }

  pdf.save(filename);
}

export default generatePdf;