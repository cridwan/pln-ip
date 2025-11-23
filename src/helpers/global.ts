import { ref, watchEffect } from "vue";

function useScreen() {
  const screenWidth = ref(window.innerWidth);
  const screenHeight = ref(window.innerHeight);

  const updateScreen = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
  };

  watchEffect(() => {
    updateScreen();

    window.addEventListener("resize", updateScreen);

    return () => {
      window.removeEventListener("resize", updateScreen);
    };
  });

  return { screenWidth, screenHeight };
}


function formatToFloat(input: string) {
  const number = input.replace(/\./g, '')

  return parseFloat(number);
}

function numberFormat(inputNumber: number | string, isCurrency = false) {
  const number =
    typeof inputNumber === "string" ? parseInt(inputNumber, 10) : inputNumber;
  if (isNaN(number)) return "-";

  let data: any = parseInt(inputNumber.toString());

  if (isCurrency) {
    data = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(data);
  } else {
    data = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(data);
  }

  return data;
}


function dateFormatId(date: string) {
  const instanceDate = new Date(date);

  return instanceDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function parsedUrl(url: string) {
  return (
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    url
  )
}

function convertToKebabCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
}

function convertToOriginalFormat(input: string): string {
  return input
    .split("-")
    .map((part) =>
      part.match(/^[0-9]+(\.[0-9]+)?$/) ? part : part.toUpperCase()
    )
    .join(" ");
}

const mergeArrays = <T extends { value: string }, Y extends { value: string }>(
  arr1: T[],
  arr2: Y[]
): (T | Y)[] => {
  const map = new Map<string, T | Y>();

  [...arr1, ...arr2].forEach((item) => {
    map.set(item.value, item);
  });

  return Array.from(map.values());
};

/* eslint-disable no-useless-escape */
const all_characters = /[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\n ]/;
const numbers_characters = /[0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\n]/;
const numbers_letters = /[a-zA-Z0-9\n ]/;
const numbers_positive = /[0-9\n]/;
const numbers_positive_negative = /[0-9-\n]/;
const letters = /[a-zA-Z\n ]/;
const letters_characters = /[a-zA-Z`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\n ]/;
const username = /[a-zA-Z0-9_-]/;
const address = /[a-zA-Z0-9#;'":,. \n]/;
const phone = /[a-zA-Z0-9-()\n ]/;
const email = /[a-zA-Z0-9@\-._ ]/;
const character_search = /[a-zA-Z0-9@. ]/;

export {
  useScreen,
  numberFormat,
  convertToKebabCase,
  convertToOriginalFormat,
  mergeArrays,
  all_characters,
  numbers_characters,
  numbers_letters,
  numbers_positive,
  numbers_positive_negative,
  letters,
  letters_characters,
  username,
  address,
  phone,
  email,
  character_search,
  dateFormatId,
  formatToFloat,
  parsedUrl
};
