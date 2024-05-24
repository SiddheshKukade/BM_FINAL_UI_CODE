import { useAtom } from "jotai";
import { foundKeysAtom, isAutoCompleteVisibleAtom, isInFocusAtom, productNameAtom, searchTextAtom, sourceCitiesAtom } from "./atoms";
import { isDestinationOrSourcePresent, isProductPropertyPresent } from "../../utils/utils";
import { products } from "../../data/products";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
export const TransSelect = () => {
  const [isAutoComplete] = useAtom(isAutoCompleteVisibleAtom);
  const [cities] = useAtom(sourceCitiesAtom);
  const [productLists] = useAtom(productNameAtom);
  const [productListFull, setProductListFull] = useState([...productLists])

  const [foundKeys, setFoundKetys] = useAtom(foundKeysAtom);
  const [search, setSearch] = useAtom(searchTextAtom);

  console.log(foundKeys, "are found keys ")
  const [currentKey, currentVal] =
    foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];

  const handleClickProductTag = (e, tag) => {
    // console.log('{[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]}=')
    // console.log(foundKeys)
    // console.log('{[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]}=')

    if (foundKeys[foundKeys.length - 1]) {
      foundKeys[foundKeys.length - 1][1] = tag.alt
      console.log('===============================================================================')
      console.log(foundKeys)
      console.log('===============================================================================')
    } else {
      console.log("ca't find the last one.")
    }
    let arr = search.split(' ')
    console.log(tag)
    arr[arr.length - 1] = tag.alt;
    setSearch(arr.join(' '))
    setFoundKetys(foundKeys);
  }

  const handleClickSourceDestination = (e, tag) => {
    console.log(tag.city)
    if (foundKeys[foundKeys.length - 1]) {
      foundKeys[foundKeys.length - 1][1] = tag.city
    } else {
      console.log("ca't find the last one.")
    }
    // console.log("-------------------------------------", search)
    // console.log(foundKeys)
    let arr = search.split(' ')
    arr[arr.length - 1] = tag.city;
    setSearch(arr.join(' '))
    // console.log("-------------------------------------", search)
    setFoundKetys(foundKeys);
  }
  let state = localStorage.getItem("templateMode")

  useEffect(() => {
    setProductListFull(() => productLists.filter(item => item?.alt?.toLowerCase().includes(currentVal.toLowerCase())));
  }, [currentVal])
  // console.log("------------------- , isProductPropertyPresent(foundKeys), isDestinationOrSourcePresent", isProductPropertyPresent(foundKeys), isDestinationOrSourcePresent(foundKeys), productLists)
  return (isAutoComplete &&
    <>
      <Flex direction={"column"}
      maxH={100} overflow={"scroll"}
        onMouseOver={() => console.log("inside")}
        className="h-60 w-100 rounded-md border z-1 relative">
        {productListFull.map(tag => (
          <div onClick={(e) => handleClickProductTag(e, tag)}
            key={tag.id} className="py-1 text-gray-400 border-b border-b-gray-300 text-xs hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
          >
            {tag.name} - {tag.price}
          </div>
        ))}
      </Flex>
    </>
  );
};