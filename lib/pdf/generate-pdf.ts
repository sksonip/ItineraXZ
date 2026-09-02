import { getElementById, prepareForPdf } from "@/lib/pdf/browser";

function cloneWithResolvedStyles(
  element: HTMLElement
): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  const sourceElements = [element, ...Array.from(element.querySelectorAll("*"))];
  const cloneElements = [clone, ...Array.from(clone.querySelectorAll("*"))];

  sourceElements.forEach((source, index) => {
    const target = cloneElements[index] as HTMLElement;
    const computed = window.getComputedStyle(source);

    for (const property of Array.from(computed)) {
      if (property.startsWith("--")) {
        continue;
      }

      target.style.setProperty(
        property,
        computed.getPropertyValue(property),
        computed.getPropertyPriority(property)
      );
    }

    target.className = "";
  });

  clone.style.position = "absolute";
  clone.style.left = "-100000px";
  clone.style.top = "0";
  clone.style.width = `${element.getBoundingClientRect().width}px`;
  clone.style.height = `${element.getBoundingClientRect().height}px`;
  clone.style.overflow = "hidden";
  document.body.appendChild(clone);

  return clone;
}

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
    element.querySelectorAll<HTMLElement>(".pdf-page");

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

  for (const [index, page] of Array.from(canvas).entries()) {
    const exportPage = cloneWithResolvedStyles(page);

    try {
      const canvas = await html2canvas(exportPage, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: options.backgroundColor || "#101010",
        logging: false,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        windowWidth: exportPage.scrollWidth,
        windowHeight: exportPage.scrollHeight,
      });

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );
    } finally {
      exportPage.remove();
    }
  }

  pdf.save(filename);
}

export default generatePdf;