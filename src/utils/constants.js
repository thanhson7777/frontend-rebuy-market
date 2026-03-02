let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

export const API_ROOT = apiRoot
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 10
