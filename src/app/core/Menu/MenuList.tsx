// import * as React from "react";
// import { withMenuSplash } from "@utils/enhancers/menu";

// const MenuList = withMenuSplash(
//   ({ navigation, getAvailableMenuState: { loading, data, error } }) => {
//     const selectMenu = menu => e => {
//       navigation.push("authorize", {
//         menu
//       });
//     };
//     if (loading) {
//       return <div>loading menu</div>;
//     }
//     if (error) {
//       return <div>cannot load menu</div>;
//     }
//     return (
//       <div className="flex-mosaic">
//         {data &&
//           data.map((menu, i) => {
//             return (
//               <div onClick={selectMenu(menu)} key={i}>
//                 <label>Menu: {menu.label_id}</label>
//               </div>
//             );
//           })}
//       </div>
//     );
//   }
// );

// export default MenuList;
