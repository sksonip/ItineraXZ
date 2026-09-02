import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";

type ItineraryDay = {
  day?: number;
  title?: string;
  description?: string;
  distance?: string;
  altitude?: string;
  overnight?: string;
  activities?: string[];
};

type ItineraryPhase = {
  title?: string;
  description?: string;
  days?: ItineraryDay[];
};

type Itinerary = {
  title?: string;
  destination?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  travellers?: number;
  travelStyle?: string;
  description?: string;
  philosophy?: string;
  highlights?: string[];
  phases?: ItineraryPhase[];
  pricing?: {
    currency?: string;
    subtotal?: number;
    discount?: number;
    adjustment?: number;
    total?: number;
    items?: {
      name?: string;
      quantity?: number;
      unitPrice?: number;
      total?: number;
    }[];
  };
};

function formatCurrency(
  amount: number | undefined,
  currency = "INR"
) {
  if (amount === undefined || Number.isNaN(amount)) {
    return "-";
  }

  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

function addWrappedText(
  doc: PDFKit.PDFDocument,
  text: string,
  options?: {
    fontSize?: number;
    bold?: boolean;
    spacing?: number;
  }
) {
  doc
    .font(options?.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options?.fontSize ?? 10)
    .text(text, {
      width: 500,
      lineGap: 3,
    });

  doc.moveDown(options?.spacing ?? 0.5);
}

function checkPageBreak(
  doc: PDFKit.PDFDocument,
  requiredSpace = 100
) {
  if (doc.y + requiredSpace > 730) {
    doc.addPage();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const itinerary: Itinerary =
      body.itinerary ?? body;

    if (!itinerary || typeof itinerary !== "object") {
      return NextResponse.json(
        {
          error: "Itinerary data is required.",
        },
        { status: 400 }
      );
    }

    if (!itinerary.title) {
      return NextResponse.json(
        {
          error: "Itinerary title is required.",
        },
        { status: 400 }
      );
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      info: {
        Title: itinerary.title,
        Author: "Bettada Jeeva",
        Subject: "Travel Itinerary",
      },
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    const pdfFinished = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);
    });

    /*
     * COVER
     */

    doc.moveDown(5);

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("BETTADA JEEVA", {
        align: "center",
      });

    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(22)
      .text(itinerary.title, {
        align: "center",
      });

    doc.moveDown(0.8);

    if (itinerary.destination) {
      doc
        .fontSize(13)
        .text(itinerary.destination, {
          align: "center",
        });
    }

    doc.moveDown(1);

    if (itinerary.duration) {
      doc
        .fontSize(11)
        .text(itinerary.duration, {
          align: "center",
        });
    }

    if (itinerary.travelStyle) {
      doc
        .fontSize(10)
        .text(itinerary.travelStyle, {
          align: "center",
        });
    }

    doc.addPage();

    /*
     * TRIP OVERVIEW
     */

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("Trip Overview");

    doc.moveDown();

    if (itinerary.description) {
      addWrappedText(doc, itinerary.description, {
        fontSize: 11,
        spacing: 1,
      });
    }

    if (
      itinerary.startDate ||
      itinerary.endDate ||
      itinerary.travellers
    ) {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Trip Details");

      doc.moveDown(0.4);

      if (itinerary.startDate) {
        addWrappedText(
          doc,
          `Start: ${itinerary.startDate}`,
          { spacing: 0.2 }
        );
      }

      if (itinerary.endDate) {
        addWrappedText(
          doc,
          `End: ${itinerary.endDate}`,
          { spacing: 0.2 }
        );
      }

      if (itinerary.travellers) {
        addWrappedText(
          doc,
          `Travellers: ${itinerary.travellers}`,
          { spacing: 0.2 }
        );
      }

      doc.moveDown();
    }

    /*
     * HIGHLIGHTS
     */

    if (
      itinerary.highlights &&
      itinerary.highlights.length > 0
    ) {
      checkPageBreak(doc, 150);

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Highlights");

      doc.moveDown(0.5);

      itinerary.highlights.forEach((highlight) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(`• ${highlight}`, {
            width: 500,
            lineGap: 3,
          });

        doc.moveDown(0.3);
      });

      doc.moveDown();
    }

    /*
     * PHILOSOPHY
     */

    if (itinerary.philosophy) {
      checkPageBreak(doc, 120);

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Travel Philosophy");

      doc.moveDown(0.5);

      addWrappedText(doc, itinerary.philosophy, {
        fontSize: 10,
        spacing: 1,
      });
    }

    /*
     * ITINERARY
     */

    if (
      itinerary.phases &&
      itinerary.phases.length > 0
    ) {
      doc.addPage();

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Detailed Itinerary");

      doc.moveDown();

      itinerary.phases.forEach((phase) => {
        checkPageBreak(doc, 150);

        if (phase.title) {
          doc
            .font("Helvetica-Bold")
            .fontSize(16)
            .text(phase.title);

          doc.moveDown(0.4);
        }

        if (phase.description) {
          addWrappedText(doc, phase.description, {
            fontSize: 10,
            spacing: 0.5,
          });
        }

        phase.days?.forEach((day) => {
          checkPageBreak(doc, 180);

          doc
            .font("Helvetica-Bold")
            .fontSize(13)
            .text(
              `Day ${day.day ?? ""}${day.title ? ` — ${day.title}` : ""}`
            );

          doc.moveDown(0.4);

          if (day.description) {
            addWrappedText(doc, day.description, {
              fontSize: 10,
              spacing: 0.5,
            });
          }

          if (day.distance) {
            addWrappedText(
              doc,
              `Distance: ${day.distance}`,
              { spacing: 0.2 }
            );
          }

          if (day.altitude) {
            addWrappedText(
              doc,
              `Altitude: ${day.altitude}`,
              { spacing: 0.2 }
            );
          }

          if (day.overnight) {
            addWrappedText(
              doc,
              `Overnight: ${day.overnight}`,
              { spacing: 0.2 }
            );
          }

          if (
            day.activities &&
            day.activities.length > 0
          ) {
            doc
              .font("Helvetica-Bold")
              .fontSize(10)
              .text("Activities");

            day.activities.forEach((activity) => {
              doc
                .font("Helvetica")
                .fontSize(10)
                .text(`• ${activity}`);

              doc.moveDown(0.2);
            });

            doc.moveDown(0.4);
          }

          doc.moveDown();
        });
      });
    }

    /*
     * PRICING
     */

    if (itinerary.pricing) {
      doc.addPage();

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Pricing");

      doc.moveDown();

      const currency =
        itinerary.pricing.currency ?? "INR";

      if (
        itinerary.pricing.items &&
        itinerary.pricing.items.length > 0
      ) {
        itinerary.pricing.items.forEach((item) => {
          checkPageBreak(doc, 50);

          const quantity = item.quantity ?? 1;
          const total =
            item.total ??
            (item.unitPrice ?? 0) * quantity;

          doc
            .font("Helvetica")
            .fontSize(10)
            .text(
              `${item.name ?? "Item"} × ${quantity}`,
              {
                continued: true,
              }
            )
            .text(
              formatCurrency(total, currency),
              {
                align: "right",
              }
            );

          doc.moveDown(0.3);
        });

        doc.moveDown();
      }

      if (itinerary.pricing.subtotal !== undefined) {
        addWrappedText(
          doc,
          `Subtotal: ${formatCurrency(
            itinerary.pricing.subtotal,
            currency
          )}`,
          { spacing: 0.2 }
        );
      }

      if (itinerary.pricing.adjustment !== undefined) {
        addWrappedText(
          doc,
          `Adjustment: ${formatCurrency(
            itinerary.pricing.adjustment,
            currency
          )}`,
          { spacing: 0.2 }
        );
      }

      if (itinerary.pricing.discount !== undefined) {
        addWrappedText(
          doc,
          `Discount: ${formatCurrency(
            itinerary.pricing.discount,
            currency
          )}`,
          { spacing: 0.2 }
        );
      }

      doc.moveDown(0.5);

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .text(
          `Total: ${formatCurrency(
            itinerary.pricing.total,
            currency
          )}`
        );
    }

    /*
     * FOOTER
     */

    const range = doc.bufferedPageRange();

    for (
      let page = 0;
      page < range.count;
      page++
    ) {
      doc.switchToPage(range.start + page);

      doc
        .font("Helvetica")
        .fontSize(8)
        .text(
          `Bettada Jeeva  •  ${itinerary.title}`,
          50,
          790,
          {
            width: 500,
            align: "center",
          }
        );

      doc
        .fontSize(8)
        .text(
          `${page + 1}`,
          520,
          790
        );
    }

    doc.end();

    const pdf = await pdfFinished;

    const filename =
      `${itinerary.title
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "itinerary"}.pdf`;

    return new NextResponse(pdf as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdf.length),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF.",
      },
      { status: 500 }
    );
  }
}