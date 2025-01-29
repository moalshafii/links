import "./style.css";

document.addEventListener("DOMContentLoaded", initializePage);
// document.addEventListener("DOMContentLoaded", Ads);

function initializePage(): void {
  const pageSection = document.getElementById("page");

  const timerSection = createSection("timer");
  const captchaSection = createSection("captcha");
  const linkSection = createSection("link");

  pageSection?.append(timerSection, captchaSection, linkSection);

  const urlParams = new URLSearchParams(window.location.search);
  const hex = urlParams.get("hex");
  const decodedLink = hex ? decodeLink(hex) : null;

  wait(15, () => showCaptcha(captchaSection, linkSection, decodedLink));
}

function createSection(id: string): HTMLDivElement {
  const section = document.createElement("div");
  section.id = id;
  section.style.display = "none";
  return section;
}

function wait(seconds: number, callback: () => void): void {
  const timerSection = document.getElementById("timer");
  if (!timerSection) return;

  let countdown = seconds;
  timerSection.style.display = "flex";
  timerSection.textContent = `Wait ${
    countdown < 10 ? "0" + countdown : countdown
  } seconds`;

  const timerInterval = setInterval(() => {
    countdown--;
    timerSection.textContent = `Wait ${
      countdown < 10 ? "0" + countdown : countdown
    } seconds`;
    if (countdown === 0) {
      clearInterval(timerInterval);
      timerSection.style.display = "none";
      callback();
    }
  }, 1000);
}

function showCaptcha(
  captchaSection: HTMLElement,
  linkSection: HTMLElement,
  decodedLink: string | null
): void {
  captchaSection.style.display = "flex";
  captchaSection.innerHTML = `
    <strong>Enter the CAPTCHA</strong>
    <s id="captchaGenerated"></s>
    <input type="text" id="captchaInput" placeholder="Enter CAPTCHA" />
    <button id="changeCaptchaButton">Change CAPTCHA</button>
    <button id="captchaButton">Submit</button>
  `;
  generateCaptcha();

  document
    .getElementById("captchaButton")
    ?.addEventListener("click", () =>
      checkCaptcha(captchaSection, linkSection, decodedLink)
    );
  document
    .getElementById("changeCaptchaButton")
    ?.addEventListener("click", changeCaptcha);
  document
    .getElementById("captchaInput")
    ?.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        checkCaptcha(captchaSection, linkSection, decodedLink);
      }
    });
}

function generateCaptcha(): void {
  const captchaGenerated = document.getElementById("captchaGenerated");
  if (!captchaGenerated) return;

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  captchaGenerated.textContent = Array.from({ length: 5 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}

function changeCaptcha(): void {
  generateCaptcha();
  const captchaInputElement = document.getElementById(
    "captchaInput"
  ) as HTMLInputElement | null;
  if (captchaInputElement) {
    captchaInputElement.value = "";
    captchaInputElement.placeholder = "Enter CAPTCHA";
  }
}

function checkCaptcha(
  captchaSection: HTMLElement,
  linkSection: HTMLElement,
  decodedLink: string | null
): void {
  const captchaInputElement = document.getElementById(
    "captchaInput"
  ) as HTMLInputElement | null;
  const captchaGenerated = document.getElementById("captchaGenerated");
  if (!captchaInputElement || !captchaGenerated) return;

  if (captchaInputElement.value === captchaGenerated.textContent) {
    captchaSection.style.display = "none";
    wait(15, () => showLinkButton(linkSection, decodedLink));
  } else {
    captchaInputElement.value = "";
    captchaInputElement.placeholder = "Please Try Again";
    generateCaptcha();
  }
}

function showLinkButton(
  linkSection: HTMLElement,
  decodedLink: string | null
): void {
  linkSection.style.display = "flex";
  linkSection.innerHTML = "";

  if (decodedLink) {
    const button = document.createElement("button");
    button.className = "text-lg px-12 py-2 bg-green-700 rounded-2xl";
    button.textContent = "Link";

    button.addEventListener("click", () => {
      window.open(
        "https://maintaintournamentslick.com/jv30ep7nb?key=93fa0c55e33236f4b0171e58419fcf6a",
        "_blank"
      );
      window.location.href = decodedLink;
    });

    linkSection.appendChild(button);
  } else {
    const span = document.createElement("span");
    span.className = "text-lg border-red-700 border-y-2 px-4 py-2 rounded-2xl";
    span.innerHTML = "Sorry The Link Is Not <s>Valid</s>";

    linkSection.appendChild(span);
  }
}

function decodeLink(encodedLink: string): string | null {
  if (!/^[0-9a-fA-F]+$/.test(encodedLink) || encodedLink.length % 2 !== 0)
    return null;

  try {
    const decoded = (encodedLink.match(/.{1,2}/g) || [])
      .map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("")
      .replace(/[<>'"(){}]/g, "");

    const url = new URL(decoded);
    return ["http:", "https:"].includes(url.protocol) ? decoded : null;
  } catch {
    return null;
  }
}
