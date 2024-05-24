// import {  TransMask} from "./components/search/trans-mask.tsx";
import { TransInput } from "./trans-input";
import { useAtom } from "jotai";
// import { isInFocusAtom, searchTextAtom } from "@/components/search/atoms.ts";
// import { TransSelect } from "@/components/search/trans-select.tsx";
// import { TransTable } from "@/components/search/trans-table.tsx";
import { TransMask } from "./trans-mask.tsx";
import { hinterAtom, isInFocusAtom, searchTextAtom } from "./atoms.ts";
import { TransSelect } from "./trans-select.tsx";
import { TransTable } from "./trans-table.tsx";
import { Button, Center } from "@chakra-ui/react";
import TableUI from "../table/TableUI.tsx";
import { useState } from "react";
import { table } from "console";

export const TransSearch = () => {
  const [search, writSearch] = useAtom(searchTextAtom);
  const [, toggleInFocus] = useAtom(isInFocusAtom);
  const [tableData, setTableData] = useState([])
  const [hint] = useAtom(hinterAtom);
  const submitPressed = () => {
    const jsonObject = {};
    hint.forEach(([key, value]) => {
      jsonObject[key] = value;
    });
    setTableData((prev) => [...prev, jsonObject])
    writSearch("")
  }
  // localStorage.setItem("templateMode", "INVENTORY")

  return (
    <div>
      <TransMask />
      <TransInput
        submitPressed={submitPressed}
        id="esy-trans-search"
        value={search}
        onChange={(e) => writSearch(e.target.value)}
        onFocus={() => toggleInFocus(true)}
        onBlur={() => toggleInFocus(false)}
      />
       <TransSelect />
      <pre>
        {/* {JSON.stringify({ search, hinterAtom, hint })} */}
      </pre>
      {/* t":[["destination","mumbai"],["source","pune"],["mode","train"],["product","parle"],["qty","100"]]} */}
      {/* <Center py={2}><Button w={"80%"} colorScheme="blue" isDisabled={search.length == 0} onClick={submitPressed}>
        Submit
      </Button> </Center> */}
     
      {/* <TransTable /> */}
      <TableUI tableData={tableData} setTableData={setTableData} />
    </div>
  );
};
