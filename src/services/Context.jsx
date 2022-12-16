// import ReactDOM from "react-dom";
// import axios from "axios";

// export function fetchVisitedProducts() {
//   debugger;
//   let visited_products_handles = localStorage.getItem("visited_products");
//   if (visited_products_handles) {
//     let body = {
//       category_handles: visited_products_handles.replaceAll(" ", "").split(","),
//     };

//     return axios
//       .post(
//         process.env.REACT_APP_BACKEND_HOST + "/storefront/visited_products",
//         body
//       )
//       .then((response) => {
//         return response.data;
//       });
//   }
// }

// export function setVisitedProducts(catName) {
//   // console.log("Context CatName: ", catName);
//   if (catName) {
//     catName = catName.replace(" ", "");
//     let visitedProducts = localStorage.getItem("visited_products");
//     if (visitedProducts) {
//       visitedProducts = visitedProducts.split(",");
//       visitedProducts = visitedProducts.map((x) => x.replace(" ", ""));
//       if (visitedProducts.indexOf(catName) < 0) {
//         if (visitedProducts.length >= 11) {
//           // debugger
//           visitedProducts.shift();
//           visitedProducts.push(catName);
//           localStorage.setItem("visited_products", visitedProducts);
//         } else {
//           localStorage.setItem(
//             "visited_products",
//             catName + " , " + localStorage.getItem("visited_products")
//           );
//         }
//       }
//     } else {
//       localStorage.setItem("visited_products", catName);
//     }
//   }
// }
