// Function to check if destination or source values are present
export function isDestinationOrSourcePresent(arr) {
    let it=0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === "destination" ||   arr[i][0] === "source") {
        it++;
      }
    }
    console.log(it)
    if( it == 2 ) return true;
    return false; // Neither destination nor source value found
  } 

// Function to check if the "product" property is present
export function isProductPropertyPresent(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === "product") {
        return true; // "product" property found
      }
    }
    return false; // "product" property not found
  }

//   [["destination", "mumbai"], ["source", "mumbai"], ["mode", "train"], ["product", "parle"], ["qty", "1"]