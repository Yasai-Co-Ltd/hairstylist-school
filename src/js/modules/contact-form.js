// 送信先確定前の入力チェック専用。データの送信・保存は行わない。
export function initContactForm() {
  const form = document.querySelector(".js-contact-form");
  if (!form) return;
  const fields = [...form.querySelectorAll("[data-validate]")];
  const submit = form.querySelector("[data-contact-submit]");
  const status = form.querySelector("[data-contact-status]");
  let submitted = false;

  const messageFor = (field) => {
    const kind = field.dataset.validate;
    if (kind === "purpose") {
      return form.querySelector('[name="purpose"]:checked') ? "" : "ご用件を選択してください。";
    }
    if (kind === "privacy") {
      return field.checked ? "" : "個人情報に関する取り扱いへの同意が必要です。";
    }
    if (!field.value.trim()) {
      const labels = {
        name: "お名前",
        kana: "フリガナ",
        phone: "電話番号",
        postal: "郵便番号",
        address: "ご住所",
      };
      return `${labels[kind]}を入力してください。`;
    }
    if (kind === "postal" && field.validity.patternMismatch) {
      return "郵便番号は7桁の数字で入力してください（例：000-0000）。";
    }
    if (kind === "phone") {
      const phone = field.value.normalize("NFKC").trim();
      if (!/^[+0-9\s()\-−ー]+$/.test(phone) || !/[0-9]/.test(phone)) {
        return "電話番号は数字とハイフンなどで入力してください（例：090-0000-0000）。";
      }
    }
    return "";
  };

  const validate = (field) => {
    const message = messageFor(field);
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  };

  const validateAll = () => fields.filter((field) => !validate(field));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const invalid = validateAll();
    if (invalid.length) {
      status.textContent = `未入力・入力内容に誤りのある項目が${invalid.length}件あります。各項目をご確認ください。`;
      invalid[0].focus();
      return;
    }
    status.textContent = "入力内容を確認しました。送信機能は準備中のため、まだ送信されていません。";
    status.focus();
  });

  const revalidate = () => {
    if (submitted) {
      const invalid = validateAll();
      status.textContent = invalid.length
        ? `未入力・入力内容に誤りのある項目が${invalid.length}件あります。各項目をご確認ください。`
        : "";
    }
  };
  form.addEventListener("input", revalidate);
  form.addEventListener("change", revalidate);

  // ハンドラーが付いた後に有効化。JSが動かない場合も仮actionへPOSTしない。
  form.noValidate = true;
  submit.disabled = false;
}
