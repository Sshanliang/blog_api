import api from '@/utils/api'
export function getCategory() {
    return  api.get('/category/all',null,(res)=>{
            return res
        }
    )
}
