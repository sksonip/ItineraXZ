export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return !isBrowser();
}

export function getBrowserWindow(): Window {
  if (!isBrowser()) {
    throw new Error(
      "This function can only be used in the browser."
    );
  }

  return window;
}

export function getBrowserDocument(): Document {
  if (!isBrowser()) {
    throw new Error(
      "This function can only be used in the browser."
    );
  }

  return document;
}

export function getElement(
  selector: string
): HTMLElement | null {
  if (!isBrowser()) {
    return null;
  }

  return document.querySelector<HTMLElement>(
    selector
  );
}

export function getElementById(
  id: string
): HTMLElement | null {
  if (!isBrowser()) {
    return null;
  }

  return document.getElementById(id);
}

export function waitForImages(
  element: HTMLElement
): Promise<void> {
  const images =
    Array.from(
      element.querySelectorAll("img")
    );

  if (images.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>(
        (resolve) => {
          image.addEventListener(
            "load",
            () => resolve(),
            { once: true }
          );

          image.addEventListener(
            "error",
            () => resolve(),
            { once: true }
          );
        }
      );
    })
  ).then(() => undefined);
}

export function waitForFonts(): Promise<void> {
  if (!isBrowser()) {
    return Promise.resolve();
  }

  if (!document.fonts) {
    return Promise.resolve();
  }

  return document.fonts.ready.then(
    () => undefined
  );
}

export async function prepareForPdf(
  element: HTMLElement
): Promise<void> {
  await Promise.all([
    waitForImages(element),
    waitForFonts(),
  ]);

  await new Promise<void>(
    (resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }
  );
}

export function getElementDimensions(
  element: HTMLElement
) {
  const rect =
    element.getBoundingClientRect();

  return {
    width: Math.ceil(
      Math.max(
        rect.width,
        element.scrollWidth
      )
    ),

    height: Math.ceil(
      Math.max(
        rect.height,
        element.scrollHeight
      )
    ),
  };
}

export function cloneForPdf(
  element: HTMLElement
): HTMLElement {
  const clone =
    element.cloneNode(
      true
    ) as HTMLElement;

  clone.style.position =
    "absolute";

  clone.style.left =
    "-99999px";

  clone.style.top = "0";

  clone.style.width =
    `${element.scrollWidth}px`;

  clone.style.height =
    `${element.scrollHeight}px`;

  clone.style.overflow =
    "visible";

  document.body.appendChild(
    clone
  );

  return clone;
}

export function removePdfClone(
  element: HTMLElement
): void {
  if (element.parentNode) {
    element.parentNode.removeChild(
      element
    );
  }
}