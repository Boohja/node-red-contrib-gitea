/**
 * @typedef {Object} Pagination
 * @property {number} page
 * @property {number} limit
 */

/**
 * @typedef {Object} Integration
 * @property {string} apiUrl
 * @property {string} apiKey
 */

/**
 * Make a get request with pagination
 * @param {Integration} integration
 * @param {string} url
 * @param {Object} queryObject
 * @param {Pagination} pagination
 * @return {Promise<{result: *[], total: number}>}
 */
async function apiGetPagination (integration, url, queryObject, pagination) {

  const fetchAll = !pagination.page
  let page = pagination.page || 1
  let limit = pagination.limit || 100
  let total = 0

  const queryString = new URLSearchParams(queryObject).toString();
  let hasMore = true
  let result = []
  while (hasMore) {
    const res = await fetch(`${integration.apiUrl}${url}?${queryString}&limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        "Authorization": `token ${integration.apiKey}`,
        "Content-Type": "application/json",
      }
    })
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    result = result.concat(data)
    total = res.headers.get('x-total-count') ? parseInt(res.headers.get('x-total-count')) : 0
    hasMore = fetchAll && total > result.length
    page++
  }

  return { result, total }
}


async function apiGet (integration, url, queryObject) {

  let fetchUrl = `${integration.apiUrl}${url}`
  if (queryObject) {
    fetchUrl += `?${new URLSearchParams(queryObject).toString()}`
  }
  const res = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      "Authorization": `token ${integration.apiKey}`,
      "Content-Type": "application/json",
    }
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}


async function apiPost (integration, url, bodyData) {

  const res = await fetch(`${integration.apiUrl}${url}`, {
    method: 'POST',
    headers: {
      "Authorization": `token ${integration.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData)
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}


module.exports = {
  apiGet,
  apiGetPagination,
  apiPost
}
