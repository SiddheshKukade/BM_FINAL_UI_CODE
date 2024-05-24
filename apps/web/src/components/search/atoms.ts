import { atom, useAtom, WritableAtom } from "jotai";
import { getCanvasFont, getTextWidth } from "./utils";
import { sortBy } from "lodash";
import { cities } from "../../data";
import { templateState } from "../ui/input";
import { productNames, products } from "../../data/products";
const MODULE = "delivery";

//variales

const sortedCities = sortBy(cities, (it: any) => it.city);
const sortedProducts = sortBy(products, (it: any) => it.name)
const  productLists = products;
const sourceCities = sortedCities.filter(
  (it) => !it.type || it.type === "source",
);
const destinitionCities = sortedCities.filter(
  (it) => !it.type || it.type === "destination",
);

let first = [
  { key: "source", autoComplete: true, autoCompleteSource: sourceCities },
  {
    key: "destination",
    autoComplete: true,
    autoCompleteSource: destinitionCities,
  },
  { key: "mode" },
  { key: "product",  autoComplete: true, autoCompleteSource: productLists  },
  { key: "qty" },
];
let second = [
  { key: "product",  autoComplete: true, autoCompleteSource: productLists  },
  { key: "qty" },
];

const TEMPLATES = {
  delivery: {
    default: "please enter search ...",
    prompts: first,
    prompts2: second,
  },
};

