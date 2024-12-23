// // utils/localStorage.js
// export const loadState = () => {
//   try {
//     const serializedState = localStorage.getItem("cart");
//     if (serializedState === null) {
//       return undefined;
//     }
//     return JSON.parse(serializedState);
//   } catch (error) {
//     console.error("Failed to load state:", error);
//     return undefined;
//   }
// };
// //
// export const saveState = (state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem("cart", serializedState);
//   } catch (error) {
//     console.error("Failed to save state:", error);
//   }
// };
// export const loadDollarState = () => {
//   try {
//     const serializedState = localStorage.getItem("dollarCart");
//     if (serializedState === null) {
//       return undefined;
//     }
//     return JSON.parse(serializedState);
//   } catch (error) {
//     console.error("Failed to load state:", error);
//     return undefined;
//   }
// };

// export const saveDollarState = (state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem("dollarCart", serializedState);
//   } catch (error) {
//     console.error("Failed to save state:", error);
//   }
// };
