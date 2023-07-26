# soso-back-end (SOSO購物網)

## 簡介

這是一個使用Node.js和Express.js開發的購物網站的後端API。這個API提供商品數據，並處理購物車和結帳功能。

## 安裝

為了在本地運行這個專案，你需要先安裝Node.js和npm。然後，你可以遵循以下步驟來安裝並運行這個專案：

1. 下載或 clone 此儲存庫到你的電腦。
2. 在終端或命令提示字元中，導航到專案的根目錄。
3. 運行 npm install 來安裝必要的依賴套件。
4. 在專案的根目錄建立 .env 檔案，參考 .env.example 檔案來填入必要資訊。
5. 運行 npm run dev 來啟動開發伺服器。

如果一切順利，你現在應該能在 http://localhost:3000 看到這個應用運行。

此時便可安裝另一個專案，這個應用的前端部分 https://github.com/awei1127/soso-front-end

## 使用說明

這個API有以下幾個端點：

---

### GET	/api/v1/products

簡述：

獲取所有商品的列表

query string:

categoryId, lowestPrice, highestPrice, keyword, sortBy

---

### GET	/api/v1/categories

簡述：

獲取所有分類的列表

---

### POST /api/v1/signin

簡述：

送出登入資訊

---

### POST /api/v1/signup

簡述：

送出註冊資訊

---

### GET /api/v1/user/

簡述：

獲取使用者資訊

---

### GET /api/v1/cart/:userId

簡述：

獲取使用者的購物車物品列表

---

### POST /api/v1/cart/:productId

簡述：

將商品加入購物車

---

### DELETE /api/v1/cart/:cartItemId

簡述：

將商品從購物車移除

---

### PUT /api/v1/cart/:cartItemId

簡述：

改變購物車物品的勾選狀態

---

### GET /api/v1/shop/:userId

簡述：

獲取使用者的商店商品資料

---

### POST /api/v1/shop

簡述：

新增一項商品

---

### PUT /api/v1/shop/:productId

簡述：

改變商店中物品的上架狀態

---

### POST /api/v1/order

簡述：

建立一張訂單

---

你可以使用一個API測試工具（如Postman）或者在你的前端應用中來調用這些API。

## 預計更新項目

+ 回傳分頁處理後的資料
