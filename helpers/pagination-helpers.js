// 傳入要查詢第幾頁(page)、每頁要顯示幾筆(limit)，來取得查詢資料庫用的offset
const getOffset = (page = 1, limit = 20) => (page - 1) * limit

// 傳入要查詢第幾頁(page)、每頁要顯示幾筆(limit)、總共有幾筆(total)，來返回渲染分頁器需要的資料
const getPagination = (page = 1, limit = 20, total) => {
  const totalPage = Math.ceil(total / limit)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  const pages = getPagesToShow(currentPage, totalPage)

  return {
    totalPage,
    currentPage,
    prev,
    next,
    pages
  }
}

// 傳入現在分頁、總頁數，來返回要顯示的分頁頁籤陣列
const getPagesToShow = (currentPage, totalPage) => {
  const MAX_PAGES = 9
  let startPage = 1
  let endPage = MAX_PAGES

  if (totalPage < MAX_PAGES) {
    startPage = 1
    endPage = totalPage
  } else if (currentPage <= Math.floor(MAX_PAGES / 2)) {
    startPage = 1
    endPage = MAX_PAGES
  } else if (currentPage > totalPage - Math.floor(MAX_PAGES / 2)) {
    startPage = totalPage - MAX_PAGES + 1
    endPage = totalPage
  } else {
    startPage = currentPage - Math.floor(MAX_PAGES / 2)
    endPage = startPage + MAX_PAGES - 1
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
}

module.exports = {
  getOffset,
  getPagination
}