let elemtnCache: HTMLElement;
// base atoms
export const sourceCitiesAtom = (() => {
  const baseAtom = atom(sortedCities);
  return atom(
    (get) => get(baseAtom),
    (get, set) => {
      const foundKeys = get(foundKeysAtom);
      // console.log(foundKeys, "are found keys ")
      const [currentKey, currentVal] =
        foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];

      // console.log(currentVal, currentKey, "are found keys 2 ", TEMPLATES.delivery.default)
      // console.log("===?> ", foundKeys,currentVal )
      // foundKeys[foundKeys.length-1][1] = 'sdfeds'
      // console.log("===> ", foundKeys, currentVal, )

      if (!["source", "destination"].includes(currentKey)) {
        set(isAutoCompleteVisibleAtom, false);
      }
      set(isAutoCompleteVisibleAtom, true);
      const cities = currentKey === "source" ? sourceCities : destinitionCities;
      set(
        baseAtom,
        cities.filter(
          (it) => it?.city?.toLowerCase().indexOf(currentVal?.toLowerCase()) === 0,
        ).slice(0, 3),
      );
    },
  );
})();
export const productNameAtom = (()=>{ 
  const baseProductsAtom = atom(sortedProducts);
  return atom(
    (get) => get(baseProductsAtom),
    (get,set) => {
      const foundKeys = get(foundKeysAtom);
      const [currentKey, currentVal] =
        foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
      console.log(currentVal, currentKey, "are found keys 2 products ", TEMPLATES.delivery.default)

        if (!["product"].includes(currentKey)) {
          set(isAutoCompleteVisibleAtom, false);
        }
        // set(isAutoCompleteVisibleAtom, true);
        console.log("======-------=====",    products.filter( it => it?.name?.toLowerCase().indexOf(currentVal?.toLowerCase()) == 0,).slice(0,3),)
      set(
        baseProductsAtom,
        products.filter( it => it?.name?.toLowerCase().indexOf(currentVal?.toLowerCase()) == 0,).slice(0,3),
      )
    }
  )

})();
const maskAtom = atom(TEMPLATES[MODULE].default);
export const foundKeysAtom = atom<string[][]>([]);
const baseSearchTextAtom = atom("");
const baseMaskLocationAtom = atom(0);
export const isInFocusAtom = atom(false);
export const isAutoCompleteVisibleAtom = atom(false);
//derived atoms
export const hinterAtom = atom((get) => get(foundKeysAtom));
export const maskLocationAtom = atom(
  (get) => get(baseMaskLocationAtom),
  (_get, set, update) => {
    if (!elemtnCache) {
      elemtnCache = document.getElementById("esy-trans-search")!;
    }
    const width = getTextWidth(update, getCanvasFont(elemtnCache));
    set(baseMaskLocationAtom, width && width + 7);
  },
);
export const searchTextAtom = atom(
  (get) => get(baseSearchTextAtom),
  (get, set, update: string) => {
    const text = update.trim();
    set(baseSearchTextAtom, update);
    if (!text) {
      set(foundKeysAtom, []);
      set(maskOnInteractionAtom);
      set(maskLocationAtom, update);
      set(sourceCitiesAtom);
      return;
    }
    const { prompts } = TEMPLATES[MODULE];
    const foundKeys = get(foundKeysAtom);
    const entries = text.split(" ");
    if (foundKeys.length > entries.length) {
      foundKeys.length = entries.length;
    }
    const nextFoundkey = foundKeys.length;
    const entry =
      entries[
      nextFoundkey === entries.length ? nextFoundkey - 1 : nextFoundkey
      ];
    const key = identifyValue({ prompts, foundKeys, entries, entry })!;
    if (nextFoundkey !== entries.length) {
      key && foundKeys.push(key);
    } else {
      const found = foundKeys.find((it) => it[0] === key[0]);
      if (found) {
        found[1] = key[1];
      } else {
        foundKeys.pop();
        foundKeys.push(key);
      }
    }
    set(foundKeysAtom, [...foundKeys]);
    set(maskOnInteractionAtom);
    set(maskOnInteractionAtom);
    set(maskLocationAtom, update);
    set(sourceCitiesAtom);
  },
);
function guessSourceDestination(entry: string, nextKey = "") {
  const lowerEntry = entry.toLowerCase();
  const sourceFund =
    ["", "source"].includes(nextKey) &&
    sourceCities.find((it) => it.city.toLowerCase().indexOf(lowerEntry) === 0);
  if (sourceFund) {
    return ["source", entry];
  }
  const destinationFund =
    ["", "destination"].includes(nextKey) &&
    destinitionCities.find(
      (it) => it.city.toLowerCase().indexOf(lowerEntry) === 0,
    );
  if (destinationFund) {
    return ["destination", entry];
  }
}
const identifyValue = ({ prompts, foundKeys, entries, entry }) => {
  if (isNumeric(entry)) {
    return ["qty", entry];
  }
  if (["train", "road", "flight"].includes(entry)) {
    return ["mode", entry];
  }
  if (productNames.includes(entry)) {
    return ["product", entry];
  }
  console.log('At the includes ', )
  //
  if (foundKeys.length === 0) {
    return guessSourceDestination(entry);
  } else if (entries.length > foundKeys.length) {
    const sourceExist = foundKeys.find((it) => it[0] === "source");
    const destinationExist = foundKeys.find((it) => it[0] === "destination");
    if (sourceExist && destinationExist) {
      return ["product", entry];
    } else if (sourceExist && !destinationExist) {
      return guessSourceDestination(entry, "destination");
    }
    return guessSourceDestination(entry, "source");
  } else if (entries.length === foundKeys.length) {
    const updateKeys = foundKeys[foundKeys.length - 1];
    if (!["source", "destination"].includes(updateKeys[0])) {
      return [updateKeys[0], entry];
    }
    const sourceExist = foundKeys.find((it) => it[0] === "source");
    const destinationExist = foundKeys.find((it) => it[0] === "destination");
    let guessed;
    if (sourceExist && !destinationExist) {
      guessed = guessSourceDestination(entry, "destination");
    } else if (destinationExist && !sourceExist) {
      guessed = guessSourceDestination(entry, "destination");
    }
    return guessed ? guessed : [updateKeys[0], entry];
  }
};
export const maskOnInteractionAtom = atom(
  (get) => get(maskAtom),
  (get, set) => {
    const foundKeys = get(foundKeysAtom);
    const { prompts, prompts2 } = TEMPLATES[MODULE];
    let currPrompts = prompts2;
    // let state = localStorage.getItem("templateMode")
    // if (state == "INVENTORY") {
    //   currPrompts = prompts2;
    // }

    let maskedPrompts = currPrompts.reduce((maskList, { key }) => {
      if (!foundKeys.find(([targetKey]) => targetKey === key)) {
        maskList.push(key);
      }
      return maskList;
    }, [] as string[]);

    console.log("masked prompot", maskedPrompts)
    if (isArrayExactlyMatching(maskedPrompts)) {
      maskedPrompts = [];
    }
    set(maskAtom, maskedPrompts.join(" "));
  },
);
//utils
export function atomWithToggle(
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom);
    set(anAtom, update);
  });
  return anAtom as WritableAtom<boolean, [boolean?], void>;
}
function isNumeric(str: string | number) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    // @ts-expect-error use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
function isArrayExactlyMatching(arr) {
  const expectedArray = ['source', 'destination', 'mode'];

  if (arr.length !== expectedArray.length) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== expectedArray[i]) {
      return false;
    }
  }

  return true;
}

